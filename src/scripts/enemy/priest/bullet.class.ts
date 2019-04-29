import MainScene from "../../scenes/MainScene";
import {EnemiesEnum} from "../enemies.enum";
import {PriestInfo} from "./priest-info.enum";
/**
 * Enemy class
 */
export class Bullet extends Phaser.Physics.Matter.Sprite{
    private GUID = 'bullet';
    public DAMAGE = PriestInfo.DAMAGE;
    public scene: any;
    /**
     *
     * @param world
     * @param scene
     * @param x
     * @param y
     * @param key
     * @param frame
     */
    constructor(world:Phaser.Physics.Matter.World, scene:MainScene, x:number, y:number, key:string, frame?:string | integer, direction?) {
        super(world, x, y, key, frame);

        this.scene = scene;
        scene.add.existing(this);
        // change collision rect
        this.setPhysics(x + 20, y  + 20);
        this.initAnim();
        this.setVelocityX(5 * direction);
    }

    public generateFrameNames(key: string, atlasName: string, start: number, end: number): Phaser.Animations.Types.AnimationFrame[] {
        return this.scene.anims.generateFrameNames(atlasName, {
            start: start, end: end, zeroPad: 1,
            prefix: key, suffix: '.png'
        })
    }

    private initAnim() {
        const bulletAttack = this.generateFrameNames('fireball', EnemiesEnum.SPRITE_SHEET_ID, 1, 4);
        this.scene.anims.create({ key: this.GUID + 'Attack', frames: bulletAttack, frameRate: 20, repeat: -1 });
        this.anims.play(this.GUID + 'Attack', true);

        this.scene.matterCollision.addOnCollideActive({
            objectA: this,
            callback: this.onSensorCollide,
            context: this
        });
    }

    private onSensorCollide(eventData) {
        if (eventData.gameObjectB !== undefined && eventData.gameObjectB instanceof Phaser.Tilemaps.Tile) {
            this.destroy();
        }
    }

    private setPhysics(x, y) {
        const matterEngine: any = Phaser.Physics.Matter;
        const body = matterEngine.Matter.Bodies.rectangle(x, y, 50, 50, {
            chamfer: { radius: 25 },
        });

        this.setExistingBody(body);
        this.setFixedRotation();
        this.setCollidesWith([1,  MainScene.PLAYER_CAT]);
        this.setFriction(0);
        this.setIgnoreGravity(true);
        this.setScale(0.5, 0.5);
    }
}