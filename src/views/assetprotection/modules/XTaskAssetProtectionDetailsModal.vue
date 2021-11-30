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
              <span class="name">{{ xtaskAssetProtection.xm }}</span>
              <span class="type">{{ xtaskAssetProtection.customerType | typeFormat(customerType) }}</span>
              <span class="status">{{ xtaskAssetProtection.status | typeFormat(zcbqStatus) }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <a-form-item label="申请流水号：">
              <span>{{ xtaskAssetProtection.taskNo }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <div class="row-line"></div>
            <div class="row-header">资产信息</div>
          </a-col>

          <a-col :span="8">
            <a-form-item label="贷款金额(万)：">
              <span>{{ xtaskAssetProtection.dkje }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="到期日期：">
              <span>{{ xtaskAssetProtection.dqrq | moment('YYYY-MM-DD') }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="业务品种：">
              <span>{{ xtaskAssetProtection.ywpz }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="业务币种：">
              <span>{{ xtaskAssetProtection.ywbz | typeFormat(ywbz) }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="五级分类：">
              <span>{{ xtaskAssetProtection.wjfl | typeFormat(zcfl) }}</span>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-item label="当前余额(万)：">
              <span>{{ xtaskAssetProtection.dqye }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="回收金额(万)：">
              <span>{{ xtaskAssetProtection.hsje }}</span>
            </a-form-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-item label="资产状态：">
              <span>{{
                xtaskAssetProtection.ifEnd === null ? '—' : xtaskAssetProtection.ifEnd === 0 ? '已终结' : '未终结'
              }}</span>
            </a-form-item>
          </a-col>

          <a-col :span="24"
                 v-if="xtaskAssetProtection.status && xtaskAssetProtection.status !== 0">
            <a-row :gutter="0"
                   v-for="(item, index) of dutyInfos"
                   :key="index">
              <!-- 责任信息 -->
              <a-col :span="24">
                <div class="row-line"></div>
                <div class="row-header">责任信息</div>
              </a-col>

              <a-col :span="12">
                <a-form-item label="责任类别：">
                  <a-select v-if="isEdit && index === dutyInfos.length - 1"
                            v-model="item.zrlb"
                            placeholder="请选择责任类别"
                            allowClear>
                    <a-select-option v-for="(value, key, index) of zrlb"
                                     :key="index"
                                     :value="key">
                      {{ value }}
                    </a-select-option>
                  </a-select>
                  <span v-else>{{ item.zrlb | typeFormat(zrlb) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="责任属性：">
                  <a-select v-if="isEdit && index === dutyInfos.length - 1"
                            v-model="item.zrsx"
                            placeholder="请选择责任属性"
                            allowClear>
                    <a-select-option v-for="(value, key, index) of zrsx"
                                     :key="index"
                                     :value="key">
                      {{ value }}
                    </a-select-option>
                  </a-select>
                  <span v-else>{{ item.zrsx | typeFormat(zrsx) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="所在机构：">
                  <a-input placeholder="请输入责任人所在机构"
                           v-if="isEdit && index === dutyInfos.length - 1"
                           v-model="item.zrrszjg" />

                  <span v-else>{{ item.zrrszjg }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="责任认定人：">
                  <a-input placeholder="请输入责任认定人"
                           v-if="isEdit && index === dutyInfos.length - 1"
                           v-model="item.zrrxm" />

                  <span v-else>{{ item.zrrxm }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="责任描述：">
                  <a-textarea placeholder="请输入责任描述"
                              v-if="isEdit && index === dutyInfos.length - 1"
                              v-model="item.zrms" />
                  <span v-else>{{ item.zrms }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="追究意见：">
                  <a-textarea placeholder="请输入责任追究意见"
                              v-if="isEdit && index === dutyInfos.length - 1"
                              v-model="item.zrzjyj" />
                  <span v-else>{{ item.zrzjyj }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item label="落实情况：">
                  <a-textarea placeholder="请输入责任追究落实情况"
                              v-if="isEdit && index === dutyInfos.length - 1"
                              v-model="item.zrzjlsqk" />
                  <span v-else>{{ item.zrzjlsqk }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="10"
                     v-if="isEdit && index === dutyInfos.length - 1">
                <a-form-item label="是否协查：">
                  <a-switch v-model="isHasXC" />
                </a-form-item>
              </a-col>
              <a-col :span="10"
                     v-if="isEdit && index === dutyInfos.length - 1">
                <a-form-item label="审查用户：">
                  <a-select placeholder="请选择审查用户"
                            style="width: 200px"
                            v-model="xtaskAssetProtection.userShenId"
                            allowClear>
                    <a-select-option v-for="(item, index) of userList"
                                     :key="index"
                                     :value="item.id">{{
                      item.realname
                    }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
          <!-- 流程信息 -->
          <a-col :span="24"
                 v-if="xtaskAssetProtection.status && xtaskAssetProtection.status !== 0">
            <div class="row-line"></div>
            <div class="row-header">流程信息</div>
          </a-col>
          <a-col :span="18"
                 v-if="xtaskAssetProtection.status && xtaskAssetProtection.status !== 0">
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
                  <span class="label">处理意见 </span>
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

          <!-- 处理操作 -->
          <template v-if="isBan && xtaskAssetProtection.status != -1">
            <a-col :span="24">
              <div class="row-line"></div>
              <div class="row-header">处理</div>
            </a-col>
            <a-col :span="12">
              <a-form-item label="处理结果"
                           v-if="xtaskAssetProtection.status !== 1">
                <a-radio-group v-model="formData.rdjg">
                  <a-radio :value="1"> 通过 </a-radio>
                  <a-radio :value="0"> 驳回修改 </a-radio>
                  <a-radio v-if="formData.type === 3"
                           :value="2"> 否决 </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item :label="(formData.type + 1) | typeFormat(yjlcbz)"
                           v-if="[-1, 2].includes(xtaskAssetProtection.status)">
                <a-select style="width: 300px"
                          placeholder="请选择下一步处理人"
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
              <a-form-item label="处理意见">
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
import { customerType, roleTypes, zcbqStatus, zrlb, zrsx, yjlcbz, ywbz, zcfl } from '@/utils/dictionary'

export default {
  name: '',
  data() {
    return {
      description: 'x_task_report管理页面',
      customerType,
      zcbqStatus,
      zrlb,
      zrsx,
      yjlcbz,
      ywbz,
      zcfl,
      confirmLoading: false,
      title: '查看详情',
      visible: false,
      record: {},
      isEdit: false,
      roleTypes,
      userList: [],
      xcommonAudits: [],
      xtaskAssetProtection: {}, //资产信息
      dutyInfos: [], //责任信息
      isBan: false, //是否有审批权限
      isHasXC: false,
      nextUserId: '',
      formData: {},
      url: {
        zeRenRenDing: '/credit/xTaskAssetProtection/zeRenRenDing',
        edit: '/credit/xTaskAssetProtection/edit',
        queryUserByRole: '/sys/role/queryUserByRole',
        queryById: '/credit/xTaskAssetProtection/queryById',
        checkWarning: '/credit/xTaskAssetProtection/checkProtection', //协查
        examinationWarning: '/credit/xTaskAssetProtection/examinationTaskAssetProtection', //审查
        approvalWarning: '/credit/xTaskAssetProtection/approvalTaskAssetProtection', //审批
      },
    }
  },
  created() {
    this.getUserList()
  },
  computed: {},
  methods: {
    init(record) {
      this.isEdit = false
      this.xcommonAudits = []
      this.xtaskAssetProtection = {}
      this.xtaskAssetProtectionResponsibility = {}
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
          this.xtaskAssetProtection = res.result.xtaskAssetProtection
          this.dutyInfos = res.result.xtaskAssetProtectionResponsibilities
            ? res.result.xtaskAssetProtectionResponsibilities
            : []
          this.xcommonAudits = res.result.xcommonAudits
          // this.isHasXC = this.xtaskAssetProtection.isHasXC === 1
          this.isBan = res.result.isBan
          if (this.isBan && this.xcommonAudits.length > 0) {
            this.formData = Object.assign({}, this.xcommonAudits[this.xcommonAudits.length - 1])
            this.getUserList()
          }
          if (this.xtaskAssetProtection.status === -1 && res.result.isBan) {
            this.isEdit = true
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
      let xcommonAudit = Object.assign({}, this.formData)
      // 不同结点访问接口url
      //审批
      let url = this.url.approvalWarning
      //协查
      if (this.xtaskAssetProtection.status === 1) {
        url = this.url.checkWarning
        //协查直接通过
        xcommonAudit.rdjg = 1
      }
      //审查
      if (this.xtaskAssetProtection.status === 2) {
        url = this.url.examinationWarning
      }
      let param = {
        nextUserId: xcommonAudit.nextUserId,
        xcommonAudit: xcommonAudit,
        xtaskAssetProtection: this.xtaskAssetProtection,
      }
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
      let param = {
        xtaskAssetProtection: Object.assign({}, this.xtaskAssetProtection),
        xtaskAssetProtectionResponsibility: this.dutyInfos[this.dutyInfos.length - 1],
      }
      param.xtaskAssetProtection.status = 2
      //责任认定
      let url = this.url.zeRenRenDing

      //判断 是否是转终结流程
      if (this.xtaskAssetProtection.ifEnd) {
        url = this.url.edit
      }
      //需要协查
      if (this.isHasXC) {
        param.xtaskAssetProtection.status = 1
      }
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
    handleCancel() {
      this.close()
    },

    // 获取用户列表
    getUserList() {
      //协查处理  不需要选择审查人
      if (this.xtaskAssetProtection.status === 1) {
        return
      }
      //状态-2拒绝 -1驳回 0系统生成 1待协查 2待审查 3待审批 4审批完成
      //role  3 审查 4 审批
      let value = 4
      //驳回
      if (this.xtaskAssetProtection.status === -1) {
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
    height: 40px;
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