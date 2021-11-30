
import { deleteAction, downFile, getFileAccessHttpUrl } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const tableListMixin = {
  data() {
    return {
      //token header
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      /** 高级查询拼接方式 */
      superQueryMatchType: 'and',
      selectedRows: [],
    }
  },

  methods: {
    handleSelectionChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    searchQuery() {
      this.handleSelectionChange([], [])
      this.$refs.MyTable.reload()
    },
    modalFormOk() {
      this.searchQuery()
    },
    searchReset() {
      this.queryParam = {}
      this.handleSelectionChange([], [])
      this.$nextTick(() => {
        this.$refs.MyTable.reload()
      })
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error("请设置url.deleteBatch属性!")
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否删除选中数据?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.searchQuery()
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.searchQuery()
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit: function (record) {
      // console.log(record);
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "编辑";
      this.$refs.modalForm.disableSubmit = false;
    },

    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },

    handleDetail: function (record) {
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "详情";
      this.$refs.modalForm.disableSubmit = true;
    },

    /* 导出 */
    handleExportXls2() {
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },

    handleExportXls(fileName) {
      if (!fileName || typeof fileName != "string") {
        fileName = "导出文件"
      }
      let param = this.$refs.MyTable.getQueryParams();
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(",")
      }
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },

    /* 导入 */
    handleImportExcel(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br />
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          that.searchQuery()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
      }
    },

    /* 图片预览 */
    getImgView(text) {
      if (text && text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      return getFileAccessHttpUrl(text)
    },

    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
  }

}