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
     * Sprite prefix for dead anim
     * @type {string}
     */
    private readonly deadPeasantSpritePrefix = 'deathpaysan';
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
        this.world = world;
        this.initAnims();
    }

    /**
     * Init all anims for peasant interaction
     */
    private initAnims(): void {
        const peasantRunAnims = this.generateFrameNames(this.runPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 10);
        const peasantFightAnims = this.generateFrameNames(this.fightPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 1, 8);
        const peasantDeadAnims = this.generateFrameNames(this.deadPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 2, 9);
        const peasantHitAnims = this.generateFrameNames(this.deadPeasantSpritePrefix, EnemiesEnum.SPRITE_SHEET_ID, 2, 2);

        this.scene.anims.create({ key: 'peasantRun', frames: peasantRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'peasantFight', frames: peasantFightAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: 'peasantDead', frames: peasantDeadAnims, frameRate: 5, repeat: 0 });
        this.scene.anims.create({ key: 'peasantHit', frames: peasantHitAnims, frameRate: 10, repeat: 0 });
    }

    /**
     * Player get damage
     * @param damage
     */
    public takeDamage(damage: number): void {
        if (this.isHit || this.isDead) {
            return;
        }
        this.info.life = this.info.life - damage;

        if (this.info.life <= 0) {
            this.isDead = true;
            this.stopAllAnims();
            this.anims.play('peasantDead',true);
        } else {
            this.isHit = true;
            this.isRunning = false;
            this.anims.play('peasantHit',true);
            setTimeout(() => this.isHit = false, 500);
        }
    }
}