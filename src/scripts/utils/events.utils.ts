export default class EventsUtils {
    public static PLAYER_JUMP: CustomEvent = new CustomEvent("PLAYER_JUMP");
    public static PLAYER_DEAD: CustomEvent = new CustomEvent("PLAYER_DEAD");
    public static PLAYER_WIN: CustomEvent = new CustomEvent("PLAYER_WIN");
}