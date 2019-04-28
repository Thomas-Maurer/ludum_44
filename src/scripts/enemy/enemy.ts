import {Map} from "../map-data";
/**
 * Enemy class
 */
export class Enemy extends Phaser.Physics.Matter.Sprite{
    /**
     * Current velocity
     */
    private currentVelocity: number = 1;
    /**
     * If -1 currentdirection is to left if +1 is to right
     * @type {number}
     */
    private currentDirection: number = 1;

    protected scene: Phaser.Scene;

    public isRunning = false;

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
        this.scene = scene;
        scene.add.existing(this);
        this.setFixedRotation();
        this.setFriction(0.2, 0.05,0);
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        if (!this.isRunning) {
            this.anims.play('peasantRun',true);
            this.isRunning = true;
        }
        // mak the enemy pnj always move
        this.setVelocityCustom();
    }

    public stopAllAnims() {
        this.anims.stop();
        this.isRunning = false;
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
     * TODO export this function
     * Generate FrameNames
     * @param key
     * @param atlasName
     * @param start
     * @param end
     */
    public generateFrameNames (key: string, atlasName: string, start: number, end: number): Phaser.Animations.Types.AnimationFrame[] {
        return this.scene.anims.generateFrameNames(atlasName,{
            start: start, end: end, zeroPad: 1,
            prefix: key, suffix: '.png'
        } )
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
            this.setFlipX(this.currentDirection === -1);
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
            this.setFlipX(this.currentDirection === -1);
        }
        // TODO delete after adding the right sprite (1 is corresponding to 64px)
        // checking collide on head
        tileY = tileY - 1;

        if (map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
            this.setFlipX(this.currentDirection === -1);
        }
    }

}