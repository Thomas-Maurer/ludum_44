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
        let boostItem = new BoostItem(this.scene.matter.world, this.scene, obj.x, obj.y, 'all_sprites', 'items/dashpotion1.png');
        const itemAnim = this.scene.player.generateFrameNames('items/dashpotion', 'all_sprites', 1, 4);
        this.scene.anims.create({ key: 'dashpotionAnim', frames: itemAnim, frameRate: 5, repeat: -1 });
        boostItem.play('dashpotionAnim');
        boostItem.setDensity(50);
        boostItem.setHpCost(10);
        boostItem.setItemName('dashPotion');
        // itemSprite.setStatic(true);
        boostItem.setCollisionCategory(this.scene.itemsCat);
        boostItem.setCollidesWith([this.scene.playerCatCollision, 1, this.scene.itemsCat]);
    }
}