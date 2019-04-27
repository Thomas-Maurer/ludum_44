export class Map{
    /**
     * Tiles size X
     * @type {number}
     */
    public static TILES_SIZE_X: number = 64;
    /**
     * Tiles size Y
     * @type {number}
     */
    public static TILES_SIZE_Y: number = 64;
    /**
     * Singleton instance
     */
    private static _instance;
    /**
     * Singleton map for keep map data between each class
     * Only pas mapObject on init this class
     * @returns {any}
     * @constructor
     */
    public static getInstance(mapObject?: any): Map {
        if (this._instance === undefined) {
            this._instance = new Map(mapObject);
        }
        return this._instance;
    }

    /**
     * Contain phaser map object
     */
    private map: Phaser.Tilemaps.Tilemap;
    public get tileMap(): Phaser.Tilemaps.Tilemap {
        return this.map;
    }

    private constructor(mapObject: any) {
        this.map = mapObject;
    }

    /**
     * Check if the current tile exist
     * @param x
     * @param y
     * @returns {boolean}
     */
    public isExistTile(x: number, y: number): boolean {
        if (this.map.getTileAt(Math.round(x), Math.round(y)) === null) {
            return false;
        }
        return true;
    }
}