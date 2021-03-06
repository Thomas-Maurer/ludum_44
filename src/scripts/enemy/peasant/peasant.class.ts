import { Enemy } from "../enemy";
import { IEnemy } from "../enemy.interface";
import { EnemyGuid } from "../enemy-guid.enum";
import { PeasantInfo } from "./peasant-info.enum";
import { EnemiesEnum } from "../enemies.enum";
import MainScene from "../../scenes/MainScene";

export class Peasant extends Enemy implements IEnemy {
    /**
     * Sprite prefix for run anim
     * @type {string}
     */
    private readonly runPeasantSpritePrefix = 'runpaysan';
    /**
     * Sprite prefix for dead anim
     * @type {string}
     */
    private readonly deadPeasantSpritePrefix = 'deathpaysan';
    /**
     * Sprite prefix for fight
     * @type {string}
     */
    private readonly fightPeasantSpritePrefix = 'speedfightpaysan';
    /**
     * First frame to show
     * @type {string}
     */
    public static firstSpriteSheet = 'runpaysan1.png';

    public GUID: EnemyGuid = EnemyGuid.PEASANT;
    public info = {
        life: PeasantInfo.LIFE,
        damage: PeasantInfo.DAMAGE,
        gain: PeasantInfo.GAIN
    };

    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number) {
        super(world, scene, x, y, EnemiesEnum.SPRITE_SHEET_ID, Peasant.firstSpriteSheet);
        this.world = world;
        this.initAnims();

        this.on('animationcomplete', (anim, frame) => {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        });

        this.on('animationcomplete_' + this.GUID + 'Fight', () => {
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
     * Init all anims for peasant interaction
     */
    private initAnims(): void {
        const peasantRunAnims = this.generateFrameNames(this.runPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 10);
        const peasantFightAnims = this.generateFrameNames(this.fightPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 8);
        const peasantDeadAnims = this.generateFrameNames(this.deadPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 2, 9);
        const peasantHitAnims = this.generateFrameNames(this.deadPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 2, 2);

        this.scene.anims.create({ key: this.GUID + 'Run', frames: peasantRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: this.GUID + 'Fight', frames: peasantFightAnims, frameRate: 10});
        this.scene.anims.create({ key: this.GUID + 'Dead', frames: peasantDeadAnims, frameRate: 8});
        this.scene.anims.create({ key: this.GUID + 'Hit', frames: peasantHitAnims, frameRate: 1});
    }
}