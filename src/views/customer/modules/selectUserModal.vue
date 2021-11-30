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
              <a-select-option v-for="(item, index) of sysUsers" :key="index" :value="item.id">{{
                item.realname
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="更新原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-model="queryParam.createReson" placeholder="请选择更新原因" allowClear>
              <a-select-option v-for="(item, index) of createResons" :key="index" :value="item">{{
                item
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </j-modal>
</template>

<script>
const createResons = ['贷款申请', '贷后管理', '日常变更']
export default {
  props: {
    sysUsers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      createResons,
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
        this.$message.warning('请选择审批人')
        return
      }
      if (this.queryParam.createReson === null || this.queryParam.createReson === undefined) {
        this.$message.warning('请选择更新原因')
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