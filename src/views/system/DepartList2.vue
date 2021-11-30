<template>
  <a-card :bordered="false" style="margin: 16px">
    <PageTitle title="机构管理">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
    </PageTitle>
    <a-spin :spinning="loading">
      <a-table
        ref="table"
        size="middle"
        v-if="dataSource.length > 0"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :defaultExpandAllRows="true"
        :pagination="false"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </a-table>
      <a-empty :image="simpleImage" v-else />
    </a-spin>
    <sysDepart-modal ref="sysDepartModal" @ok="modalFormOk"></sysDepart-modal>
  </a-card>
</template>

<script>
import SysDepartModal from './modules/DepartModal2'
import { queryDepartTreeList } from '@/api/api'
import { deleteAction } from '@/api/manage'
import { Empty } from 'ant-design-vue'

// 表头
const columns = [
  {
    title: '机构名称',
    dataIndex: 'departName',
    width: 250,
    align: 'left',
    ellipsis: true,
  },
  {
    title: '机构编码',
    dataIndex: 'orgCode',
    width: 120,
    align: 'left',
    ellipsis: true,
  },
  {
    title: '银企通企业编号',
    dataIndex: 'fax',
    width: 120,
    align: 'left',
    ellipsis: true,
  },
  {
    title: '联系电话',
    dataIndex: 'mobile',
    width: 120,
    align: 'left',
    ellipsis: true,
  },

  {
    title: '地址',
    dataIndex: 'address',
    width: 120,
    align: 'left',
    ellipsis: true,
  },

  {
    title: '操作',
    align: 'center',
    dataIndex: 'action',
    width: 120,
    align: 'left',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'DepartList2',
  components: {
    SysDepartModal,
  },
  data() {
    return {
      description: 'jeecg 生成SysDepart代码管理页面',
      // 查询条件
      queryParam: {},
      //数据集
      factories: '',
      dataSource: [],
      columns: columns,
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
      url: {
        list: '/sys/sysDepart/list',
        delete: '/sys/sysDepart/delete',
        deleteBatch: '/sys/sysDepart/deleteBatch',
      },
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      queryDepartTreeList().then((res) => {
        if (res.success) {
          this.dataSource = res.result
        }
        this.loading = false
      })
    },

    getQueryField() {
      //TODO 字段权限控制
      var str = 'id,'
      for (var a = 0; a < this.columns.length; a++) {
        str += ',' + this.columns[a].dataIndex
      }
      return str
    },
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    //TODO getQueryParams
    handleDelete: function (id) {
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleDetail(record) {
      this.$refs.sysDepartModal.edit(record)
      this.$refs.sysDepartModal.title = '详情'
      this.$refs.sysDepartModal.disableSubmit = true
    },
    batchDel: function () {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: '确认删除',
          content: '是否删除选中数据?',
          onOk: function () {
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            })
          },
        })
      }
    },
    handleEdit: function (record) {
      this.$refs.sysDepartModal.edit(record)
      this.$refs.sysDepartModal.title = '编辑'
    },
    handleAdd() {
      this.$refs.sysDepartModal.add()
      this.$refs.sysDepartModal.title = '新增'
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      console.log(sorter)
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = 'ascend' == sorter.order ? 'asc' : 'desc'
      }
      /*this.ipagination = pagination;*/
      this.loadData()
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>