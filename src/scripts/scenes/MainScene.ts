import Player from "../player/Player";
import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import AudioManager from "../AudioManager";
import { Enemy } from "../enemy/enemy";
import { Map } from "../map-data";
import { EnemiesEnum } from "../enemy/enemies.enum";
import { Enemies } from "../enemy/enemies.class";
import VictoryItem from "../items/victoryItem";
import EventsUtils from "../utils/events.utils";
import ItemUtil from "../items/itemUtil";
import Boss from "../enemy/boss/boss";
import { PLAYER_ANIM } from "../player/animTabs";
export default class MainScene extends Phaser.Scene {
  public bullets: any;
  public matterCollision: PhaserMatterCollisionPlugin;
  public map: Phaser.Tilemaps.Tilemap;
  public itemUtil: ItemUtil;
  public player: Player;
  public static PLAYER_CAT;
  public shapes: any;
  public boss: Boss;
  public audioManager: AudioManager;
  public playerCatCollision: any;
  public itemsCat: any;
  public fps: any;
  public sunSensors: any[] = [];
  public bossRooms: any[] = [];
  public shopZone: any[] = [];
  public musicCanPlay: boolean = false;
  public win: boolean = false;
  public caliceSprite: VictoryItem;
  private parralaxLayers: {
    static: {
      cloud: Phaser.GameObjects.TileSprite,
      sun: Phaser.GameObjects.TileSprite,
      sky: Phaser.GameObjects.TileSprite,
    }
    scene1: {
      //foreground: Phaser.GameObjects.TileSprite,
      bg_far: Phaser.GameObjects.TileSprite,
      bg: Phaser.GameObjects.TileSprite
    },
    // scene2: {
    //   foreground: Phaser.GameObjects.TileSprite,
    //   bg_far: Phaser.GameObjects.TileSprite,
    //   bg: Phaser.GameObjects.TileSprite
    // }

  };

  /**
   * Contain enemies object
   */
  private enemies: Enemies;
  constructor() {
    super({
      key: "MainScene",
    });
    this.fps = 60;

    this.win = false;

  }
  preload() {
    this.load.tilemapTiledJSON("map", "assets/map/map_beta.json");
    this.load.multiatlas('all_sprites', 'assets/graphics/map/backgrounds/spritesheet.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas('all_sprites_background', 'assets/graphics/map/backgrounds/spritesheet_background.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas('block', 'assets/graphics/map/backgrounds/block.json', 'assets/graphics/map/backgrounds');
    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/graphics/char/character/shapes_char.json');
    this.load.multiatlas(EnemiesEnum.SPRITE_SHEET_ID, EnemiesEnum.SPRITE_SHEET_URL, EnemiesEnum.SPRITE_SHEET_FOLDER);
    if (!this.audioManager) {
      this.audioManager = new AudioManager(this);
    }
  }
  create() {

    /** Build all layers maps */
    const map = Map.getInstance(this.add.tilemap('map'));
    this.map = map.tileMap;
    this.shapes = this.cache.json.get('shapes');
    this.sunSensors = [];
    this.bossRooms = [];
    const tileset = this.map.addTilesetImage('block', 'block');
    this.playerCatCollision = this.matter.world.nextCategory();
    this.itemsCat = this.matter.world.nextCategory();

    this.itemUtil = new ItemUtil(this);

    this.generateParralaxLayers();
    const worldLayer = this.map.createStaticLayer('main_tile', tileset, 0, 0);
    const worldLayerCollide = this.map.createStaticLayer('collide', tileset, 0, 0);
    worldLayer.depth = 1;
    worldLayerCollide.depth = 2;

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    worldLayerCollide.setCollisionByProperty({ collide: true });

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(worldLayerCollide);
    this.matter.world.convertTilemapLayer(worldLayer);
    this.player = this.spawnPlayer();
    this.player.setDepth(3);

    this.enemies = new Enemies(this.map, this.matter.world, this);

    this.player.setCollisionCategory(this.playerCatCollision);
    MainScene.PLAYER_CAT = this.playerCatCollision;
    // 1 is the collision category of the tile with tiled
    this.player.setCollidesWith([1, this.enemies.collisionCat, this.itemsCat]);


    this.cameras.main.startFollow(this.player.getPlayerSprite(), false, 0.5, 0.5);
    // Visualize all the matter bodies in the world. Note: this will be slow so go ahead and comment
    // it out after you've seen what the bodies look like.
    // this.matter.world.createDebugGraphic();
    this.addCalice();
    this.addEventsListeners();
    this.generateItems();
    this.buildSunSensor();
    this.buildShopSensor();
    this.buildBossRoomSensor();
    this.buildTextSign();
    this.generatePnj();
    this.audioManager.playMusic(this.audioManager.musicsList.TITLE);
    this.boss = this.spawnBoss();
  }

  buildSunSensor(): void {
    // Create a sensor at the rectangle object created in Tiled (under the "sunSensor" layer)
    this.map.findObject("sunSensor", (obj: any) => {
      const sunSensor = this.matter.add.rectangle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height,
        {
          isSensor: true, // It shouldn't physically interact with other bodies
          isStatic: true // It shouldn't move
        }
      );
      this.sunSensors.push(sunSensor);
    });

    this.matterCollision.addOnCollideStart({
      objectA: this.player,
      objectB: this.sunSensors,
      callback: (eventData: any) => {
        if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
        this.player.disableSun()
      },
      context: this
    });

    this.matterCollision.addOnCollideEnd({
      objectA: this.player,
      objectB: this.sunSensors,
      callback: (eventData: any) => {
        if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
        if (this.player.isInSun) {
          this.player.disableSun()
        }
        else {
          this.player.enableSun();
        }

      },
      context: this
    });

  }

