import Player from "../Player";
import Vector2 = Phaser.Math.Vector2;

export class PlayerControls {
    private cursors: any;
    constructor(scene: Phaser.Scene){
        this.mappingKeys(scene);
    }

    private mappingKeys(scene: Phaser.Scene) {
        // Handle Keyboard Event
        this.cursors = scene.input.keyboard.addKeys(
            {
                escape: Phaser.Input.Keyboard.KeyCodes.ESC,
                up: "up",
                down: "down",
                left: "left",
                right: "right",
            });
    }

    public handlePlayerControls(player: Player): void {
        let negativeforceVector: Vector2;
        let forceVector: Vector2;
        let body: any = player.getPlayerSprite().body;
        if (!player.canPlayerAct()) {
            // Player is in the Air
            forceVector = new Vector2(0.1);
            negativeforceVector = new Vector2(-0.1);
            if (body.velocity.x >= 0.3) {
                player.getPlayerSprite().setVelocity(0.3);
            } else if (body.velocity.x <= -0.3) {
                player.getPlayerSprite().setVelocity(-0.3);
            }
        } else {
            //Player touch the ground
            negativeforceVector = new Vector2(-0.1);
            forceVector = new Vector2(0.5);
            if (body.velocity.x >= 0.1) {
                player.getPlayerSprite().setVelocity(0.1);
            } else if (body.velocity.x <= -0.15) {
                player.getPlayerSprite().setVelocity(-0.15);
            }
        }
        if(this.cursors.right.isDown){
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(forceVector);
        } else if(this.cursors.left.isDown){
            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(negativeforceVector);
        } else {
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.up.isDown && player.getCanJump() && !player.canPlayerAct()) {
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-11);
        }
    }
}