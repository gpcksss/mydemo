// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
// import ECharts from 'vue-echarts/components/ECharts.vue'
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
// 引入折线图
import 'echarts/lib/chart/line'
// 引入提示框
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/tooltip'
import '@/utils/flexible.js'
import LivePlayer from '@liveqing/liveplayer'
Vue.component('live-player', LivePlayer)
// Vue.component('v-chart', ECharts)
Vue.prototype.$http = axios
// Vue.config.productionTip = false
// Vue.use(ElementUI)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
