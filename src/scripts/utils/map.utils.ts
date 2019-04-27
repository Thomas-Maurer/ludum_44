export class MapUtils {
    /**
     * Tile main size
     * @type {number}
     */
    private static TILE_SIZE: number = 64;

    /**
     * Return the tile coord corresponding to the tile index
     */
    public static getMapPixelCoord(tileGridIndex: number): number {
        return tileGridIndex * this.TILE_SIZE;
    }
}