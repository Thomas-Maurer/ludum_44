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
        'umbrella',
        'dead',
        'win',
        'bossHp',
        'bossHpPercent',
        'bossBarEnabled',
        'isInSun'
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
            window.addEventListener('BOSS_HP', (e) => {
                this.$store.commit("setBossHp", e.detail);
            });
            window.addEventListener('PLAYER_GLASS', (e) => {
                this.$store.commit("setGlass", true);
            });
            window.addEventListener('PLAYER_POTION', (e) => {
                this.$store.commit("setPotion", true);
            });
            window.addEventListener('PLAYER_SUN_STATE', (e) => {
                this.$store.commit("setSun", e.detail);
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