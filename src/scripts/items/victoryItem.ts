import Item from "./item";

export default class VictoryItem extends Item {
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, scene, x, y, key, frame);
    }
}