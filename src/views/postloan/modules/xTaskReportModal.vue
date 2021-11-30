<template>
  <j-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit && !(userId === model.userId && model.status === 1) } }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        class="my-descriptions-form"
        :model="form"
        :rules="rules"
        labelAlign="left"
        layout="horizontal"
      >
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="贷款主体是否正常还本付息？">
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code1">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code1 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code1sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 18 }"
              label="贷款主体资金归集情况是否正常？"
            >
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code2">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code2 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code2sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="相关酒店经营情况是否正常？">
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code3">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code3 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code3sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="相关投资人经营情况是否正常？">
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code4">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code4 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code4sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item
              :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 18 }"
              label="相关担保及共同还款主体经营情况是否正常？"
            >
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code5">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code5 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code5sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="贷后检查是否完成？">
              <a-row :gutter="0">
                <a-col :span="6">
                  <a-radio-group :disabled="disableSubmit" v-model="form.code6">
                    <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value">
                      {{ item.name }}
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col :span="18" v-if="form.code6 === 0">
                  <a-input :disabled="disableSubmit" v-model="form.code6sm" placeholder="请说明原因" />
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-model-item label="是否需要协查">
              <a-radio-group :disabled="disableSubmit" v-model="form.isHasXC">
                <a-radio v-for="(item, index) of ifTypes" :key="index" :value="item.value"> {{ item.name }} </a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="form.isHasXC === 1">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="协查问题">
              <a-input :disabled="disableSubmit" placeholder="" v-model="form.xcwt" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-if="form.isHasXC === 1">
            <a-form-model-item :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }" label="协查意见">
              <a-input
                :disabled="disableSubmit && !(userId === model.userId && model.status === 1)"
                placeholder=""
                v-model="form.xcyj"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>
import { filterObj } from '@/utils/util.js'
import { httpAction } from '@/api/manage'
import { getAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { customerType, ifTypes } from '@/utils/dictionary'
import { mapGetters } from 'vuex'

export default {
  name: 'xTaskReportModal',
  data() {
    return {
      title: '操作',
      visible: false,
      taskId: Number(this.$route.query.taskId),
      taskNo: this.$route.query.taskNo,
      xm: this.$route.query.xm,
      model: {},
      customerType,
      ifTypes,
      reportContent: {},
      confirmLoading: false,
      disableSubmit: false,
      userId: '',
      form: {
        isHasXC: 0,
      },
      rules: {},
      url: {
        add: '/credit/xTaskReport/add',
        edit: '/credit/xTaskReport/edit',
      },
    }
  },
  created() {
    this.userId = this.userInfo().id
  },
  methods: {
    ...mapGetters(['userInfo']),
    add(record) {
      this.edit(record)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.form = {}
      if (record.content) {
        this.form = Object.assign({}, JSON.parse(record.content))
      }
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = this.url.add
          let method = 'post'
          let formData = Object.assign({}, this.form)
          //时间格式化
          let param = {
            ifNeedCheck: this.form.isHasXC,
            xtaskReport: {
              customerId: this.model.customerId,
              taskAfterId: this.model.taskAfterId,
              xm: this.model.xm,
              status: this.form.isHasXC ? 1 : 0,
              taskId: this.model.taskId,
              taskNo: this.model.taskNo,
              content: JSON.stringify(formData),
            },
          }
          if (this.model.id) {
            param.xtaskReport.id = this.model.id
          }
          if (this.userId === this.model.userId) {
            param.xtaskReport.status = 2
          }
          httpAction(httpurl, param, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    onChange(e) {
      console.log('radio checked', e.target.value)
    },
  },
}
</script>
