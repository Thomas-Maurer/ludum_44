import { Map } from "../map-data";
import { EnemyGuid } from "./enemy-guid.enum";
import { IEnemy } from "./enemy.interface";
import MainScene from "../scenes/MainScene";
import Player from "../player/Player";
import Boss from "./boss/boss";
/**
 * Enemy class
 */
export class Enemy extends Phaser.Physics.Matter.Sprite implements IEnemy {
    /**
     * Current velocity
     */
    protected currentVelocity: number = 1;
    /**
     * If -1 currentdirection is to left if +1 is to right
     * @type {number}
     */
    protected currentDirection: number = 1;

    public currentPlayerInstance: Player;

    protected scene: MainScene;

    public isRunning = false;
    public isDead = false;
    public isHit = false;
    public isDoingAnAction = false;

    public sensors: any;

    /**
     * Guid fill by the children
     */
    public GUID: EnemyGuid;
    /**
     * Fill by the children
     * @type {{life: number; damage: number}}
     */
    public info = {
        life: 0,
        damage: 0,
        gain: 0,
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
        this.setDepth(3);

        this.scene = scene;
        scene.add.existing(this);
        // change collision rect
        this.setPhysics(x, y);
        this.handleCollision();
    }

    /**
     * Handle collision effects
     */
    private handleCollision(): void {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [this.sensors.left, this.sensors.right],
            callback: () => this.currentPlayerInstance = null,
            context: this
        });
    }

    /**
     * Change velocity on enemy collide wall with sensor
     * @param bodyA
     * @param bodyB
     */
    protected onSensorCollide({ bodyA, bodyB }): void {
        // Watch for the player colliding with walls/objects on either side and the ground below, so
        // that we can use that logic inside of update to move the player.
        // Note: we are using the "pair.separation" here. That number tells us how much bodyA and bodyB
        // overlap. We want to teleport the sprite away from walls just enough so that the player won't
        // be able to press up against the wall and use friction to hang in midair. This formula leaves
        // 0.5px of overlap with the sensor so that the sensor will stay colliding on the next tick if
        // the player doesn't move.
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
        if (bodyB.gameObject instanceof Player) {
            if (bodyB.gameObject.getAttackstate()) {
                // player attack before
            } else if (!this.isDead && !this.isHit) {
                this.attackPlayer(bodyA, bodyB.gameObject);
            }
        } else {
            if (bodyA === this.sensors.left) {
                // is currently going to left
                if (this.currentDirection === -1) {
                    // make it going to right
                    this.currentDirection = 1;
                    this.currentVelocity = 1;
                    this.setFlipX(false);
                    this.setVelocityX(this.currentVelocity);
                }
            } else if (bodyA === this.sensors.right) {
                // is currently going to left
                if (this.currentDirection === 1) {
                    // make it going to right
                    this.currentDirection = -1;
                    this.currentVelocity = -1;
                    this.setFlipX(true);
                    this.setVelocityX(this.currentVelocity);
                }
            }
        }
    }

    /**
     * Set physics of the enemy
     */
    protected setPhysics(x: number, y: number) {
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 60, 120, {
            chamfer: { radius: 17 }
        });
        // add sensor
        this.sensors = {
            left: matterEngine.Matter.Bodies.rectangle(x - 50, y, 20, 50, { isSensor: true, label: 'left' }),
            right: matterEngine.Matter.Bodies.rectangle(x + 50, y, 20, 50, { isSensor: true, label: 'right' })
        };

        const compoundBody = matterEngine.Matter.Body.create({
            parts: [body, this.sensors.left, this.sensors.right],
            inertia: Infinity
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.setFriction(0);
        this.setOrigin(0.5, 0.65);
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        if (this.isDead || this.isHit || this.isDoingAnAction) {
            return;
        }
        if (!this.isRunning) {
            this.anims.play(this.GUID + 'Run', true);
            this.isRunning = true;
        }

        // mak the enemy pnj always move
        this.setVelocityCustom();
    }

    /**
     * Attack player
     */
    protected attackPlayer(bodyA: any, playerInstance: Player): void {
        if (bodyA === this.sensors.left) {
            if (this.currentDirection !== -1) {
                this.currentDirection = -1;
                this.currentVelocity = -1;
                this.setFlipX(true);
            }
        } else if (bodyA === this.sensors.right) {
            if (this.currentDirection !== 1) {
                this.currentDirection = 1;
                this.currentVelocity = 1;
                this.setFlipX(false);
            }
        }
        this.isDoingAnAction = true;
        this.anims.play(this.GUID + 'Fight', true);
        this.currentPlayerInstance = playerInstance;
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
    protected setVelocityCustom(): void {
        this.setVelocityOnGround();
        // this.setVelocityOnCollide();
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
    protected setVelocityOnGround(): void {
        const map = Map.getInstance();
        // calculate tile (for origin position of the sprite
        const tileX: number = (this.x / Map.TILES_SIZE_X) - 0.5;

        const tileY: number = (this.y / Map.TILES_SIZE_Y) + 1;

        if (!map.isExistTile(tileX, tileY)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
            this.setFlipX(this.currentDirection === -1);
        }
        this.setVelocityX(this.currentVelocity);
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
            parts: [deadSensor],
            inertia: Infinity
        });

        const currentX = this.x;
        const currentY = this.y;

        this.setExistingBody(compoundBody);
        this.setStatic(true);
        this.x = currentX;
        this.y = currentY;
        this.setOrigin(0.5, 0.65);

    }

    /**
     * Method used by childrens
     * @param damage
     */
    public takeDamage(damage: number): void {
        if (this.isHit || this.isDead) {
            return;
        }
        this.currentPlayerInstance = null;

        this.info.life = this.info.life - damage;

        if (this.GUID === EnemyGuid.BOSS) {
            const bossHpEvent: CustomEvent = new CustomEvent("BOSS_HP", {
                detail: this.info.life
            });
            window.dispatchEvent(bossHpEvent);
        }

        //window.dispatchEvent(playerHpEvent);

        if (this.info.life <= 0) {
            this.isDead = true;
            this.setStatic(true);
            this.anims.play(this.GUID + 'Dead', true);
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.PEASANT_DIE);
            this.addDeadSensor();
        } else {
            this.stopAllAnims();
            this.isHit = true;
            this.isRunning = false;
            this.anims.play(this.GUID + 'Hit', true);
        }
    }

}