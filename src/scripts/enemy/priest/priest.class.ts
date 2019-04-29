import { Enemy } from "../enemy";
import { IEnemy } from "../enemy.interface";
import { EnemyGuid } from "../enemy-guid.enum";
import { EnemiesEnum } from "../enemies.enum";
import MainScene from "../../scenes/MainScene";
import {PriestInfo} from "./priest-info.enum";

export class Priest extends Enemy implements IEnemy {
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