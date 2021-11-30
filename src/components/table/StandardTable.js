import { filterObj } from '@/utils/util'
import { getAction } from '@/api/manage'
export default {
  props: {
    headTitle: {
      type: String,
      default: '',
    },
    loadUrl: {
      type: String,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    hasPagination: {
      type: Boolean,
      default: true,
    },
    queryParam: {
      type: Object,
      default() {
        return {}
      },
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    //是否事待办
    isTask: {
      type: Boolean,
      default: false,
    },
    hasSearch: {
      type: Boolean,
      default: false,
    },
    //是否创建后加载数据
    isLoad: {
      type: Boolean,
      default: true,
    },
    scroll: {
      type: Object,
      default() {
        return {}
      },
    },
    type: {
      type: String,
      default: 'checkbox',
    },
    rowSelection: {
      type: Object,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return ' 共 ' + total + ' 条记录 ' + range[0] + '-' + range[1]
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
      },
      dataSource: [],
      loading: false,
    }
  },
  created() {
    if (this.isLoad) {
      this.loadData()
    }
  },
  methods: {
    getQueryParams() {
      var param = Object.assign({}, this.queryParam)
      if (this.hasPagination) {
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
      }
      return filterObj(param)
    },
    loadData(flag) {
      if (flag === 1) {
        this.ipagination.current = 1
      }
      let that = this
      let params = that.getQueryParams() //查询条件
      that.loading = true
      getAction(that.loadUrl, params).then(
        (res) => {
          if (res.success) {
            if (res.result.hasOwnProperty('list')) {
              that.dataSource = res.result.list.records
              that.ipagination.total = res.result.list.total
            } else {
              if (this.isTask) {
                res.result.records.map(item => {
                  let obj = {}
                  if (item.context) {
                    try {
                      obj = JSON.parse(item.context)
                    } catch (error) {
                    }
                    obj.dataId = item.id
                  }
                  return Object.assign(item, obj)
                })
              }
              that.dataSource = res.result.records
              that.ipagination.total = res.result.total
            }
            this.$emit('getResult', res.result)
          } else {
            this.$message.warning(res.message)
          }
          that.loading = false
        },
        () => {
          that.loading = false
        }
      )
    },

    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    },

    onClearSelected() {
      this.$emit('onClearSelected')
    },
    reload() {
      this.onClearSelected()
      this.loadData(1)
    },
  },

  render(h) {

    const on = {
      change: this.handleTableChange
    }
    const props = {
      pagination: this.hasPagination ? this.ipagination : false,
      rowKey: this.rowKey,
      bordered: this.bordered,
      loading: this.loading,
      columns: this.columns,
      dataSource: this.dataSource,
      scroll: this.scroll,
      rowSelection: this.rowSelection,
    }
    let headerList = []
    headerList.push(h('div', { class: 'header-title' }, [this.$slots.header]))
    if (this.hasSearch) {
      headerList.push(h('div', { class: 'header-search' }, [this.$slots.sHeader]))
    }
    return h('div', { class: 'standard-table-container' }, [
      h('div', { class: 'table-container-header' }, headerList),
      h("a-table", {
        attrs: props,
        class: 'standard-table',
        on: on,
        scopedSlots: this.$scopedSlots
      }, this.$slots.default)
    ], this.$slots.default)

  }
};
