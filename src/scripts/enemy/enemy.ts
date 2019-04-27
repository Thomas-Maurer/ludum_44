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
        return this;
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
        this.setVelocityCustom();
    }

    /**
     * Set the velocity of the sprite depending on the platform
     */
    private setVelocityCustom(): void {
        this.setVelocityOnGround();
        this.setVelocityOnCollide();
        this.setVelocityX(this.currentVelocity);

    }

    /**
     * Set current velocity and direction
     */
    private setVelocityOnGround(): void {
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

    /**
     * Set velocity on collide
     */
    private setVelocityOnCollide(): void {
        // fix prob with origin of the tile TODO check this condition after doing good sprite
        // 0.3+ for fix "bug" math round
        const xToAdd = this.currentDirection === -1 ? -1.3 : 0.3;
        const map = Map.getInstance();
        // calculate tile (for origin position of the sprite
        const tileX: number = (this.x / Map.TILES_SIZE_X) + xToAdd;
        let tileY: number = (this.y / Map.TILES_SIZE_Y);

        if (map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
        }
        // TODO delete after adding the right sprite (1 is corresponding to 64px)
        // checking collid on head
        tileY = tileY - 1;

        if (map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
        }
    }

}