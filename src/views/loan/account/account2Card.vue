<template>
  <a-form class="my-descriptions-form m0 no-line" :form="form" labelAlign="left" layout="horizontal">
    <a-row :gutter="0">
      <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
        <a-form-item :required="field.required" :label="field.name">
          <span v-if="[2, 3].includes(field.type)">
            <a-input
              :value="model[field.code] | typeFormat(field.types)"
              disabled
              :suffix="field.unit ? field.unit : ''"
            />
          </span>
          <span v-else>
            <comInput
              :value="model[field.code]"
              disabled
              :type="field.inputType ? field.inputType : 'text'"
              :unit="field.unit ? field.unit : ''"
            />
          </span>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { filterObj } from '@/utils/util.js'
import pick from 'lodash.pick'
import { customerType } from '@/utils/dictionary'

export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fieldList: [
        {
          name: '客户类型',
          code: 'customerType',
          type: 2,
          types: customerType,
          span: 8,
          required: true,
        },
        {
          name: '主借人',
          code: 'zjr',
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '证件号码',
          code: 'zjhm',
          type: 1,
          span: 8,
          required: true,
        },
      ],
      model: {},
      form: this.$form.createForm(this),
    }
  },

  created() {},
  methods: {
    init(record) {
      this.model = Object.assign({}, record)
      // this.$nextTick(() => {
      //   this.form.setFieldsValue(pick(this.model, 'customerType', 'zjr', 'zjhm'))
      // })
    },
  },
}
</script>