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
    private speed: number;
    constructor(scene: MainScene, player: Player) {
        this.initDefaultKeys();
        this.mappingKeys(scene);
        this.scene = scene;
        this.audioManager = this.scene.audioManager;
        this.generateComboKeys(player);
        this.speed = 0.2;
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
            if (body.velocity.x >= this.speed) {
                player.getPlayerSprite().setVelocity(this.speed);
            } else if (body.velocity.x <= -this.speed) {
                player.getPlayerSprite().setVelocity(-this.speed);
            }
        } else {
            if (body.velocity.y <= -11) {
                player.getPlayerSprite().setVelocity(-11);
            }
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
            if (player.glasses) {
                player.anims.play(PLAYER_ANIM.playerAttackGlasses, true);
            } else {
                player.anims.play(PLAYER_ANIM.playerAttack, true);
            }
            this.scene.audioManager.playSound(this.scene.audioManager.soundsList.HIT);
            player.enableAttackState();
        }
        if (this.cursors.right.isDown && !player.isTouching.right && !player.isSucking) {
            player.setLookRight(true);
            if (player.anims.currentAnim !== null && PLAYER_ANIM_ACTION.hasOwnProperty(player.anims.currentAnim.key)) {
            } else {
                if (player.glasses) {
                    player.anims.play(PLAYER_ANIM.playerRunGlasses, true);
                } else {
                    player.anims.play(PLAYER_ANIM.playerRun, true);
                }
            }

            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(this.forceVector);
        } else if (this.cursors.left.isDown && !player.isTouching.left && !player.isSucking) {
            player.setLookLeft(true);
            if (player.anims.currentAnim !== null && PLAYER_ANIM_ACTION.hasOwnProperty(player.anims.currentAnim.key)) {
            } else {
                if (player.glasses) {
                    player.anims.play(PLAYER_ANIM.playerRunGlasses, true);
                } else {
                    player.anims.play(PLAYER_ANIM.playerRun, true);
                }
                //this.audioManager.playSound(this.audioManager.soundsList.PLAYER_FOOTSTEP);
            }
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(this.negativeforceVector);
        } else {
            if (player.anims.currentAnim !== null && PLAYER_ANIM_DONT_CANCEL.hasOwnProperty(player.anims.currentAnim.key)) {
            } else {
                player.doAction = false;
                if (player.glasses) {
                    player.anims.play(PLAYER_ANIM.playerIdleGlasses, true);
                } else {
                    player.anims.play(PLAYER_ANIM.playerIdle, true);
                }
            }
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.action.isDown) {
            player.doAction = true;
        }
        if (this.cursors.up.isDown && player.getCanJump() && !player.isPlayerInTheAir() && player.isTouching.ground) {
            if (player.glasses) {
                player.anims.play(PLAYER_ANIM.playerJumpGlasses, true);
            } else {
                player.anims.play(PLAYER_ANIM.playerJump, true);
            }
            this.audioManager.playSound(this.audioManager.soundsList.PLAYER_JUMP);
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-13);
        }
    }

    private generateComboKeys(player: Player): void {
        this.scene.input.keyboard.createCombo([ this.getControls().right, this.getControls().right ], { resetOnMatch: true, maxKeyDelay: 500 });
        this.scene.input.keyboard.createCombo([ this.getControls().left, this.getControls().left ], { resetOnMatch: true, maxKeyDelay: 500 });
        this.scene.input.keyboard.on('keycombomatch', function () {
            if (this.allowDash) {
                this.anims.play(PLAYER_ANIM.playerDash);
            }
        }, player);
    }

}