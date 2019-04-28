import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        // config: defaultConfig,
        play: false,
        playerHP: 100,
        dead: false,
        win: false
    },
    mutations: {
        setPlay(state, value) {
            state.play = value;
        },
        setDead(state, value) {
            state.dead = value;
        },
        setWin(state, value) {
            state.win = value;
        },
        setPlayerHP(state, value) {
            state.playerHP = value;
        }
    },
    actions: {
        setPlay(context, value) {
            context.commit('setPlay', value);
        },
        setDead(context, value) {
            context.commit('setDead', value);
        },
        setWin(context, value) {
            context.commit('setWin', value);
        },
        setPlayerHP(context, value) {
            context.commit('setPlayerHP', value);
        }
    }
});