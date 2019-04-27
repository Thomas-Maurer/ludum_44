import Player from "../player/Player";

export default class MainScene extends Phaser.Scene {
  public map: Phaser.Tilemaps.Tilemap;
  public player: Player;
  private parralaxLayers: Phaser.GameObjects.TileSprite[] = [];
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
    //create the parralax layers

    this.generateParralaxLayers();




    const worldLayer = this.map.createStaticLayer("tile_test", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collide: true });
    this.player = new Player(this, 64, 11 * 32, 'all_sprites', 'Poses/player_walk1.png');

    // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
    // haven't mapped out custom collision shapes in Tiled so each colliding tile will get a default
    // rectangle body (similar to AP).
    this.matter.world.convertTilemapLayer(worldLayer);
    // Visualize all the matter bodies in the world. Note: this will be slow so go ahead and comment
    // it out after you've seen what the bodies look like.
    this.matter.world.createDebugGraphic();
  }

  /**
   * Create the parralax layers
   */
  private generateParralaxLayers() {
    this.parralaxLayers.push(this.add.tileSprite(0, 0, window.innerWidth, window.innerHeight, 'all_sprites', 'bg_beta.png'))
  }

  /**
   * Update the parralax layers each frame
   */
  private updateParralax() {
    this.parralaxLayers[0].tilePositionX -= 0.05;
  }

  // Fct we call each frame
  public update() {
    this.player.handleActions();
    this.updateParralax();
  }
}

