<template>
  <div class="page-customer-details">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }" v-if="viewType === 0">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 客户管理 </a-breadcrumb-item>
        <a-breadcrumb-item> {{ type | titleFormat }} </a-breadcrumb-item>
      </a-breadcrumb>
      <div></div>
      <PageTitle :title="type | titleFormat" fontSize="20px">
        <a-button @click="$router.back()">返回</a-button>
        <!-- <a-button disabled>发起贷款申请</a-button> -->
        <a-button type="primary" @click="save(1)" v-if="type === 0" :loading="loading">完成建档</a-button>
        <a-button type="primary" @click="save(0)" v-if="type === 0" :loading="loading"> 保 存</a-button>
        <a-button type="primary" @click="openSelectUserModal" v-if="type === 3" :loading="loading"> 申请修改</a-button>
        <a-button type="primary" @click="examine(1)" v-if="type === 1 && ifCheck === 1" :loading="loading">
          同意
        </a-button>
        <a-button type="danger" @click="examine(0)" v-if="type === 1 && ifCheck === 1" :loading="loading">
          拒绝
        </a-button>
      </PageTitle>
    </a-card>
    <a-spin :spinning="loading">
      <a-card
        :bordered="false"
        :style="{ margin: viewType === 0 ? '16px' : '0' }"
        :body-style="{ margin: '0', padding: '0' }"
      >
        <a-tabs default-active-key="1" class="com-tabs">
          <a-tab-pane key="1" tab="门店基础信息" forceRender>
            <cardDetails1 ref="cardDetails1" :type="type" :viewType="viewType" @nzjChange="nzjChange"></cardDetails1>
          </a-tab-pane>
          <a-tab-pane key="2" tab="门店运营数据" forceRender>
            <cardDetails2 ref="cardDetails2" :type="type" :viewType="viewType"></cardDetails2>
          </a-tab-pane>
          <a-tab-pane key="3" tab="投资人信息" forceRender>
            <cardDetails3 ref="cardDetails3" :type="type" :viewType="viewType"></cardDetails3>
          </a-tab-pane>
          <a-tab-pane key="4" tab="其他附件" forceRender>
            <cardDetails4 ref="cardDetails4" :type="type" :viewType="viewType"></cardDetails4>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>
    <selectUserModal ref="selectUserModal" @ok="selectUserOk" :sysUsers="sysUsers"></selectUserModal>
  </div>
</template>

<script>
import cardDetails1 from './cardDetails/cardDetails1'
import cardDetails2 from './cardDetails/cardDetails2'
import cardDetails3 from './cardDetails/cardDetails3'
import cardDetails4 from './cardDetails/cardDetails4'

import selectUserModal from './modules/selectUserModal'

import { putAction, getAction, postAction } from '@/api/manage'

