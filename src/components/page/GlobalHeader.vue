<template>
  <a-layout-header class="ant-header-fixedHeader"
                   :style="{ padding: '0' }">
    <div v-if="mode === 'sidemenu'"
         class="header">
      <div class="header-logo">
        <img src="@/assets/logo_header.png"
             alt="logo"
             width="150px" />
        <div class="title">
          <h1>可视化专家平台</h1>
        </div>
       <span style="color:#fff">版本(内测专用): v1.5</span>

      </div>

      <user-menu :theme="theme" />
    </div>

    <!-- 顶部 导航栏模式 -->
    <div v-else
         class="top-nav-header-index dark">
      <div class="header-index-wide">
        <div class="header-index-left"
             :style="topMenuStyle.headerIndexLeft">
          <logo class="top-nav-header"
                :style="topMenuStyle.topNavHeader" />
          <div :style="topMenuStyle.topSmenuStyle">
            <s-menu mode="horizontal"
                    :menu="menus"
                    theme="dark"></s-menu>
          </div>
        </div>
        <user-menu class="header-index-right"
                   :theme="theme"
                   :style="topMenuStyle.headerIndexRight" />
      </div>
    </div>

  </a-layout-header>
</template>

<script>
import UserMenu from '../tools/UserMenu'
import SMenu from '../menu/'
import Logo from '../tools/Logo'

import { mixin } from '@/utils/mixin.js'

export default {
  name: 'GlobalHeader',
  components: {
    UserMenu,
    SMenu,
    Logo,
  },
  mixins: [mixin],
  props: {
    mode: {
      type: String,
      default: 'sidemenu',
    },
    menus: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'dark',
    },

    device: {
      type: String,
      required: false,
      default: 'desktop',
    },
  },
  data() {
    return {
      headerBarFixed: false,
      topMenuStyle: {
        headerIndexLeft: {},
        topNavHeader: {},
        headerIndexRight: {},
        topSmenuStyle: {},
      },
      chatStatus: '',
    }
  },
  watch: {
    mode(newVal) {
      if (newVal === 'topmenu') {
        this.buildTopMenuStyle()
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    if (this.mode === 'topmenu') {
      this.buildTopMenuStyle()
    }
  },
  methods: {
    handleScroll() {
      if (this.autoHideHeader) {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 100) {
          this.headerBarFixed = true
        } else {
          this.headerBarFixed = false
        }
      } else {
        this.headerBarFixed = false
      }
    },
    toggle() {
      this.$emit('toggle')
    },
    buildTopMenuStyle() {
      if (this.mode === 'topmenu') {
        if (this.device === 'mobile') {
          // 手机端需要清空样式，否则显示会错乱
          this.topMenuStyle.topNavHeader = {}
          this.topMenuStyle.topSmenuStyle = {}
          this.topMenuStyle.headerIndexRight = {}
          this.topMenuStyle.headerIndexLeft = {}
        } else {
          let rightWidth = '280px'
          this.topMenuStyle.topNavHeader = { 'min-width': '430px' }
          this.topMenuStyle.topSmenuStyle = { width: 'calc(100% - 430px)' }
          this.topMenuStyle.headerIndexRight = { 'min-width': rightWidth }
          this.topMenuStyle.headerIndexLeft = { width: `calc(100% - ${rightWidth})` }
        }
      }
    },
    //update-begin--author:sunjianlei---date:20190508------for: 顶部导航栏过长时显示更多按钮-----
  },
}
</script>

<style lang="less" scoped>
/* update_begin author:scott date:20190220 for: 缩小首页布局顶部的高度*/

@height: 64px;

.layout {
  .top-nav-header-index {
    .header-index-wide {
      margin-left: 10px;

      .ant-menu.ant-menu-horizontal {
        height: @height;
        line-height: @height;
      }
    }
    .trigger {
      line-height: 64px;
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .header {
    z-index: 2;
    color: #fff;
    height: @height;
    // background-color: @primary-color;
    background-color: #172c61;
    transition: background 300ms;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  }

  .header,
  .top-nav-header-index {
    &.dark .trigger:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}

.ant-layout-header {
  height: @height;
  line-height: @height;
}

/* update_end author:scott date:20190220 for: 缩小首页布局顶部的高度*/
</style>