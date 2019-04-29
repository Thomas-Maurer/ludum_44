import {
    mapState
} from 'vuex';

export default {
    name: "Gameplay",
    computed: mapState([
        'play',
        'playerHP',
        'potion',
        'glass',
        'umbrella'
    ]),
    data() {
        return {
            listen: false,

        }
    },
    methods: {
        initEventsListeners() {

            window.addEventListener('PLAYER_HP', (e) => {
                this.$store.commit("setPlayerHP", e.detail);
            });
            window.addEventListener('PLAYER_GLASS', (e) => {
                this.$store.commit("setGlass", true);
            });
            window.addEventListener('PLAYER_POTION', (e) => {
                this.$store.commit("setPotion", true);
            });
            window.addEventListener('PLAYER_UMBRELLA', (e) => {
                this.$store.commit("setUmbrella", true);
            });
        }
    },

    created() {
        this.initEventsListeners();
    },
};