import Vue from 'vue'
import App from './App.vue'
import store from "./store";

export default class ui {
    constructor() {
        window.addEventListener('load', () => {
            new Vue({
                el: '#ui',
                store,
                render: h => h(App)
            });
        })

    }
}