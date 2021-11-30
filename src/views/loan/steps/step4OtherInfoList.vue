<template>
  <div>
    <a-form class="my-descriptions-form m0 no-line" :form="form" labelAlign="left" layout="horizontal">
      <a-row :gutter="0">
        <a-col v-for="field in fieldList" :key="field.code" :span="field.span">
          <a-form-item :label="field.name">
            <span v-if="[2, 3].includes(field.type)">
              <a-input
                :value="model[field.code] | typeFormat(field.types)"
                disabled
                :suffix="field.unit ? field.unit : ''"
              />
            </span>
            <span v-else-if="field.type === 8">
              <comUpload :value="model[field.code]" disabled />
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
  </div>
</template>
<script>
import { filterObj } from '@/utils/util.js'
import pick from 'lodash.pick'
import { getAction, postAction } from '@/api/manage'
import { jkrsfType, dbType, bzType, gjrType, dywType, zywType } from '@/utils/dictionary'
import comUpload from '@/components/jeecg/comUpload'

export default {
  components: {
    comUpload,
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
    record: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      customerData: null,
      model: {},
      fieldDefaultList: [
        {
          name: '借款人身份',
          code: 'jkrsf',
          type: 2,
          types: jkrsfType,
          span: 8,
          required: true,
        },
        {
          name: '担保类型',
          code: 'dblx',
          filter: [{ code: 'jkrsf', value: '1' }],
          type: 2,
          types: dbType,
          span: 8,
          required: true,
        },
        {
          name: '共借人',
          code: 'gjr',
          filter: [{ code: 'jkrsf', value: '2' }],
          type: 2,
          types: gjrType,
          span: 8,
          required: true,
        },
        {
          name: '保证人',
          code: 'bzr',
          filter: [{ code: 'dblx', value: '1' }],
          type: 2,
          types: bzType,
          span: 8,
          required: true,
        },
        {
          name: '抵押物',
          code: 'dyw',
          filter: [{ code: 'dblx', value: '2' }],
          type: 2,
          types: dywType,
          span: 8,
          required: true,
        },
        {
          name: '质押物',
          code: 'zyw',
          filter: [{ code: 'dblx', value: '3' }],
          type: 2,
          types: zywType,
          span: 8,
          required: true,
        },
        {
          name: '门店编号',
          code: 'code',
          filter: [
            { code: 'bzr', value: '1' },
            { code: 'gjr', value: '1' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '加盟酒店店名',
          code: 'jmjddm',
          filter: [
            { code: 'bzr', value: '1' },
            { code: 'gjr', value: '1' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '工商注册名称',
          code: 'gszcmc',
          filter: [{ code: 'bzr', value: '2' }],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '统一社会信用代码',
          code: 'tyshxydm',
          filter: [{ code: 'bzr', value: '2' }],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '姓名',
          code: 'xm',
          filter: [
            { code: 'bzr', value: '3' },
            { code: 'gjr', value: '2' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '身份证号',
          code: 'sfzh',
          filter: [
            { code: 'bzr', value: '3' },
            { code: 'gjr', value: '2' },
          ],
          type: 1,
          span: 8,
          required: true,
        },

        {
          name: '担保额',
          code: 'dbe',
          filter: [{ code: 'dblx', value: '1' }],
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
        },

        {
          name: '名称',
          code: 'mc',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '权属',
          code: 'qs',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },

        {
          name: '状况',
          code: 'zk',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          span: 8,
          required: true,
        },
        {
          name: '抵押额', //质押物
          code: 'dyye',
          filter: [
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
          ],
          type: 1,
          inputType: 'number',
          span: 8,
          required: true,
        },
        {
          name: '上传附件',
          code: 'fjname', //fjcode
          filter: [
            { code: 'gjr', value: '2' },
            { code: 'dblx', value: '2' },
            { code: 'dblx', value: '3' },
            { code: 'bzr', value: '2' },
            { code: 'bzr', value: '3' },
          ],
          type: 8,
          span: 8,
          required: true,
        },
      ],
      fieldList: [],
      form: this.$form.createForm(this),
    }
  },

  created() {
    this.init()
  },
  methods: {
    init() {
      this.fieldDefaultList[7].span = this.record.jkrsf === '1' || this.record.gjr !== '1' ? 8 : 24
      this.fieldDefaultList[16].name = this.record.dblx === '2' ? '抵押额' : '质押额'
      this.fieldDefaultList[17].span = this.record.dblx === '1' ? 24 : 16
      this.fieldList = this.fieldDefaultList.filter(
        (item) => !item.filter || item.filter.some((data) => data.value === this.record[data.code])
      )
      this.$nextTick(() => {
        this.model = Object.assign({}, this.record)
      })
    },
  },
}
</script>
