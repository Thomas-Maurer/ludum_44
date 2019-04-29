import { Enemy } from "../enemy";
import { IEnemy } from "../enemy.interface";
import { EnemyGuid } from "../enemy-guid.enum";
import { EnemiesEnum } from "../enemies.enum";
import MainScene from "../../scenes/MainScene";
import {PriestInfo} from "./priest-info.enum";
import Player from "../../player/Player";
import {Bullet} from "./bullet.class";

export class Priest extends Enemy implements IEnemy {
    private isRangeAttacking = false;
    private bullets: any;
    /**
     * Sprite prefix for run anim
     * @type {string}
     */
    private readonly runPriestSpritePrefix = 'runpriest';
    /**
     * Sprite prefix for dead anim
     * @type {string}
     */
    private readonly deadPriestSpritePrefix = 'deathpriest';
    /**
     * Sprite prefix for fight
     * @type {string}
     */
    private readonly fightPriestSpritePrefix = 'fightpriest';
    /**
     * First frame to show
     * @type {string}
     */
    public static firstSpriteSheet = 'runpriest1.png';

    public GUID: EnemyGuid = EnemyGuid.PRIEST;
    public info = {
        life: PriestInfo.LIFE,
        damage: PriestInfo.DAMAGE,
        gain: PriestInfo.GAIN
    };

    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number) {
        super(world, scene, x, y, EnemiesEnum.SPRITE_SHEET_ID, Priest.firstSpriteSheet);
        this.world = world;
        this.initAnims();

        this.on('animationcomplete', (anim, frame) => {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        });

        this.on('animationcomplete_' + this.GUID + 'Fight', () => {
            if (!this.isDead) {
                this.pushBullet();

                if (this.currentPlayerInstance !== null) {
                    this.currentPlayerInstance.getDamageFromEnemy(this.info.damage);
                }
                this.isDoingAnAction = false;
                this.anims.play(this.GUID + 'Run', true);
                this.isRunning = true;
            }
        });

        this.on('animationcomplete_' + this.GUID + 'Hit', () => {
            this.isHit = false;
        });

        this.handleCollisionAttack();
    }


    /**
     * Set physics of the enemy
     */
    protected setPhysics(x: number, y: number) {
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 60, 110, {
            chamfer: { radius: 17 }
        });
        // add sensor
        this.sensors = {
            left: matterEngine.Matter.Bodies.rectangle(x - 50, y, 20, 50, { isSensor: true, label: 'left' }),
            right: matterEngine.Matter.Bodies.rectangle(x + 50, y, 20, 50, { isSensor: true, label: 'right' }),
            rightRangeAttack: matterEngine.Matter.Bodies.rectangle(x + 200, y, 300, 10, { isSensor: true, label: 'rightRangeAttack' }),
            leftRangeAttack: matterEngine.Matter.Bodies.rectangle(x - 200, y, 300, 10, { isSensor: true, label: 'leftRangeAttack' })
        };

        const compoundBody = matterEngine.Matter.Body.create({
            parts: [ body, this.sensors.left, this.sensors.right, this.sensors.rightRangeAttack, this.sensors.leftRangeAttack],
            inertia: Infinity
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation();
        this.setFriction(0);
    }


    /**
     * Handle collision effects
     */
    private handleCollisionAttack(): void {
        this.scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.leftRangeAttack, this.sensors.rightRangeAttack],
            callback: this.onSensorRangeAttack,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.leftRangeAttack, this.sensors.rightRangeAttack],
            callback: this.onSensorRangeAttack,
            context: this
        });
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [this.sensors.leftRangeAttack, this.sensors.rightRangeAttack],
            callback: () => this.currentPlayerInstance = null,
            context: this
        });
    }

    /**
     * On sensor was display
     * @param bodyA
     * @param bodyB
     */
    private onSensorRangeAttack({ bodyA, bodyB }) {
        if (bodyB.isSensor ) return; // We only care about collisions with physical objects
        if (bodyB.gameObject instanceof Player) {
            if (bodyB.gameObject.getAttackstate()) {
                // player attack before
            } else if (!this.isDead && !this.isHit) {
                if (bodyA === this.sensors.leftRangeAttack) {
                    if (this.currentDirection !== -1) {
                        this.currentDirection = -1;
                        this.currentVelocity = -1;
                        this.setFlipX(true);
                    }
                } else if (bodyA === this.sensors.rightRangeAttack) {
                    if (this.currentDirection !== 1) {
                        this.currentDirection = 1;
                        this.currentVelocity = 1;
                        this.setFlipX(false);
                    }
                }
                if (!this.isRangeAttacking && !this.isHit) {
                    this.rangeAttack(bodyB.gameObject);
                }
            }
        }
    }

    /**
     * Make a range attack
     * @param bodyA
     * @param playerInstance
     */
    private rangeAttack(playerInstance) {
        this.isDoingAnAction = true;
        this.anims.play(this.GUID + 'Fight', true);
        this.currentPlayerInstance = playerInstance;
        // const bullet = this.bullets.get();
        // bullet.fire(this);
        // this.pushBullet();
        this.isRangeAttacking = true;
        setTimeout(() => {this.isRangeAttacking = false}, 3000);
    }

    public pushBullet() {
        let x = this.x;
        if (this.currentDirection === -1) {
            x -= 40;
        } else {
            x += 10;
        }
       const bullet = new Bullet(this.world, this.scene, x, this.y, EnemiesEnum.SPRITE_SHEET_ID, 'fireball1.png', this.currentDirection);
        setTimeout(() => bullet.destroy(), 3000);
    }




    /**
     * Init all anims for peasant interaction
     */
    private initAnims(): void {
        const priestRunAnims = this.generateFrameNames(this.runPriestSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 10);
        const priestFightAnims = this.generateFrameNames(this.fightPriestSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 9);
        const priestDeadAnims = this.generateFrameNames(this.deadPriestSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 11);
        const priestHitAnims = this.generateFrameNames(this.deadPriestSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 2, 2);

        this.scene.anims.create({ key: this.GUID + 'Run', frames: priestRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: this.GUID + 'Fight', frames: priestFightAnims, frameRate: 10});
        this.scene.anims.create({ key: this.GUID + 'Dead', frames: priestDeadAnims, frameRate: 8});
        this.scene.anims.create({ key: this.GUID + 'Hit', frames: priestHitAnims, frameRate: 1});
    }
}