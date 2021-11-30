<template>
  <j-modal
    :title="title"
    :width="796"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @cancel="handleCancel"
    cancelText="关闭"
    :bodyStyle="{ padding: '33px 25px 6px' }"
  >
    <template slot="footer">
      <a-button key="submit" type="primary" v-if="ifBan || isEdit > 0" :loading="confirmLoading" @click="handleOk">
        提 交
      </a-button>
      <a-button key="back" @click="handleCancel"> 取消 </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline" class="warn-details-form">
        <a-row :gutter="0">
          <a-col :span="24">
            <div class="info-row">
              <span class="name">{{ xwarningRecord.customerName }}</span>
              <!-- <span class="type">{{ xwarningRecord.customerType | typeFormat(customerType) }}</span> -->
              <span class="status">{{ xwarningRecord.status | typeFormat(warnStatus) }}</span>
            </div>
          </a-col>
          <a-col :span="10">
            <a-form-item label="门店编号：">
              <span>{{ xwarningRecord.code }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="所属品牌公司：">
              <span>{{ xwarningRecord.customerDepartment| distFormat('brand_types') }}</span>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="10">
            <a-form-item label="证件类型：">
              <span>{{ xwarningRecord.zjlx | typeFormat(zjType) }}</span>
            </a-form-item>
          </a-col> -->
          <a-col :span="10">
            <a-form-item label="统一社会信用代码：">
              <span>{{ xwarningRecord.zjhm }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <div class="row-line"></div>
            <div class="row-header">预警信息</div>
          </a-col>
          <a-col :span="10">
            <a-form-item label="预警级别">
              <a-select v-if="isEdit === 1" placeholder="请选择预警级别" v-model="xwarningRecord.yjjb" allowClear>
                <a-select-option value="1">高</a-select-option>
                <a-select-option value="2">中</a-select-option>
                <a-select-option value="3">低</a-select-option>
              </a-select>
              <span v-else :class="`level${xwarningRecord.yjjb}`">{{ xwarningRecord.yjjb | typeFormat(yjjb) }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="预警来源">
              <a-select v-if="isEdit === 1" v-model="xwarningRecord.yjxxly" placeholder="请选择预警信息来源" allowClear>
                <a-select-option value="1">贷后监控活动</a-select-option>
                <a-select-option value="2">关注媒体</a-select-option>
                <a-select-option value="3">研究分析</a-select-option>
                <a-select-option value="4">金融监管机构披露</a-select-option>
                <a-select-option value="5">其他</a-select-option>
              </a-select>
              <span v-else>{{ xwarningRecord.yjxxly | typeFormat(yjxxly) }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item label="预警信号">
              <a-input placeholder="请输入预警信号" v-if="isEdit === 1" v-model="xwarningRecord.yjxh" />
              <span v-else>{{ xwarningRecord.yjxh | typeFormat(yjxh) }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item label="预警详情">
              <a-textarea placeholder="请输入预警信息详情" v-if="isEdit === 1" v-model="xwarningRecord.yjxxxq" />
              <span v-else>{{ xwarningRecord.yjxxxq }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="20" v-if="xwarningRecord.yjjcyjyy">
            <a-form-item label="预警解除原因">
              <a-textarea placeholder="请输入预警解除原因" v-if="isEdit === 2" v-model="xwarningRecord.yjjcyjyy" />
              <span v-else>{{ xwarningRecord.yjjcyjyy }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="10" v-if="role === '1' && isEdit > 0 && userList.length > 0">
            <a-form-item label="协查用户">
              <a-select
                placeholder="请选择协查用户"
                v-decorator="['userThirdId', {}]"
                v-if="isEdit"
                v-model="xwarningRecord.userThirdId"
                allowClear
              >
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                  item.realname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="10" v-if="role === '2' && isEdit > 0">
            <a-form-item label="是否协查">
              <a-switch v-model="isHasXC" />
            </a-form-item>
          </a-col>
          <a-col :span="10" v-if="role === '2' && isEdit > 0 && userList.length > 0">
            <a-form-item label="审查用户">
              <a-select placeholder="请选择审查用户" v-model="xwarningRecord.userShenId" allowClear>
                <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                  item.realname
                }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="24">
            <div class="row-line"></div>
            <div class="row-header">流程信息</div>
          </a-col>
          <a-col :span="18">
            <ul class="flow-ul">
              <li v-for="(item, index) of xcommonAudits" :key="index">
                <div class="flow-item-row">
                  <span class="name">{{ item.czrxm }} </span>
                  <span
                    >/{{ item.type | typeFormat(yjlcbz) }} /{{ item.role | typeFormat(roleTypes) }}/{{
                      item.types === 1 ? '预警流程' : '解禁流程'
                    }}</span
                  >
                  <span class="fr">{{ item.createTime }}</span>
                </div>
                <div class="flow-item-row" v-if="item.rdjg && item.rdjg !== -1 && item.rdjg !== -2">
                  <span class="label">处理意见： </span>
                  <span class="content">{{ item.bsyj }} </span>
                  <span :class="`fr flow-status past${item.rdjg}`">
                    <a-icon theme="filled" :type="item.rdjg === 1 ? 'check-circle' : 'close-circle'" />{{
                      item.rdjg === 1 ? '通过' : item.rdjg === 2 ? '驳回' : '否决'
                    }}</span
                  >
                </div>
              </li>
            </ul>
          </a-col>
          <template v-if="ifBan">
            <a-col :span="24">
              <div class="row-line"></div>
              <div class="row-header">处理</div>
            </a-col>
            <a-col :span="12">
              <a-form-item label="处理结果：">
                <a-radio-group v-model="formData.rdjg">
                  <a-radio :value="1"> 通过 </a-radio>
                  <a-radio v-if="!(xwarningRecord.status === 2 && role === '1')" :value="2"> 驳回修改 </a-radio>
                  <a-radio v-if="formData.type === 3" :value="3"> 否决 </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                :label="(formData.type + 1) | typeFormat(yjlcbz)"
                v-if="!((xwarningRecord.status === 2 && role === '1') || xwarningRecord.status >= 4)"
              >
                <a-select placeholder="请选择处理人" v-model="formData.nextUserId" allowClear>
                  <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                    item.realname
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item label="处理意见：">
                <a-textarea placeholder="请输入处理意见" v-model="formData.bsyj" allowClear></a-textarea>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getAction, putAction } from '@/api/manage'
import { customerType, warnStatus, zjType, yjjb, yjxxly, yjlcbz, roleTypes, yjxh } from '@/utils/dictionary'

export default {
  data() {
    return {
      customerType,
      warnStatus,
      zjType,
      yjjb,
      yjlcbz,
      yjxxly,
      yjxh,
      roleTypes,
      title: '查看详情',
      visible: false,
      record: {},
      isEdit: 0,
      xcommonAudits: [],
      xwarningRecord: {},
      isHasXC: false,
      ifBan: false, //是否有审批权限
      role: '',
      userList: [],
      confirmLoading: false,
      formData: {},
      url: {
        edit: '/credit/xWarningRecord/add',
        queryUserByRole: '/sys/role/queryUserByRole',
        queryById: '/credit/xWarningRecord/queryById',
        checkWarning: '/credit/xWarningRecord/checkWarning', //协查
        examinationWarning: '/credit/xWarningRecord/examinationWarning', //审查
        approvalWarning: '/credit/xWarningRecord/approvalWarning', //审批
      },
    }
  },
  created() {
    this.role = this.userInfo().role
  },
  methods: {
    //获取用户信息
    ...mapGetters(['userInfo']),
    init(record) {
      this.isEdit = 0
      this.xcommonAudits = []
      this.formData = {}
      this.xwarningRecord = {}
      this.ifBan = false
      this.record = Object.assign({}, record)
      this.visible = true
      this.loadData()
    },
    loadData() {
      const param = {
        id: this.record.id,
      }
      this.confirmLoading = true
      getAction(this.url.queryById, param).then((res) => {
        if (res.success) {
          this.xwarningRecord = res.result.xwarningRecord
          this.isHasXC = this.xwarningRecord.isHasXC === 1
          this.xcommonAudits = res.result.xcommonAudits
          this.ifBan = res.result.ifBan
          if (this.ifBan && this.xcommonAudits.length > 0) {
            this.formData = Object.assign({}, this.xcommonAudits[this.xcommonAudits.length - 1])
            this.formData.rdjg = 1
            this.getUserList()
          }
          if (this.xwarningRecord.status === 0 && res.result.ifFrist) {
            this.isEdit = this.xwarningRecord.ifeffect === 1 ? 2 : 1
            this.getUserList()
          }
        } else {
          this.$message.warning(res.message)
        }
        this.confirmLoading = false
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      //驳回修改
      if (this.isEdit > 0) {
        this.handleEdit()
        return
      }
      if (
        !((this.xwarningRecord.status === 2 && this.role === '1') || this.xwarningRecord.status >= 4) &&
        !this.formData.nextUserId
      ) {
        this.$message.warning('请选择下一步处理人!')
        return
      }
      let url = this.url.checkWarning
      if (this.xwarningRecord.status === 3) {
        url = this.url.examinationWarning
      }
      if (this.xwarningRecord.status === 4) {
        url = this.url.approvalWarning
      }
      let param = Object.assign({}, this.formData)
      this.confirmLoading = true
      putAction(url, param).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
        this.confirmLoading = false
      })
    },
    handleEdit() {
      if (!this.xwarningRecord.userShenId && this.role === '2') {
        this.$message.warning('请选择审查人!')
        return
      }
      if (!this.xwarningRecord.userThirdId && this.role === '1') {
        this.$message.warning('请选择协查用户!')
        return
      }
      let param = Object.assign({}, this.xwarningRecord)
      param.status = 2
      param.isHasXC = this.isHasXC ? 1 : 0
      if (this.role === '2' && param.isHasXC === 0) {
        param.status = 3
      }
      this.confirmLoading = true
      postAction(this.url.edit, param).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
        this.confirmLoading = false
      })
    },
    handleCancel() {
      this.close()
    },
    getUserList() {
      //不需要选择 审查人
      if ((this.xwarningRecord.status === 2 && this.role === '1') || this.xwarningRecord.status >= 4) {
        return
      }
      let value = this.xwarningRecord.status + 1

      //驳回
      if (this.xwarningRecord.status === 0 && this.isEdit > 0) {
        value = this.role === '1' ? '2' : '3'
      }
      const param = {
        role: value + '',
      }
      getAction(this.url.queryUserByRole, param).then((res) => {
        if (res.success) {
          this.userList = res.result
        }
      })
    },
  },
}
</script>

<style lang="less">
.warn-details-form {
  .info-row {
    margin-bottom: 16px;
    display: inline-block;
    .name {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #131212;
      line-height: 25px;
      margin-right: 8px;
    }
    .type {
      height: 18px;
      padding: 2px 6px;
      background: #ffe9e2;
      border-radius: 2px;
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ff6a39;
      line-height: 18px;
      margin-right: 8px;
    }
    .status {
      height: 18px;
      padding: 2px 6px;
      background: #ddecfd;
      border-radius: 2px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3990ed;
      line-height: 18px;
    }
  }
  .ant-form-item {
    display: flex;
    margin-bottom: 10px;
    .ant-form-item-control-wrapper {
      flex: 1 1;
      display: inline-block;
      vertical-align: middle;
      .ant-form-item-children {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        .level1 {
          color: #b52309;
        }
        .level2 {
          color: #eb4e33;
        }
        .level3 {
          color: #f0a100;
        }
      }
    }
    > .ant-form-item-label {
      width: auto;
      > label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }
  }
  .row-line {
    display: block;
    height: 1px;
    background: #e5e5e5;
  }
  .row-header {
    margin: 25px 0 16px;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #202b3b;
    line-height: 22px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 24px;
      background: #4664b4;
      border-radius: 3px;
      position: absolute;
      top: 50%;
      left: -17px;
      margin-top: -12px;
    }
  }
  .flow-ul {
    padding: 0;
    list-style: none;
    margin-top: 16px;
    li {
      list-style: none;
      position: relative;
      padding-left: 31px;
      .flow-item-row {
        padding-bottom: 8px;
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          line-height: 22px;
          vertical-align: baseline;
        }
        .name {
          display: inline-block;
          font-size: 16px;
          color: #333333;
          margin-right: 5px;
        }
        .label {
          display: inline-block;
          font-size: 14px;
          margin-right: 5px;
          vertical-align: top;
        }
        .content {
          display: inline-block;
          font-size: 14px;
          color: #333333;
          max-width: 300px;
          word-break: break-all;
          vertical-align: top;
        }
        .fr {
          min-width: 110px;
          text-align: center;
        }
        .flow-status {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #eb4e33;
          line-height: 22px;
          i {
            margin-right: 4px;
          }
        }
        .past1 {
          color: #4cb325;
        }
        &:last-of-type {
          padding-bottom: 32px;
        }
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
      &:last-of-type::before {
        background: #a4a4a4;
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
}
</style>