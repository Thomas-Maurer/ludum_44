import {
    mapState
} from 'vuex';
export default {
    name: "MainMenu",
    computed: mapState([
        'play',
        'keyboardMode'
    ]),
    methods: {
        setPlay() {
            this.$store.commit("setPlay", true);
        },
        setKeyboardMode(mode) {
            this.$store.commit("setKeyboardMode", mode);
        }
    }
};