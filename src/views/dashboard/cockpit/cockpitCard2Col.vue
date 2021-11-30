<template>
  <div class="card-col">
    <div class="card-col-header">
      {{ type | titleFormat }}
    </div>
    <ul class="card-col-content">
      <li v-for="(item, index) of dataSource" :key="index">
        <div class="li-header">
          <span class="index" :class="{ ative: index < 3 }">{{ index + 1 }}</span>
          <span class="title" v-if="ptype === 2">{{ item.name | distFormat('brand_types') }}</span>
          <span class="title" v-else>{{ item.name }}</span>
          <span class="sum fr"
            >{{ item.count | numberFormat(2, type === 3 ? '%万%' : '') }}({{ type === 3 ? '万' : '笔' }})</span
          >
        </div>
        <a-slider :default-value="item.rate" :disabled="true" :class="`slider${type}`" />
      </li>
      <a-empty :image="simpleImage" v-if="dataSource.length === 0" />
    </ul>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import CAL from '@/utils/calculation'
import { numCal } from '@/utils/util'

export default {
  props: {
    type: {
      type: Number,
      default: 1,
    },
    ptype: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dataSource: [],
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  methods: {
    init(dataSource) {
      if (dataSource) {
        this.dataSource = dataSource.map((item) => {
          return {
            name: item.name,
            count: item.zcount ? item.zcount : 0,
            rate: numCal(CAL.accDiv(item.zcount, item.isYydh), 0, '%'),
          }
        })
      }
    },
  },
  filters: {
    titleFormat(type) {
      return type === 1 ? '申请笔数' : type === 2 ? '放款笔数' : '信贷投放'
    },
  },
}
</script>
<style lang="less">
.card-col {
  background: #ffffff;
  padding: 16px 0;
  .card-col-header {
    margin: 0 17px 22px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    padding-left: 12px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 18px;
      background: #4664b4;
      border-radius: 2px;
      position: absolute;
      top: 50%;
      left: 0;
      margin-top: -9px;
    }
  }
  .card-col-content {
    list-style: none;
    margin: 0;
    min-height: 150px;
    padding: 0 29px;
    li {
      list-style: none;
      padding: 0;
      margin: 0;
      .li-header {
        line-height: 20px;
        .index {
          display: inline-block;
          width: 18px;
          height: 18px;
          font-size: 12px;
          font-weight: 500;
          border-radius: 50%;
          color: #535455;
          background: #f4f5f8;
          text-align: center;
          line-height: 18px;
        }
        .ative {
          color: #ffffff;
          background: #ee5d5d;
        }
        .title {
          display: inline-block;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #1b1617;
          line-height: 20px;
          margin-left: 11px;
        }
        .sum {
          float: right;
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1b1617;
          line-height: 20px;
        }
      }
      .ant-slider {
        margin: 10px 0 16px;
        .ant-slider-rail {
          height: 8px;
          background: #f4f5f8;
          border-radius: 8px;
        }
        .ant-slider-track {
          height: 8px;
        }
        .ant-slider-step {
          height: 8px;
        }
        .ant-slider-handle {
          margin-top: -4px;
        }
      }
      .slider1 .ant-slider-track {
        background: #fdc85c !important;
      }
      .slider2 .ant-slider-track {
        background: #7088c6 !important;
      }
      .slider3 .ant-slider-track {
        background: #57d4e9 !important;
      }
    }
  }
}
</style>