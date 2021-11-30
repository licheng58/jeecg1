<template>
  <j-modal :title="title"
           :width="796"
           :visible="visible"
           :confirmLoading="confirmLoading"
           switchFullscreen
           @cancel="handleCancel"
           cancelText="关闭"
           :bodyStyle="{ padding: '33px 25px 6px' }">
    <template slot="footer">
      <a-button key="submit"
                type="primary"
                v-if="isBan || isEdit"
                :loading="confirmLoading"
                @click="handleOk">
        提 交
      </a-button>
      <a-button key="back"
                @click="handleCancel"> 取消 </a-button>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form layout="inline"
              class="warn-details-form">
        <a-row :gutter="0">
          <!-- 基本信息 -->
          <a-col :span="24">
            <div class="info-row">
              <span class="name">{{ xtaskAsset.xm }}</span>
              <span class="type">{{ xtaskAsset.customerType | typeFormat(customerType) }}</span>
              <span class="status">{{ xtaskAsset.status | typeFormat(tzzcflStatus) }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <a-form-item label="申请流水号：">
              <span>{{ xtaskAsset.taskNo }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="业务品种：">
              <span>{{ xtaskAsset.ywpz }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="业务币种：">
              <span>{{ xtaskAsset.ywbz }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="贷款金额(元)：">
              <span>{{ xtaskAsset.dkje }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="分类月份：">
              <span>{{ xtaskAsset.month }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="系统分类结果">
              <span>{{ xtaskAsset.xtzcfl | typeFormat(zcfl) }}</span>
            </a-form-item>
          </a-col>
          <template v-if="xtaskAsset.status && xtaskAsset.status !== 0">
            <!-- 资产分类信息 -->
            <a-col :span="24">
              <div class="row-line"></div>
              <div class="row-header">分类信息</div>
            </a-col>
            <a-col :span="12">
              <a-form-item label="调整分类结果">
                <a-select v-if="isEdit"
                          v-model="xtaskAsset.xtzcfl"
                          placeholder="请选择调整分类结果"
                          allowClear>
                  <a-select-option v-for="(value, key, index) of zcfl"
                                   :key="index"
                                   :value="key">
                    {{ value }}
                  </a-select-option>
                </a-select>
                <span v-else>{{ xtaskAsset.tzzcfl | typeFormat(zcfl) }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="12"
                   v-if="role === '2' && isEdit">
              <a-form-item label="审查用户">
                <a-select placeholder="请选择审查用户"
                          v-model="xtaskAsset.nextUserId"
                          allowClear>
                  <a-select-option v-for="(item, index) of userList"
                                   :key="index"
                                   :value="item.id">{{
                    item.realname
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="分类调整原因">
                <a-textarea placeholder="请输入调整原因"
                            v-if="isEdit"
                            v-model="xtaskAsset.tzyy" />
                <span v-else>{{ xtaskAsset.tzyy }}</span>
              </a-form-item>
            </a-col>
          </template>

          <!-- 流程信息 -->
          <template v-if="xtaskAsset.status && xtaskAsset.status !== 0">
            <a-col :span="24">
              <div class="row-line"></div>
              <div class="row-header">流程信息</div>
            </a-col>
            <a-col :span="18">
              <ul class="flow-ul">
                <li v-for="(item, index) of xcommonAudits"
                    :key="index">
                  <div class="flow-item-row">
                    <span class="name">{{ item.czrxm }} </span>
                    <span> /{{ item.type | typeFormat(yjlcbz) }} /{{ item.role | typeFormat(roleTypes) }} </span>
                    <span class="fr">{{ item.createTime }}</span>
                  </div>
                  <div class="flow-item-row"
                       v-if="item.rdjg != null && item.rdjg !== -1 && item.rdjg !== -2">
                    <span class="label">处理意见： </span>
                    <span class="content">{{ item.bsyj }} </span>
                    <span :class="`fr flow-status past${item.rdjg}`">
                      <a-icon theme="filled"
                              :type="item.rdjg === 1 ? 'check-circle' : 'close-circle'" />{{
                        item.rdjg === 1 ? '通过' : item.rdjg === 0 ? '驳回' : '否决'
                      }}
                    </span>
                  </div>
                </li>
              </ul>
            </a-col>
          </template>

          <!-- 处理操作 -->
          <template v-if="isBan && xtaskAsset.status !== -1">
            <a-col :span="24">
              <div class="row-line"></div>
              <div class="row-header">处理</div>
            </a-col>
            <a-col :span="12">
              <a-form-item label="处理结果：">
                <a-radio-group v-model="formData.rdjg">
                  <a-radio :value="1"> 通过 </a-radio>
                  <a-radio v-if="!(xtaskAsset.status === 2 && role === '1')"
                           :value="0"> 驳回修改 </a-radio>
                  <a-radio v-if="formData.type === 3"
                           :value="2"> 否决 </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="(formData.type + 1) | typeFormat(yjlcbz)"
                           v-if="!((xtaskAsset.status === 2 && role === '1') || xtaskAsset.status >= 2)">
                <a-select style="width: 300px"
                          placeholder="请选择审查用户"
                          v-model="formData.nextUserId"
                          allowClear>
                  <a-select-option v-for="(item, index) of userList"
                                   :key="index"
                                   :value="item.id">{{
                    item.realname
                  }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="20">
              <a-form-item label="处理意见：">
                <a-textarea style="width: 500px"
                            placeholder="请输入处理意见"
                            v-model="formData.bsyj"
                            allowClear></a-textarea>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { getAction, putAction, postAction } from '@/api/manage'
import { customerType, tzzcflStatus, zcfl, yjlcbz, roleTypes, ywbz, ywpz } from '@/utils/dictionary'

export default {
  data() {
    return {
      customerType,
      zcfl,
      ywpz,
      tzzcflStatus,
      yjlcbz,
      roleTypes,
      ywbz,
      title: '查看详情',
      visible: false,
      record: {},
      isEdit: false,
      xcommonAudits: [],
      xtaskAsset: {},
      isBan: false, //是否有审批权限
      isHasXC: false,
      role: '',
      userList: [],
      confirmLoading: false,
      formData: {},
      url: {
        changeSave: '/credit/xTaskAsset/checkTask',
        queryUserByRole: '/sys/role/queryUserByRole',
        queryById: '/credit/xTaskAsset/queryById',
        examinationTaskAsset: '/credit/xTaskAsset/examinationTaskAsset', //审查
        approvalTaskAsset: '/credit/xTaskAsset/approvalTaskAsset', //审批
      },
    }
  },
  created() {
    this.role = this.userInfo().role
    this.getUserList()
  },
  methods: {
    //获取用户信息
    ...mapGetters(['userInfo']),

    init(record) {
      this.isEdit = false
      this.xcommonAudits = []
      this.xtaskAsset = {}
      this.formData = {}
      this.isBan = false
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
          this.xtaskAsset = res.result.xtaskAsset
          this.xcommonAudits = res.result.xcommonAudits
          this.isHasXC = this.xtaskAsset.isHasXC === 1
          this.isBan = res.result.isBan
          if (this.isBan && this.xtaskAsset.status === -1) {
            this.isEdit = true
            this.getUserList()
          } else if (this.isBan && this.xcommonAudits.length > 0) {
            this.formData = Object.assign({}, this.xcommonAudits[this.xcommonAudits.length - 1])
            this.formData.rdjg = 1
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
      if (this.isEdit) {
        this.handleEdit()
        return
      }
      if (!this.formData.nextUserId && this.xtaskAsset.status < 2) {
        this.$message.warning('请选择审查人!')
        return
      }
      //审查
      let url = this.url.examinationTaskAsset
      //审批
      if (this.xtaskAsset.status === 2) {
        url = this.url.approvalTaskAsset
      }
      let param = Object.assign({}, this.formData)
      let params = {
        nextUserId: param.nextUserId,
        xcommonAudit: param,
        xtaskAsset: this.xtaskAsset,
      }
      this.confirmLoading = true
      putAction(url, params).then((res) => {
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
      if (!this.xtaskAsset.nextUserId) {
        this.$message.warning('请选择审查人!')
        return
      }
      let param = {
        nextUserId: this.xtaskAsset.nextUserId,
        xtaskAsset: Object.assign({}, this.xtaskAsset),
      }
      this.confirmLoading = true
      putAction(this.url.changeSave, param).then((res) => {
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
      //审批不需要选择下一步处理人
      if (this.xtaskAsset.status >= 2) {
        return
      }
      let value = 4
      //驳回
      if (this.xtaskAsset.status === -1) {
        value = 3
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
          font-size: 14px;
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