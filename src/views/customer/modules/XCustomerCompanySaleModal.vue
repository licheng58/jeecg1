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
    <x-customer-company-sale-form
      ref="realForm"
      @ok="submitCallback"
      :disabled="disableSubmit"
    ></x-customer-company-sale-form>
  </j-modal>
</template>

<script>
import XCustomerCompanySaleForm from './XCustomerCompanySaleForm'
export default {
  name: 'XCustomerCompanySaleModal',
  components: {
    XCustomerCompanySaleForm,
  },
  data() {
    return {
      title: '',
      width: 500,
      visible: false,
      disableSubmit: false,
    }
  },
  methods: {
    add(endMonth) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.realForm.add(endMonth)
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
      this.$emit('ok', record)
      this.visible = false
    },

    handleCancel() {
      this.close()
    },
  },
}
</script>