import {MapUtils} from "../utils/map.utils";
export default class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  public cursors: any;
  constructor() {
    super({
      key: "MainScene",
    });
  }
  preload() {
    this.load.tilemapTiledJSON("map", "/assets/map/map_beta.json");
    this.load.image("tiles_test", "/assets/graphics/map/backgrounds/bg_beta.png");
    this.load.multiatlas('all_sprites', 'assets/graphics/map/backgrounds/spritesheet.json', 'assets/graphics/map/backgrounds');
    this.load.multiatlas('enemy_sprites', 'assets/graphics/char/enemy/enemy_test.json', 'assets/graphics/char/enemy');
  }
  create() {
    /** Build all layers maps */
    this.map = this.add.tilemap("map");
    const tileset = this.map.addTilesetImage("tile_test", "tiles_test");
    this.add.sprite(0, 0, 'all_sprites', 'bg_beta.png');

    const worldLayer = this.map.createStaticLayer("tile_test", tileset, 0, 0);

      worldLayer.setCollisionByProperty({ collide: true });
    this.matter.add.sprite(64, 11*32, 'all_sprites', 'Poses/player_walk1.png');

    this.matter.add.sprite(MapUtils.getMapPixelCoord(10), MapUtils.getMapPixelCoord(0), 'enemy_sprites', 'zombie_hang.png');

      // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
      // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
      // rectangle body (similar to AP).
      this.matter.world.convertTilemapLayer(worldLayer);
      // Visualize all the matter bodies in the world. Note: this will be slow so go ahead and comment
      // it out after you've seen what the bodies look like.
      this.matter.world.createDebugGraphic();
    this.mappingKeys();
  }

  private mappingKeys() {
    // Handle Keyboard Event
    this.cursors = this.input.keyboard.addKeys(
        {
          escape: Phaser.Input.Keyboard.KeyCodes.ESC,
          up: "up",
          down: "down",
          left: "left",
          right: "right",
        });
  }
// Fct we call each frame
  public update() {

  }
}

