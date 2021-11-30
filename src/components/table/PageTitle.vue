<template>
  <div class="page-title clearfix">
    <h1 v-if="title"
        :style="{ fontSize: fontSize }"
        :class="{ before: hasBefore }">{{ title }}</h1>
    <slot name="title"></slot>
    <div class="fr">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTitle',
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    hasBefore: {
      type: Boolean,
      default: false,
    },
    fontSize: {
      type: String,
      default: '18px',
    },
  },
}
</script>

<style lang="less" scoped>
/*缩小首页布 局顶部的高度*/
.page-title {
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 16px 0;
  h1 {
    position: relative;
    display: inline-block;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    line-height: 32px;
    margin: 0;
  }
  .before {
    padding-left: 9px;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 24px;
      background: #4262ba;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -12px;
    }
  }

  .fr > * {
    margin-left: 8px;
  }
}
</style>