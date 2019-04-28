import Player from "../player/Player";
import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import AudioManager from "../AudioManager";
import { Enemy } from "../enemy/enemy";
import { Map } from "../map-data";
import { EnemiesEnum } from "../enemy/enemies.enum";
import { Enemies } from "../enemy/enemies.class";
import VictoryItem from "../items/victoryItem";
import EventsUtils from "../utils/events.utils";
import Item from "../items/item";
import BoostItem from "../items/boostItem";
export default class MainScene extends Phaser.Scene {
  public matterCollision: PhaserMatterCollisionPlugin;
  public map: Phaser.Tilemaps.Tilemap;
  public enemy: Enemy;
  public player: Player;
  public shapes: any;
  public audioManager: AudioManager;
  public playerCatCollision: any;
  public itemsCat: any;
  private parralaxLayers: {
    static: {
      cloud: Phaser.GameObjects.TileSprite,
      sun: Phaser.GameObjects.TileSprite,
      sky: Phaser.GameObjects.TileSprite,
    }
    scene1: {
      foreground: Phaser.GameObjects.TileSprite,
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

  }
  preload() {
    this.load.tilemapTiledJSON("map", "/assets/map/map_beta.json");
    this.load.multiatlas('all_sprites', 'assets/graphics/map/backgrounds/spritesheet.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas('block', 'assets/graphics/map/backgrounds/block.json', 'assets/graphics/map/backgrounds');
    // Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/graphics/char/character/shapes_char.json');
    this.audioManager = new AudioManager(this);

    this.load.multiatlas(EnemiesEnum.SPRITE_SHEET_ID, EnemiesEnum.SPRITE_SHEET_URL, EnemiesEnum.SPRITE_SHEET_FOLDER);
  }
  create() {
    /** Build all layers maps */
    const map = Map.getInstance(this.add.tilemap('map'));
    this.map = map.tileMap;
    this.shapes = this.cache.json.get('shapes');
    const tileset = this.map.addTilesetImage('block', 'block');
    this.playerCatCollision = this.matter.world.nextCategory();
    this.itemsCat = this.matter.world.nextCategory();

    this.generateParralaxLayers();
    const worldLayer = this.map.createStaticLayer('main_tile', tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    worldLayer.setCollisionByProperty({ collide: true });

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(worldLayer);
    this.player = this.spawnPlayer();

    this.enemies = new Enemies(this.map, this.matter.world, this);

    //this.enemy.setCollisionCategory(defaultCat);
    this.player.setCollisionCategory(this.playerCatCollision);
    // 1 is the collision category of the tile with tiled
    this.player.setCollidesWith([1, this.enemies.collisionCat, this.itemsCat]);


    const playerRunAnims = this.player.generateFrameNames('vampire/runvampright', 'all_sprites', 1, 10);
    const playerIdleAnims = this.player.generateFrameNames('vampire/fightvamp', 'all_sprites', 1, 10);
    const playerJumpAnims = this.player.generateFrameNames('vampire/jumpvamp', 'all_sprites', 1, 7);
    const playerAttackAnims = this.player.generateFrameNames('vampire/fightvamp', 'all_sprites', 9, 19);
    const playerDeathAnims = this.player.generateFrameNames('vampire/deathvamp', 'all_sprites', 1, 7);
    const playerSuck = this.player.generateFrameNames('vampire/vampdrink', 'all_sprites', 1, 5);

    this.anims.create({ key: 'suck', frames: playerSuck, frameRate: 10, repeat: 0 });
    this.anims.create({ key: 'playerRun', frames: playerRunAnims, frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'playerIdle', frames: playerIdleAnims, frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'playerJump', frames: playerJumpAnims, frameRate: 9 });
    this.anims.create({ key: 'playerAttack', frames: playerAttackAnims, frameRate: 50 });
    this.anims.create({ key: 'playerDeath', frames: playerDeathAnims, frameRate: 13 });

    this.cameras.main.startFollow(this.player.getPlayerSprite(), false, 0.5, 0.5);
    // Visualize all the matter bodies in the world. Note: this will be slow so go ahead and comment
    // it out after you've seen what the bodies look like.
    this.matter.world.createDebugGraphic();
    this.matterCollision.addOnCollideStart({
      objectA: this.player.getPlayerSprite(),
      callback: function (eventData) {
        //console.log(eventData.gameObjectB)
      },
      context: this // Context to apply to the callback function
    });

    this.matterCollision.addOnCollideActive({
      objectA: this.player.getPlayerSprite(),
      callback: (eventData: any) => {
        if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
          this.player.setPlayerInAirValue(false);
        } else if (eventData.gameObjectB instanceof Enemy) {
          if (this.player.getAttackstate()) {
            this.player.emit('playertouchtarget', eventData.gameObjectB);
          }

          if (this.player.doAction && eventData.gameObjectB.isDead) {
            console.log('suck');
            this.player.doAction = false;
            this.player.suck();
          }

        } else if (eventData.gameObjectB == null) {
          this.player.killPlayer();
        } else if (eventData.gameObjectB instanceof VictoryItem) {
          //TriggerVictory
          console.log(eventData.gameObjectB);
          eventData.gameObjectB.destroy();
          this.triggerVictory();
        } else if (eventData.gameObjectB instanceof Item) {
          if (this.player.doAction) {
            this.player.doAction = false;
            this.player.emit('playerbuyitem', eventData.gameObjectB);
            eventData.gameObjectB.destroy();
          }
        }else {
          console.log(eventData.gameObjectB);
        }
      },
      context: this
    });

    this.addCalice();
    this.addEventsListeners();
    this.generateItems();
  }

  spawnPlayer(): Player {
    const spawnPoint: any = this.map.findObject("spawn_player", (obj: any) => obj.name === "player");
    return new Player(this.matter.world, this, spawnPoint.x, spawnPoint.y, 'all_sprites', 'vampire/runvampright1.png');
  }

  generateItems() {
    this.map.findObject("items", (obj: any) => {
      let itemSprite = new BoostItem(this.matter.world, this, obj.x, obj.y, 'all_sprites', 'items/dashpotion1.png');
      const itemAnim = this.player.generateFrameNames('items/dashpotion', 'all_sprites', 1, 4);
      this.anims.create({ key: 'dashpotionAnim', frames: itemAnim, frameRate: 5, repeat: -1 });
      itemSprite.play('dashpotionAnim');
      itemSprite.setDensity(50);
      itemSprite.setHpCost(10);
      // itemSprite.setStatic(true);
      itemSprite.setCollisionCategory(this.itemsCat);
      itemSprite.setCollidesWith([this.playerCatCollision, 1, this.itemsCat]);
    }
    );
  }

  /**
   * Shortcut for reloading the scene
   */
  restart() {
    this.scene.restart();
  }

  /**
   * listen for external events
   */
  private addEventsListeners() {
    window.addEventListener('restart', (e) => {
      this.restart();
    });
  }

  /**
   * Trigger the victory of the player
   */
  private triggerVictory(): void {
    //TODO play win anim
    console.log('you win !')
    //this.scene.restart();
    window.dispatchEvent(EventsUtils.PLAYER_WIN);
    this.audioManager.playSound(this.audioManager.soundsList.VICTORY);
  }

  private addCalice(): void {
    const spawnPoint: any = this.map.findObject("calice_spawn", (obj: any) => obj.name === "calice");
    let caliceSprite = new VictoryItem(this.matter.world, this, spawnPoint.x, spawnPoint.y, 'all_sprites', 'items/calice1.png');
    const caliceAnim = this.player.generateFrameNames('items/calice', 'all_sprites', 1, 2);
    this.anims.create({ key: 'caliceAnim', frames: caliceAnim, frameRate: 10, repeat: -1 });
    caliceSprite.play('caliceAnim');
    caliceSprite.setStatic(true);
    caliceSprite.setCollisionCategory(1);
    caliceSprite.setCollidesWith([this.playerCatCollision]);
  }
  // Fct we call each frame
  /**
 * Create the parralax layers
 */
  private generateParralaxLayers() {
    this.parralaxLayers = {
      static: {
        sky: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/static/sky.png'),
        sun: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/static/sun.png'),
        cloud: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/static/cloud.png'),
      },
      scene1: {

        bg_far: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene1/bg_far.png'),
        bg: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene1/bg.png'),
        foreground: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene1/foreground.png'),
      },
      // scene2: {
      //   bg_far: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene2/bg_far.png'),
      //   bg: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene2/bg.png'),
      //   foreground: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'background/scene2/foreground.png'),

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


    //Scene1 bg

    //bg far
    this.parralaxLayers.scene1.bg_far.setTilePosition(this.cameras.main.scrollX * 0.1, this.cameras.main.scrollY * 0.1)
    //this.parralaxLayers.scene1.foreground.setTilePosition(this.player.x, this.player.y);

    //bg
    this.parralaxLayers.scene1.bg.setTilePosition(this.cameras.main.scrollX * 0.4, this.cameras.main.scrollY * 0.4)

    //foreground
    this.parralaxLayers.scene1.foreground.active = false;
  }

  // Fct we call each frame
  public update() {
    this.player.update();
    this.updateParralax();
    this.enemies.updateAllEnemies(this.player.x);
  }
}