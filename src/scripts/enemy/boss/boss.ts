import {Enemy} from "../enemy";
import {IEnemy} from "../enemy.interface";
import {BossInfo} from "../Boss/Boss-info.enum";
import MainScene from "../../scenes/MainScene";
import {EnemiesEnum} from "../enemies.enum";
import {EnemyGuid} from "../enemy-guid.enum";
import {Map} from "../../map-data";

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
    private readonly fightBossSpritePrefix = 'boss/fight';
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
            left: matterEngine.Matter.Bodies.rectangle(x - 50, y, 20, 50, { isSensor: true, label: 'left' }),
            right: matterEngine.Matter.Bodies.rectangle(x + 50, y, 20, 50, { isSensor: true, label: 'right' })
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
        const BossRunAnims = this.generateFrameNames(this.runBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 9);
        const BossFightAnims = this.generateFrameNames(this.fightBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 4);
        const BossDeadAnims = this.generateFrameNames(this.deadBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 1, 4);
        const BossHitAnims = this.generateFrameNames(this.deadBossSpritePrefix, EnemiesEnum.SPRITE_SHEET_BOSS, 2, 2);

        this.scene.anims.create({ key: this.GUID + 'Run', frames: BossRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: this.GUID + 'Fight', frames: BossFightAnims, frameRate: 20, repeat: -1 });
        this.scene.anims.create({ key: this.GUID + 'Dead', frames: BossDeadAnims, frameRate: 5, repeat: 0 });
        this.scene.anims.create({ key: this.GUID + 'Hit', frames: BossRunAnims, frameRate: 10, repeat: 0 });
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

        this.attackPlayer();

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
            console.log('jexiste');
            this.currentDirection = this.currentDirection * -1;
            this.currentVelocity = this.currentVelocity * -1;
            this.setFlipX(this.currentDirection === -1);
        }
        this.setVelocityX(this.currentVelocity);
    }
}