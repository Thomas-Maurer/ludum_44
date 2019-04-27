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
        const forceVector = new Vector2(-0.1,0);
        const negativeforceVector = new Vector2(0.1,0);
        let body: any = player.getPlayerSprite().body;
        if (body.velocity.x > 0.2) {
            player.getPlayerSprite().setVelocity(0.2);
        } else if (body.velocity.x < -0.3) {
            player.getPlayerSprite().setVelocity(-0.3);
        }
        if(this.cursors.left.isDown){
            player.getPlayerSprite().setFlipX(true);
            player.getPlayerSprite().applyForce(forceVector);
        } else if(this.cursors.right.isDown){
            player.getPlayerSprite().setFlipX(false);
            player.getPlayerSprite().applyForce(negativeforceVector);
        } else {
            player.getPlayerSprite().setVelocityX(0);
        }
        if (this.cursors.up.isDown && player.getCanJump()) {
            player.desactivateJump();
            player.getPlayerSprite().setVelocityY(-11);
        }
    }
}