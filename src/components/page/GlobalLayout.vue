<template>
  <a-layout class="layout" :class="[device]">
    <global-header :mode="layoutMode" :menus="menus" :theme="navTheme" :device="device" @toggle="toggle" />
    <a-layout class="content-width-Fixed">
      <side-menu
        v-if="layoutMode === 'sidemenu'"
        mode="inline"
        :menus="menus"
        @menuSelect="myMenuSelect"
        :theme="navTheme"
        :collapsible="true"
        @toggle="toggle"
      ></side-menu>
      <a-layout :style="{ paddingLeft: layoutMode === 'sidemenu' ? `${sidebarOpened ? 80 : 256}px` : '0' }">
        <a-layout-content :style="{ height: '100%' }" :class="{ layoutStyle: isFullscreen }">
          <slot></slot>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
import SideMenu from '@/components/menu/SideMenu'
import GlobalHeader from '@/components/page/GlobalHeader'
import GlobalFooter from '@/components/page/GlobalFooter'

import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { triggerWindowResizeEvent } from '@/utils/util'

export default {
  // class="layout-style"
  name: 'GlobalLayout',
  components: {
    SideMenu,
    GlobalHeader,
    GlobalFooter
  },
  mixins: [mixin, mixinDevice],
  data() {
    return {
      activeMenu: {},
      menus: []
    }
  },
  computed: {
    ...mapState({
      // 主路由
      mainRouters: state => state.permission.addRouters,
      // 后台菜单
      permissionMenuList: state => state.user.permissionList,
      // 全屏
      isFullscreen: state => state.isFullscreen
    })
  },

  created() {
    this.menus = this.permissionMenuList
  },
  methods: {
    ...mapActions(['setSidebar']),
    toggle() {
      triggerWindowResizeEvent()
      this.setSidebar(!this.sidebarOpened)
    },
    myMenuSelect(value) {
      //此处触发动态路由被点击事件
      this.findMenuBykey(this.menus, value.key)
      this.$emit('dynamicRouterShow', value.key, this.activeMenu.meta.title)
      // update-begin-author:sunjianlei date:20191223 for: 修复刷新后菜单Tab名字显示异常
      let storeKey = 'route:title:' + this.activeMenu.path
      this.$ls.set(storeKey, this.activeMenu.meta.title)
      // update-end-author:sunjianlei date:20191223 for: 修复刷新后菜单Tab名字显示异常
    },
    findMenuBykey(menus, key) {
      for (let i of menus) {
        if (i.path == key) {
          this.activeMenu = { ...i }
        } else if (i.children && i.children.length > 0) {
          this.findMenuBykey(i.children, key)
        }
      }
    }
    //update-end-author:taoyan date:20190430 for:动态路由title显示配置的菜单title而不是其对应路由的title
  }
}
</script>

<style lang="less">
body {
  // 打开滚动条固定显示
  overflow-y: scroll;

  &.colorWeak {
    filter: invert(80%);
  }
}

