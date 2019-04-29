import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        // config: defaultConfig,
        play: false,
        playerHP: 100,
        dead: false,
        win: false,
        potion: false,
        glass: false,
        umbrella: false,
        bossBaseHp: 50,
        bossHp: 50,
        bossHpPercent: 100,
        bossBarEnabled: false,
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
        setPotion(state, value) {
            state.potion = value;
        },
        setUmbrella(state, value) {
            state.umbrella = value;
        },
        setGlass(state, value) {
            state.glass = value;
        },
        setPlayerHP(state, value) {
            state.playerHP = value;
        },
        setBossHp(state, value) {
            state.bossHp = value;
            state.bossHpPercent = (value / state.bossBaseHp) * 100;
            state.bossBarEnabled = true;
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