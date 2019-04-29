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
        let frameName = '';
        let cost = 15;
        if (obj.name === 'glasses') {
            frameName = 'items/iconglasses.png';
            cost = 10;
        } else if (obj.name === 'umbrella') {
            cost = 20;
            frameName = 'items/umbrella1.png';
        } else if ((obj.name === 'pipe')){
            cost = 5;
            frameName = 'items/pipe.png'
        }
        let boostItem = new BoostItem(this.scene.matter.world, this.scene, obj.x, obj.y, 'all_sprites', frameName);
        boostItem.setHpCost(cost);
        boostItem.setItemName(obj.name);
        boostItem.setCollisionCategory(this.scene.itemsCat);
        boostItem.setCollidesWith([this.scene.playerCatCollision, 1, this.scene.itemsCat]);
    }
}