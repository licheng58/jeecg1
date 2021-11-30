<template>
  <el-button type='primary'
             @click="handleCilck">asd</el-button>
</template>

<script>
export default {
  methods: {
    handleCilck() {
      const appkey = 'c4b14ff023d7966fe0244097'
      const userId = 'licheng58'
      const password = 'licheng58' // 密码，不能为 null 或 ""

      // 可选参数, 例子中是默认值
      // 1. heartbeatTime 表示心跳间隔。指经过多久向对方发送心跳包，告知服务器自己还在线。
      // 2. connectUrl 表示服务器地址。默认使用菊风服务器，可自定义服务器。(需要在最后加上`/`。)
      const loginParam = {
        heartbeatTime: 500,
        connectUrl: 'https://ums.justalkcloud.com:18443/',
      }

      JCSDK.login(appkey, userId, password, loginParam)
    },
  },
}
</script>

<style>
</style>