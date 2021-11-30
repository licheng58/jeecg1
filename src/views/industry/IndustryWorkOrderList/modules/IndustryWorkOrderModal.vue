<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
          <a-input placeholder="请输入名称" v-decorator.trim="['name', validatorRules.name]" :maxLength="12" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工作流">
          <a-select
            v-decorator="['workFlowNodes', validatorRules.workFlowNodes]"
            @change="handleChange"
            placeholder="请选择工作流"
            mode="multiple"
          >
            <a-select-option v-for="val in WorkFlows" :key="val.id">
              {{ val.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="指派人">
          <a-select
            v-decorator="['userId', validatorRules.userId]"
            placeholder="请选择指派人"
            @change="handleChangeUserName"
          >
            <a-select-option v-for="val in Appointors" :key="val.id">
              {{ val.realname }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工单类型">
          <a-select v-decorator="['type', validatorRules.type]" placeholder="请选择工单类型">
            <a-select-option v-for="val in workTypes" :key="val.id" :value="val.value">
              {{ val.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <!-- <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['startTime', validatorRules.startTime]" /> -->
          <a-date-picker
            v-decorator="['startTime', validatorRules.startTime]"
            :disabled-date="disabledStartDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="开始时间"
            @openChange="handleStartOpenChange"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <!-- <a-date-picker showTime
                         format='YYYY-MM-DD HH:mm:ss'
                         v-decorator="[ 'endTime',validatorRules.endTime]" /> -->
          <a-date-picker
            v-decorator="['endTime', validatorRules.endTime]"
            :disabled-date="disabledEndDate"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="结束时间"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea placeholder="请输入备注" :rows="3" :maxLength="100" v-decorator="['remake', {}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
const workTypes = [
  { id: 1, name: '单次任务', value: 1 },
  { id: 2, name: '多次循环任务', value: 2 }
]
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { lc_validateName } from '@/api/lc_api'
export default {
  name: 'IndustryWorkOrderModal',

  props: {
    WorkFlows: {
      type: Array,
      default: []
    },

    Appointors: {
      type: Array,
      default: []
    }
  },

  data() {
    return {
      endOpen: false,
      workTypes,
      workFlowNodes: [], //工作流下拉框数据
      userName: '',
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        name: {
          rules: [
            {
              required: true,
              message: '请输入名称!'
            },
            // { validator: this.validators.length({ min: 1, max: 12 }) },
            { min: 1, max: 12, message: '长度在 1 到 12 个字符' },
            {
              validator: this.validateName
            }
          ]
        },

        workFlowNodes: {
          rules: [
            {
              required: true,
              message: '请选择选择工作流!'
            }
          ]
        },

        userId: {
          rules: [
            {
              required: true,
              message: '请选择指派人!'
            }
          ]
        },

        type: {
          rules: [
            {
              required: true,
              message: '请选择工单类型!'
            }
          ]
        },

        startTime: {
          rules: [
            {
              required: true,
              message: '请选择开始时间!'
            }
          ]
        },

        endTime: {
          rules: [
            {
              required: true,
              message: '请选择结束时间!'
            }
          ]
        }
      },
      url: {
        add: '/industry/industryWorkOrder/add',
        edit: '/industry/industryWorkOrder/edit'
      }
    }
  },

  methods: {
    handleStartOpenChange(open) {
      //   console.log(this.form.getFieldsValue())
      if (!open) {
        this.endOpen = true
      }
    },

    handleEndOpenChange(open) {
      this.endOpen = open
    },

    disabledStartDate(startValue) {
      const endValue = this.form.getFieldsValue().endTime
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },

    disabledEndDate(endValue) {
      const startValue = this.form.getFieldsValue().startTime
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },

    // check名称
    async validateName(rule, value, callback) {
      const rege = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      if (this.title === '编辑') return
      const res = await lc_validateName(value)
      const { result } = res
      if (result !== 0) {
        callback('名称已存在!')
      }
      if (rege.test(value)) {
        callback('名称不能包含特殊字符!')
      }
    },

    add() {
      this.edit({})
    },

    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'name', 'status', 'workFlowId', 'workFlowName', 'deptId', 'deptName', 'remake')
        )
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    // 下拉框获取数据对象信息
    handleChange(selectItems) {
      // console.log(selectItems)
      this.workFlowNodes = []
      this.WorkFlows.forEach(v => {
        selectItems.forEach(v2 => {
          if (v.id === v2) {
            this.workFlowNodes.unshift(v)
          }
        })
      })
      // console.log(this.workFlowNodes)
    },

    // 获取userName
    handleChangeUserName(val) {
      this.Appointors.forEach(v => {
        if (v.id === val) {
          this.userName = v.realname
        }
      })
      // console.log(this.userName)
    },

    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          // return
          let resForm = {
            industryWorkOrder: {
              createBy: formData.createBy || '',
              createTime: formData.createTime || '',
              deptId: formData.deptId || '',
              deptName: formData.deptName || '',
              endTime: formData.endTime || '',
              id: formData.id || 0,
              name: formData.name || '',
              remake: formData.remake || '',
              startTime: formData.startTime || '',
              status: formData.status || 0,
              updateBy: formData.updateBy || '',
              updateTime: formData.updateTime || '',
              userId: formData.userId || '',
              type: formData.type,
              username: that.userName || '',
              workFlowId: formData.workFlowId || '',
              workFlowName: formData.workFlowName || '',
              updateTime: formData.updateTime || ''
            },

            workFlowNodes: this.workFlowNodes
          }
          // console.log(resForm)
          // return
          httpAction(httpurl, resForm, method)
            .then(res => {
              if (res.success) {
                that.$message.success('发布成功')
                that.$emit('ok')
                this.$parent.getInfoCount()
                this.$parent.getWorderOrders()
                this.$parent.currentIndex = 0
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
    }
  }
}
</script>

<style lang="less" scoped></style>
