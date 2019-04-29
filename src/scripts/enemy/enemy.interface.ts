import {EnemyGuid} from "./enemy-guid.enum";
export interface IEnemy {
    /**
     * Unique guid for recognize type of enemy
     * @type {EnemyGuid}
     */
    GUID: EnemyGuid,
    /**
     * Info about the char
     */
    info: {
        life: number; // life of the enemy
        damage: number; // dammage deal by the enemy
        gain: number;
    }
}