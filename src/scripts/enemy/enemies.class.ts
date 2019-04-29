import { Peasant } from "./peasant/peasant.class";
import { Enemy } from "./enemy";
import MainScene from "../scenes/MainScene";
import {Priest} from "./priest/priest.class";
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
    private DISTANCE_TO_PLAYER = 1500;

    private mapObject: any;
    private scene: any;

    private _collisionCat: any;
    public get collisionCat() {
        return this._collisionCat;
    }

    /**
     * Contain all enemies object
     * @type {Array}
     */
    public listOfEnemies: Array<Enemy> = [];

    constructor(map: any, world: Phaser.Physics.Matter.World, scene: MainScene) {
        this.scene = scene;
        this._collisionCat = world.nextCategory();
        this.mapObject = map;
        this.initSpawns(world, scene);
    }

    /**
     * Init spawn for all enemies
     * @param world
     * @param scene
     */
    private initSpawns(world: Phaser.Physics.Matter.World, scene: MainScene) {
        this.initPeasantSpawn(world, scene);
        this.initPriestSpawn(world, scene);
    }

    /**
     * Init peasant spawn
     * @param world
     * @param scene
     */
    private initPriestSpawn(world: Phaser.Physics.Matter.World, scene: MainScene) {
        this.mapObject.findObject(this.SPAWN_PRIEST, (obj: any) => {
            let priest = new Priest(world, scene, obj.x, obj.y);
            priest.setCollisionCategory(this.collisionCat);
            priest.setCollidesWith([1, this.scene.playerCatCollision]);
            this.listOfEnemies.push(priest);
        });
    }

    /**
     * Init peasant spawn
     * @param world
     * @param scene
     */
    private initPeasantSpawn(world: Phaser.Physics.Matter.World, scene: MainScene) {
        this.mapObject.findObject(this.SPAWN_PEASANT, (obj: any) => {
            let peasant = new Peasant(world, scene, obj.x, obj.y);
            peasant.setCollisionCategory(this.collisionCat);
            peasant.setCollidesWith([1, this.scene.playerCatCollision]);
            this.listOfEnemies.push(peasant);
        });
    }

    /**
     * Call update on all enemies
     * Check if player is 2000px to the enemy for update
     */
    public updateAllEnemies(playerX: number): void {
        for (let index = 0; index < this.listOfEnemies.length; index++) {
            try {
                let enemy = this.listOfEnemies[index];
                if (enemy.isDead) {
                    this.listOfEnemies.splice(index, 1);
                    continue;
                }
                if (enemy.x + this.DISTANCE_TO_PLAYER >= playerX && enemy.x - this.DISTANCE_TO_PLAYER <= playerX) {
                    enemy.update();
                } else {
                    if (enemy.anims.isPlaying) {
                        enemy.stopAllAnims();
                    }
                }
            } catch (e) {
                this.listOfEnemies.splice(index, 1);
                continue;
            }

        }
    }

}