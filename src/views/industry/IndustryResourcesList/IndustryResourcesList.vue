<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline"
              @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="资源名称">
              <a-input placeholder="请输入资源名称"
                       v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>

          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <a-form-item label="产品型号">

              <a-select v-model="queryParam.productNo"
                        placeholder="请选择产品型号">
                <a-select-option v-for="val in productNoList"
                                 :key="val.productNo">
                  {{ val.productNo }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">

          </template>
          <a-col :xl="6"
                 :lg="7"
                 :md="8"
                 :sm="24">
            <span style="float: left;overflow: hidden;"
                  class="table-page-search-submitButtons">
              <a-button type="primary"
                        @click="searchQuery"
                        icon="search">查询</a-button>
              <a-button type="primary"
                        @click="searchReset"
                        icon="reload"
                        style="margin-left: 8px">重置</a-button>

            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd"
                type="primary"
                icon="plus">新增</a-button>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"
                       @click="batchDel">
            <a-icon type="delete" />删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table ref="table"
               size="middle"
               rowKey="id"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="ipagination"
               :loading="loading"
               class="j-table-force-nowrap"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange">

        <template slot="imgSlot"
                  slot-scope="text">
          <a-popover title="预览"
                     placement="rightTop">
            <template slot="content">
              <img :src="getImgView(text)"
                   v-if="checkFile(text) === 'img'"
                   style="height: 500px;width: 500px ;object-fit: contain;" />

              <video :src="getImgView(text)"
                     disablePictureInPicture
                     controlsList="nodownload"
                     v-else-if="checkFile(text) === 'video'"
                     controls="controls"
                     width="500"
                     height="500"></video>
              <img src="./images/2440fc73ac76e67630d0f9882b7d377.png"
                   v-else
                   style="height: 500px;width: 500px ;object-fit: contain;" />
            </template>

            <img :src="getImgView(text)"
                 v-if="checkFile(text) === 'img'"
                 alt=""
                 style="width: 40px; height: 40px;object-fit: contain;">
            <video :src="getImgView(text)"
                   disablePictureInPicture
                   controlsList="nodownload"
                   v-else-if="checkFile(text) === 'video'"
                   controls="controls"
                   width="40"
                   height="40"></video>
            <img src="./images/2440fc73ac76e67630d0f9882b7d377.png"
                 v-else
                 style="width: 40px; height: 40px;object-fit: contain;" />
          </a-popover>
        </template>

        <span slot="action"
              slot-scope="text, record">
          <!-- <a @click="handleEdit(record)">编辑</a> -->
          <a-popconfirm title="确定删除吗?"
                        @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>

          <a-divider type="vertical" />

          <a @click="downloadImg(record)">下载</a>

        </span>

      </a-table>
      <div class="ant-alert ant-alert-info"
           style="margin-bottom: 16px;"
           v-if="selectedRowKeys.length > 0">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px"
           @click="onClearSelected">清空</a>
      </div>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <industryResources-modal ref="modalForm"
                             :productNoList='productNoList'
                             @ok="modalFormOk"></industryResources-modal>
  </a-card>
</template>

<script>
import '@/assets/less/TableExpand.less'
import IndustryResourcesModal from './modules/IndustryResourcesModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { lc_getGrobalProductType } from '@/api/lc_api'
import writes from '@/utils/writes'
export default {
  name: 'IndustryResourcesList',
  mixins: [JeecgListMixin],

  components: {
    IndustryResourcesModal,
    JEllipsis,
  },

  data() {
    return {
      description: '资料库信息管理页面',
      productNoList: [], //产品型号数据
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
          title: '产品型号',
          align: 'center',
          dataIndex: 'productNo',
        },

        {
          title: '资源名称',
          align: 'center',
          dataIndex: 'title',
          ellipsis: true,
        },

        {
          title: '缩略图',
          align: 'center',
          dataIndex: 'url',
          scopedSlots: { customRender: 'imgSlot' },
        },
        {
          title: '文件类型',
          align: 'center',
          // dataIndex: 'fileType',
          customRender: (t, r, index) => {
            // return parseInt(fileType) + 1"image/png"
            let res = r.fileType

            const imgArr = [
              'image/jpeg',
              'image/jpg',
              'image/png',
              'image/gif',
              'image/tif',
              'image/swf',
              'image/psd',
              'image/cdr',
              'image/dxf',
              'image/ufo',
              'image/ai',
              'image/rif',
              'image/wmf',
              'image/emf',
              'image/eps',
              'image/svg',
            ]
            const videoArr = [
              'wmv',
              'avi',
              'dat',
              'asf',
              'mpeg',
              'mpg',
              'rm',
              'rmvb',
              'ram',
              'flv',
              'mp4',
              '3gp',
              'mov',
              'divx',
              'dv',
              'vob',
              'mkv',
              'qt',
              'cpk',
              'fli',
              'flc',
              'f4v',
              'm4v',
              'mod',
              'm2t',
              'swf',
              'webm',
              'mts',
              'm2ts',
            ]
            if (imgArr.indexOf(r.fileType) !== -1) {
              r.fileType && r.fileType.split('/')[1]
              return `图片/${r.fileType.split('/')[1]}`
            } else if (videoArr.indexOf(r.fileType && r.fileType.split('/')[1]) !== -1) {
              return `视频/${r.fileType.split('/')[1]}`
            } else {
              return `文件`
            }
          },
        },

        {
          title: '部门姓名',
          align: 'center',
          dataIndex: 'deptName',
        },

        {
          title: '上传人员',
          align: 'center',
          dataIndex: 'createBy',
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/industry/industryResources/list',
        delete: '/industry/industryResources/delete',
        deleteBatch: '/industry/industryResources/deleteBatch',
        exportXlsUrl: 'industry/industryResources/exportXls',
        importExcelUrl: 'industry/industryResources/importExcel',
      },
    }
  },

  created() {
    this.getGrobalProductType()
  },

  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  methods: {
    downloadImg(item) {
      // this.downloadIamge(item.url, item.title)
      this.downloadAjax(item.url, item.title)
    },

    downloadIamge(imgsrc, name) {
      // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },

    ajax(url, callback, options) {
      window.URL = window.URL || window.webkitURL
      var xhr = new XMLHttpRequest()
      xhr.open('get', url, true)
      if (options.responseType) {
        xhr.responseType = options.responseType
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          callback(xhr)
        }
      }
      xhr.send()
    },

    downloadAjax(url) {
      let innerurl = url // 文件地址
      var name = url.replace(/(.*\/)*([^.]+).*/gi, '$2')
      this.ajax(
        innerurl,
        function (xhr) {
          let filename = name + '.' + innerurl.replace(/(.*\.)/, '')
          let content = xhr.response
          let a = document.createElement('a')
          let blob = new Blob([xhr.response])
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download = filename
          a.click()
          window.URL.revokeObjectURL(url)
        },
        {
          responseType: 'blob',
        }
      )
    },

    // 获取产品型号数据
    async getGrobalProductType() {
      const res = await lc_getGrobalProductType()
      this.productNoList = res.result
    },

    // 判断图片和视频格式
    checkFile(fileName) {
      if (fileName) {
        var flieArr = fileName.split('.')
        let lastName = flieArr[flieArr.length - 1]
        let imgTypes = writes.imgTypes
        let videoTypes = writes.videoTypes

        let isImg = imgTypes.some((v) => {
          return v === lastName.toUpperCase()
        })

        let isVideo = videoTypes.some((v) => {
          return v === lastName
        })

        if (isImg) {
          return 'img'
        } else if (isVideo) {
          return 'video'
        }
      }
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>