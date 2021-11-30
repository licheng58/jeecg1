<template>
  <div style="padding: 0 10px; display: inline-block">
    <a-upload
      style="margin-right: 10px"
      :multiple="false"
      :showUploadList="false"
      :headers="tokenHeader"
      :action="uploadUrl"
      @change="handleChange"
      v-if="!disabled"
    >
      <a-button :loading="loading"> 上传文件 </a-button>
    </a-upload>
    <a @click="downloadFile" v-if="fileParam.fileName">{{ fileParam.fileName }}</a>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { downFile } from '@/api/manage'

export default {
  name: 'checkDate',
  props: {
    value: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      loading: false,
      downLoading: false,
      fileParam: {
        fileName: '',
        fileCode: '',
      },
      url: {
        uploadUrl: '/credit/xFileRecord/upload',
        download: '/credit/xFileRecord/download',
      },
    }
  },
  computed: {
    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.uploadUrl}`
    },
    download: function () {
      return `${window._CONFIG['domianURL']}/${this.url.download}`
    },
  },
  watch: {
    value(val) {
      console.log(val)
      if (!val) {
        this.fileParam = {
          fileName: '',
          fileCode: '',
        }
      } else {
        this.fileParam = JSON.parse(val)
      }
    },
  },
  methods: {
    dateChange(value) {
      this.$emit('change', this.fileParam.fileName ? JSON.stringify(this.fileParam) : '')
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.success) {
          this.fileParam.fileCode = info.file.response.result.fileCode
          this.fileParam.fileName = info.file.name
          this.dateChange()
        } else {
          this.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    downloadFile() {
      if (this.downLoading) {
        return
      }
      const param = {
        fileCode: this.fileParam.fileCode,
      }
      this.downLoading = true
      this.$message.loading({ content: '附件下载中...', key: 'downFile', duration: 0 })
      downFile(this.url.download, param)
        .then((data) => {
          this.downLoading = false
          if (!data) {
            // this.$message.warning('文件下载失败')
            this.$message.warning({ content: '文件下载失败', key: 'downFile', duration: 2 })
            return
          } else {
            this.$message.success({ content: '文件下载成功', key: 'downFile', duration: 2 })
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), this.fileParam.fileName)
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', this.fileParam.fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) //下载完成移除元素
            window.URL.revokeObjectURL(url) //释放掉blob对象
          }
        })
        .catch(() => {
          this.downLoading = false
          this.$message.warning({ content: '文件下载失败', key: 'downFile', duration: 2 })
        })
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>
<style lang="less">
</style>
