<template>
  <div class="user-wrapper" :class="theme">
    <!-- 跳转视频直播页面 -->
    <div class="top-out" style="cursor:pointer;padding:0 20px;color:#68cdfe;font-weight:700" @click="to_out">
      视频直播
    </div>
    <!-- 全屏操作 -->
    <a-icon
      style="font-size: 20px;  color: #fff; cursor: pointer;"
      :type="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
      :title="isFullscreen ? '返回' : '全屏'"
      @click="handleClick"
    />

    <!-- <header-notice class="action"/>  <a-icon type="fullscreen-exit" />-->
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" />
        <span style="margin-right: 5px; color: #fff">欢迎您，{{ nickname() }}</span>
        <a-icon type="down" />
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!-- <a-menu-item key="0">
          <router-link :to="{ name: 'account-center' }">
            <a-icon type="user"/>
            <span>个人中心</span>
          </router-link>
        </a-menu-item>-->
        <!-- <a-menu-item key="1">
          <router-link :to="{ name: 'account-settings-base' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>-->
        <!-- <a-menu-item key="3" @click="systemSetting">
          <a-icon type="tool" />
          <span>系统设置</span>
        </a-menu-item>-->
        <a-menu-item key="4" @click="updatePassword">
          <a-icon type="setting" />
          <span>密码修改</span>
        </a-menu-item>
        <!-- <a-menu-item key="5" @click="updateCurrentDepart">
          <a-icon type="cluster"/>
          <span>切换机构</span>
        </a-menu-item>-->
        <!-- <a-menu-item key="6" @click="clearCache">
          <a-icon type="sync" />
          <span>清理缓存</span>
        </a-menu-item>-->
        <!-- <a-menu-item key="2" disabled>
          <a-icon type="setting"/>
          <span>测试</span>
        </a-menu-item>
        <a-menu-divider/>-->
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <!-- <span class="action">
      <a class="logout_title" href="javascript:;" @click="handleLogout">
        <a-icon type="logout" />
        <span v-if="isDesktop()">&nbsp;退出登录</span>
      </a>
    </span>-->
    <user-password ref="userPassword"></user-password>
    <!-- <depart-select ref="departSelect" :closable="true" title="机构切换"></depart-select> -->
    <!-- <setting-drawer ref="settingDrawer" :closable="true" title="系统设置"></setting-drawer> -->
  </div>
</template>

<script>
// import HeaderNotice from './HeaderNotice'
import UserPassword from './UserPassword'
// import SettingDrawer from '@/components/setting/SettingDrawer'
// import DepartSelect from './DepartSelect'
import { mapActions, mapGetters, mapState } from 'vuex'
import { mixinDevice } from '@/utils/mixin.js'
import { getFileAccessHttpUrl, getAction } from '@/api/manage'
import Vue from 'vue'
import { UI_CACHE_DB_DICT_DATA } from '@/store/mutation-types'
import screenfull from 'screenfull'
export default {
  name: 'UserMenu',
  mixins: [mixinDevice],
  data() {
    return {
      // isFullscreen: false,
      searchMenuOptions: [],
      searchMenuComp: 'span',
      searchMenuVisible: false
    }
  },
  components: {
    // HeaderNotice,
    UserPassword
    // DepartSelect,
    // SettingDrawer,
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },

  mounted() {
    let that = this
    window.onresize = function() {
      if (!that.checkFull()) {
        // 退出全屏后要执行的动作
        // console.log('退出全屏')
        // mapState.isFullscreen = false
        that.$store.commit('setFullScreen', false)
      }
    }
  },

  computed: {
    isFullscreen: () => mapState.isFullscreen
  },

  methods: {
    to_out() {
      window.open('https://www.juxingtech.cn:18280/')
    },

    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      var isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },

    handleFullScreen() {
      let element = document.documentElement
      if (this.isFullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      // this.isFullscreen = !this.isFullscreen
      this.$store.commit('setFullScreen', !this.isFullscreen)
    },

    //全屏方法
    handleClick() {
      // 需要注意的是 如果判断!screenfull.enabled 显示的是不支持全屏的话 是因为谷歌的版本问题  判断改为 !screenfull.isEnabled  就可以了

      if (!screenfull.isEnabled) {
        // 如果不支持进入全屏，发出不支持提示
        this.$message({
          message: '您的浏览器版本过低不支持全屏显示！',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
      // this.isFullscreen = !screenfull.isFullscreen
      console.log(!screenfull.isFullscreen)
      this.$store.commit('setFullScreen', !screenfull.isFullscreen)
    },

    showClick() {
      this.searchMenuVisible = true
    },
    hiddenClick() {
      this.shows = false
    },
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar', 'userInfo']),
    getAvatar() {
      return getFileAccessHttpUrl(this.avatar())
    },
    handleLogout() {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return that
            .Logout({})
            .then(() => {
              // that.$router.push({ path: '/user/login' });
              window.location.reload()
            })
            .catch(err => {
              that.$message.error({
                title: '错误',
                description: err.message
              })
            })
        },
        onCancel() {}
      })
    },
    updatePassword() {
      let username = this.userInfo().username
      this.$refs.userPassword.show(username)
    },
    updateCurrentDepart() {
      this.$refs.departSelect.show()
    },
    // systemSetting() {
    //   this.$refs.settingDrawer.showDrawer()
    // },
    searchMenus(arr, menus) {
      for (let i of menus) {
        if (!i.hidden && 'layouts/RouteView' !== i.component) {
          arr.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.searchMenus(arr, i.children)
        }
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    searchMethods(value) {
      let route = this.searchMenuOptions.filter(item => item.id === value)[0]
      if (route.meta.internalOrExternal === true || route.component.includes('layouts/IframePageView')) {
        window.open(route.meta.url, '_blank')
      } else {
        this.$router.push({ path: route.path })
      }
      this.searchMenuVisible = false
    },

    clearCache() {
      getAction('sys/dict/refleshCache')
        .then(res => {
          if (res.success) {
            //重新加载缓存
            getAction('sys/dict/queryAllDictItems').then(res => {
              if (res.success) {
                Vue.ls.remove(UI_CACHE_DB_DICT_DATA)
                Vue.ls.set(UI_CACHE_DB_DICT_DATA, res.result, 7 * 24 * 60 * 60 * 1000)
              }
            })
            this.$message.success('刷新缓存完成！')
          }
        })
        .catch(e => {
          this.$message.warn('刷新缓存失败！')
          console.log('刷新失败', e)
        })
    }
  }
}
</script>

<style scoped>
.logout_title {
  color: inherit;
  text-decoration: none;
}
</style>
