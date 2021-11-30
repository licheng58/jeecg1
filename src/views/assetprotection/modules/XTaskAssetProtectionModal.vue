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
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="业务品种">
              <a-input placeholder="请输入业务品种" v-decorator="['ywpz', {}]" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="业务币种">
              <a-input placeholder="请输入业务币种" v-decorator="['ywbz', {}]" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="贷款金额(元)">
              <a-input placeholder="请输入贷款金额(元)" v-decorator="['dkje', {}]" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="到期日期">
              <a-date-picker v-decorator="['dqrq', {}]" format="YYYY-MM-DD" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="当前余额(万)">
              <a-input placeholder="请输入当前余额" v-decorator="['dqye', {}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="回收金额(万)">
              <a-input placeholder="请输入回收金额" v-decorator="['hsje', {}]"/>
            </a-form-item>
          </a-col> -->
          <a-col :span="24">
            <a-form-item :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }" label="五级分类">
              <a-select v-decorator="['wjfl', {}]" placeholder="请选择五级分类" allowClear>
                <a-select-option v-for="(value, key, index) of zcfl" :key="index" :value="key">
                  {{ value }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>	
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { customerType, zcfl } from '@/utils/dictionary'

  export default {
    name: "XTaskAssetProtectionModal",
    data () {
      return {
        title:"操作",
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
        customerType,
        zcfl,
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/credit/xTaskAssetProtection/add",
          edit: "/credit/xTaskAssetProtection/edit",
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
          this.form.setFieldsValue(pick(this.model,'taskId','taskNo','customerType','xm','ywpz','ywbz','dqrq','fslx','hsje','dqye','wjfl','status'))
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
            // 时间格式化    
            // 加上财务公司客户经理userThirdId
            formData.userThirdId = '491a5c4f754a400aa7b08af3f2cf8436'    
            
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
            ywpz: customer.ywpz,
            ywbz: customer.ywbz,
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