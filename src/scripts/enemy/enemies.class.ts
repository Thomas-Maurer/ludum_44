import {Peasant} from "./peasant/peasant.class";
import {Enemy} from "./enemy";
/**
 * Class initializing all enemies sprites
 */
export class Enemies {
    private SPAWN_PEASANT = 'spawn_peasant';

    private SPAWN_PRIEST = 'spawn_priest';

    /**
     * Distance while the enemy will start update in px
     * @type {number}
     */
    private DISTANCE_TO_PLAYER = 3000;

    private mapObject: any;

    /**
     * Contain all enemies object
     * @type {Array}
     */
    private listOfEnemies: Array<Enemy> = [];

    constructor(map: any, world: Phaser.Physics.Matter.World, scene: Phaser.Scene) {
        this.mapObject = map;
        this.initSpawns(world, scene);
    }

    /**
     * Init spawn for all enemies
     * @param world
     * @param scene
     */
    private initSpawns(world: Phaser.Physics.Matter.World, scene: Phaser.Scene) {
        this.iniPeasantSpwans(world, scene);
    }

    /**
     * Init peasant spawn
     * @param world
     * @param scene
     */
    private iniPeasantSpwans(world: Phaser.Physics.Matter.World, scene: Phaser.Scene) {
       this.mapObject.findObject(this.SPAWN_PEASANT, (obj: any) => {
           this.listOfEnemies.push(new Peasant(world, scene, obj.x, obj.y));
        });
    }

    /**
     * Call update on all enemies
     * Check if player is 2000px to the enemy for update
     */
    public updateAllEnemies(playerX: number): void {
        for (let enemy of this.listOfEnemies) {
            if (enemy.x + this.DISTANCE_TO_PLAYER >= playerX && enemy.x - this.DISTANCE_TO_PLAYER <= playerX) {
                enemy.update();

            } else {
                if (enemy.anims.isPlaying) {
                    enemy.stopAllAnims();
                }
            }
        }
    }

}