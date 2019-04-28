import {
    mapState
} from 'vuex';
export default {
    name: "MainMenu",
    computed: mapState([
        'play',
        'dead'
    ]),
    methods: {
        setPlay() {
            this.$store.commit("setPlay", true);
        },
        initEventsListeners() {

            window.addEventListener('PLAYER_DEAD', (e) => {
                this.$store.commit("setDead", true);
            });
        },
        retry() {
            const event = new Event("restart");
            window.dispatchEvent(event);
            this.$store.commit("setDead", false);
        }
    },
    mounted() {
        if (window.location.href.indexOf("debug") > -1) {
            this.setPlay();
        }
        this.initEventsListeners();
    },
};