.layoutStyle {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
}
.ant-menu-dark,
.ant-menu-dark .ant-menu-sub {
  // background: #3e4856 !important;
  background: #172c61 !important;
}
.ant-menu-item-selected {
  background: #4664b4 !important;
}
.ant-menu-dark .ant-menu-inline.ant-menu-sub {
  box-shadow: none !important;
}
.layout {
  min-height: 100vh !important;
  overflow-x: hidden;

  .content-width-Fixed {
    margin-top: 65px;
    background: #f8f8f8;
  }
  &.ant-layout-has-sider {
    flex-direction: row;
  }

  .trigger {
    font-size: 22px;
    line-height: 42px;
    padding: 0 18px;
    cursor: pointer;
    transition: color 300ms, background 300ms;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .ant-header-fixedHeader {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.2s;
    background: #1182fbff;
  }

  .header {
    height: 64pxpx;
    padding: 0 19px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    .header-logo {
      display: inline-block;
      img {
        display: inline-block;
        vertical-align: middle;
        // height: 40px;
        // width: 40px;
        margin-right: 19px;
      }
      .title {
        display: inline-block;
        vertical-align: middle;
        margin-right: 16px;
        h1 {
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #fff;
          line-height: 22px;
          margin: 0;
        }
      }
      i {
        font-size: 20px;
        color: rgba(0, 0, 0, 0.65);
        padding: 5px;
        cursor: pointer;
      }
    }
  }
  .user-wrapper {
    float: right;
    height: 100%;
    color: #3a3a3a;
    display: flex;
    align-items: center;
    .action {
      cursor: pointer;
      padding: 0 14px;
      display: inline-block;
      transition: all 0.3s;
      height: 70%;
      line-height: 46px;
      &.action-full {
        height: 100%;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      .avatar {
        margin: 20px 10px 20px 0;
        color: #3a3a3a;
        background: #dfe8eaff;
        vertical-align: middle;
      }
      .icon {
        font-size: 16px;
        padding: 4px;
      }
      .anticon {
        color: #3a3a3aff;
      }
    }
  }

  &.tablet {
    // overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
    .top-nav-header-index {
      .header-index-wide {
        .header-index-left {
          .logo > a {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .top-nav-header-index {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    transition: background 0.3s, width 0.2s;

    .header-index-wide {
      width: 100%;
      margin: auto;
      padding: 0 20px 0 0;
      display: flex;
      height: 64px;

      .ant-menu.ant-menu-horizontal {
        border: none;
        height: 64px;
        line-height: 64px;
        background: #1182fbff;
      }

      .header-index-left {
        flex: 1 1;
        display: flex;

        .logo.top-nav-header {
          width: 165px;
          height: 64px;
          position: relative;
          line-height: 64px;
          transition: all 0.3s;
          overflow: hidden;

          img {
            display: inline-block;
            vertical-align: middle;
            height: 38px;
          }

          h1 {
            color: #fff;
            display: inline-block;
            vertical-align: top;
            font-size: 16px;
            margin: 0 0 0 12px;
            font-weight: 400;
          }
        }
      }

      .header-index-right {
        float: right;
        height: 64px;
        overflow: hidden;
        .action:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }

    &.light {
      background-color: #fff;

      .header-index-wide {
        .header-index-left {
          .logo {
            h1 {
              color: #002140;
            }
          }
        }
      }
    }
  }

  // 内容区
  .layout-content {
    margin: 24px 24px 0px;
    height: 64px;
    padding: 0 12px 0 0;
  }
}

.topmenu {
  .page-header-index-wide {
    margin: 0 auto;
    width: 100%;
  }
}

// drawer-sider 自定义
.ant-drawer.drawer-sider {
  .sider {
    box-shadow: none;
  }

  &.dark {
    .ant-drawer-content {
      background-color: rgb(0, 21, 41);
    }
  }
  &.light {
    box-shadow: none;
    .ant-drawer-content {
      background-color: #fff;
    }
  }

  .ant-drawer-body {
    padding: 0;
  }
}

// 菜单样式
.sider {
  // box-shadow: 2px 116px 6px 0 rgba(0, 21, 41, 0.35);
  position: relative;
  z-index: 10;
  background: #ffffff !important;
  display: block;
  &.ant-fixed-sidemenu {
    position: fixed;
    left: 0;
    top: 65px;
    height: calc(100% - 65px);
    overflow: hidden;
  }
  .sider-menu {
    // background: #3e4856;
    background: #172c61;
    width: 265px;
    height: calc(100% - 34px);
    overflow-y: auto;
    overflow-x: hidden;
    .ant-menu-item-selected::after {
      left: 0;
      right: none;
      right: auto;
    }
  }
  .sider-footer {
    width: 100%;
    height: 34px;
    line-height: 34px;
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    background: #4664b4;
    cursor: pointer;
    i {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

// 外置的样式控制
.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;

  .ant-dropdown-menu-item {
    width: 160px;
  }

  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title > .anticon:first-child .ant-dropdown-menu-submenu-title > a > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}

// 数据列表 样式
.table-alert {
  margin-bottom: 16px;
}

.table-page-search-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}
.table-page-search-model-wrapper {
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-bottom: 24px;
      margin-right: 0;

      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        line-height: 32px;
      }
    }
  }

  .table-page-search-submitButtons {
    display: block;
    margin-bottom: 24px;
    white-space: nowrap;
  }
}

.content {
  .table-operator {
    margin-bottom: 18px;

    button {
      margin-right: 8px;
    }
  }
}
.ant-form-item-with-help {
  margin-bottom: 5px !important;
}
</style>
