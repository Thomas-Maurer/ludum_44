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
  }
  create() {
    /** Build all layers maps */
    this.map = this.add.tilemap("map");
    const tileset = this.map.addTilesetImage("tile_test", "tiles_test");
    var background = this.add.sprite(0, 0, 'all_sprites', 'bg_beta.png');


    const worldLayer = this.map.createStaticLayer("tile_test", tileset, 0, 0);
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

}

