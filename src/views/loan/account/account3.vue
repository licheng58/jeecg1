<template>
  <div>
    <StandardTable
      ref="MyTable"
      size="middle"
      rowKey="id"
      :bordered="false"
      :loadUrl="url.list"
      :queryParam="queryParam"
      :columns="columns"
      :scroll="{ x: 840 }"
      :isLoad="false"
      @getResult="getResult"
    >
      <template slot="header">
        <PageTitle>
          <span slot="title" class="table-title-sum">
            <span> 贷款额度(元)：</span>
            <span class="sum">{{ counts.sum1 }}</span>
            <span> 尚未提交用途信息的贷款额(元)：</span>
            <span class="sum">{{ counts.sum2 }}</span>
          </span>
          <a-button @click="add" type="primary" icon="plus">新 增</a-button>
        </PageTitle>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </span>
      <span slot="fileSlot" slot-scope="text, record">
        <a @click="download(record)" :title="record.originalFilename + '.' + record.fileExtName">
          <a-icon type="link" />
          <span>{{ record.originalFilename + '.' + record.fileExtName }}</span>
        </a>
      </span>
    </StandardTable>
    <account3Modal ref="modalForm" @ok="modalFormOk"></account3Modal>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import { tableListMixin } from '@/mixins/tableListMixin'
import account3Modal from '../modules/account3Modal'
import moment from 'moment'
import { downFile } from '@/api/manage'

export default {
  components: {
    account3Modal,
  },
  mixins: [tableListMixin],

  props: {
    type: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      loading: false,
      id: Number(this.$route.query.id),
      counts: {
        sum1: 0,
        sum2: 0,
      },
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'left',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '发生时间',
          align: 'left',
          width: 120,
          dataIndex: 'fssj',
          ellipsis: true,
          customRender: function (t, r, index) {
            return moment(t).format('YYYY/MM/DD')
          },
        },

        {
          title: '发生金额(元)',
          align: 'left',
          width: 120,
          dataIndex: 'fsje',
        },
        {
          title: '用途',
          align: 'left',
          width: 150,
          dataIndex: 'yt',
          ellipsis: true,
        },
        {
          title: '付款对象',
          align: 'left',
          width: 150,
          dataIndex: 'fkdx',
          ellipsis: true,
        },
        {
          title: '附件',
          align: 'left',
          width: 120,
          dataIndex: 'filePath',
          ellipsis: true,
          scopedSlots: { customRender: 'fileSlot' },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/credit/xTaskPurpose/list',
        delete: '/credit/xTaskPurpose/delete',
        download: '/credit/xTaskPurpose/download',
      },
    }
  },
  created() {
    this.queryParam.taskId = this.id
  },
  methods: {
    add() {
      this.$refs.modalForm.add(this.id)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    download(record) {
      const param = {
        fileExtName: record.fileExtName,
        path: record.filePath,
        originalFilename: record.originalFilename,
      }
      downFile(this.url.download, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(
            new Blob([data], { type: 'application/vnd.ms-excel' }),
            record.originalFilename + '.' + record.fileExtName
          )
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', record.originalFilename + '.' + record.fileExtName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    getResult(data) {
      if (data.amount) {
        this.counts.sum1 = data.amount
      }
      if (data.shengyu) {
        this.counts.sum2 = data.shengyu
      }
    },
  },
}
</script>