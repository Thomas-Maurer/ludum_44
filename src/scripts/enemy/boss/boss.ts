import {Enemy} from "../enemy";
import {IEnemy} from "../enemy.interface";
import {BossInfo} from "../Boss/Boss-info.enum";
import MainScene from "../../scenes/MainScene";
import {EnemiesEnum} from "../enemies.enum";
import {EnemyGuid} from "../enemy-guid.enum";
import {Map} from "../../map-data";
import Player from "../../player/Player";

export default class Boss extends Enemy implements IEnemy {
    /**
     * Sprite prefix for run anim
     * @type {string}
     */
    private readonly runBossSpritePrefix = 'boss/walkboss';
    /**
     * Sprite prefix for dead anim
     * @type {string}
     */
    private readonly deadBossSpritePrefix = 'boss/deadboss';
    /**
     * Sprite prefix for fight
     * @type {string}
     */
    private readonly fightBossSpritePrefix = 'boss/fightboss';
    /**
     * First frame to show
     * @type {string}
     */
    public static firstSpriteSheet = 'boss/walkboss1.png';
    public GUID: EnemyGuid = EnemyGuid.BOSS;
    public info = {
        life: BossInfo.LIFE,
        damage: BossInfo.DAMAGE,
        gain: BossInfo.GAIN
    };

    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number) {
        super(world, scene, x, y, EnemiesEnum.SPRITE_SHEET_BOSS, Boss.firstSpriteSheet);
        this.world = world;
        this.initAnims();
        this.on('animationcomplete', (anim, frame) => {
            console.log(anim.key)
            this.emit('animationcomplete_' + anim.key, anim, frame);
        });

        this.on('animationcomplete_' + this.GUID + 'Fight', () => {
            console.log('penis')

            if (!this.isDead) {
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
    }

    /**
     * Set physics of the enemy
     */
    protected setPhysics(x: number, y: number) {
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 100, 250, {
            chamfer: { radius: 17 }
        });
        // add sensor
        this.sensors = {
            left: matterEngine.Matter.Bodies.rectangle(x - 125, y, 50, 150, { isSensor: true, label: 'left' }),
            right: matterEngine.Matter.Bodies.rectangle(x + 125, y, 50, 150, { isSensor: true, label: 'right' })
        };

        const compoundBody = matterEngine.Matter.Body.create({
            parts: [ body, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            mass: 5000,
            inertia: Infinity
        });

        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }


    /**
     * Init all anims for Boss interaction
     */
    private initAnims(): void {
        const BossRunAnims = this.generateFrameNames(this.runBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 11);
        const BossFightAnims = this.generateFrameNames(this.fightBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 4);
        const BossDeadAnims = this.generateFrameNames(this.deadBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 4);
        const BossHitAnims = this.generateFrameNames(this.deadBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 2, 2);

        this.scene.anims.create({ key: this.GUID + 'Run', frames: BossRunAnims, frameRate: 12, repeat: -1 });
        this.scene.anims.create({ key: this.GUID + 'Fight', frames: BossFightAnims, frameRate: 20 });
        this.scene.anims.create({ key: this.GUID + 'Dead', frames: BossDeadAnims, frameRate: 5, repeat: 0 });
        this.scene.anims.create({ key: this.GUID + 'Hit', frames: BossHitAnims, frameRate: 10, repeat: 0 });
    }

    /**
     * Update function call by scene update
     */
    public update(): void {
        if (this.isDead || this.isHit) {
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
     * Set current velocity and direction
     */
    protected setVelocityOnGround(): void {
        const map = Map.getInstance();
        // calculate tile (for origin position of the sprite
        const tileX: number = (this.x + 74);

        const tileY: number = (this.y + 154);
        // console.log(tileX, tileY);
        // let debugPath = new Phaser.GameObjects.Graphics(this.scene);
        // debugPath.lineStyle(5, 0x000000, 1.0);
        // debugPath.fillStyle(0x4ef442, 1.0);
        // debugPath.fillCircle(tileX, tileY, 5);
        // this.scene.add.existing(debugPath);
        // console.log(map.isExistTile(tileX/64, tileY/64));

        if (!map.isExistTile(tileX/64, tileY/64)) {
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
            this.setFlipX(this.currentDirection === -1);
        }
        this.setVelocityX(this.currentVelocity);
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
        if (bodyB.isSensor ) return; // We only care about collisions with physical objects
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
}