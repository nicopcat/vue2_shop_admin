import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import 'default-passive-events'
import ZkTable from 'vue-table-with-tree-grid'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import './assets/css/global.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './plugins/element.js'
// Vue.prototype.$message = Message

// Ele-UI全局方法：$msgbox, $alert, $confirm 和 $prompt
// $msgbox(options)
// $alert(message, title, options) 或 $alert(message, options)
// $confirm(message, title, options) 或 $confirm(message, options)
// $prompt(message, title, options) 或 $prompt(message, options)
// Element 为 Vue.prototype 添加了全局方法 $message。因此在 vue instance 中可以采用本页面中的方式调用 Message。



// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')

  // 最后必须return config
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false


Vue.use(ElementUI)
Vue.component('zk-table', ZkTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
