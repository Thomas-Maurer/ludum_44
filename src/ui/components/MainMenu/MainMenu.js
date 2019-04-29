import {
    mapState
} from 'vuex';
export default {
    name: "MainMenu",
    data() {
        return {
            loading: true,
            tutorial: false
        }
    },
    computed: mapState([
        'play',
        'dead',
        'win'
    ]),
    methods: {
        setPlay() {
            this.$store.commit("setPlay", true);
            const event = new Event("play");
            window.dispatchEvent(event);
        },
        initEventsListeners() {
            window.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    this.handleEnterKey();
                }
            });
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
        },
        handleEnterKey() {
            // Retry if player dead or won
            if (this.dead || this.win) {
                this.retry();
                return;
            }

            //set play if not already playing


            if (!this.play) {
                if (!this.tutorial) {
                    this.tutorial = true;
                    return;
                }
                this.setPlay();
                return;
            }

        }
    },
    mounted() {
        if (window.location.href.indexOf("debug") > -1) {
            this.setPlay();
        }
        this.initEventsListeners();
        setTimeout(() => {
            this.loading = false;
        }, 7000);
    },
};