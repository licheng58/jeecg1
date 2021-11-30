<template>
  <div class="page-xtasklist-details">
    <a-card :bordered="false" :body-style="{ margin: '0px 0px 16px', padding: '16px 24px 0' }">
      <a-breadcrumb>
        <a-breadcrumb-item @click="$router.back()"> 贷款管理 </a-breadcrumb-item>
        <a-breadcrumb-item> 处理 </a-breadcrumb-item>
      </a-breadcrumb>
      <PageTitle :title="title" fontSize="20px">
        <a-button @click="$router.back()">返回</a-button>
        <!-- <a-button v-if="stepsAtive > 0" @click="upStep">上一步</a-button>
        <a-button v-if="stepsAtive < 2" type="primary" @click="downStep">下一步</a-button> -->
        <a-button v-if="type != 2" type="primary" :loading="loading" @click="submit(0)">保存</a-button>
        <a-button v-if="type != 2" type="primary" :loading="loading" @click="handleUser">提交</a-button>
      </PageTitle>
    </a-card>
    <a-spin :spinning="loading">
      <a-card :bordered="false" style="margin: 16px" :body-style="{ margin: '0', padding: '0' }">
        <a-steps :current="stepsAtive" class="com-steps" @change="onChange">
          <a-step title="贷款申请信息" />
          <a-step title="选择产品" />
          <a-step title="合作方所需信息" />
        </a-steps>
        <a-tabs v-model="tabsAtive" class="com-tabs">
          <a-tab-pane key="0" tab="贷款申请信息" forceRender>
            <step1 ref="step1" :type="type" @cusChange="cusChange" @cusTypeChange="cusTypeChange"></step1>
          </a-tab-pane>

          <a-tab-pane key="1" tab="选择产品" forceRender>
            <step2 ref="step2" :type="type" @showChange="step3ShowChange"></step2>
          </a-tab-pane>
          <a-tab-pane key="2" tab="合作方所需信息" forceRender>
            <step3 ref="step3" :type="type"></step3>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-spin>
    <selectUserModal ref="selectUserModal" @ok="userModalOk" :userList="userList"></selectUserModal>
  </div>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import step1 from './steps/step1'
import step2 from './steps/step2'
import step3 from './steps/step3'
import selectUserModal from './modules/selectUserModal'

export default {
  components: {
    step1,
    step2,
    step3,
    selectUserModal,
  },
  data() {
    return {
      title: '新建贷款办理',
      loading: false,
      type: Number(this.$route.query.type),
      id: Number(this.$route.query.id),
      stepsAtive: 0,
      tabsAtive: '0',
      userList: [],
      record: {},
      url: {
        add: '/credit/xTask/add',
        queryById: '/credit/xTask/queryById',

        queryUserByRole: '/sys/role/queryUserByRole',
      },
    }
  },
  created() {
    //type   0 新增 1 修改 2 查看
    this.title = this.type === 0 ? '新建贷款办理' : this.type === 1 ? '修改贷款办理' : '贷款办理详情'
    if (this.type > 0) {
      this.getDetails()
    }
    this.getUserList()
  },
  methods: {
    getDetails() {
      let param = {
        id: this.id,
      }
      this.loading = true
      getAction(this.url.queryById, param).then((res) => {
        if (res.success) {
          let xTask = Object.assign({}, res.result.xtask)
          this.$refs.step1.init(xTask, res.result.otherInfos, res.result.xcustomerInfo)
          this.$refs.step2.init(xTask)
          this.$refs.step3.init(xTask)
        } else {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    getUserList() {
      const param = {
        role: '2',
      }
      getAction(this.url.queryUserByRole, param).then((res) => {
        if (res.success) {
          this.userList = res.result
        }
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
    handleUser() {
      let step1Data = this.$refs.step1.getData(1)
      let step2Data = this.$refs.step2.getData(1)
      let step3Data = this.$refs.step3.getData(1)

      if (!step1Data || !step2Data || !step3Data) {
        return
      }
      if (Number(step1Data.qx) > Number(step2Data.dkqx)) {
        this.$message.warning('申请期限小于等于产品期限!')
        return
      }
      this.$refs.selectUserModal.visible = true
    },
    userModalOk(data) {
      this.submit(1, data)
    },
    submit(status, data) {
      let step1Data = this.$refs.step1.getData(status)
      let step1OtherData = this.$refs.step1.getOtherData(status)
      let step2Data = this.$refs.step2.getData(status)
      let step3Data = this.$refs.step3.getData(status)
      if (!step1Data.code) {
        this.$message.warning('请输入门店编号!')
        return
      }
      //保存后 保存id
      if (this.id) {
        step1Data.id = this.id
      }
      let param = Object.assign({}, step1Data, step2Data)
      param.partnerNeed = JSON.stringify(step3Data)
      if (data) {
        param.userThirdId = data.userId
      }
      if (!param.status) {
        param.status = status
      } else {
        //状态不为空时 保存 还是原来的状态 (已经保存或者驳回时)
        param.status = status === 1 ? 1 : param.status
      }
      console.log(param)
      this.loading = true
      postAction(this.url.add, { xtask: param, otherInfos: step1OtherData })
        .then((res) => {
          if (res.success) {
            this.$message.success('保存成功!')
            this.$router.back()
            // if (status === 1) {
            //   this.$router.back()
            // } else {
            //   this.$message.success('保存成功!')
            // }
          } else {
            this.$message.warning(res.message)
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    cusChange(id) {
      this.$refs.step3.queryYyData(id)
    },
    cusTypeChange(type) {
      this.$refs.step2.cusTypeChange(type)
    },
    //是否显示 建行个贷 的合作方
    step3ShowChange(isShow) {
      this.$refs.step3.showChange(isShow)
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