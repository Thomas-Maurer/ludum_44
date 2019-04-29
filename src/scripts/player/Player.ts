import { PlayerControls } from "./playerControls/playerControls";
import { Enemy } from "../enemy/enemy";
import MainScene from "../scenes/MainScene";
import EventsUtils from "../utils/events.utils";
import Item from "../items/item";
import { PLAYER_ANIM } from "./animTabs";
import VictoryItem from "../items/victoryItem";
import Vector2 = Phaser.Math.Vector2;
import { PeasantInfo } from "../enemy/peasant/peasant-info.enum";

export default class Player extends Phaser.Physics.Matter.Sprite {
    private playerControl: PlayerControls;
    public scene: MainScene;
    private canJump: boolean;
    public canAttack: boolean;
    private jumpCooldownTimer: Phaser.Time.TimerEvent;
    private attackCooldownTimer: Phaser.Time.TimerEvent;
    private inAir: boolean;
    public isInSun: boolean;
    private willTakeSunDamage: Phaser.Time.TimerEvent;
    private healthPoint: number;
    private baseDamage: number;
    private isAttacking: boolean;
    private doingDamage: boolean;
    public isSucking: boolean;
    private currentEnemyDead: Enemy;
    private isPlayerDead: boolean;
    private canSuck: boolean;
    public doAction: boolean;
    private itemWantToBuy: Item;
    private allowDash: boolean;
    private lookRight: boolean;
    private suckHintText: Phaser.GameObjects.Text;
    private lookLeft: boolean;
    private sensors: any;
    public isTouching: any;
    constructor(world: Phaser.Physics.Matter.World, scene: MainScene, x: number, y: number, key: string, frame?: string | integer, options?: object) {
        super(world, x, y, key, frame, options);
        this.scene = scene;
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 55, 95, { chamfer: { radius: 12 } });

        this.sensors = {
            bottom: matterEngine.Matter.Bodies.rectangle(x, y + 95 * 0.53, 55, this.width * 0.05, { isSensor: true }),
            left: matterEngine.Matter.Bodies.rectangle(x - 55 * 0.53, y, 9, this.height * 0.25, { isSensor: true }),
            right: matterEngine.Matter.Bodies.rectangle(x + 55 * 0.53, y, 9, this.height * 0.25, { isSensor: true })
        };

        const compoundBody = matterEngine.Matter.Body.create({
            parts: [body, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1
        });
        this.setExistingBody(compoundBody);
        scene.add.existing(this);
        this.initDefaultValue();
        this.generateAnim();
        this.generateEventHandler();
        this.handleCollision();
        this.takeDamage(0); //send a hp update to the ui
        // Before matter's update, reset our record of which surfaces the player is touching.
        scene.matter.world.on("beforeupdate", this.resetTouching, this);
    }

    public enablePowerUp(item: Item): void {

        if (item.getNameItem() === 'dashPotion') {
            this.allowDash = true;
        }

    }

    private resetTouching(): void {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }

    /**
     * Init the default value of the player Char
     */
    private initDefaultValue(): void {
        this.playerControl = new PlayerControls(this.scene, this);
        this.canJump = true;
        this.canAttack = true;
        this.setFixedRotation();
        this.inAir = true;
        this.healthPoint = 100;
        this.baseDamage = 1;
        this.isInSun = false;
        this.isPlayerDead = false;
        this.doAction = false;
        this.allowDash = false;
        this.isTouching = { left: false, right: false, ground: false };
    }

    public setLookRight(value: boolean): void {
        this.lookLeft = !value;
        this.lookRight = value;
    }

    public setLookLeft(value: boolean): void {
        this.lookLeft = value;
        this.lookRight = !value;
    }

    private dash(): void {
        if (this.allowDash) {
            if (this.lookRight) {
                let force = new Vector2(0.5, 0)
                this.applyForce(force);

                // this.setPosition(this.x + 100, this.y);
            } else {
                let force = new Vector2(-0.5, 0)
                this.applyForce(force);
                // this.setPosition(this.x - 100, this.y);
            }
        }
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

        this.on('animationcomplete_playerDash', function () {
            this.dash();
            this.anims.play(PLAYER_ANIM.playerIdle);
        }, this);

        this.once('animationcomplete_playerDeath', () => {
            window.dispatchEvent(EventsUtils.PLAYER_DEAD);
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.DEATH);
        }, this);

        this.on('animationcomplete_suck', () => {
            this.gainDamage(this.currentEnemyDead.info.gain / 5);
            this.currentEnemyDead.destroySprite();
            this.anims.play(PLAYER_ANIM.playerIdle);
            this.isSucking = false;
            this.currentEnemyDead = null;
        });

        this.on('animationupdate-suck', () => {
            this.gainDamage(this.currentEnemyDead.info.gain / 5);
        });

