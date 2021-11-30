<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img src="@/assets/logo.png" alt="logo" />
      <a-divider type="vertical" />
      <h1>欢迎进入财务智能预警系统</h1>
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Logo',
}
</script>
<style lang="less" scoped>

</style>