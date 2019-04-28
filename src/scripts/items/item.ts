export default class Item extends Phaser.Physics.Matter.Sprite {
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);
        scene.add.existing(this);
    }
}