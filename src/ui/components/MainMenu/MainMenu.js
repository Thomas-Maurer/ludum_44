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
    },
    mounted() {
        if (window.location.href.indexOf("debug") > -1) {
            this.setPlay();
        }
    },
};