        this.on('playerbuyitem', () => {
            this.doAction = false;
            if (this.itemWantToBuy !== null && this.itemWantToBuy !== undefined) {
                this.enablePowerUp(this.itemWantToBuy);
                this.takeDamage(this.itemWantToBuy.getHpCost());
                this.generateHpAnim("-" + this.itemWantToBuy.getHpCost());
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
        const playerSuckAnims = this.generateFrameNames('vampire/vampdrink', 'all_sprites', 1, 5);
        const playerDashAnims = this.generateFrameNames('vampire/dash', 'all_sprites', 1, 4);

        this.scene.anims.create({ key: PLAYER_ANIM.suck, frames: playerSuckAnims, frameRate: 5 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerRun, frames: playerRunAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerIdle, frames: playerIdleAnims, frameRate: 10, repeat: -1 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerJump, frames: playerJumpAnims, frameRate: 9 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerAttack, frames: playerAttackAnims, frameRate: 50 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerDeath, frames: playerDeathAnims, frameRate: 13 });
        this.scene.anims.create({ key: PLAYER_ANIM.playerDash, frames: playerDashAnims, frameRate: 13 });
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
        } else {
            this.handleActions();
            this.handleSun();
            this.handleSuckText();
        }

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
     *  show or not the suck text
     */
    public handleSuckText(): void {
        //display a text if player can suck corps
        if (this.canSuck) {
            if (!this.suckHintText) {
                this.suckHintText = this.scene.add.text(this.x, this.y - 100, '');
                this.suckHintText.setOrigin(0, 0);
            }

            this.suckHintText.setColor("#000000");
            this.suckHintText.setBackgroundColor("#ffffff");
            this.suckHintText.setText("Press [E] to suck his blood");
            this.suckHintText.setPosition(this.x - 50, this.y - 100);


        }
        else {
            if (this.suckHintText) {
                this.suckHintText.setText('');
            }
        }
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

        this.scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        this.scene.matterCollision.addOnCollideEnd({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        //Handle current collision
        this.scene.matterCollision.addOnCollideActive({
            objectA: this.getPlayerSprite(),
            callback: (eventData: any) => {
                if (eventData.bodyA.isSensor) return; // We only care about collisions with physical objects
                this.canSuck = false;
                if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
                    this.setPlayerInAirValue(false);
                } else if (eventData.gameObjectB instanceof Enemy) {
                    if (this.getAttackstate()) {
                        this.emit('playertouchtarget', eventData.gameObjectB);
                    }

                    if (eventData.gameObjectB.isDead) {
                        this.canSuck = true;
                    }

                    if (this.doAction && eventData.gameObjectB.isDead) {
                        this.doAction = false;
                        this.suck(eventData.gameObjectB);
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
                } else {

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

    onSensorCollide(eventdata) {
        if (eventdata.bodyB.isSensor) return; // We only care about collisions with physical objects
        if (eventdata.bodyA === this.sensors.left && eventdata.gameObjectB instanceof Phaser.Tilemaps.Tile && !this.isTouching.left) {
            this.isTouching.left = true;
            if (eventdata.pair.separation > 0.5) this.x += eventdata.pair.separation - 0.5;
        } else if (eventdata.bodyA === this.sensors.right && eventdata.gameObjectB instanceof Phaser.Tilemaps.Tile && !this.isTouching.right) {
            this.isTouching.right = true;
            if (eventdata.pair.separation > 0.5) this.x -= eventdata.pair.separation - 0.5;
        } else if (eventdata.bodyA === this.sensors.bottom && eventdata.gameObjectB instanceof Phaser.Tilemaps.Tile && !this.isTouching.ground) {
            this.isTouching.ground = true;
        }
    }

    public disableSun(): void {
        this.isInSun = false;
        const audioManager = this.scene.audioManager;
        audioManager.playMusic(audioManager.musicsList.SHOP);
    }

    public enableSun(): void {
        this.isInSun = true;
        const audioManager = this.scene.audioManager;
        audioManager.playMusic(audioManager.musicsList.WORLD);
    }

    /**
     * Take damage
     */
    private takeDamage(damage: number) {
        console.log("Player take " + damage + " damages");
        this.healthPoint -= damage;
        const playerHpEvent: CustomEvent = new CustomEvent("PLAYER_HP", {
            detail: this.healthPoint
        });
        window.dispatchEvent(playerHpEvent);

        //play a sound if less than 25 hp
        if (this.healthPoint <= 25) {
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.HEARTH_BEAT);
        }
        if (this.healthPoint <= 0) {
            this.killPlayer();
        }
    }

    /**
     * Gain health point
     * @param gain
     */
    private gainDamage(gain: number): void {
        console.log("Player win " + gain + " damages");
        this.healthPoint += gain;
        if (this.healthPoint > 100) {
            this.healthPoint = 100;
        }
        const playerHpEvent: CustomEvent = new CustomEvent("PLAYER_HP", {
            detail: this.healthPoint
        });
        window.dispatchEvent(playerHpEvent);
    }

    /**
     * Kill the player then restart the scene
     * Show deathScreen
     */
    public killPlayer(): void {
        //stop if already dead
        if (this.isPlayerDead) {
            return;
        }
        this.isPlayerDead = true;
        this.anims.play('playerDeath', true);
        this.scene.audioManager.playSound(this.scene.audioManager.soundsList.PLAYER_DIE)
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

    /**
     * Suck
     */
    public suck(enemyDead: Enemy): void {
        if (this.isSucking) {
            return;
        }
        this.currentEnemyDead = enemyDead;
        this.isSucking = true;
        this.anims.play('suck', true);
        this.scene.audioManager.playSound(this.scene.audioManager.soundsList.SUCK);

        this.generateHpAnim("+" + PeasantInfo.GAIN + "");


    }

    /**
     * Display an animated number informing about live won or loss
     */
    private generateHpAnim(value: string) {
        const duration = 1000;
        const text = this.scene.add.text(this.x, this.y, value, { fontFamily: "Arial", fontSize: 30, color: "#FF0000" });
        this.scene.tweens.add({
            targets: text,
            x: this.scene.cameras.main.scrollX + window.innerWidth,
            y: this.scene.cameras.main.scrollY + 100,
            ease: 'Sine.easeIn',
            duration: duration
        });

        if (value.charAt(0) === "-") {
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.PLAYER_LOOSE_HP)
        } else {
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.PLAYER_GAIN_HP)
        }

        //destroy text after duration
        setTimeout(() => {
            text.destroy();
        }, duration);

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