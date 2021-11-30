<template>
  <a-row :gutter="0" style="padding: 0 16px">
    <a-col :span="8">
      <a-checkbox v-model="timeChecked" :disabled="disabled" @change="checkChange"> 长期 </a-checkbox>
    </a-col>
    <a-col :span="16">
      <a-date-picker
        :disabled="disabled"
        v-if="!timeChecked"
        v-model="timeData"
        :format="format"
        @change="dateChange"
      />
    </a-col>
  </a-row>
</template>
<script>
import moment from 'moment'
export default {
  name: 'checkDate',
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD',
    },
  },
  data() {
    return {
      timeChecked: false,
      timeData: null,
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.timeData = null
        this.timeChecked = false
      } else if (val === '2099-12-31 00:00:00') {
        this.timeChecked = true
      } else {
        this.timeData = val ? moment(val) : null
      }
    },
  },
  methods: {
    checkChange(value) {
      this.$emit('change', value.target.checked ? '2099-12-31 00:00:00' : undefined)
    },
    dateChange(value) {
      this.$emit('change', value ? moment(value).format(this.format) : undefined)
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>
<style lang="less">
</style>
