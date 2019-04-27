import Vue from 'vue'
import App from './App.vue'

export default class ui {
    constructor() {
        window.addEventListener('load', () => {
            new Vue({
                el: '#ui',
                render: h => h(App)
            });
        })

    }
}