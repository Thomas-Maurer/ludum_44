import {Enemy} from "../enemy";
import {IEnemy} from "../enemy.interface";
import {EnemyGuid} from "../enemy-guid.enum";
import {PeasantInfo} from "./peasant-info.enum";
import {EnemiesEnum} from "../enemies.enum";

export class Peasant extends Enemy implements IEnemy {
    /**
     * Sprite prefix for run anim
     * @type {string}
     */
    private readonly runPeasantSpritePrefix = 'runpaysan';
    /**
     * Sprite prefix for fight
     * @type {string}
     */
    private readonly fightPeasantSpritePrefix = 'fightpaysan';
    /**
     * First frame to show
     * @type {string}
     */
    public static firstSpriteSheet = 'runpaysan1.png';

    public GUID: EnemyGuid = EnemyGuid.PEASANT;
    public info = {
        life:  PeasantInfo.LIFE,
        damage:  PeasantInfo.DAMAGE,
    };

    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number) {
        super(world, scene, x, y, EnemiesEnum.SPRITE_SHEET_ID, Peasant.firstSpriteSheet);
        this.initAnims();
    }

    /**
     * Init all anims for peasant interaction
     */
    private initAnims(): void {
        const peasantRunAnims = this.generateFrameNames(this.runPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 10);
        const peasantIdleAnims = this.generateFrameNames(this.fightPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 8);
        this.scene.anims.create({ key: 'peasantRun', frames: peasantRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'peasantIdle', frames: peasantIdleAnims, frameRate: 10, repeat: -1 });
    }
}