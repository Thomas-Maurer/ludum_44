import {MapUtils} from "../utils/map.utils";
import {Map} from "../map-data";
/**
 * Enemy class
 */
export class Enemy extends Phaser.Physics.Matter.Sprite{
    /**
     * Sprite id
     * @type {string}
     */
    public static SPRITE_ID = 'enemy_sprites';
    /**
     * Matter object
     */
    private matterObject: any;
    /**
     * Current velocity
     */
    private currentVelocity: number = 1;
    /**
     * If -1 currentdirection is to left if +1 is to right
     * @type {number}
     */
    private currentDirection: number = 1;
    /**
     * Contain enemy sprite object from phaser
     */
    private _enemySprite: any;
    public get sprite() {
        return this._enemySprite;
    }

    /**
     *
     * @param world
     * @param scene
     * @param x
     * @param y
     * @param key
     * @param frame
     */
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);
        scene.add.existing(this);
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        // mak the enemy pnj always move
        this.calculVelocity();
    }

    /**
     * Set the velocity of the sprite depending on the platform
     */
    private calculVelocity(): void {
        // fix prob with origin of the tile TODO check this condition after doing good sprite
        const xToAdd = this.currentDirection === 1 ? 0 : this.currentDirection;
        const map = Map.getInstance();
        // calculate tile (for origin position of the sprite
        const tileX: number = (this.x / Map.TILES_SIZE_X) + xToAdd;
        const tileY: number = (this.y / Map.TILES_SIZE_Y) + 1;

        if (!map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
        }
        this.setVelocityX(this.currentVelocity);

    }

}