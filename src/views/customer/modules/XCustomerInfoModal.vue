<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <x-customer-info-form
      ref="realForm"
      @ok="submitCallback"
      :disabled="disableSubmit"
    ></x-customer-info-form>
  </j-modal>
</template>

<script>
import XCustomerInfoForm from './XCustomerInfoForm'
export default {
  name: 'XCustomerInfoModal',
  components: {
    XCustomerInfoForm,
  },
  data() {
    return {
      title: '',
      width: 700,
      visible: false,
      disableSubmit: false,
    }
  },
  methods: {
    add() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add()
      })
    },
    edit(record) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.edit(record)
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      this.$refs.realForm.submitForm()
    },
    submitCallback(record) {
      this.$emit('ok',record)
      this.visible = false
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>