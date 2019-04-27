import {MapUtils} from "../utils/map.utils";
import {Map} from "../map-data";
/**
 * Enemy class
 */
export class Enemy {
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
     * @param matterObject
     * @param x
     * @param y
     */
    constructor(matterObject: any, x: number, y: number) {
        this.matterObject = matterObject;
        this.initSprite(x, y);
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        // mak the enemy pnj always move
        this.setVelocity();
    }

    /**
     * Set the velocity of the sprite depending on the platform
     */
    private setVelocity(): void {
        // fix prob with origin of the tile TODO check this condition after doing good sprite
        const xToAdd = this.currentDirection === 1 ? 0 : this.currentDirection;
        const map = Map.getInstance();
        // calculate tile (for origin position of the sprite
        const tileX: number = (parseInt(this._enemySprite.x) / Map.TILES_SIZE_X) + xToAdd;
        const tileY: number = (parseInt(this._enemySprite.y) / Map.TILES_SIZE_Y) + 1;

        if (!map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
        }
        this._enemySprite.setVelocityX(this.currentVelocity);

    }

    /**
     * Init enemy sprite
     * @param x
     * @param y
     */
    private initSprite(x: number, y: number): void {
        this._enemySprite = this.matterObject.add.sprite(
            MapUtils.getMapPixelCoord(x),
            MapUtils.getMapPixelCoord(y),
            Enemy.SPRITE_ID,
            'zombie_hang.png');
    }

}