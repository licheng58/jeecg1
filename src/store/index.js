import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import enhance from './modules/enhance'
import getters from './getters'
import { lc_getDeviceTypes } from '@/api/lc_api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    enhance
  },
  state: {
    isFullscreen: false, //是否全屏
    DEVIVE_TYPES: [] //设备类型
  },

  mutations: {
    // 控制全屏
    setFullScreen(state, val) {
      // console.log(val)
      state.isFullscreen = val
    },

    // 获取设备类型
    setDeviceTypes(state, val) {
      state.DEVIVE_TYPES = val
      // console.log(state.DEVIVE_TYPES)
    }
  },

  actions: {
    // 获取设备类型
    async getDeviceTypes(context) {
      const res = await lc_getDeviceTypes()
      // console.log(res)
      context.commit('setDeviceTypes', res.result)
    }
  },
  getters
})
