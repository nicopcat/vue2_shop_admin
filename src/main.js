import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Button, Form, FormItem, Input } from 'element-ui'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './assets/css/global.css'

Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 或指定组件名称
// Vue.component('my-button', Button);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
