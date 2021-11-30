<template>
  <j-modal
    title="月销售额"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :footer="false"
    switchFullscreen
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-table
      class="standard-table"
      size="small"
      rowKey="month"
      :bordered="false"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <span slot="action" slot-scope="text, record, index">
        <span v-if="[0, 3].includes(type)">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(index)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        <span v-else>--</span>
      </span>
    </a-table>
  </j-modal>
</template>
<script>
import { numFormat } from '@/utils/util'

export default {
  data() {
    return {
      dataSource: [],
      visible: false,
      confirmLoading: false,
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 120,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },

        {
          title: '月份',
          align: 'center',
          width: 120,
          dataIndex: 'month',
        },

        {
          title: '销售额(元)',
          align: 'center',
          width: 120,
          dataIndex: 'salesVolume',
          customRender: function (t, r, index) {
            return numFormat(t, 2)
          },
        },
      ],
    }
  },
  methods: {
    init(records) {
      this.dataSource = records
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>