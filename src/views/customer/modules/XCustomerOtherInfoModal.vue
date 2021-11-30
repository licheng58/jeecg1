<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <x-customer-other-info-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></x-customer-other-info-form>
  </j-modal>
</template>

<script>

  import XCustomerOtherInfoForm from './XCustomerOtherInfoForm'
  export default {
    name: 'XCustomerOtherInfoModal',
    components: {
      XCustomerOtherInfoForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(record){
        this.$emit('ok',record);
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>