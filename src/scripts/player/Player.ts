import { PlayerControls } from "./playerControls/playerControls";
import { Enemy } from "../enemy/enemy";
import MainScene from "../scenes/MainScene";

export default class Player extends Phaser.Physics.Matter.Sprite {
    private playerControl: PlayerControls;
    public scene: MainScene;
    private canJump: boolean;
    private canAttack: boolean;
    private jumpCooldownTimer: Phaser.Time.TimerEvent;
    private attackCooldownTimer: Phaser.Time.TimerEvent;
    private inAir: boolean;
    private isInSun: boolean;
    private willTakeSunDamage: Phaser.Time.TimerEvent;
    private healthPoint: number;
    private baseDamage: number;
    private isAttacking: boolean;
    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number, key: string, frame?: string | integer, options?: object) {
        super(world, x, y, key, frame, options);
        const matterEngine: any = Phaser.Physics.Matter;
        this.scene = scene;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 55, 100, { chamfer: { radius: 10 } });
        this.setExistingBody(body);
        scene.add.existing(this);
        this.playerControl = new PlayerControls(scene);
        this.scene = scene;
        this.canJump = true;
        this.canAttack = true;
        this.setFixedRotation();
        this.setFriction(0.2, 0.05, 0);
        this.inAir = true;
        this.healthPoint = 100;
        this.baseDamage = 1;
        this.isInSun = true;

        //TODO Better handling of event
        this.on('animationupdate', function (anim, frame) {
            //console.log(this.scene.shapes[anim.key.toLowerCase() + frame.index]);
            //this.setBody(this.scene.shapes[anim.key.toLowerCase() + frame.index])
        }, this);

        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);

        this.on('animationcomplete_playerJump', function () {
            this.anims.play('playerIdle');
        }, this);

        this.on('animationcomplete_playerAttack', function () {
            this.anims.play('playerIdle');
            this.alterHitbox();
            //TODO Player attack system
            this.disableAttackState();
        }, this);
    }

    /**
     * called each frame
     */
    update() {
        this.handleActions();
        this.handleSun();
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

    private alterHitbox() {
        this.setSize(20, 20);
    }

    /**
     * Return the PlayerSprite
     */
    public getPlayerSprite(): Phaser.Physics.Matter.Sprite {
        return this;
    }

    /**
     * Handle all the Action the player can do with the controls
     */
    public handleActions(): void {
        // If the player is in the Air he can't do shit
        this.playerControl.handlePlayerControls(this);
    }

    /**
     * Handle sun damage
     */
    private handleSun() {
        //ignore if not in sun
        if (!this.isInSun) {

            //remove the event if we got out the sun before taking the damage
            if (this.willTakeSunDamage) {
                this.willTakeSunDamage.remove();
                this.willTakeSunDamage = null;
            }
        }

        if (this.isInSun && !this.willTakeSunDamage) {
            //  The same as above, but uses a method signature to declare it (shorter, and compatible with GSAP syntax)
            this.willTakeSunDamage = this.scene.time.delayedCall(1000, () => {
                this.takeDamage(1);
                this.willTakeSunDamage.remove();
                this.willTakeSunDamage = null;

            }, [], this);
        }

    }

    /**
     * Take damage
     */
    private takeDamage(damage: number) {
        console.log("Player take " + damage + " damages")
        this.healthPoint -= damage;
    }

    /**
     * Return if the player can jump or not
     */
    public getCanJump(): boolean {
        return this.canJump;
    }

    /**
     * Enable attack state
     */
    public enableAttackState(): void {
        this.isAttacking = true;
        // Add a slight delay between attack
        this.attackCooldownTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => (this.canAttack = true)
        });
        this.canAttack = false;
    }

    /**
     * disable attack state
     */
    public disableAttackState(): void {
        this.isAttacking = false;
    }

    /**
     * Deactivate Jump and add a cd to avoid superman effect
     */
    public desactivateJump(): void {
        // Add a slight delay between jumps since the bottom sensor will still collide for a few
        // frames after a jump is initiated
        this.jumpCooldownTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => (this.canJump = true)
        });
        this.setPlayerInAirValue(true);
        this.canJump = false;
    }

    /**
     * activate player in Air
     */
    public setPlayerInAirValue(value: boolean): void {
        this.inAir = value;
    }

    /**
     * return if the player is in the air or not
     */
    public isPlayerInTheAir(): boolean {
        return this.inAir;
    }

    /**
     * this do damage to an enemy
     * @param enemy
     */
    public doDamageTo(enemy: Enemy): void {

    }
}