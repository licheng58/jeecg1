<template>
  <a-select :value="selVal"
            :placeholder="placeholder"
            :disabled="disabled"
            @select="handleSelect"
            @change="handleChange"
            showSearch
            @focus="onFocus"
            :filterOption="false"
            @search="getDataSource"
            :notFoundContent="fetching ? undefined : fetchMsg"
            allowClear>
    <a-spin v-if="fetching"
            slot="notFoundContent"
            size="small" />
    <a-select-option v-for="(item, index) in dataSource"
                     :key="index"
                     :value="item[valueCode]">{{
      item[valueCode]
    }}</a-select-option>
  </a-select>
</template>
<script>
import debounce from 'lodash.debounce'
import { getAction } from '@/api/manage'

export default {
  name: 'CustomerSelect',
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    valueCode: {
      type: String,
      default: 'code',
      required: false,
    },
    //1 客户模糊查询 (编号,加盟酒店店名)
    //2 贷款流水号模糊查询
    type: {
      type: Number,
      default: 1,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 是否为新开酒店
    ifNew: {
      type: String,
      default: '',
    },
  },
  data() {
    this.lastFetchId = 0
    this.getDataSource = debounce(this.getDataSource, 800)
    return {
      fetching: false,
      fetchMsg: null,
      dataSource: [],
      selVal: undefined,
      url: {
        queryCustomerByLike: '/credit/xTask/queryCustomerByLike', //客户模糊查询 (编号,加盟酒店店名)
        queryCustomerByLike1: '/credit/xTask/queryTaskByLike', //贷款流水号模糊查询
      },
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.selVal = undefined
      } else {
        this.selVal = val
      }
    },
  },
  methods: {
    getDataSource(value) {
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataSource = []
      this.fetching = true
      let url = this.url.queryCustomerByLike
      let param = {
        content: value,
        type: this.valueCode === 'code' ? 1 : 2,
        ifNew: this.ifNew,
      }
      //修改参数
      if (this.type === 2) {
        url = this.url.queryCustomerByLike1
        param = {
          content: value,
        }
      }
      getAction(url, param).then((res) => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        if (res.success) {
          this.dataSource = res.result
        }
        this.fetchMsg = this.dataSource.length === 0 ? '未查询到相关数据' : ''
        this.fetching = false
      })
    },
    onFocus() {
      if (this.dataSource.length === 0) {
        this.getDataSource('')
      }
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    handleSelect(key, option) {
      let index = option.data.key
      let data = this.dataSource[index]
      this.$emit('select', data)
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>
