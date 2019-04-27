import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        // config: defaultConfig,
        play: false
    },
    mutations: {
        setPlay(state, value) {
            state.play = value;
        }
    },
    actions: {
        setPlay(context, value) {
            context.commit('setPlay', value);
        }
    }
});