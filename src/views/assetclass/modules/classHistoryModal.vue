<template>
  <j-modal :title="title" :width="width" :visible="visible" switchFullscreen :footer="null" @cancel="handleCancel">
    <a-spin :spinning="loading">
      <ul class="history-item">
        <li v-for="(item, index) of dataSource" :key="index">
          <div class="history-item-header">
            <span class="name">{{ item.xm }}</span>
            <!-- <span class="tag" :class="{ 'tag-ative': item.status === 1 }">{{
              item.status === 1 ? '已生效' : '变更申请'
            }}</span> -->
            <!-- <span class="header-right" @click="pushDetails(item)">查看详情>></span> -->
          </div>
          <div class="history-item-time">
            资产分类结果：
            <span v-if="item.status === 3">{{ item.tzzcfl | typeFormat(zcfl) }}</span>
            <span v-else>{{ item.xtzcfl | typeFormat(zcfl) }}</span>
          </div>
          <div class="history-item-time">资产分类月份：{{ item.month }}</div>
          <div class="history-item-time">分类时间：{{ item.updateTime }}</div>
        </li>
        <p class="history-empty" v-if="dataSource.length === 0">暂无数据</p>
      </ul>
    </a-spin>
  </j-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import { zcfl } from '@/utils/dictionary'

export default {
  data() {
    return {
      title: '历史分类记录',
      width: 460,
      visible: false,
      loading: false,
      dataSource: [],
      record: {},
      zcfl,
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
      url: {
        queryListByTaskId: '/credit/xTaskAsset/queryListByTaskId',
      },
    }
  },
  methods: {
    init(record) {
      this.record = record
      this.loadData()
      this.visible = true
    },
    loadData() {
      const param = {
        taskId: this.record.taskId,
      }
      this.loading = true
      getAction(this.url.queryListByTaskId, param).then((res) => {
        if (res.success && res.result) {
          this.dataSource = res.result.reverse()
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    // pushDetails(record) {
    //   this.$emit('ok', record)
    //   this.close()
    // },
    close() {
      this.visible = false
    },
    handleOk() {
      this.close()
    },
    handleCancel() {
      this.close()
    },
  },
}
</script>
<style lang="less">
.history-empty {
  width: 100%;
  margin-top: 50px;
  text-align: center;
  font-size: 14px;
  color: #cdcdcd;
}
.history-item {
  list-style: none;
  display: block;
  position: relative;
  padding: 0 11px;
  margin: 0;
  min-height: 200px;
  max-height: 800px;
  overflow-y: auto;
  li {
    position: relative;
    display: block;
    width: 100%;
    padding: 0 0 32px 31px;
    .history-item-header {
      display: inline-block;
      width: 100%;
      .name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 22px;
      }
      .tag {
        height: 20px;
        background: #ddecfd;
        border-radius: 2px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3990ed;
        padding: 1px 4px;
        line-height: 17px;
        margin-left: 8px;
        vertical-align: text-bottom;
      }
      .tag-ative {
        color: #00b700;
        background: #c2eec2;
      }
      .header-right {
        cursor: pointer;
        float: right;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6a82c3;
        line-height: 20px;
      }
    }
    .history-item-time {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #7d7d7d;
      line-height: 20px;
      margin-top: 10px;
    }
    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4262ba;
      position: absolute;
      top: 7px;
      left: 0;
    }
    &:not(:last-child):after {
      content: '';
      display: block;
      width: 2px;
      height: 100%;
      background: #4262ba;
      position: absolute;
      top: 15px;
      left: 3px;
    }
  }
}
</style>