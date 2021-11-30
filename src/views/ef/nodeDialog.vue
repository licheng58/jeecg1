
<template>
  <div class="ef-node-form"
       id="ef-node-form">
    <el-dialog @close='closeDialog'
               :show-close='false'
               :visible.sync="nodeDialog"
               :close-on-click-modal='false'
               :close-on-press-escape='false'
               append-to-body
               z-index="999">

      <div slot="title"
           class="header-title"
           style="display: flex;
                  width: 100%;
                  justify-content: center;
                  align-items: center;font-size:16px;position: relative;">
        <span class="title">{{ title }} </span>
        <i class="el-icon-close"
           @click="cancel_node"
           style="font-size: 20px;
                  font-weight: 700;
                  cursor: pointer;
                  position: absolute;
                  top: 5px;
                  right: 5px;"></i>
      </div>
      <el-form :model="node"
               :rules="rules"
               ref="dataForm"
               label-width="140px"
               v-show="type === 'node'">
        <el-form-item label="名称"
                      prop='name'>
          <el-input v-model="node.name"
                    maxlength="12"></el-input>
        </el-form-item>

        <el-form-item label="是否检测采集图片">
          <el-select v-model="node.ifNeedImage">
            <el-option label="是"
                       :value="1"></el-option>
            <el-option label="否"
                       :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否检测采集视频">
          <el-select v-model="node.ifNeedSp">
            <el-option label="是"
                       :value="1"></el-option>
            <el-option label="否"
                       :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="附件上传"
                      prop="flowNodeFiles"
                      v-if="node.type !== 1 && node.type !== 'form'">

          <el-button type="primary"
                     @click="chooseAccessory">选择附件
          </el-button>
          <span class="error-word"
                v-show="isErrorWordShow">请选择附件!</span>

          <el-popover placement="right"
                      title="图片预览"
                      trigger="click"
                      popper-class='node-popover'
                      v-for="item in node.flowNodeFiles"
                      :key="item.id">

            <img :src="item.url"
                 v-if="checkFile(item.url) === 'img'"
                 style="height: 500px;width: 500px ;">

            <img slot="reference"
                 :src="item.url"
                 v-if="checkFile(item.url) === 'img'"
                 style="height: 50px;max-width: 50px ;margin:0 20px">

            <video :src="item.url"
                   controls="controls"
                   disablePictureInPicture
                   controlsList="nodownload"
                   v-if="checkFile(item.url) === 'video'"
                   style="height: 500px;width: 500px ;vertical-align: middle" />

            <video slot="reference"
                   disablePictureInPicture
                   controlsList="nodownload"
                   :src="item.url"
                   v-if="checkFile(item.url) === 'video'"
                   controls="controls"
                   style="height: 50px;max-width: 50px ;margin:0 20px;vertical-align: middle" />

            <i slot="reference"
               class="el-icon-close node-close"
               style="right: 12px;
                      top: -20px;
                      font-weight: 700;"
               @click="delImg(item)"></i>

          </el-popover>

        </el-form-item>

        <el-form-item label="检验项目和标准">
          <el-input v-model="node.content"
                    type="textarea"
                    :rows="3"
                    placeholder="最大长度不能超100字"
                    :maxlength="100"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel_node">取 消</el-button>
          <el-button type="primary"
                     @click="save_node">保 存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title='附件上传'
               :fullscreen='isFullscreen'
               :visible.sync="chooseAccessoryDialog"
               append-to-body
               ref="myDialog"
               custom-class='chooseAccessoryDialog'
               z-index="1000">

      <div slot="title"
           class="header-title"
           style="display: flex;
    justify-content: space-between;">
        <span style="font-size:20px">{{title}} </span>
        <span>
          <!-- <el-button style="margin-right:50px"
                     type="text">本地上传</el-button> -->
          <a-upload v-decorator="[
              'fileList',
              {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              },
            ]"
                    name="file"
                    :action="uploadUrl"
                    @change="handleChange"
                    :before-upload="beforeUpload"
                    :headers="tokenHeader"
                    list-type="picture"
                    :data="{ bucketName: 'industry' }">
            <a-button :loading="loading"
                      style="margin-right:50px">
              <a-icon type="upload" />文件上传
            </a-button>
          </a-upload>
        </span>
      </div>
      <a-table ref="table"
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               class="j-table-force-nowrap"
               :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">

        <template slot="imgSlot"
                  slot-scope="text">

          <a-popover title="预览"
                     placement="rightTop">
            <template slot="content">
              <img :src="getImgView(text)"
                   v-if="checkFile(text) === 'img'"
                   style="height: 200px;width: 200px ;object-fit: contain;" />

              <video :src="getImgView(text)"
                     disablePictureInPicture
                     controlsList="nodownload"
                     v-if="checkFile(text) === 'video'"
                     controls="controls"
                     width="200"
                     height="200"></video>
            </template>

            <img :src="getImgView(text)"
                 v-if="checkFile(text) === 'img'"
                 alt=""
                 style="width: 40px; height: 40px;object-fit: contain;">
            <video :src="getImgView(text)"
                   disablePictureInPicture
                   controlsList="nodownload"
                   v-if="checkFile(text) === 'video'"
                   controls="controls"
                   width="40"
                   height="40"></video>
          </a-popover>
        </template>

        <!-- <span slot="action"
              slot-scope="text, record">
          <a @click="handleChoose(record)">选择</a>

        </span> -->

      </a-table>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="chooseAccessoryDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { Message } from 'element-ui'
