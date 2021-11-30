<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row :gutter="12">
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="申请流水号">
              <CustomerSelect
                placeholder="请输入申请流水号"
                v-decorator="['taskNo', {}]"
                valueCode="task_no"
                :type = "2"
                @select="taskNoSelect"
              ></CustomerSelect>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="客户类型">
              <a-select v-decorator="['customerType', {}]" placeholder="请选择客户类型" allowClear disabled>
                <a-select-option v-for="(value, key, index) of customerType" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="客户名称">
              <a-input placeholder="请输入客户名称" v-decorator="['xm', {}]" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="证件号码">
              <a-input placeholder="请输入证件号码" v-decorator="['sjhm', {}]" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="贷款金额(万)">
              <a-input placeholder="请输入贷款金额" v-decorator="['dkje', {}]" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="贷款期限(月)">
              <a-input placeholder="请输入贷款期限" v-decorator="['dkqx', {}]" disabled/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="贷后状态">
              <a-input placeholder="请输入贷后状态" v-decorator="['status', {}]" />
            </a-form-item>
          </a-col> -->
          <!-- <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="taskId">
              <a-input placeholder="请输入taskId" v-decorator="['taskId', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="customerId">
              <a-input placeholder="请输入customerId" v-decorator="['customerId', {}]" />
            </a-form-item>
          </a-col> -->

        </a-row>	
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from "moment"
import { customerType, reportStatus } from '@/utils/dictionary'

export default {
  name: "xTaskAfterLoanModal",
  data () {
    return {
      title:"操作",
      visible: false,
      model: {},
      customerType,
      reportStatus,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules:{
      },
      url: {
        add: "/credit/xTaskAfterLoan/add",
        edit: "/credit/xTaskAfterLoan/edit",
      },
    }
  },
  created () {
  },
  methods: {
    add () {
      this.edit({});
    },
    edit (record) {
      this.form.resetFields();
      this.model = Object.assign({}, record);
      this.visible = true;
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model,'taskNo','customerType','xm','sjhm','dkje','dkqx'))
    //时间格式化
      });

    },
    close () {
      this.$emit('close');
      this.visible = false;
    },
    handleOk () {
      const that = this;
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true;
          let httpurl = '';
          let method = '';
          if(!this.model.id){
            httpurl+=this.url.add;
            method = 'post';
          }else{
            httpurl+=this.url.edit;
            method = 'put';
          }
          let formData = Object.assign(this.model, values);
          //时间格式化
          
          console.log(formData)
          httpAction(httpurl,formData,method).then((res)=>{
            if(res.success){
              that.$message.success(res.message);
              that.$emit('ok');
            }else{
              that.$message.warning(res.message);
            }
          }).finally(() => {
            that.confirmLoading = false;
            that.close();
          })



        }
      })
    },
    handleCancel () {
      this.close()
    },
    taskNoSelect(customer) {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          customerType: customer.customer_type,
          xm: customer.zjr,
          sjhm: customer.zjhm,
          dkje: customer.amount,
          dkqx: customer.qx,
        })
        this.model.taskId = customer.id
        this.model.customerId = customer.customer_id
      })
    },

  }
}
</script>

<style lang="less" scoped>

</style>