export default {
  name: 'XCustomerInfoDetails',
  components: {
    cardDetails1,
    cardDetails2,
    cardDetails3,
    cardDetails4,
    selectUserModal,
  },
  props: {
    //查看
    viewType: {
      type: Number,
      default: 0,
    },
    dataId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      type: 1,
      id: null,
      ifCheck: 0,
      isView: true,
      sysUsers: [],
      customerUpdateAudit: null,
      url: {
        edit: 'credit/xCustomerInfo/edit',
        add: 'credit/xCustomerInfo/add',
        queryPortraitByCustomerId: '/credit/xCustomerInfoMainLog/queryPortraitByCustomerId', //查看
        queryRecordInfo: '/credit/xCustomerInfoMainLog/queryRecordInfo', //建档信息
        auditUpdate: '/credit/xCustomerInfo/auditUpdate',
        queryCustomerHistoryDetail: '/credit/xCustomerInfoMainLog/queryCustomerHistoryDetail',
      },
    }
  },
  created() {
    this.type = Number(this.$route.query.type)
    if (this.$route.query.id) {
      this.id = Number(this.$route.query.id)
    }
    //台账页面嵌套
    if (this.viewType === 1) {
      this.type = 1
      this.id = this.dataId
    }
    this.init()
  },

  methods: {
    //type  0 新增 修改 1 查看   2 查看建档信息 3 申请修改  4 查看更改记录
    init() {
      switch (this.type) {
        case 0:
        case 1:
        case 3:
          if (this.id) {
            this.getDetails(this.url.queryPortraitByCustomerId)
          }
          break
        case 2:
          this.getDetails(this.url.queryRecordInfo)
          break
        case 4:
          this.getDetails(this.url.queryCustomerHistoryDetail)
          break
      }
    },
    getDetails(url) {
      let param = {
        customerId: this.id,
      }
      if (this.type === 4) {
        param = {
          customerMainLogId: this.id,
        }
      }
      this.loading = true
      getAction(url, param).then((res) => {
        if (res.success) {
          this.initCardDetails(res.result)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    initCardDetails(data) {
      if (data) {
        this.sysUsers = data.sysUsers
        this.ifCheck = data.ifCheck
        this.customerUpdateAudit = data.customerUpdateAudit
        data.xcustomerInfo.role = data.role
        data.xcustomerInfo.ifCheck = data.ifCheck
        this.$refs.cardDetails1.init(data.xcustomerInfo)
        this.$refs.cardDetails2.init(data.xcustomerOperationStatus, data.xcustomerInfo, data.xcustomerCompanySales)
        this.$refs.cardDetails3.init(data.xcustomerOtherInfos, data.xcustomerInfo)
        this.$refs.cardDetails4.init(data.xcustomerFiles, data.xcustomerInfo)
      }
    },

    save(flag, data) {
      if (this.loading) {
        return
      }
      //必填类型 1必填
      let type = [1, 2].includes(flag) ? 1 : 0
      let param = {
        xcustomerInfo: this.$refs.cardDetails1.getData(type),
        xcustomerOperationStatus: this.$refs.cardDetails2.getData(type),
        xcustomerOtherInfos: this.$refs.cardDetails3.getData(type),
        xcustomerFiles: this.$refs.cardDetails4.getData(),
        xcustomerCompanySales: this.$refs.cardDetails2.getSales(),
      }
      if (type === 1 && (!param.xcustomerInfo || !param.xcustomerOperationStatus || !param.xcustomerOtherInfos)) {
        return
      }
      if (!param.xcustomerInfo || !param.xcustomerInfo.code) {
        this.$message.warning('请输入门店编号!')
        return
      }
      // if (type === 1 && !param.xcustomerCompanySales.length === 0) {
      //   this.$message.warning('请上传月销售数据!')
      //   return
      // }
      param.xcustomerInfo.status = flag
      if (flag === 2) {
        param.checkId = data.userId
        param.xcustomerInfo.createReson = data.createReson
      }
      if (flag === 1) {
        //建档时更新原因
        param.xcustomerInfo.createReson = '新建档案'
      }
      let urlStr = this.url.add
      let fn = postAction

      if (this.id) {
        urlStr = this.url.edit
        fn = putAction
        if (param.xcustomerOperationStatus) {
          param.xcustomerOperationStatus.customerId = this.id
        }
        if (param.xcustomerOtherInfos) {
          param.xcustomerOtherInfos.map((item) => {
            item.customerId = this.id
          })
        }
      }
      this.loading = true
      fn(urlStr, param).then((res) => {
        if (res.success) {
          if ([1, 2].includes(flag)) {
            this.$router.back()
          }
          if (!this.id) {
            this.id = res.result.id
            this.$refs.cardDetails1.init(res.result)
          }
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    selectUserOk(data) {
      this.save(2, data)
    },
    openSelectUserModal() {
      this.$refs.selectUserModal.visible = true
    },
    examine(flag) {
      if (!this.customerUpdateAudit) {
        this.$message.warning('操作失败!')
        return
      }
      let param = Object.assign({}, this.customerUpdateAudit)
      param.auditResult = flag
      this.loading = true
      putAction(this.url.auditUpdate, param).then((res) => {
        if (res.success) {
          this.$router.back()
          this.$message.success(res.message)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    nzjChange(data) {
      this.$refs.cardDetails2.nzjChange(data)
    },
  },
  filters: {
    titleFormat(type) {
      let title = ''
      switch (type) {
        case 0:
          title = '新建客户'
          break
        case 1:
          title = '查看详情'
          break
        case 2:
          title = '建档信息'
          break
        case 3:
          title = '信息变更'
          break
        case 4:
          title = '查看详情'
          break
      }
      return title
    },
  },
}
</script>
<style lang="less">
.page-customer-details {
  position: relative;
  .upload-tag {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ff0000;
    line-height: 32px;
  }
  .com-tabs {
    .ant-tabs-bar {
      display: block !important;
      margin: 0;
    }
    .ant-tabs-nav-container {
      margin: 0;
      .ant-tabs-ink-bar {
        display: none !important;
      }
      .ant-tabs-tab {
        position: relative;
        margin: 0;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8d8d8e;
        line-height: 22px;
        padding: 14px 24px;
        &::after {
          content: '';
          display: block;
          width: 1px;
          height: 18px;
          background: #b9bfc5;
          position: absolute;
          top: 50%;
          left: 1px;
          margin-top: -9px;
        }
        &:first-of-type::after {
          display: none;
        }
      }
      .ant-tabs-tab-active {
        color: #ffffff !important;
        background: #4262ba !important;
        &::after {
          display: none;
        }
      }
      .ant-tabs-tab-active + .ant-tabs-tab {
        &::after {
          display: none;
        }
      }
    }
    .ant-tabs-content {
      padding: 0 0 100px;
      min-height: 500px;
    }
  }

  .footer-descriptions {
    padding: 32px;
  }
}
</style>