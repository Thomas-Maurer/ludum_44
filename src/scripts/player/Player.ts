import { PlayerControls } from "./playerControls/playerControls";
import { Enemy } from "../enemy/enemy";
import MainScene from "../scenes/MainScene";
import EventsUtils from "../utils/events.utils";
import Item from "../items/item";
import {PLAYER_ANIM} from "./animTabs";
import VictoryItem from "../items/victoryItem";

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
    private doingDamage: boolean;
    public isSucking: boolean;
    private isPlayerDead: boolean;
    public doAction: boolean;
    private itemWantToBuy: Item;
    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number, key: string, frame?: string | integer, options?: object) {
        super(world, x, y, key, frame, options);
        this.scene = scene;
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 55, 100, { chamfer: { radius: 10 } });
        this.setExistingBody(body);
        scene.add.existing(this);

        this.initDefaultValue();
        this.generateAnim();
        this.generateEventHandler();

    }

    /**
     * Init the default value of the player Char
     */
    private initDefaultValue(): void {
        this.playerControl = new PlayerControls(this.scene);
        this.canJump = true;
        this.canAttack = true;
        this.setFixedRotation();
        this.setFriction(0.2, 0.05, 0);
        this.inAir = true;
        this.healthPoint = 100;
        this.baseDamage = 1;
        this.isInSun = true;
        this.isPlayerDead = false;
        this.doAction = false;
    }

    /**
     * Generate Function event handler
     */
    private generateEventHandler(): void {
        this.on('animationcomplete', function (anim, frame) {
            this.emit('animationcomplete_' + anim.key, anim, frame);
        }, this);

        this.on('animationcomplete_playerJump', function () {
            this.anims.play(PLAYER_ANIM.playerIdle);
        }, this);

        this.once('animationcomplete_playerDeath', () => {
            window.dispatchEvent(EventsUtils.PLAYER_DEAD);
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.DEATH);
        }, this);

        this.on('animationcomplete_suck', () => {
            this.isSucking = false;
        });

        this.on('playerbuyitem', () => {
            console.log(this.itemWantToBuy);
            this.doAction = false;
            if (this.itemWantToBuy !== null && this.itemWantToBuy !== undefined) {
                this.takeDamage(this.itemWantToBuy.getHpCost());
                this.itemWantToBuy.destroy();
                this.itemWantToBuy = null;
            }
        });

        this.on('animationcomplete_playerAttack', function () {
            this.anims.play(PLAYER_ANIM.playerIdle);
            //TODO Player attack system
            this.disableAttackState();
        }, this);
    }

    /**
     * Create all the anim the player has
     */
    private generateAnim(): void {
        const playerRunAnims = this.generateFrameNames('vampire/runvampright', 'all_sprites', 1, 10);
        const playerIdleAnims = this.generateFrameNames('vampire/fightvamp', 'all_sprites', 1, 10);
        const playerJumpAnims = this.generateFrameNames('vampire/jumpvamp', 'all_sprites', 1, 7);
        const playerAttackAnims = this.generateFrameNames('vampire/fightvamp', 'all_sprites', 9, 19);
        const playerDeathAnims = this.generateFrameNames('vampire/deathvamp', 'all_sprites', 1, 7);
        const playerSuck = this.generateFrameNames('vampire/vampdrink', 'all_sprites', 1, 5);

        this.scene.anims.create({ key: PLAYER_ANIM.suck, frames: playerSuck, frameRate: 10, repeat: 0 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerRun, frames: playerRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerIdle, frames: playerIdleAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerJump, frames: playerJumpAnims, frameRate: 9 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerAttack, frames: playerAttackAnims, frameRate: 50 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerDeath, frames: playerDeathAnims, frameRate: 13 });
    }

    public getPlayerControl(): PlayerControls {
        return this.playerControl;
    }

    private addPlayerTouchTargetEvent(): void {
        this.once('playertouchtarget', function (enemy: Enemy) {
            this.doDamageTo(enemy);
        }, this);
    }

    public addItemPlayerWantToBuy(item: Item): void {
        this.itemWantToBuy = item;
    }

    /**
     * called each frame
     */
    update() {
        if (this.isPlayerDead) {
            this.killPlayer();
        }
        this.handleCollision();
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
     * Handle Player collision
     */
    handleCollision(): void {
        //Handle current collision
        this.scene.matterCollision.addOnCollideActive({
            objectA: this.getPlayerSprite(),
            callback: (eventData: any) => {
                if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
                    this.setPlayerInAirValue(false);
                } else if (eventData.gameObjectB instanceof Enemy) {
                    if (this.getAttackstate()) {
                        this.emit('playertouchtarget', eventData.gameObjectB);
                    }

                    if (this.doAction && eventData.gameObjectB.isDead) {
                        console.log('suck');
                        this.doAction = false;
                        this.suck();
                    }

                } else if (eventData.gameObjectB instanceof VictoryItem) {
                    //TriggerVictory
                    eventData.gameObjectB.destroy();
                    this.scene.triggerVictory();
                } else if (eventData.gameObjectB instanceof Item) {
                    if (this.doAction) {
                        this.doAction = false;
                        this.addItemPlayerWantToBuy(eventData.gameObjectB);
                        this.emit('playerbuyitem');
                    }
                }else {
                    if (eventData.bodyB.isSensor === false) {
                        this.killPlayer();
                    }
                }
            },
            context: this
        });
        // Handle end of collision
        this.scene.matterCollision.addOnCollideEnd({
            objectA: this.getPlayerSprite(),
            callback: (eventData: any) => {
                if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
                    this.setPlayerInAirValue(true);
                }
            },
            context: this
        });
    }

    public disableSun(): void {
        this.isInSun = !this.isInSun;
    }

    /**
     * Take damage
     */
    private takeDamage(damage: number) {
        console.log("Player take " + damage + " damages")
        this.healthPoint -= damage;
        const playerHpEvent: CustomEvent = new CustomEvent("PLAYER_HP", {
            detail: this.healthPoint
        });
        window.dispatchEvent(playerHpEvent);
        if (this.healthPoint <= 0) {
            this.killPlayer();
        }
    }

    /**
     * Kill the player then restart the scene
     * Show deathScreen
     */
    public killPlayer(): void {
        this.anims.play('playerDeath', true);
    }

    /**
     * return if the player is dead
     */
    public getisPlayerDead(): boolean {
        return this.isPlayerDead;
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
        this.doingDamage = true;
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
        this.addPlayerTouchTargetEvent();
    }

    public suck() {
        this.isSucking = true;
        this.anims.play('suck',true);
    }


    /**
     * return if the player is attacking or not
     */
    public getAttackstate(): boolean {
        return this.isAttacking;
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
        enemy.takeDamage(this.baseDamage);
    }
}