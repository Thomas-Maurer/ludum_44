import Player from "../player/Player";
import * as PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

import {Enemy} from "../enemy/enemy";
import {Map} from "../map-data";
export default class MainScene extends Phaser.Scene {
  public matterCollision: PhaserMatterCollisionPlugin;
  public map: Phaser.Tilemaps.Tilemap;
  public player: Player;
  private parralaxLayers: {
    bg_static: Phaser.GameObjects.TileSprite,
    bg_clouds: Phaser.GameObjects.TileSprite,
    bg_far: Phaser.GameObjects.TileSprite
  };
  public cursors: any;
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
    this.load.image("tiles_test", "/assets/graphics/map/backgrounds/bg_beta.png");
    this.load.multiatlas('all_sprites', 'assets/graphics/map/backgrounds/spritesheet.json', 'assets/graphics/map/backgrounds');


    this.load.multiatlas(Enemy.SPRITE_ID, 'assets/graphics/char/enemy/enemy_test.json', 'assets/graphics/char/enemy');
  }
  create() {
    /** Build all layers maps */
    const map = Map.getInstance(this.add.tilemap('map'));
    this.map = map.tileMap;

    const tileset = this.map.addTilesetImage("tile_test", "tiles_test");
    this.generateParralaxLayers();
    const worldLayer = this.map.createStaticLayer("tile_test", tileset, 0, 0);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    worldLayer.setCollisionByProperty({ collide: true });
    this.player = new Player(this, 64, 11 * 32, 'all_sprites', 'Poses/player_walk1.png');

    this.enemy = new Enemy(this.matter, 10, 0);

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(worldLayer);

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
        const playerPos = this.player.getPlayerSprite();
        layer.setPosition(this.cameras.main.scrollX, this.cameras.main.scrollY)
        layer.setOrigin(0, 0);
      }
    }

    this.parralaxLayers.bg_clouds.tilePositionX -= 0.5;
    this.parralaxLayers.bg_far.tilePositionX = this.cameras.main.scrollX * 0.1;
    this.parralaxLayers.bg_far.tilePositionY = this.cameras.main.scrollY * 0.1;
    // this.parralaxLayers[1].tilePositionX = this.player.getPlayerSprite().x * 0.1;

  }

  // Fct we call each frame
  public update() {
    this.player.handleActions();
    this.updateParralax();
    this.enemy.update();
  }
}

