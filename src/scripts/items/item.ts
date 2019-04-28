export default class Item extends Phaser.Physics.Matter.Sprite {
    protected hpCost: number;
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);
        this.hpCost = 0;
        scene.add.existing(this);
    }

    public getHpCost(): number {
        return this.hpCost;
    }
}