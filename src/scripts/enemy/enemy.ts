import { Map } from "../map-data";
import { EnemyGuid } from "./enemy-guid.enum";
import { IEnemy } from "./enemy.interface";
import MainScene from "../scenes/MainScene";
/**
 * Enemy class
 */
export class Enemy extends Phaser.Physics.Matter.Sprite implements IEnemy {
    /**
     * Current velocity
     */
    private currentVelocity: number = 1;
    /**
     * If -1 currentdirection is to left if +1 is to right
     * @type {number}
     */
    private currentDirection: number = 1;

    protected scene: MainScene;

    public isRunning = false;
    public isDead = false;
    public isHit = false;

    /**
     * Guid fill by the children
     */
    public GUID: EnemyGuid;
    /**
     * Fill by the children
     * @type {{life: number; damage: number}}
     */
    public info = {
        life:  0,
        damage:  0,
        gain:  0,
    };

    /**
     *
     * @param world
     * @param scene
     * @param x
     * @param y
     * @param key
     * @param frame
     */
    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);

        this.scene = scene;
        scene.add.existing(this);
        // change collision rect
        this.setPhysics(x, y);
    }

    /**
     * Set physics of the enemy
     */
    private setPhysics(x: number, y: number) {
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 64, 115);
        this.setExistingBody(body);

        this.setFixedRotation();
        this.setFriction(0);
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        if (this.isDead || this.isHit) {
            return;
        }
        if (!this.isRunning) {
            this.anims.play(this.GUID + 'Run',true);
            this.isRunning = true;
        }

        // mak the enemy pnj always move
        this.setVelocityCustom();
    }

    /**
     * Stop all animations
     */
    public stopAllAnims(): void {
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
    public generateFrameNames(key: string, atlasName: string, start: number, end: number): Phaser.Animations.Types.AnimationFrame[] {
        return this.scene.anims.generateFrameNames(atlasName, {
            start: start, end: end, zeroPad: 1,
            prefix: key, suffix: '.png'
        })
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

    /**
     * Destroy sprite
     */
    public destroySprite() {
        this.destroy();
    }

    /**
     * Add a dead sensor to the corps
     */
    private addDeadSensor(): void {
        const matterEngine: any = Phaser.Physics.Matter;
        const Bodies = matterEngine.Matter.Bodies;
        const deadSensor = Bodies.rectangle(0, 0, 64, 64, {
            isSensor: true,
            label: 'deadsensor'
        });

        const compoundBody = matterEngine.Matter.Body.create({
            parts: [ deadSensor ],
            inertia: Infinity
        });

        const currentX = this.x;
        const currentY = this.y;

        this.setExistingBody(compoundBody);
        this.setStatic(true);
        this.x = currentX;
        this.y = currentY;
    }

    /**
     * Method used by childrens
     * @param damage
     */
    public takeDamage(damage: number): void {
        debugger
        if (this.isHit || this.isDead) {
            return;
        }
        this.info.life = this.info.life - damage;

        if (this.info.life <= 0) {
            this.setStatic(true);
            this.isDead = true;
            this.stopAllAnims();
            this.anims.play(this.GUID + 'Dead',true);
            this.addDeadSensor();
        } else {
            this.isHit = true;
            this.isRunning = false;
            this.anims.play(this.GUID + 'Hit',true);
            setTimeout(() => this.isHit = false, 500);
        }
    }

}