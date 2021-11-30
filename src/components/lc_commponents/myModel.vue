<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    :okText="okText"
    :footer="footer"
  >
    <a-spin :spinning="confirmLoading">
      <slot></slot>
    </a-spin>
  </j-modal>
</template>

<script>
export default {
  name: 'bindUserModel',
  props: {
    footer: {
      type: String
    },

    visible: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: '操作'
    },

    okText: {
      type: String,
      default: '确定'
    },

    width: {
      type: Number,
      default: 800
    }
  },

  data() {
    return {
      confirmLoading: false
    }
  },

  created() {},

  methods: {
    handleOk() {
      this.$emit('handleOk')
    },

    handleCancel() {
      this.$emit('closeDialog')
    }
  }
}
</script>

<style lang="less" scoped></style>
