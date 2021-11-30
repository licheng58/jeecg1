<template>
  <div>
    <PageTitle title="流程处理" fontSize="16px" hasBefore style="padding: 0 24px" v-if="isEdit"> </PageTitle>
    <a-form :form="form" v-if="isEdit" style="padding: 0 24px">
      <a-row :gutter="0">
        <a-col :span="10">
          <a-form-item :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }" :required="true" label="处理结果：">
            <a-radio-group v-model="formData.auditResult">
              <a-radio :value="1"> 通过 </a-radio>
              <a-radio :value="2"> 驳回修改 </a-radio>
              <a-radio :value="0" v-if="formData.operatorType === 3"> 否决 </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="10" v-if="formData.operatorType < 3">
          <a-form-item :labelCol="{ span: 4 }" :wrapperCol="{ span: 16 }" :required="true" label="下级处理人">
            <a-select placeholder="请选择处理人" v-model="formData.nextUserId" allowClear>
              <a-select-option v-for="(item, index) of userList" :key="index" :value="item.id">{{
                item.realname
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="20">
          <a-form-item :labelCol="{ span: 2 }" :wrapperCol="{ span: 20 }" label="处理意见：">
            <a-textarea placeholder="请输入处理意见" v-model="formData.reason" allowClear></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <PageTitle title="流程信息" fontSize="16px" hasBefore style="padding: 0 24px"> </PageTitle>
    <ul class="flow-ul1">
      <li v-for="(item, index) of xcommonAudits" :key="index">
        <div class="flow-item-row">
          <span class="name">{{ item.createBy }} </span>
          <span>{{ item.operatorType | typeFormat(dklcbz) }} </span>
          <span class="fr">{{ item.createTime }}</span>
        </div>
        <div class="flow-item-row" v-if="item.auditResult || item.auditResult === 0">
          <span class="label">处理意见： </span>
          <span class="content">{{ item.reason }} </span>
          <span :class="`fr flow-status past${item.auditResult}`">
            <a-icon theme="filled" :type="item.auditResult === 1 ? 'check-circle' : 'close-circle'" />{{
              item.auditResult === 1 ? '通过' : item.auditResult === 2 ? '驳回' : '否决'
            }}</span
          >
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getAction } from '@/api/manage'
import { filterObj } from '@/utils/util.js'
import { customerType, ifTypes, sexTypes } from '@/utils/dictionary'
import pick from 'lodash.pick'
import moment from 'moment'
import { dklcbz } from '@/utils/dictionary'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      dklcbz,
      formData: {},
      xcommonAudits: [],
      role: '',
      isEdit: false,
      userList: [],
      form: this.$form.createForm(this),
      url: {
        queryUserByRole: '/sys/role/queryUserByRole',
      },
    }
  },
  created() {
    this.role = this.userInfo().role
    this.getUserList()
  },
  methods: {
    ...mapGetters(['userInfo']),

    init(xcommonAudits, xcommonAudit, isEdit) {
      this.isEdit = isEdit
      if (xcommonAudits) {
        this.xcommonAudits = xcommonAudits
      }
      if (xcommonAudit) {
        this.formData = Object.assign({}, xcommonAudit)
      }
    },
    getUserList() {
      const param = {
        role: this.role === '2' ? '3' : '4',
      }
      getAction(this.url.queryUserByRole, param).then((res) => {
        if (res.success) {
          this.userList = res.result
        }
      })
    },

    getData() {
      if (!this.formData.auditResult && this.formData.auditResult !== 0) {
        this.$message.warning('请选择处理结果!')
        return false
      }
      if (!this.formData.nextUserId && this.formData.operatorType < 3 && this.formData.auditResult === 1) {
        this.$message.warning('请选择下级处理人!')
        return false
      }
      // if (!this.formData.reason) {
      //   this.$message.warning('请选择处理原因!')
      //   return false
      // }
      let data = Object.assign({}, this.formData)
      return data
    },
  },
}
</script>
<style lang="less">
.flow-ul1 {
  padding: 0;
  list-style: none;
  max-width: 650px;
  margin-top: 10px;
  margin-left: 100px;
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
</style>