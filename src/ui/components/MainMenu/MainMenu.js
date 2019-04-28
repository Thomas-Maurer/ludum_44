import {
    mapState
} from 'vuex';
export default {
    name: "MainMenu",
    computed: mapState([
        'play'
    ]),
    methods: {
        setPlay() {
            this.$store.commit("setPlay", true);
        }
    }
};