import Vue from 'vue'
export default {
  props: {
    nodeDialog: Boolean,
    title: String,
    form: {
      type: Object,
      default: {},
    },
  },

  mixins: [JeecgListMixin],

  data() {
    return {
      isErrorWordShow: false,
      pageType: 'nodeDialog',
      isFullscreen: false, //全屏
      selectedRowKeys: [],
      selectedRows: [],
      selectData: [], //table多选的值
      uploadData: [], //上传文件的值
      loading: false,
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      chooseAccessoryDialog: false,
      type: 'node',
      node: {},
      realNode: {},
      line: {},
      data: {},
      fileList: [],
      action: `${window.location.origin}/jeecg-boot/sys/upload/uploadFile`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Access-Token': this.$store.getters.token,
      },
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          },
        },
        {
          title: '资源名称',
          align: 'center',
          dataIndex: 'title',
        },
        {
          title: '产品型号',
          align: 'center',
          dataIndex: 'productNo',
          // customRender: function (t, r, index) {
          //   return t === '1' ? '中德热水器' : '其他'
          // },
        },
        {
          title: '文件路径',
          align: 'center',
          dataIndex: 'url',
          scopedSlots: { customRender: 'imgSlot' },
          // customRender: function (t, r, index) {
          //   return <img src={t} style="width: 40px; height: 40px; border-radius: 20px;" />
          // },
        },
        {
          title: '文件类型',
          align: 'center',
          dataIndex: 'fileType',
        },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],

      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        flowNodeFiles: [{ required: true, message: ' ', trigger: 'change' }],
      },

      url: {
        list: '/industry/industryResources/list',
        delete: '/industry/industryResources/delete',
        deleteBatch: '/industry/industryResources/deleteBatch',
        exportXlsUrl: 'industry/industryResources/exportXls',
        importExcelUrl: 'industry/industryResources/importExcel',
      },
      disableMixinCreated: true,
      selectVal: '',
    }
  },

  watch: {
    'node.flowNodeFiles': function (v) {
      if (v.length === 0) {
        this.isErrorWordShow = true
      } else {
        this.isErrorWordShow = false
      }
    },
  },

  computed: {
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/sys/upload/uploadFile`
    },
  },

  methods: {
    /**
     * 表单修改，这里可以根据传入的ID进行业务信息获取
     * @param data
     * @param id
     */
    nodeInit(data, id) {
      this.type = 'node'
      this.data = data
      data.nodeList.forEach((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node)
        }
      })
    },

    // 上传附件 多选  点击表格多选框
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows)
      if (selectedRowKeys.length > 3) {
        Message({
          message: '附件不能超过3张,请删除后再进行选择 !',
          type: 'error',
          customClass: 'mzindex',
        })
        return
      }
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    filterNodes() {
      console.log(this.node.flowNodeFiles)
      let newArr = []
      if (this.node.flowNodeFiles.length === 0) {
        newArr = this.selectData
      } else {
        this.selectData.forEach((v2) => {
          this.node.flowNodeFiles.forEach((v) => {
            if (v.url !== v2.url) {
              newArr.push(v2)
            }
          })
        })
      }

      return newArr
    },

    checkFile(fileName) {
      if (fileName) {
        var flieArr = fileName.split('.')
        let lastName = flieArr[flieArr.length - 1]
        let imgArr = ['gif', 'jpg', 'jpeg', 'png', 'GIF', 'JPG', 'PNG']

        let res = imgArr.some((v) => {
          return v === lastName
        })
        if (res) {
          return 'img'
        } else {
          return 'video'
        }
      }
    },

    // 上传附件弹框保存
    handleSave() {
      this.node.flowNodeFiles = this.selectedRows
      this.chooseAccessoryDialog = false
    },

    // 打开选择附件弹框
    chooseAccessory() {
      this.selectData = []
      this.uploadData = []

      this.$parent.$parent.form.validateFields((err, values) => {
        this.selectVal = values.productNo
        if (this.selectVal) {
          this.chooseAccessoryDialog = true
          this.url.list = `/industry/industryResources/list?productNo=${this.selectVal}`
          this.loadData()
        } else {
          // this.$message.error('请选择产品类型')
          Message({
            message: '请选择产品类型 !',
            type: 'error',
            customClass: 'mzindex',
          })
          this.$emit('handleClose')
        }
      })
    },

    // 删除附件
    delImg(item) {
      // console.log(item)
      // console.log(this.node.flowNodeFiles)
      let res = this.node.flowNodeFiles.filter((v) => {
        return v.url !== item.url
      })

      this.node.flowNodeFiles = res
      this.$forceUpdate()
      Message({
        message: '删除成功 !',
        type: 'success',
        customClass: 'mzindex',
      })
      // console.log(this.node.flowNodeFiles)
    },

    // 本地图片上传之前验证格式
    beforeUpload(file) {
      // console.log(file)
      let types = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/rmvb',
        'video/avi',
        'video/ts',
      ]
      const isJpgOrPng = types.indexOf(file.type) === -1
      if (isJpgOrPng) {
        return this.$message.error('请选择正确格式附件!')
      }
    },

    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          // 上传成功

          // console.log(info.file.response)
          let res = {
            // sort: this.node.flowNodeFiles ? this.node.flowNodeFiles.length + 1 : 1,
            ids: Date.now(),
            title: '本地资源',
            url: info.file.response.message,
            workFlowNodeId: this.node.ids,
          }
          // console.log(res)
          this.dataSource.push(res)
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },

    beforeImageUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp'
      if (!isJPG) {
        this.$message.error('请上传图片文件')
      }
      const isLt2M = file.size / 1024 < 1024 * 16 && file.size / 1024 > 10
      if (!isLt2M) {
        this.$message.error('文件大小应在10KB~200KB之间')
      }
      return isJPG && isLt2M
    },

    normFile(e) {
      // console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },

    lineInit(line) {
      this.type = 'line'
      this.line = line
    },

    // 修改连线
    saveLine() {
      this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label)
    },

    // 保存节点
    save_node() {
      // console.log(1122)
      this.$refs.dataForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          // 排序
          this.sortNodes()

          this.data.nodeList.forEach((v, index, arr) => {
            if (v.id === this.node.id) {
              this.$set(arr, index, this.node)
            }
          })
          this.$parent.nodeDialog = false
        }
      })
    },

    sortNodes() {
      if (this.node.flowNodeFiles) {
        return (this.node.flowNodeFiles = this.node.flowNodeFiles.map((v, index) => {
          return {
            sort: index + 1,
            url: v.url,
            workFlowNodeId: this.node.ids,
          }
        }))
      }
    },

    // 取消节点
    cancel_node() {
      // console.log(this.title)
      if (this.title === '新建节点') {
        this.$parent.nodeDialog = false
        this.$parent.cancelNode(this.node.id)
      } else if (this.title === '编辑节点') {
        this.$parent.nodeDialog = false
        // this.$refs.dataForm.resetFields()
      }
    },

    closeDialog() {
      // this.$emit('handleClose')
      // this.$refs.dataForm.resetFields()
    },

    // 判断图片和视频格式
    checkFile(fileName) {
      if (fileName) {
        var flieArr = fileName.split('.')
        let lastName = flieArr[flieArr.length - 1]
        let imgArr = ['gif', 'jpg', 'jpeg', 'png', 'GIF', 'JPG', 'PNG']

        let res = imgArr.some((v) => {
          return v === lastName
        })
        if (res) {
          return 'img'
        } else {
          return 'video'
        }
      }
    },
  },
}
</script>

<style >
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
.chooseAccessoryDialog .el-dialog__body {
  height: 60vh;
  overflow: auto;
}

.chooseAccessoryDialog .mzindex {
  z-index: 3000;
}

.node-close {
  position: absolute;
  right: 0;
  top: -10px;
  cursor: pointer;
  color: #f56c6c;
}

.chooseAccessoryDialog .el-popover__reference-wrapper {
  position: relative;
}

.chooseAccessoryDialog .ant-upload-list-picture .ant-upload-list-item,
.ant-upload-list-picture-card .ant-upload-list-item {
  display: none;
}
</style>

<style lang="less" scoped>
/deep/.el-popover__reference-wrapper {
  position: relative;
  cursor: zoom-in;
}
.error-word {
  position: absolute;
  font-size: 12px;
  color: #f56c6c;
  bottom: -25px;
  left: 5px;
}

/deep/.el-form-item__content {
  position: relative;
}
</style>
