<template>
  <div class="page-xtasklist-account">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 贷款管理 </a-breadcrumb-item>
        <a-breadcrumb-item> 台账 </a-breadcrumb-item>
      </a-breadcrumb>
      <PageTitle fontSize="20px" style="margin: 10px 0">
        <div slot="title" class="header-tabs">
          <a :class="{ ative: tabsAtive === '0' }" @click="tabsAtive = '0'">客户信息</a>
          <a :class="{ ative: tabsAtive === '1' }" @click="tabsAtive = '1'">贷款信息</a>
          <a :class="{ ative: tabsAtive === '2' }" @click="tabsAtive = '2'">用途信息</a>
        </div>
        <a-button @click="$router.back()">返回</a-button>
      </PageTitle>
    </a-card>

    <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0' }">
      <a-tabs v-model="tabsAtive" class="com-tabs1">
        <a-tab-pane key="0" tab="客户信息" forceRender>
          <XCustomerInfoDetails ref="XCustomerInfoDetails" :viewType="1" :dataId="customerId"></XCustomerInfoDetails>
        </a-tab-pane>
        <a-tab-pane key="1" tab="贷款信息" forceRender>
          <account2 ref="用途信息" style="padding: 16px"></account2>
        </a-tab-pane>
        <a-tab-pane key="2" tab="合作方所需信息" forceRender>
          <account3 ref="account3" ></account3>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import account2 from './account/account2'
import account3 from './account/account3'
import XCustomerInfoDetails from '../customer/XCustomerInfoDetails'

export default {
  components: {
    account2,
    account3,
    XCustomerInfoDetails,
  },
  data() {
    return {
      loading: false,
      tabsAtive: '0',
      customerId: Number(this.$route.query.customerId),
    }
  },
  created() {},
  methods: {},
}
</script>
<style lang="less">
.page-xtasklist-account {
  position: relative;
  .header-tabs {
    display: inline-block;
    a {
      position: relative;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
      text-decoration: none;
      margin-right: 54px;
    }
    .ative {
      font-weight: 600;
      color: #4664b4;
      &::after {
        content: '';
        width: 100%;
        height: 3px;
        background: #4664b4;
        border-radius: 3px;
        position: absolute;
        bottom: -16px;
        left: 0;
      }
    }
  }
  .com-tabs1 {
    width: 100%;
    min-height: 589px;
    .ant-tabs-bar {
      display: none;
    }
  }
}
</style>