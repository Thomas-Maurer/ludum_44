import Item from "./item";

export default class BoostItem extends Item {
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, scene, x, y, key, frame);
    }

    /**
     * set the price of the item
     * @param value
     */
    public setHpCost(value: number): void {
        this.hpCost = value;
    }
}