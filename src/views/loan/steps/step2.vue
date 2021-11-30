<template>
  <StandardTable
    ref="MyTable"
    size="middle"
    rowKey="id"
    :bordered="false"
    :loadUrl="url.list"
    :queryParam="queryParam"
    :columns="columns"
    :rowSelection="{
      selectedRowKeys: this.selectedRowKeys,
      hideDefaultSelections: true,
      onChange: (selectedRowKeys, selectedRows) => {
        this.handleSelectionChange(selectedRowKeys, selectedRows)
      },
      getCheckboxProps: (record) => ({
        props: {
          disabled: type === 2,
        },
      }),
    }"
    :scroll="{ x: 1140 }"
    @getResult="getResult"
  >
    <span slot="jxfsSolt" slot-scope="text, record">
      <a-select
        style="width: 100%"
        v-model="record.jxfs1"
        placeholder="请选择计息方式"
        @select="jxfsSelect"
        allowClear
        :disabled="type === 2"
      >
        <a-select-option v-for="(item, index) of formatTypes(record.jxfs)" :key="index" :value="item">{{
          item
        }}</a-select-option>
      </a-select>
    </span>
    <span slot="hkfsSolt" slot-scope="text, record">
      <a-select
        style="width: 100%"
        v-model="record.hkfs1"
        placeholder="请选择还款方式"
        @select="hkfsSelect"
        allowClear
        :disabled="type === 2"
      >
        <a-select-option v-for="(item, index) of formatTypes(record.hkfs)" :key="index" :value="item">{{
          item
        }}</a-select-option>
      </a-select>
    </span>
  </StandardTable>
</template>
<script>
import pick from 'lodash.pick'
import { ywbz } from '@/utils/dictionary'

export default {
  components: {},
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        hideDefaultSelections: true,
        onChange: (selectedRowKeys, selectedRows) => {
          this.handleSelectionChange(selectedRowKeys, selectedRows)
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: type === 2,
          },
        }),
      }
    },
  },
  data() {
    return {
      loading: false,
      queryParam: {
        ywpz: '个人贷款',
      },
      record: {},
      selectedRowKeys: [],
      selectionRows: [],
      columns: [
        {
          title: '融资机构名称',
          align: 'left',
          width: 120,
          dataIndex: 'partnerName',
          ellipsis: true,
        },

        {
          title: '合作方产品',
          align: 'left',
          width: 120,
          dataIndex: 'partnerProName',
          ellipsis: true,
        },
        {
          title: '业务品种',
          align: 'left',
          width: 120,
          dataIndex: 'ywpz',
          ellipsis: true,
        },
        {
          title: '业务币种',
          align: 'left',
          width: 120,
          dataIndex: 'ywbz',
          ellipsis: true,
        },
        {
          title: '额度上限(万)',
          align: 'left',
          width: 120,
          dataIndex: 'dkedsx',
          ellipsis: true,
        },

        {
          title: '贷款利率(%)',
          align: 'left',
          width: 120,
          dataIndex: 'dkll',
          ellipsis: true,
        },

        {
          title: '贷款期限(月)',
          align: 'left',
          width: 120,
          dataIndex: 'dkqx',
          ellipsis: true,
        },
        {
          title: '计息方式',
          align: 'center',
          width: 150,
          dataIndex: 'jxfs',
          scopedSlots: { customRender: 'jxfsSolt' },
        },
        {
          title: '还款方式',
          align: 'center',
          width: 150,
          dataIndex: 'hkfs',
          scopedSlots: { customRender: 'hkfsSolt' },
        },
      ],
      url: {
        list: '/credit/xPartnerInfo/list',
      },
    }
  },
  computed: {
    formatTypes() {
      return function (typeStr) {
        if (typeStr === null || typeStr === undefined || typeStr === '') {
          return []
        }
        return typeStr.split(',')
      }
    },
  },
  methods: {
    init(record) {
      if (record && record.partnerId) {
        this.record = record
        this.queryParam.id = record.partnerId
        this.queryParam.ywpz = record.customerType === '1' ? '个人贷款' : '对公贷款'
        this.$refs.MyTable.reload()
      }
    },
    cusTypeChange(type) {
      this.queryParam.id = null
      this.queryParam.ywpz = type === '1' ? '个人贷款' : '对公贷款'
      this.selectedRowKeys = []
      this.selectionRows = []
      this.$refs.MyTable.reload()
    },
    getResult(data) {
      if (data.records.length > 0 && this.queryParam.id) {
        if (this.record.jxfs) {
          data.records[0].jxfs1 = this.record.jxfs
        }
        if (this.record.hkfs) {
          data.records[0].hkfs1 = this.record.hkfs
        }
        this.$nextTick(() => {
          this.selectedRowKeys = [this.record.partnerId]
          this.selectionRows = data.records
        })
      }
    },
    handleSelectionChange(selectedRowKeys, selectionRows) {
      if (selectedRowKeys.length === 0 && this.queryParam.id) {
        this.queryParam.id = null
        this.$refs.MyTable.reload()
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows

      //是否显示 建行个贷 的合作方
      this.$emit(
        'showChange',
        this.selectionRows.some((item) => item.partnerName === '建设银行' && item.partnerProName === '个人快贷')
      )
    },

    jxfsSelect(value) {
      this.$forceUpdate()
    },
    hkfsSelect(value) {
      this.$forceUpdate()
    },
    getData(status) {
      if (status === 1 && this.selectionRows.length !== 1) {
        this.$message.warning('请选择一个合作方产品!')
        return false
      } else if (status === 0 && this.selectionRows.length !== 1) {
        return null
      }
      let data = Object.assign({}, this.selectionRows[0])
      if (status === 1 && !data.jxfs1) {
        this.$message.warning('请选择合作方计息方式!')
        return false
      }
      if (status === 1 && !data.hkfs1) {
        this.$message.warning('请选择合作方还款方式!')
        return false
      }
      data.jxfs = data.jxfs1 ? data.jxfs1 : ''
      data.hkfs = data.hkfs1 ? data.hkfs1 : ''
      data.amountMax = Number(data.dkedsx)
      data.ll = Number(data.dkll)
      data.partnerId = data.id
      return pick(
        data,
        'partnerId',
        'partnerName',
        'partnerProName',
        'ywpz',
        'ywbz',
        'amountMax',
        'dkqx',
        'll',
        'jxfs',
        'hkfs'
      )
    },
  },
}
</script>