import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
import { VueAxios } from '@/utils/request'
import './assets/font/iconfont'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less' // or 'ant-design-vue/dist/antd.less'
import '@/permission' // permission control
import '@/utils/filter' // base filter
import '@/assets/less/com.less'

import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from '@/store/mutation-types'
import config from '@/defaultSettings'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus'
import JeecgComponents from '@/components/jeecg/index'
import '@/assets/less/JAreaLinkage.less'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import '@/这个为复制后的目录，src就不要写了/ef/index.css'
Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(hasPermission)
Vue.use(vueBus)
Vue.use(JeecgComponents)

import customCom from '@/components/table/index'
Vue.use(customCom)

// lc---------
import validators from './utils/lc_utils/validators'
Vue.use(validators)

import VueLazyLoad from 'vue-lazyload'
let error = require('./assets/images/img_error.png')
let loading = require('./assets/images/img_loading.png')
Vue.use(VueLazyLoad, {
  error, //报错需要的图片
  loading // 替换需要的图片
})

// 引入jQuery
// const $ = require('jquery')
// window.$ = $
// console.log($);

// // 引入基本模板
// let echarts = require('echarts/lib/echarts')
// // 引入柱状图组件
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/line')
// require("echarts/lib/chart/graph");
// require("echarts/lib/chart/scatter");
// // 引入提示框和title组件
// require("echarts/lib/component/singleAxis");
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')
// require("echarts/lib/component/legend");
// require("echarts/lib/component/dataZoom");
// // require("echarts/lib/component/dataZoomInside");
// require("echarts/lib/component/dataZoomSlider");
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  mounted() {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, false))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    store.commit('SET_MULTI_PAGE', Vue.ls.get(DEFAULT_MULTI_PAGE, config.multipage))
  },
  render: h => h(App)
}).$mount('#app')
