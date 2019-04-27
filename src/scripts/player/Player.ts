import {PlayerControls} from "./playerControls/playerControls";
import {Enemy} from "../enemy/enemy";

export default class Player extends Phaser.Physics.Matter.Sprite{
    private playerControl: PlayerControls;
    private canJump: boolean;
    private jumpCooldownTimer: Phaser.Time.TimerEvent;
    private inAir: boolean;
    private healthPoint: number;
    private baseDamage: number;
    constructor(world: Phaser.Physics.Matter.World, scene: Phaser.Scene, x: number, y: number, key: string, frame?: string | integer) {
        super(world, x, y, key, frame);
        scene.add.existing(this);
        console.log(x, y, key, frame);
        this.playerControl = new PlayerControls(scene);
        this.scene = scene;
        this.canJump = true;
        this.setFixedRotation();
        this.setFriction(0.2, 0.05,0);
        this.inAir = true;
        this.healthPoint = 100;
        this.baseDamage = 1;
//TODO Better handling of event
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);

        this.on('animationcomplete_playerJump', function () {
            this.anims.play('playerIdle');
        }, this);
    }

    /**
     * TODO export this function
     * Generate FrameNames
     * @param key
     * @param atlasName
     * @param start
     * @param end
     */
    public generateFrameNames (key: string, atlasName: string, start: number, end: number): Phaser.Animations.Types.AnimationFrame[] {
        return this.scene.anims.generateFrameNames(atlasName,{
            start: start, end: end, zeroPad: 1,
            prefix: key, suffix: '.png'
        } )
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
     * Return if the player can jump or not
     */
    public getCanJump(): boolean {
        return this.canJump;
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