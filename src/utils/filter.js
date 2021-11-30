import Vue from "vue";
import * as dayjs from "dayjs";
import { filterDictTextByCache } from '@/components/dict/JDictSelectUtil'

// vue3.0 filter已经废弃

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) {
    return ""
  }
  return dayjs(dataStr).format(pattern)
})

/** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function (value, vlength = 25) {
  if (!value) {
    return "";
  }
  console.log('vlength: ' + vlength);
  if (value.length > vlength) {
    return value.slice(0, vlength) + '...'
  }
  return value
})

Vue.filter('typeFormat', function (dataStr, types, emityReturn = "") {
  if (dataStr === '' || dataStr === undefined || dataStr === null) {
    return emityReturn
  }
  if (!types) {
    return dataStr
  }
  if (Array.isArray(types)) {
    let obj = {}
    types.map(item => {
      obj[item.value + ''] = item.name
    })
    types = obj
  }
  try {
    return types[dataStr + '']
  } catch (error) {
    return ''
  }
})

Vue.filter('distFormat', function (dataStr, dictCode, emityReturn = "") {
  if (dataStr === '' || dataStr === undefined || dataStr === null) {
    return emityReturn
  }
  return filterDictTextByCache(dictCode, dataStr)
})

Vue.filter('cqdateFormat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss', emityReturn = "") {
  if (dataStr === '' || dataStr === undefined || dataStr === null) {
    return emityReturn
  }
  if (dataStr === '2099-12-31 00:00:00') {
    return '长期'
  }
  return dayjs(dataStr).format(pattern)
})
//isPositive 是否负数转正数
Vue.filter('NumberFormat', function (value, point = 0, unit = '', isPositive = false) {
  try {
    if (value === null || value === undefined || value === '' || value === 0) {
      return 0
    }
    value = Number(value + '')
    if (isPositive) {
      value = Math.abs(value)
    }
    if (unit === '%') {
      value = value * 100
    }
    if (unit === "%万%") {
      value = value / 10000
    }
    if (point > 0) {
      value = Math.round(value * Math.pow(10, point)) / Math.pow(10, point); // point 幂   
    }
    let numArr = value.toString().split('.')
    let numStr = numArr[0].replace(/,/g, "")//输入框 第二次调用 去掉逗号
    let intPartFormat = numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
    if (numArr.length >= 2) {
      intPartFormat = intPartFormat + '.' + numArr[1]
    }
    if (unit && unit !== "%万%") {
      intPartFormat = intPartFormat + unit
    }
    return intPartFormat
  } catch (error) {
    return 0
  }

})
//整数部分逢三一断
Vue.filter('inputFormat', function (value, type = 'number') {
  try {
    if (type === 'text' || isNaN(Number(value))) {
      return value
    }
    let numArr = value.toString().split('.')
    let numStr = numArr[0].replace(/,/g, "")//输入框 第二次调用 去掉逗号
    let intPartFormat = numStr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
    if (numArr.length >= 2) {
      intPartFormat = intPartFormat + '.' + numArr[1]
    }
    return intPartFormat
  } catch (error) {
    return value
  }

})