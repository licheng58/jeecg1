<template>
  <div class="footer">
    <div class="copyright">
      <span>Copyright © 2021 上海钜星有限公司版权所有</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutFooter',
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    // color: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 14px;
  }
}
</style>