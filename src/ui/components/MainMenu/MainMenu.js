import {
    mapState
} from 'vuex';
export default {
    name: "MainMenu",
    computed: mapState([
        'play',
        'dead',
        'win'
    ]),
    methods: {
        setPlay() {
            this.$store.commit("setPlay", true);
        },
        initEventsListeners() {

            window.addEventListener('PLAYER_DEAD', (e) => {
                this.$store.commit("setDead", true);
            });

            window.addEventListener('PLAYER_WIN', (e) => {
                this.$store.commit("setWin", true);
            });
        },
        retry() {
            const event = new Event("restart");
            window.dispatchEvent(event);
            this.$store.commit("setDead", false);
            this.$store.commit("setWin", false);
        }
    },
    mounted() {
        if (window.location.href.indexOf("debug") > -1) {
            this.setPlay();
        }
        this.initEventsListeners();
    },
};