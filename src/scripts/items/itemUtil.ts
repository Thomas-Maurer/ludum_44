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
        let boostItem = new BoostItem(this.scene.matter.world, this.scene, obj.x, obj.y, 'all_sprites', 'items/iconglasses.png');
        boostItem.setHpCost(10);
        boostItem.setItemName('glasses');
        // itemSprite.setStatic(true);
        boostItem.setCollisionCategory(this.scene.itemsCat);
        boostItem.setCollidesWith([this.scene.playerCatCollision, 1, this.scene.itemsCat]);
    }
}