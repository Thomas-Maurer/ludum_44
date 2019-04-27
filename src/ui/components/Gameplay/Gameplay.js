import {
    mapState
} from 'vuex';

export default {
    name: "Gameplay",
    computed: mapState([
        'play'
    ]),
    data() {
        return {
            lorem: false
        }
    },
    methods: {
        initEventsListeners() {
            console.log("listening")
            window.addEventListener('PLAYER_JUMP', (e) => {
                console.log("Player jump")
            });
        }
    },

    created() {
        this.initEventsListeners();
    },
};