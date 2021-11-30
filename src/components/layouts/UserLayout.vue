<template>
  <div id="userLayout"
       class="user-layout-wrapper desktop">
    <div class="container">
      <!-- <div class="top">
        <div class="top-logo">
          <img src="~@/assets/logo_header.png" class="logo" alt="logo" />
        </div>
        <span class="top-right">欢迎登录~</span>
      </div> -->

      <route-view></route-view>
      <GlobalFooter></GlobalFooter>
    </div>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'
import GlobalFooter from '@/components/page/GlobalFooter'

export default {
  name: 'UserLayout',
  components: { RouteView, GlobalFooter },
  mixins: [mixinDevice],
  data() {
    return {}
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  width: 100%;
  height: 100vh;
  .container {
    width: 100%;
    height: 100%;
    background: #f9faff;
    position: relative;
    a {
      text-decoration: none;
    }
    .top {
      height: 65px;
      background: #172c61;
      color: #fff;
      height: 65px;
      line-height: 65px;
      padding: 0 83px;
      // border-bottom: 1px solid #e3e3e3;
      .top-logo {
        display: inline-block;
        height: 65px;
        line-height: 65px;
        .logo {
          // max-width: 50px;
          // max-height: 50px;
          max-width: 100%;
          max-height: 50px;
          vertical-align: middle;
          border-style: none;
        }

        .title {
          font-size: 24px;
          font-family: Heiti SC;
          font-weight: 500;
          vertical-align: middle;
          margin-left: 15px;
        }
      }
      .top-right {
        float: right;
        height: 65px;
        line-height: 65px;
        font-size: 18px;
        font-family: Heiti SC;
      }
    }

    .main {
      width: 100%;
      height: 100%;
      // height: calc(100% - 145px);
      // padding: 78px 78px 0 48px;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 25px 0;
      text-align: center;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #4764b4;
      line-height: 30px;
    }
  }
}
</style>