import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        // config: defaultConfig,
        play: false,
        keyboardMode: 'wasd'
    },
    mutations: {
        setPlay(state, value) {
            state.play = value;
        },
        setKeyboardMode(state, value) {
            state.keyboardMode = value;
        }
    },
    actions: {
        setKeyboardMode(context, value) {
            context.commit('setKeyboardMode', value);
        }
    }
});