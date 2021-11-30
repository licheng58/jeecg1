<template>
  <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0 16px 16px' }">
    <a-tabs v-model="tabsAtive" class="com-tabs">
      <a-tab-pane key="5" forceRender>
        <span slot="tab">
          贷款办理
          <span v-if="num5 > 0">({{ num5 }})</span>
        </span>
        <XTaskList ref="XTaskList" :type="5" @ok="modalOk" :status="1"></XTaskList>
      </a-tab-pane>
      <a-tab-pane key="1" forceRender>
        <span slot="tab">
          贷款预警
          <span v-if="num1 > 0">({{ num1 }})</span>
        </span>
        <XWarningRecord ref="XWarningRecord" :type="1" @ok="modalOk" :status="1"></XWarningRecord>
      </a-tab-pane>
      <a-tab-pane key="6" forceRender>
        <span slot="tab">
          贷后检查
          <span v-if="num6 > 0">({{ num6 }})</span>
        </span>
        <xTaskAfterLoan ref="xTaskAfterLoan" :type="6" @ok="modalOk" :status="1"></xTaskAfterLoan>
      </a-tab-pane>
      <a-tab-pane key="7" forceRender>
        <span slot="tab">
          资产分类
          <span v-if="num7 > 0">({{ num7 }})</span>
        </span>
        <XTaskAssetList ref="XTaskAssetList" :type="7" @ok="modalOk" :status="1"></XTaskAssetList>
      </a-tab-pane>
      <a-tab-pane key="8" forceRender>
        <span slot="tab">
          资产保全
          <span v-if="num8 > 0">({{ num8 }})</span>
        </span>
        <XTaskAssetProtectionList
          ref="XTaskAssetProtectionList"
          :type="8"
          @ok="modalOk"
          :status="1"
        ></XTaskAssetProtectionList>
      </a-tab-pane>
      <a-tab-pane key="2" forceRender>
        <span slot="tab">
          黑名单
          <span v-if="num2 > 0">({{ num2 }})</span>
        </span>
        <XBlacklistList ref="XBlacklistList" :type="2" @ok="modalOk" :status="1"></XBlacklistList>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import XWarningRecord from './task/XWarningRecord'
import XTaskList from './task/XTaskList'
import XBlacklistList from './task/XBlacklistList'
import xTaskAfterLoan from './task/xTaskAfterLoan'
import XTaskAssetList from './task/XTaskAssetList'
import XTaskAssetProtectionList from './task/XTaskAssetProtectionList'
// * 代办类型
// * 预警管理 1
// * 黑名单 2
// * 预警解禁 3
// * 黑名单解禁 4
// * 订单贷款 5
// * 贷后报告 6
// * 资产分类 7
// * 资产保全 8
export default {
  components: {
    XWarningRecord,
    XTaskList,
    XBlacklistList,
    xTaskAfterLoan,
    XTaskAssetList,
    XTaskAssetProtectionList,
  },
  data() {
    return {
      loading: false,
      tabsAtive: '5',
      num1: 0,
      num2: 0,
      num5: 0,
      num6: 0,
      num7: 0,
      num8: 0,
    }
  },
  created() {
    if (this.$route.query.type) {
      this.tabsAtive = this.$route.query.type + ''
    }
  },
  methods: {
    modalOk(obj) {
      console.log(obj)
      switch (obj.type) {
        case 1:
          this.num1 = obj.total
          break
        case 2:
          this.num2 = obj.total
          break
        case 5:
          this.num5 = obj.total
          break
        case 6:
          this.num6 = obj.total
          break
        case 7:
          this.num7 = obj.total
          break
        case 8:
          this.num8 = obj.total
          break
      }
    },
  },
}
</script>
<style lang="less">
.page-xtasklist-account {
  .com-tabs {
    width: 100%;
    min-height: 589px;
    .ant-tabs-bar {
    }
  }
}
</style>