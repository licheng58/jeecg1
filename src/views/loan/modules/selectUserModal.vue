<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-form>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="客户经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-model="queryParam.userId" placeholder="请选择客户经理" allowClear>
              <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                item.realname
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </j-modal>
</template>

<script>
export default {
  props: {
    userList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      title: '选择客户经理',
      width: 500,
      visible: false,
      queryParam: {},
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    handleOk() {
      if (this.queryParam.userId === null || this.queryParam.userId === undefined) {
        this.$message.warning('请选择客户经理')
        return
      }
      this.$emit('ok', this.queryParam)
      this.close()
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>