import {
    mapState
} from 'vuex';

export default {
    name: "Gameplay",
    computed: mapState([
        'play',
        'playerHP'
    ]),
    data() {
        return {
            listen: false
        }
    },
    methods: {
        initEventsListeners() {

            window.addEventListener('PLAYER_HP', (e) => {
                this.$store.commit("setPlayerHP", e.detail);
            });
        }
    },

    created() {
        this.initEventsListeners();
    },
};