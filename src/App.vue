<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import enquireScreen from '@/utils/device'

export default {
  data() {
    return {
      locale: zhCN,
    }
  },
  created() {
    let that = this
    enquireScreen((deviceType) => {
      // tablet
      if (deviceType === 0) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', true)
      }
      // mobile
      else if (deviceType === 1) {
        that.$store.commit('TOGGLE_DEVICE', 'mobile')
        that.$store.dispatch('setSidebar', true)
      } else {
        that.$store.commit('TOGGLE_DEVICE', 'desktop')
        that.$store.dispatch('setSidebar', false)
      }
    })
  },

  mounted() {
    window.onload = function () {
      console.log(window.sessionStorage['ISlogin'])
      if (!window.sessionStorage['ISlogin']) {
        // 关闭浏览器
        window.localStorage.clear()
      } else {
        // 刷新
      }
    }
    window.onunload = function () {
      window.sessionStorage['ISlogin'] = true
    }
    window.onbeforeunload = function () {
      window.sessionStorage['ISlogin'] = true
    }
  },
}
</script>
<style>
#app {
  height: 100%;
}
</style>