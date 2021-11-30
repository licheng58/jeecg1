<template>
  <a-input v-model="inputVal"
           :placeholder="placeholder ? placeholder : ''"
           :suffix="unit ? unit : ''"
           :disabled="disabled" />
</template>
<script>
export default {
  name: 'comInput',
  props: {
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
    value: {
      type: String | Number,
      required: false,
    },
    //text number
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    unit: {
      type: String,
      default: '',
    },
  },
  computed: {
    inputVal: {
      get: function () {
        if (this.type === 'text') {
          return this.dataVal
        }
        let numArr = this.dataVal.toString().split('.')
        let numStr = numArr[0].replace(/,/g, '') //输入框 第二次调用 去掉逗号
        let intPartFormat = numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
        if (numArr.length >= 2) {
          intPartFormat = intPartFormat + '.' + numArr[1]
        }
        return intPartFormat
      },
      set: function (value) {
        if (this.type === 'text') {
          this.dataVal = value ? value : ''
        } else {
          this.dataVal = !value && value != 0 ? '' : value.replace(/,/g, '')
        }
      },
    },
  },
  data() {
    return {
      dataVal: '',
    }
  },
  created() {
    //赋值 0 的时候 value 监听不到 直接在显示的时候先默认给个0
    if (this.disabled && this.type === 'number') {
      this.dataVal = 0
    }
  },
  watch: {
    value(val) {
      this.dataVal = val || val === 0 ? val : ''
    },
    inputVal(value) {
      // if (value === '-') {
      //   return
      // }
      if (this.type === 'text') {
        this.$emit('change', this.dataVal)
      } else {
        let num = Number(this.dataVal)
        if ((!this.dataVal && this.dataVal !== 0) || isNaN(num)) {
          this.dataVal = ''
          this.$emit('change', undefined)
        } else {
          this.$emit('change', num)
        }
      }
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
