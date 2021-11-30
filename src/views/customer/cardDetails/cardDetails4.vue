<template>
  <div>
    <div class="standard-table-container">
      <div class="table-container-header">
        <div class="header-title">
          <PageTitle title="附件" hasBefore>
            <a-button @click="add" type="primary" icon="plus" v-if="[0, 3].includes(type)">新 增</a-button>
          </PageTitle>
        </div>
      </div>
      <a-table
        class="standard-table"
        size="small"
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
        <span slot="fileSlot" slot-scope="text, record">
          <a @click="download(record)" :title="record.fjname">
            <a-icon type="link" />
            <span>{{ record.fjname }}</span>
          </a>
        </span>
      </a-table>
    </div>
    <cardDetails4Modal ref="modalForm" @add="modaladd" @edit="modaledit"></cardDetails4Modal>
  </div>
</template>
<script>
import pick from 'lodash.pick'
import cardDetails4Modal from './cardDetails4Modal'
import moment from 'moment'
import { downFile } from '@/api/manage'

export default {
  components: {
    cardDetails4Modal,
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

  data() {
    return {
      dataSource: [],
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
          title: '附件类型',
          align: 'left',
          width: 120,
          dataIndex: 'fjlx',
        },

        {
          title: '附件',
          align: 'left',
          width: 120,
          dataIndex: 'fjname',
          ellipsis: true,
          scopedSlots: { customRender: 'fileSlot' },
        },
        {
          title: '上传时间',
          align: 'left',
          width: 120,
          dataIndex: 'createTime',
          ellipsis: true,
          customRender: function (t, r, index) {
            return moment(t).format('YYYY/MM/DD')
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      downLoading: false,
      handleInfo: {},
      url: {
        download: '/credit/xFileRecord/download',
      },
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
      this.dataSource.map((item) => {
        item.key = item.id
      })
    },
    add() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    handleEdit(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '新增'
      this.$refs.modalForm.disableSubmit = false
    },
    modaladd(data) {
      if (this.handleInfo.hasOwnProperty('id')) {
        data.customerId = this.handleInfo.id
      }
      data.status = this.type === 3 ? 1 : 2
      this.dataSource.push(data)
    },
    modaledit(data) {
      let index = this.dataSource.findIndex((item) => item.key === data.key)
      if (index > -1) {
        this.dataSource.splice(index, 1, data)
      }
    },
    handleDelete(index) {
      this.dataSource.splice(index, 1)
    },
    download(record) {
      if (this.downLoading) {
        return
      }
      const param = {
        fileCode: record.fjcode,
      }
      this.downLoading = true
      this.$message.loading({ content: '附件下载中...', key: 'downFile', duration: 0 })
      downFile(this.url.download, param)
        .then((data) => {
          this.downLoading = false
          if (!data) {
            // this.$message.warning('文件下载失败')
            this.$message.warning({ content: '文件下载失败', key: 'downFile', duration: 2 })
            return
          } else {
            this.$message.success({ content: '文件下载成功', key: 'downFile', duration: 2 })
          }
          // let type = this.getType(record.fjname)
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), record.fjname)
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', record.fjname)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
        })
        .catch(() => {
          this.downLoading = false
          this.$message.warning({ content: '文件下载失败', key: 'downFile', duration: 2 })
        })
    },
    getType(name) {
      let suffixName = name
      if (suffixName.indexOf('.xls') > -1 || suffixName.indexOf('.xlsx') > -1) {
        return 'application/vnd.ms-excel'
      }
      if (suffixName.indexOf('.doc') > -1 || suffixName.indexOf('.docx') > -1) {
        return 'application/msword'
      }
      if (suffixName.indexOf('.pdf') > -1) {
        return 'application/pdf'
      }
      if (suffixName.indexOf('.ppt') > -1 || suffixName.indexOf('.pptx') > -1) {
        return 'application/vnd.ms-powerpoint'
      }
    },
    getData() {
      return this.dataSource
    },
  },
}
</script>