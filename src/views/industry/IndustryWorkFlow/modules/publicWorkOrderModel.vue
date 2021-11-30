<template>
  <j-modal title='快捷发布工单'
           :width="800"
           :visible="publicWorkOrderModelDialog"
           :confirmLoading="confirmLoading"
           @ok="handleOk"
           @cancel="()=>close()"
           cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="名称">
          <a-input placeholder="请输入名称"
                   v-decorator.trim="['name', validatorRules.name]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="指派人">
          <a-select v-decorator="[ 'userId', validatorRules.userId]"
                    placeholder="请选择指派人"
                    @change="handleChangeUserName">
            <a-select-option v-for="val in Appointors"
                             :key="val.id">
              {{ val.realname }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="开始时间">
          <a-date-picker showTime
                         format='YYYY-MM-DD HH:mm:ss'
                         v-decorator="[ 'startTime', validatorRules.startTime]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="结束时间">
          <a-date-picker showTime
                         format='YYYY-MM-DD HH:mm:ss'
                         v-decorator="[ 'endTime',validatorRules.endTime]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </j-modal>
</template> 

<script>
import { httpAction } from '@/api/manage'
import { lc_validatePublicName } from '@/api/lc_api'
import pick from 'lodash.pick'
export default {
  name: 'IndustryWorkOrderModal',
  props: {
    Appointors: {
      type: Array,
      default: [],
    },

    workFlowNodes: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      nowTime: '',
      todayNightTime: '',
      confirmLoading: false,
      userName: '',
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      publicWorkOrderModelDialog: false,
      form: this.$form.createForm(this),
      validatorRules: {
        name: {
          rules: [
            {
              required: true,
              message: '请输入名称!',
            },
            // { validator: this.validators.length({ min: 1, max: 12 }) },
            { min: 1, max: 12, message: '长度在 1 到 12 个字符' },
            {
              validator: this.validatePublicName,
            },
          ],
        },

        userId: {
          rules: [
            {
              required: true,
              message: '请选择指派人!',
            },
          ],
        },

        startTime: {
          rules: [
            {
              required: true,
              message: '请选择开始时间!',
            },
          ],
        },

        endTime: {
          rules: [
            {
              required: true,
              message: '请选择结束时间!',
            },
          ],
        },
      },
      url: {
        add: '/industry/industryWorkOrder/add',
        edit: '/industry/industryWorkOrder/edit',
      },
    }
  },

  created() {
    this.getNowTime()
  },

  methods: {
    // 校验工作流名称
    async validatePublicName(rule, value, callback) {
      const res = await lc_validatePublicName(value)
      const { result } = res
      if (result !== 0) {
        callback('资源名称已存在!')
      }
    },
    //获取当前时间
    getNowTime() {
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()

      this.nowTime =
        year +
        '-' +
        this.addZero(month) +
        '-' +
        this.addZero(day) +
        ' ' +
        this.addZero(hour) +
        ':' +
        this.addZero(minute) +
        ':' +
        this.addZero(second)

      this.todayNightTime = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + '23:59:59'
    },

    //小于10的拼接上0字符串
    addZero(s) {
      return s < 10 ? '0' + s : s
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
        // this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        // this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },

    close() {
      this.$emit('close')
      this.form = this.$form.createForm(this)
      this.publicWorkOrderModelDialog = false
    },

    // 获取userName
    handleChangeUserName(val) {
      this.Appointors.forEach((v) => {
        if (v.id === val) {
          // this.userName = v.username
          this.userName = v.realname
          console.log(v)
        }
      })
      // console.log(this.userName)realname
    },

    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.publicWorkOrderModelDialog = true
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

          let resForm = {
            industryWorkOrder: {
              // createBy: formData.createBy || '',
              // createTime: formData.createTime || '',
              // deptId: formData.deptId || '',
              // deptName: formData.deptName || '',
              endTime: this.todayNightTime || '',
              id: formData.id || 0,
              name: formData.name || '',
              // remake: formData.remake || '',
              // startTime: this.nowTime || '',
              // status: formData.status || 0,
              startTime: formData.startTime,
              endTime: formData.endTime,
              updateBy: formData.updateBy || '',
              updateTime: formData.updateTime || '',
              userId: formData.userId || '',
              username: this.userName || '',
              workFlowId: formData.workFlowId || '',
              workFlowName: formData.workFlowName || '',
              updateTime: formData.updateTime || '',
            },
            workFlowNodes: [this.workFlowNodes],
          }

          httpAction(httpurl, resForm, method)
            .then((res) => {
              if (res.success) {
                that.$message.success('发布成功')
                that.$emit('ok')
                // this.$parent.getInfoCount()
                // this.$parent.getWorderOrders()
                this.form = this.$form.createForm(this)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.publicWorkOrderModelDialog = false
              that.close()
            })
        }
      })
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>

<style lang="less" scoped>
</style>