  buildShopSensor(): void {
    // Create a sensor at the rectangle object created in Tiled (under the "sunSensor" layer)
    this.map.findObject("sunSensor", (obj: any) => {
      const shopZone = this.matter.add.rectangle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height,
        {
          isSensor: true, // It shouldn't physically interact with other bodies
          isStatic: true // It shouldn't move
        }
      );
      this.shopZone.push(shopZone);
    });

    this.matterCollision.addOnCollideStart({
      objectA: this.player,
      objectB: this.shopZone,
      callback: (eventData: any) => {
        this.player.emit('playerEnterShop');
      },
      context: this
    });

    this.matterCollision.addOnCollideEnd({
      objectA: this.player,
      objectB: this.shopZone,
      callback: (eventData: any) => {
        if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
        this.player.emit('playerLeaveShop');
      },
      context: this
    });

  }

  generatePnj(): void {
    const pnjAnim = this.player.generateFrameNames('pnj/merch/merch', 'all_sprites', 1, 5);
    this.anims.create({ key: 'pnj/merch/merch', frames: pnjAnim, frameRate: 5, repeat: -1 });
    // Create a sensor at the rectangle object created in Tiled (under the "boss_sensor" layer)
    this.map.findObject("spawn_pnj", (obj: any) => {
      const merchSprite = this.add.sprite((obj.x) + obj.width / 2, obj.y + obj.height / 2, 'all_sprites', 'pnj/merch/merch1.png');
      merchSprite.depth = 3;
      this.add.existing(merchSprite);
      merchSprite.play('pnj/merch/merch', true);
    });
  }

  buildBossRoomSensor(): void {
    // Create a sensor at the rectangle object created in Tiled (under the "boss_sensor" layer)
    this.map.findObject("boss_sensor", (obj: any) => {
      const bossRoom = this.matter.add.rectangle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height,
        {
          isSensor: true, // It shouldn't physically interact with other bodies
          isStatic: true // It shouldn't move
        }
      );
      const bossRoomSprite = this.add.sprite((obj.x + 8) + obj.width / 2, obj.y + obj.height / 2, 'all_sprites_background', 'background/boss_room.png');
      bossRoomSprite.setDepth(0);
      this.bossRooms.push(bossRoom);
    });

    this.matterCollision.addOnCollideStart({
      objectA: this.player,
      objectB: this.bossRooms,
      callback: (eventData: any) => {
        if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
        this.player.emit('playerEnterBossRoom');
      },
      context: this
    });

    this.matterCollision.addOnCollideEnd({
      objectA: this.player,
      objectB: this.bossRooms,
      callback: (eventData: any) => {
        if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
        this.player.emit('playerLeaveBossRoom');
      },
      context: this
    });

  }

  buildTextSign(): void {
    this.map.findObject('text_spawn', (obj: any) => {
      let text = this.add.text(obj.x, obj.y, obj.text.text, {
        font: obj.text.pixelsize + "px " + obj.text.fontfamily
      });
      text.depth = 3;
    })
  }

  spawnBoss(): Boss {
    const spawnPoint: any = this.map.findObject("spawn_boss", (obj: any) => obj.name === "boss");
    return new Boss(this.matter.world, this, spawnPoint.x, spawnPoint.y);
  }

  spawnPlayer(): Player {
    const spawnPoint: any = this.map.findObject("spawn_player", (obj: any) => obj.name === "player");
    const bossRoomSprite = this.add.sprite((spawnPoint.x - 2) + spawnPoint.width / 2, spawnPoint.y - 50, 'all_sprites_background', 'background/scene1/crypte.png');
    bossRoomSprite.setDepth(0);
    return new Player(this.matter.world, this, spawnPoint.x, spawnPoint.y, 'all_sprites', 'vampire/runvampright1.png');
  }

  generateItems() {
    this.map.findObject("items", (obj: any) => {
      this.itemUtil.generateItem(obj);
    }
    );
  }

  /**
   * Shortcut for reloading the scene
   */
  restart() {
    this.scene.restart();
    this.win = false;
  }

  /**
   * listen for external events
   */
  private addEventsListeners() {
    // User clicked on play
    window.addEventListener('play', (e) => {
      this.musicCanPlay = true;
      this.audioManager.playMusic(this.audioManager.musicsList.WORLD);
      this.audioManager.playSound(this.audioManager.soundsList.FART);
    });
    window.addEventListener('restart', (e) => {
      this.restart();
    });
  }

  /**
   * Trigger the victory of the player
   */
  public triggerVictory(): void {

    if (this.win) {
      return;
    }
    this.win = true;
    //TODO play win anim

    //this.scene.restart();
    window.dispatchEvent(EventsUtils.PLAYER_WIN);
    this.audioManager.playMusic(this.audioManager.musicsList.TITLE);
    this.audioManager.playSound(this.audioManager.soundsList.VICTORY);
  }

  private addCalice(): void {
    const spawnPoint: any = this.map.findObject("calice_spawn", (obj: any) => obj.name === "calice");
    this.caliceSprite = new VictoryItem(this.matter.world, this, spawnPoint.x, spawnPoint.y, 'all_sprites', 'items/calice1.png');
    const caliceAnim = this.player.generateFrameNames('items/calice', 'all_sprites', 1, 2);
    this.anims.create({ key: 'caliceAnim', frames: caliceAnim, frameRate: 10, repeat: -1 });
    this.caliceSprite.play('caliceAnim');
    this.caliceSprite.visible = false;
    this.caliceSprite.setStatic(true);
    this.caliceSprite.setCollisionCategory(1);
    this.caliceSprite.setCollidesWith([this.playerCatCollision]);
  }
  // Fct we call each frame
  /**
 * Create the parralax layers
 */
  private generateParralaxLayers() {
    this.parralaxLayers = {
      static: {
        sky: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/static/sky.png'),
        sun: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/static/sun.png'),
        cloud: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/static/cloud.png'),
      },
      scene1: {

        bg_far: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene1/bg_far.png'),
        bg: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene1/bg.png'),
        //foreground: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene1/foreground.png'),
      },
      // scene2: {
      //   bg_far: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene2/bg_far.png'),
      //   bg: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene2/bg.png'),
      //   foreground: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites_background', 'background/scene2/foreground.png'),

      // }

    };
  }



  /**
   * Update the parralax layers each frame
   */
  private updateParralax() {

    for (const layerName in this.parralaxLayers) {
      if (this.parralaxLayers.hasOwnProperty(layerName)) {
        const layer: Phaser.GameObjects.TileSprite = this.parralaxLayers[layerName];
        for (const tileName in layer) {
          if (layer.hasOwnProperty(tileName)) {
            const tile = layer[tileName];
            tile.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY)
            tile.setOrigin(0, 0);
          }
        }
      }
    }

    //Static bg
    //Cloud
    this.parralaxLayers.static.cloud.tilePositionX -= 0.5;
    //bg far
    this.parralaxLayers.scene1.bg_far.setTilePosition(this.cameras.main.scrollX * 0.1, this.cameras.main.scrollY * 0.1)
    //this.parralaxLayers.scene1.foreground.setTilePosition(this.player.x, this.player.y);

    //bg
    this.parralaxLayers.scene1.bg.setTilePosition(this.cameras.main.scrollX * 0.4, this.cameras.main.scrollY * 0.4)

    //foreground
    // this.parralaxLayers.scene1.foreground.active = false;
  }

  // Fct we call each frame
  public update() {
    this.player.update();
    this.updateParralax();
    this.enemies.updateAllEnemies(this.player.x);
    this.boss.update();
  }
}