<template>
  <div class="page-xtasklist-details">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 贷款管理 </a-breadcrumb-item>
        <a-breadcrumb-item> 处理 </a-breadcrumb-item>
      </a-breadcrumb>
      <PageTitle title="贷款办理" fontSize="20px">
        <a-button @click="$router.back()">返回</a-button>
        <!-- <a-button v-if="stepsAtive > 0" @click="upStep">上一步</a-button> -->
        <!-- <a-button v-if="stepsAtive < 1" type="primary" @click="downStep">下一步</a-button> -->
        <a-button v-if="isEdit" type="primary" :loading="loading" @click="submit">提交</a-button>
      </PageTitle>
    </a-card>
    <a-spin :spinning="loading">
      <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0' }">
        <a-steps :current="stepsAtive" class="com-steps" @change="onChange">
          <a-step title="贷款申请信息" />
          <a-step title="授信页面" />
          <a-step title="完成" disabled />
        </a-steps>
        <a-tabs default-active-key="0" v-model="tabsAtive" class="com-tabs">
          <a-tab-pane key="0" tab="贷款申请信息" forceRender>
            <step4 ref="step4"></step4>
          </a-tab-pane>
          <a-tab-pane key="1" tab="授信页面" forceRender>
            <step5 ref="step5"></step5>
            <step6 ref="step6"></step6>
          </a-tab-pane>
          <a-tab-pane key="2" tab="完成" forceRender> </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>
  </div>
</template>

<script>
import { getAction, postAction, putAction } from '@/api/manage'
import step4 from './steps/step4'
import step5 from './steps/step5'
import step6 from './steps/step6'

export default {
  components: {
    step4,
    step5,
    step6,
  },
  data() {
    return {
      loading: false,
      isEdit: false,
      type: Number(this.$route.query.type),
      id: Number(this.$route.query.id),
      stepsAtive: 0,
      tabsAtive: '0',
      xTask: null,
      userList: [],
      url: {
        queryById: '/credit/xTask/queryById',
        checkTask: '/credit/xTask/checkTask', //协查
        examinationTask: '/credit/xTask/examinationTask', //审查
        approvalTask: '/credit/xTask/approvalTask', //审批
      },
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      let param = {
        id: this.id,
      }
      this.loading = true
      getAction(this.url.queryById, param).then((res) => {
        if (res.success) {
          this.isEdit = res.result.ifBan
          this.xTask = res.result.xtask
          this.$refs.step4.init(res.result)
          this.$refs.step5.init(this.xTask, this.isEdit)
          this.$refs.step6.init(res.result.xtaskAudits, res.result.xtaskAudit, this.isEdit)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },

    upStep() {
      this.stepsAtive--
      this.tabsAtive = this.stepsAtive + ''
    },
    downStep() {
      this.stepsAtive++
      this.tabsAtive = this.stepsAtive + ''
    },
    onChange(current) {
      this.stepsAtive = current
      this.tabsAtive = current + ''
    },

    submit() {
      // let step4Data = this.$refs.step4.getData()
      let step5Data = this.$refs.step5.getData()
      let step6Data = this.$refs.step6.getData()
      if (!step5Data || !step6Data) {
        return
      }
      let param = {}
      param.xtask = Object.assign({}, this.xTask, step5Data)
      param.xtaskAudit = step6Data
      if (step6Data.nextUserId) {
        param.nextUserId = step6Data.nextUserId
      }
      let url = this.url.checkTask
      if (param.xtask.status === 2) {
        url = this.url.examinationTask
      }
      if (param.xtask.status === 3) {
        url = this.url.approvalTask
      }
      this.loading = true
      putAction(url, param)
        .then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$router.back()
          } else {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.$message.warning('操作失败!')
          this.loading = false
        })
    },
  },
}
</script>
<style lang="less">
.page-xtasklist-details {
  position: relative;
  .com-steps {
    width: 60%;
    min-width: 520px;
    margin: 25px auto 30px;
  }
  .com-tabs {
    width: 100%;
    min-height: 589px;
    .ant-tabs-bar {
      display: none;
    }
  }
}
</style>