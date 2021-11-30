<template>
  <a-form class="my-descriptions-form m0 no-line" labelAlign="left" layout="horizontal">
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
          <span v-else-if="field.type === 4">
            <a-input
              :value="model[field.code] | moment('YYYY-MM-DD')"
              disabled
              :suffix="field.unit ? field.unit : ''"
            />
          </span>
          <span v-else-if="field.type === 6">
            <a-input
              :value="model[field.code] | distFormat(field.dictCode)"
              disabled
              :suffix="field.unit ? field.unit : ''"
            />
          </span>
          <span v-else-if="field.type === 7">
            <a-input
              :value="model[field.code] | cqdateFormat('YYYY-MM-DD')"
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
import pick from 'lodash.pick'
import moment from 'moment'

export default {
  props: {
    fieldList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: {},
    }
  },

  methods: {
    init(record) {
      if (record) {
        this.model = Object.assign({}, record)
      }
    },
  },
}
</script>
<style lang="less">
.page-task-report {
  position: relative;
  border: 1px solid #e5e5e5;
  margin: 0 16px 49px;
  h1 {
    margin: 16px auto;
    text-align: center;
    font-size: 24px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #202b3b;
    line-height: 33px;
  }
  .no-line {
    border-left: none;
    border-bottom: none;
  }
  .b-line {
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>