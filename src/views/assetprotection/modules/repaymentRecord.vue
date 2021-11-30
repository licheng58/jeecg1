<template>
  <j-modal :title="title" :width="796" :visible="visible" switchFullscreen :footer="null" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <StandardTable
        ref="MyTable"
        size="middle"
        class="p0"
        rowKey="id"
        :loadUrl="url.list"
        :queryParam="queryParam"
        :columns="columns"
        :isLoad="false"
        :loading="false"
        :scroll="{ x: 480 }"
      >
      </StandardTable>
    </a-spin>
  </j-modal>
</template>

<script>
import '@/assets/less/TableExpand.less'
import { getAction } from '@/api/manage'
import { tableListMixin } from '@/mixins/tableListMixin'
import moment from 'moment'

export default {
  name: 'repaymentRecord',
  data() {
    return {
      mixins: [tableListMixin],
      title: '回收情况',
      taskNo: '',
      queryParam: {},
      visible: false,
      loading: false,
      // 表头
      columns: [
        {
          title: '交易流水号',
          align: 'center',
          width: 120,
          ellipsis: true,
          dataIndex: 'paydebtNo',
        },
        {
          title: '发生日期',
          align: 'center',
          width: 120,
          ellipsis: true,
          dataIndex: 'repaymentDate',
          customRender: function (t, r, index) {
            return t ? moment(t).format('YYYY-MM-DD') : ''
          },
        },
        // {
        //   title: '回收方式',
        //   align: 'center',
        //   width: 120,
        //   ellipsis: true,
        //   dataIndex: 'xm',
        // },
        {
          title: '回收金额(元)',
          align: 'center',
          width: 120,
          ellipsis: true,
          dataIndex: 'repaymentAmount',
        },
      ],
      url: {
        list: '/credit/zYqtPayment/list',
      },
    }
  },

  methods: {
    init(record) {
      this.visible = true
      this.queryParam.CVID = record.taskNo
      this.$nextTick(() => {
        this.$refs.MyTable.reload()
      })
    },
    close() {
      this.visible = false
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>

<style>
</style>