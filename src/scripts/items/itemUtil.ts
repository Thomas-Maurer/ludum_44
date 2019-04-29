import BoostItem from "./boostItem";
import MainScene from "../scenes/MainScene";

export default class ItemUtil {
    private scene: MainScene;
    constructor(scene: MainScene){
        this.scene = scene;
    }

    /**
     * generate random item on spawn
     */
    public generateItem(obj: any): void {
        let itemSprite = new BoostItem(this.scene.matter.world, this.scene, obj.x, obj.y, 'all_sprites', 'items/dashpotion1.png');
        const itemAnim = this.scene.player.generateFrameNames('items/dashpotion', 'all_sprites', 1, 4);
        this.scene.anims.create({ key: 'dashpotionAnim', frames: itemAnim, frameRate: 5, repeat: -1 });
        itemSprite.play('dashpotionAnim');
        itemSprite.setDensity(50);
        itemSprite.setHpCost(10);
        // itemSprite.setStatic(true);
        itemSprite.setCollisionCategory(this.scene.itemsCat);
        itemSprite.setCollidesWith([this.scene.playerCatCollision, 1, this.scene.itemsCat]);
    }
}