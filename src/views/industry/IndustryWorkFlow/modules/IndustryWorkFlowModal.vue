<template>
  <j-modal :title="title"
           :width="800"
           :visible="visible"
           :confirmLoading="confirmLoading"
           :fullscreen="isFullscreen"
           @ok="handleOk"
           @cancel="handleCancel"
           cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="工作流名称">
          <a-input placeholder="请输入工作流名称"
                   :maxLength='12'
                   v-decorator="['name', validatorRules.name]" />
        </a-form-item>

        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="产品型号">
          <a-select v-decorator="['productNo',validatorRules.productNo]"
                    placeholder="请选择产品型号"
                    @change="changeSelect">

            <a-select-option v-for="val in productNoList"
                             :key="val.id"
                             :value='val.productNo'>
              {{ val.productNo }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     label="描述">
          <a-textarea placeholder="请输入描述"
                      :maxLength='100'
                      v-decorator="['describes', {}]" />
        </a-form-item>
        <div style="clear: both"></div>

        <!-- 工作流 -->
        <panel v-model="faData"
               :fa-data="faData"
               :form='form'
               v-if="isShow == 1" />
      </a-form>
    </a-spin>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import panel from '@/views/ef/panel'
import { lc_validateName_flow } from '@/api/lc_api'
import { MessageBox } from 'element-ui'
export default {
  name: 'IndustryWorkFlowModal',

  props: {
    productNoList: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      lineTos: [],
      newNodes: [],
      filterNodes: [],
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
      isFullscreen: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        name: {
          rules: [
            {
              required: true,
              message: '请输入工作流名称!',
            },
            {
              validator: this.validateName,
            },
          ],
        },

        productNo: {
          rules: [
            {
              required: true,
              message: '请选择产品型号!',
            },
          ],
        },
      },
      url: {
        add: '/industry/industryWorkFlow/add',
        edit: '/industry/industryWorkFlow/add',
      },
      faData: {
        name: '流程A',
        nodeList: [
          {
            id: 'nodeA',
            name: '开始',
            type: 'start',
            left: '26px',
            top: '292.5px',
            ico: 'el-icon-user-solid',
          },
        ],
        lineList: [],
      },
      isShow: 0,
    }
  },

  components: {
    panel,
  },

  methods: {
    // 选择产品型号
    changeSelect(val) {
      let old = this.form.getFieldsValue().productNo
      if (val !== old && old) {
        MessageBox.confirm('更改产品型号会清空所有节点附件信息!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            // 清空所有节点附件信息
            this.faData.nodeList.forEach((v) => {
              v.flowNodeFiles = []
            })
            console.log(this.faData)
          })
          .catch(() => {
            this.form.setFieldsValue({ productNo: old })
          })
      }
    },

    // check名称
    async validateName(rule, value, callback) {
      if (this.title === '编辑') return
      const res = await lc_validateName_flow(value)
      const { result } = res
      if (result !== 0) {
        callback('名称已存在!')
      }
    },

    add() {
      this.isShow = 1
      this.edit({})
    },

    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'name', 'productNo', 'describes'))
        //时间格式化
      })

      httpAction('/industry/industryWorkFlow/queryById?id=' + record.id, null, 'GET')
        .then((res) => {
          // console.log(JSON.stringify(res))
          let data2 = {}
          data2['name'] = record.name

          let result = JSON.parse(
            JSON.stringify(res.result)
              .replace(/id/g, 'ids')
              .replace(/nodeId/g, 'id')
              .replace(/lefts/g, 'left')
              .replace(/tops/g, 'top')
              .replace(/froms/g, 'from')
              .replace(/tos/g, 'to')
          )

          data2['lineList'] = result.edges
          data2['nodeList'] = result.nodes
          this.faData = data2
          this.$emit('faData', this.faData)
          this.faData.nodeList.push({
            id: 'nodeA',
            nodeId: 'nodeA',
            name: '开始',
            type: 'start',
            left: '26px',
            top: '292.5px',
            ico: 'el-icon-user-solid',
          })
          // console.log(this.faData)
          this.isShow = 1
        })
        .finally(() => {
          that.confirmLoading = false
          that.close()
          // window.location.reload()
        })
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    filterForm() {
      const { nodeList, lineList } = this.faData
      let count = 0
      nodeList.forEach((v1) => {
        let has_toLine = lineList.some((v2) => {
          return v1.id === v2.to
        })
        if (!has_toLine) {
          count++
        }
      })
      return count
    },

    // 流程图保存
    handleOk() {
      let count = this.filterForm()
      if (count > 1) {
        this.$message.error('请连线后再进行保存 !')
        return
      }

      let resultName = ''
      this.form.validateFields((err, values) => {
        resultName = values.name
      })

      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'post'
          }
          let formData = Object.assign(this.model, values)
          let data1 = {}
          data1['nodes'] = JSON.parse(
            JSON.stringify(this.faData.nodeList)
              .replace(/id/g, 'nodeId')
              .replace(/left/g, 'lefts')
              .replace(/top/g, 'tops')
              .replace(/from/g, 'froms')
              .replace(/"to"/g, '"tos"')
          )

          // data1['nodes'] = JSON.parse(JSON.stringify(data1['nodes']).replace(/ifNeedVidseo/g, 'ifNeedVideo'))

          data1['edges'] = JSON.parse(
            JSON.stringify(this.faData.lineList)
              .replace(/id/g, 'nodeId')
              .replace(/left/g, 'lefts')
              .replace(/top/g, 'tops')
              .replace(/from/g, 'froms')
              .replace(/"to"/g, '"tos"')
          )
          data1['industryWorkFlow'] = formData

          data1['nodes'].forEach((v) => {
            if (v.type === 'task') {
              v.type = 0
            } else if (v.type === 'form') {
              v.type = 1
            } else if (v.type === 'picture') {
              v.type = 2
            } else if (v.type === 'play-square') {
              v.type = 3
            }
          })

          // console.log('流程图保存', data1['nodes'].length)
          // return
          if (data1['nodes'].length <= 1) {
            this.$message.error('请新建节点 !')
            return
          }
          that.confirmLoading = true
          // 给nodeList加排序index
          this.filterNodes = []
          this.lineTos = []
          this.newNodes = []
          let start = data1['nodes'].find((v) => {
            return v.name === '开始'
          })
          let newNodes = []
          let res_newNodes = this.addIndexToNode(data1['nodes'], data1['edges'], start, newNodes)

          res_newNodes = res_newNodes.filter((v) => {
            return v.name !== '开始'
          })

          data1['nodes'] = res_newNodes
          // console.log(this.newNodes)

          httpAction(httpurl, data1, method)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
              ;(this.faData = {
                name: '流程A',
                nodeList: [
                  {
                    id: 'nodeA',
                    name: '开始',
                    type: 'start',
                    left: '26px',
                    top: '292.5px',
                    ico: 'el-icon-user-solid',
                  },
                ],
                lineList: [],
              }),
                (this.isShow = 0)
              //  window.location.reload()
            })
        }
      })
    },

    addIndexToNode(nodes, lines, start, newNodes) {
      newNodes.push(start)

      lines.forEach((line) => {
        if (line.froms === start.nodeId) {
          nodes.forEach((node) => {
            if (line.tos === node.nodeId) {
              let childrenStart = node
              this.addIndexToNode(nodes, lines, childrenStart, newNodes)
            }
          })
        }
      })
      return newNodes
    },

    handleCancel() {
      MessageBox.confirm('您确定要退出吗!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.faData = {
            name: '流程A',
            nodeList: [
              {
                id: 'nodeA',
                name: '开始',
                type: 'task',
                left: '26px',
                top: '292.5px',
                ico: 'el-icon-user-solid',
              },
            ],
            lineList: [],
          }
          ;(this.faData = {
            name: '流程A',
            nodeList: [
              {
                id: 'nodeA',
                name: '开始',
                type: 'task',
                left: '26px',
                top: '292.5px',
                ico: 'el-icon-user-solid',
              },
            ],
            lineList: [],
          }),
            (this.isShow = 0)
          this.close()
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="less" scoped>
.ant-form-item {
  width: 33.33%;
  float: left;
}
</style>