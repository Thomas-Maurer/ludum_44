export default class Item extends Phaser.Physics.Matter.Sprite {
    protected hpCost: number;
    protected nameItem: string;
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);
        this.hpCost = 0;
        scene.add.existing(this);
    }

    public setItemName(value: string): void {
        this.nameItem = value;
    }

    public getHpCost(): number {
        return this.hpCost;
    }

    public getNameItem(): string {
        return this.nameItem;
    }
}