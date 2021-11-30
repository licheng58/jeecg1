<template>
  <div>
    <PageTitle title="投资人信息" fontSize="16px" hasBefore style="padding: 0 24px">
      <span
        class="upload-tag"
        v-if="
          this.type == 4 ||
          ((this.handleInfo.role === '1' || this.handleInfo.ifCheck === 1) && this.handleInfo.status === 2)
        "
      >
        *红色为已修改信息
      </span>
      <a-button @click="handleAdd" v-if="[0, 3].includes(type)" type="primary" icon="plus" :loading="loading"
        >新增股东</a-button
      >
    </PageTitle>
    <a-collapse v-model="activeKey" :bordered="false" class="my-collapse m024" v-if="dataSource.length > 0">
      <a-collapse-panel
        :header="`第${index + 1}大股东`"
        v-for="(item, index) of dataSource"
        :key="`${index}`"
        :style="customStyle"
        forceRender
      >
        <cardDetails3Details
          :ref="`cardDetails3Details${index}`"
          :record="item"
          :handleInfo="handleInfo"
          :type="type"
        ></cardDetails3Details>
        <a-icon slot="extra" type="delete" @click="handleDel(index)" v-if="[0, 3].includes(type)" />
      </a-collapse-panel>
    </a-collapse>
    <a-empty v-else :image="simpleImage" />

    <PageTitle
      title="操作信息"
      fontSize="16px"
      hasBefore
      style="padding: 0 24px"
      v-if="[1, 2, 4].includes(type) && viewType === 0"
    >
    </PageTitle>
    <a-descriptions
      bordered
      :column="3"
      size="middle"
      class="my-descriptions-card"
      v-if="[1, 2, 4].includes(type) && viewType === 0"
    >
      <a-descriptions-item label="更新人员">{{ handleInfo.createBy }}</a-descriptions-item>
      <a-descriptions-item label="更新机构">
        {{ handleInfo.createByDepartment }}
      </a-descriptions-item>
      <a-descriptions-item label="更新日期"> {{ handleInfo.updateTime }}</a-descriptions-item>
      <a-descriptions-item label="更新原因" :span="3"> {{ handleInfo.createReson }}</a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script>
import cardDetails3Details from './cardDetails3Details'
import { Empty } from 'ant-design-vue'
import { createLogger } from 'vuex'

export default {
  components: {
    cardDetails3Details,
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
    viewType: {
      type: Number,
      default: 0,
    },
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  data() {
    return {
      customStyle: 'background: #fffffff;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      formData: {},
      loading: false,
      activeKey: '0',
      dataSource: [],
      handleInfo: {},
    }
  },
  created() {},
  methods: {
    init(records, handleInfo) {
      this.handleInfo = handleInfo
      let list = records ? records : []
      //status===2 申请修改状态   role !== '1' 不是客户经理(客户经理只能查看自己新增的客户)  ifCheck 0 不能处理
      if (this.handleInfo.role !== '1' && this.handleInfo.ifCheck === 0 && this.handleInfo.status === 2) {
        this.dataSource = list.filter((item) => item.status === 2)
      } else {
        this.dataSource = list
      }
    },
    handleAdd() {
      // if (this.dataSource.length === 5) {
      //   this.$message.warning('最多新增五条股东数据!')
      // } else {}
      this.loading = true
      setTimeout(() => {
        let data = { type: 1, status: this.type === 3 ? 1 : 2 }
        if (this.handleInfo.hasOwnProperty('id')) {
          data.customerId = this.handleInfo.id
        }
        this.dataSource.push(data)
        this.activeKey = `${this.dataSource.length - 1}`
        this.loading = false
      }, 500)
    },
    handleDel(index) {
      this.dataSource.splice(index, 1)
    },
    getData(type) {
      let list = this.dataSource.map((item, index) => {
        return this.$refs[`cardDetails3Details${index}`][0].getData(type)
      })
      if (type === 1 && list.some((item) => !item)) {
        this.$message.warning('请检查投资人信息必填验证!')
        return false
      }
      list = list.filter((item) => item)
      return list
    },
  },
}
</script>
