import Player from "../Player";

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
        if(this.cursors.right.isDown){
            player.getPlayerSprite().setVelocityX(3);
        } else if(this.cursors.left.isDown){
            player.getPlayerSprite().setVelocityX(-3);
        } else {
            player.getPlayerSprite().setVelocityX(0);
        }
    }
}