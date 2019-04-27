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

    }
};