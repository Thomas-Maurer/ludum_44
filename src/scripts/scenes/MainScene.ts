import Player from "../player/Player";
import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import AudioManager from "../AudioManager";
import { Enemy } from "../enemy/enemy";
import { Map } from "../map-data";
export default class MainScene extends Phaser.Scene {
  public matterCollision: PhaserMatterCollisionPlugin;
  public map: Phaser.Tilemaps.Tilemap;
  public player: Player;
  public audioManager: AudioManager;
  private parralaxLayers: {
    bg_static: Phaser.GameObjects.TileSprite,
    bg_clouds: Phaser.GameObjects.TileSprite,
    bg_far: Phaser.GameObjects.TileSprite,
    bg: Phaser.GameObjects.TileSprite
  };
  /*
   * TODO make a class calling alls enemies
   */
  public enemy: any;
  constructor() {
    super({
      key: "MainScene",
    });

  }
  preload() {
    this.load.tilemapTiledJSON("map", "/assets/map/map_beta.json");
    this.load.multiatlas('all_sprites', 'assets/graphics/map/backgrounds/spritesheet.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas('block', 'assets/graphics/map/backgrounds/block.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas(Enemy.SPRITE_ID, 'assets/graphics/char/enemy/enemy_test.json', 'assets/graphics/char/enemy');

    this.audioManager = new AudioManager(this);
  }
  create() {
    /** Build all layers maps */
    const map = Map.getInstance(this.add.tilemap('map'));
    this.map = map.tileMap;
    const tileset = this.map.addTilesetImage('block', 'block');

    this.generateParralaxLayers();
    const worldLayer = this.map.createStaticLayer('main_tile', tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    worldLayer.setCollisionByProperty({ collide: true });

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(worldLayer);

    this.player = new Player(this.matter.world, this, 64, 11 * 32, 'all_sprites', 'vampire/runvampright1.png');
    this.enemy = new Enemy(this.matter.world, this, 10 * 64, 0, Enemy.SPRITE_ID, 'zombie_hang');

    const playerRunAnims = this.player.generateFrameNames('vampire/runvampright', 'all_sprites', 1, 10);
    const playerIdleAnims = this.player.generateFrameNames('vampire/fightvamp', 'all_sprites', 1, 10);
    const playerJumpAnims = this.player.generateFrameNames('vampire/jumpvamp', 'all_sprites', 1, 7);
    const playerAttackAnims = this.player.generateFrameNames('vampire/fightvamp', 'all_sprites', 1, 19);
    this.anims.create({ key: 'playerRun', frames: playerRunAnims, frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'playerIdle', frames: playerIdleAnims, frameRate: 10, repeat: -1 });
    this.anims.create({ key: 'playerJump', frames: playerJumpAnims, frameRate: 9});
    this.anims.create({ key: 'playerAttack', frames: playerAttackAnims, frameRate: 13});

    this.cameras.main.startFollow(this.player.getPlayerSprite(), false, 0.5, 0.5);
    // Visualize all the matter bodies in the world. Note: this will be slow so go ahead and comment
    // it out after you've seen what the bodies look like.
    this.matter.world.createDebugGraphic();
    this.matterCollision.addOnCollideStart({
      objectA: this.player.getPlayerSprite(),
      callback: function (eventData) {
        //console.log(eventData)
      },
      context: this // Context to apply to the callback function
    });
    this.matterCollision.addOnCollideActive({
      objectA: this.player.getPlayerSprite(),
      callback: (eventData: any) => {
        if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
          this.player.setPlayerInAirValue(false);
        } else if (eventData.gameObjectB instanceof Enemy) {
          console.log(eventData.gameObjectB)
        }
      },
      context: this
    });
  }

  // Fct we call each frame
  /**
 * Create the parralax layers
 */
  private generateParralaxLayers() {
    this.parralaxLayers = {
      bg_static: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'bg_static.png'),
      bg_clouds: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'bg_clouds.png'),
      bg_far: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'bg_far.png'),
      bg: this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'bg.png'),

    }

    for (const layerName in this.parralaxLayers) {
      if (this.parralaxLayers.hasOwnProperty(layerName)) {
        const layer: Phaser.GameObjects.TileSprite = this.parralaxLayers[layerName];
        layer.setOrigin(0, 0);
      }
    }
  }



  /**
   * Update the parralax layers each frame
   */
  private updateParralax() {

    for (const layerName in this.parralaxLayers) {
      if (this.parralaxLayers.hasOwnProperty(layerName)) {
        const layer: Phaser.GameObjects.TileSprite = this.parralaxLayers[layerName];
        layer.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY)
        layer.setOrigin(0, 0);
      }
    }

    this.parralaxLayers.bg_clouds.tilePositionX -= 0.5;
    this.parralaxLayers.bg_far.tilePositionX = this.cameras.main.scrollX * 0.1;
    this.parralaxLayers.bg_far.tilePositionY = this.cameras.main.scrollY * 0.1;
    this.parralaxLayers.bg.tilePositionX = this.cameras.main.scrollX * 0.4;
    this.parralaxLayers.bg.tilePositionY = this.cameras.main.scrollY * 0.4;
    // this.parralaxLayers[1].tilePositionX = this.player.getPlayerSprite().x * 0.1;

  }

  // Fct we call each frame
  public update() {
    this.player.handleActions();
    this.updateParralax();
    this.enemy.update();
  }
}