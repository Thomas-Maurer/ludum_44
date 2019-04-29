import Player from "../Player";
import EventUtils from "../../utils/events.utils";
import Vector2 = Phaser.Math.Vector2;
import KeyCodes = Phaser.Input.Keyboard.KeyCodes;
import MainScene from "../../scenes/MainScene";
import AudioManager from "../../AudioManager";
import { PLAYER_ANIM, PLAYER_ANIM_ACTION, PLAYER_ANIM_DONT_CANCEL } from "../animTabs";

export class PlayerControls {
    private cursors: any;
    private leftInput: string;
    private rightInput: string;
    private jumpInput: string;
    private attackInput: KeyCodes;
    private actionInput: KeyCodes;
    private scene: MainScene;
    private audioManager: AudioManager;
    private negativeforceVector: Vector2;
    private forceVector: Vector2;
    constructor(scene: MainScene, player: Player) {
        this.initDefaultKeys();
        this.mappingKeys(scene);
        this.scene = scene;
        this.audioManager = this.scene.audioManager;
        this.generateComboKeys(player);
    }

    /**
     * Init the default control keys
     */
    private initDefaultKeys(): void {
        this.leftInput = 'left';
        this.rightInput = 'right';
        this.jumpInput = 'up';
        this.attackInput = KeyCodes.SPACE;
        this.actionInput = KeyCodes.E
    }

    /**
     * CHange the jump control key
     * @param value
     */
    public changeJumpKey(value: string): void {
        this.jumpInput = value;
    }

    /**
     * CHange the right control key
     * @param value
     */
    public changeRightKey(value: string): void {
        this.rightInput = value;
    }

    /**
     * CHange the left control key
     * @param value
     */
    public changeLeftKey(value: string): void {
        this.leftInput = value;
    }

    /**
     * CHange the attack control key
     * @param value
     */
    public changeAttackKey(value: KeyCodes): void {
        this.attackInput = value;
    }

    /**
     * CHange the action control key
     * @param value
     */
    public changeActionKey(value: KeyCodes): void {
        this.actionInput = value;
    }

    /**
     * Map the Keys to the events
     * @param scene
     */
    private mappingKeys(scene: Phaser.Scene): void {
        // Handle Keyboard Event
        this.cursors = scene.input.keyboard.addKeys(
            {
                escape: Phaser.Input.Keyboard.KeyCodes.ESC,
                up: this.jumpInput,
                down: "down",
                left: this.leftInput,
                right: this.rightInput,
                attack: this.attackInput,
                action: this.actionInput
            });
    }

    public getControls(): any {
        return this.cursors;
    }

    /**
     * Handle vector for force application
     * @param player
     * @param body
     */

    private handlePlayerControlInAir(player: Player, body: any): void {
        if (!player.isPlayerInTheAir()) {
            // Player is in the Air
            this.forceVector = new Vector2(0.1, 0);
            this.negativeforceVector = new Vector2(-0.1, 0);
            if (body.velocity.x >= 0.3) {
                player.getPlayerSprite().setVelocity(0.3);
            } else if (body.velocity.x <= -0.3) {
                player.getPlayerSprite().setVelocity(-0.3);
            }
        } else {
            //Player touch the ground
            this.negativeforceVector = new Vector2(-0.1, 0);
            this.forceVector = new Vector2(0.1, 0);
            if (body.velocity.x >= 0.1) {
                player.getPlayerSprite().setVelocityX(0.1);
            } else if (body.velocity.x <= -0.15) {
                player.getPlayerSprite().setVelocityX(-0.15);
            }
        }
    }

    public handlePlayerControls(player: Player): void {
        let body: any = player.getPlayerSprite().body;

        this.handlePlayerControlInAir(player, body);


        if (this.cursors.attack.isDown && player.canAttack) {
            player.anims.play(PLAYER_ANIM.playerAttack, true);
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.HIT);
            player.enableAttackState();
        }
console.log(player.isTouching)
        if (this.cursors.right.isDown && !player.isTouching.right) {
            player.setLookRight(true);
            if (player.anims.currentAnim !== null && PLAYER_ANIM_ACTION.hasOwnProperty(player.anims.currentAnim.key)) {
            } else {
                player.anims.play(PLAYER_ANIM.playerRun, true);
            }

            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(this.forceVector);
        } else if (this.cursors.left.isDown && !player.isTouching.left) {
            player.setLookLeft(true);
            if (player.anims.currentAnim !== null && PLAYER_ANIM_ACTION.hasOwnProperty(player.anims.currentAnim.key)) {
            } else {
                player.anims.play(PLAYER_ANIM.playerRun, true);
                //this.audioManager.playSound(this.audioManager.soundsList.PLAYER_FOOTSTEP);
            }
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(this.negativeforceVector);
        } else {
            if (player.anims.currentAnim !== null && PLAYER_ANIM_DONT_CANCEL.hasOwnProperty(player.anims.currentAnim.key)) {
                console.log(player.anims.currentAnim.key)
            } else {
                player.doAction = false;
                player.anims.play(PLAYER_ANIM.playerIdle, true);
            }
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.action.isDown) {
            player.doAction = true;
        }
        if (this.cursors.up.isDown && player.getCanJump() && !player.isPlayerInTheAir() && player.isTouching.ground) {
            player.anims.play(PLAYER_ANIM.playerJump, true);
            this.audioManager.playSound(this.audioManager.soundsList.PLAYER_JUMP);
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-18);
        }
    }

    private generateComboKeys(player: Player): void {
        this.scene.input.keyboard.createCombo([ this.getControls().right, this.getControls().right ], { resetOnMatch: true });
        this.scene.input.keyboard.createCombo([ this.getControls().left, this.getControls().left ], { resetOnMatch: true });
        this.scene.input.keyboard.on('keycombomatch', function () {
            if (this.allowDash) {
                this.anims.play(PLAYER_ANIM.playerDash);
            }
        }, player);
    }

}