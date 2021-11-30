<template>
  <div v-if="easyFlowVisible"
       class="easyFlowVisible">
    <el-row>
      <!--顶部工具菜单-->
      <el-col :span="24">
        <div class="ef-tooltar">
          <node-menu :form='form'
                     @addNode="addNode"
                     ref="nodeMenu"></node-menu>
          <el-button type='danger'
                     @click="deleteElement"
                     :disabled="this.activeElement.type !=='line'">删除连接线</el-button>
        </div>
      </el-col>
    </el-row>
    <div style="display: flex; height: calc(100%)">
      <div id="efContainer"
           ref="efContainer"
           class="container"
           v-flowDrag>
        <template v-for="node in data.nodeList">
          <flow-node :id="node.id"
                     :key="node.id"
                     :node="node"
                     ref="nodeForm"
                     :form='form'
                     :activeElement="activeElement"
                     @changeNodeSite="changeNodeSite"
                     @nodeRightMenu="nodeRightMenu"
                     @clickNode="clickNode">
          </flow-node>
        </template>
        <!-- 给画布一个默认的宽度和高度 -->
        <div style="position: absolute; left: 2000px">&nbsp;</div>

        <!-- 编辑节点 -->
        <node-dialog ref="nodeDialog"
                     :form='form'
                     :title='title'
                     :AllData="data"
                     :nodeForm='activeNode'
                     :nodeDialog='nodeDialog'
                     @handleClose='handleClose'></node-dialog>
      </div>
    </div>
    <!-- 流程数据详情 -->
    <flow-info v-if="flowInfoVisible"
               ref="flowInfo"
               :data="data"></flow-info>
  </div>
</template>

<style scoped>
@import 'index.css';
</style>

<script>
import draggable from 'vuedraggable'
// import { jsPlumb } from 'jsplumb'
// 使用修改后的jsplumb
import './jsplumb'
import { easyFlowMixin } from '@/views/ef/mixins'
import flowNode from '@/views/ef/node'
import nodeMenu from '@/views/ef/node_menu'
import FlowInfo from '@/views/ef/info'
import FlowNodeForm from './node_form'
import lodash from 'lodash'
import nodeDialog from './nodeDialog.vue'

export default {
  data() {
    return {
      title: '', //弹框
      fromsNodes: [],
      activeNode: {}, //点击的node
      nodeDialog: false, //node弹框
      jsPlumb: null, // jsPlumb 实例
      easyFlowVisible: true, // 控制画布销毁
      flowInfoVisible: false, // 控制流程数据显示与隐藏
      loadEasyFlowFinish: false, // 是否加载完毕标志位
      flowHelpVisible: false,
      data: {}, // 数据
      activeElement: {
        // 激活的元素、可能是节点、可能是连线
        type: undefined, // 可选值 node 、line
        nodeId: undefined, // 节点ID
        sourceId: undefined, // 连线ID
        targetId: undefined,
      },
      zoom: 0.5,
      timer: '',
    }
  },

  model: {
    prop: 'faData', //接收props内值
    event: 'changeData', //自定义事件名
  },

  props: {
    faData: {
      type: Object,
      default: '',
    },
    form: {
      type: Object,
      default: {},
    },
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    draggable,
    flowNode,
    nodeMenu,
    FlowInfo,
    FlowNodeForm,
    nodeDialog,
  },

  directives: {
    flowDrag: {
      bind(el, binding, vnode, oldNode) {
        if (!binding) {
          return
        }
        el.onmousedown = (e) => {
          if (e.button == 2) {
            // 右键不管
            return
          }
          //  鼠标按下，计算当前原始距离可视区的高度
          let disX = e.clientX
          let disY = e.clientY
          el.style.cursor = 'move'

          document.onmousemove = function (e) {
            // 移动时禁止默认事件
            e.preventDefault()
            const left = e.clientX - disX
            disX = e.clientX
            el.scrollLeft += -left

            const top = e.clientY - disY
            disY = e.clientY
            el.scrollTop += -top
          }

          document.onmouseup = function (e) {
            el.style.cursor = 'auto'
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      },
    },
  },

  mounted() {
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
      // this.data=getDataA();
      // console.log(this.faData)
      this.dataReload(this.faData)
    })
    this.timer = setInterval(this.dataChange, 1000)
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    handleClose(v) {
      // console.log(1111)
      // console.log(v)
      this.data.nodeList.forEach((item) => {
        if (v.id === item.id) {
          item = { ...v }
        }
      })
      this.nodeDialog = false
      console.log(this.data.nodeList)
    },

    // 每个节点只能拖出一根线
    is_oneLine(from) {
      return this.data.lineList.some((v) => {
        return v.from === from
      })
    },

    dataChange() {
      // console.log(JSON.stringify(this.data))
      this.$emit('changeData', this.data)
    },

    // 返回唯一标识
    getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },

    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线, https://www.cnblogs.com/ysx215/p/7615677.html
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.activeElement.type = 'line'
          this.activeElement.sourceId = conn.sourceId
          this.activeElement.targetId = conn.targetId
          this.$refs.nodeForm.lineInit({
            from: conn.sourceId,
            to: conn.targetId,
            label: conn.getLabel(),
          })
        })

        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          let from = evt.source.id
          let to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
          }
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 连线右击
        this.jsPlumb.bind('contextmenu', (evt) => {
          console.log('contextmenu', evt)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          let from = evt.sourceId
          let to = evt.targetId
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('两个节点之间连线回环')
            return false
          }
          if (this.is_oneLine(from)) {
            this.$message.error('不支持多分支连线')
            return false
          }

          if (this.is_invertedLine(from, to)) {
            this.$message.error('不支持倒序连线')
            return false
          }

          if (this.is_oneImportLine(from, to)) {
            this.$message.error('只支持一个入口')
            return false
          }

          if (this.start_node(from, to)) {
            this.$message.error('开始节点不支持此种连线')
            return false
          }

          this.$message.success('连接成功')
          return true
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    },

    // 是否倒序连线
    is_invertedLine(from, to) {
      this.fromsNodes = []
      this.getLineFroms(from)
      let res = this.fromsNodes.some((v) => {
        return v.id === to
      })
      if (res) {
        return true
      } else {
        return false
      }
    },

    getLineFroms(from) {
      // console.log(from)
      // console.log(this.data)
      const { lineList, nodeList } = this.data
      lineList.forEach((line) => {
        if (line.to === from) {
          nodeList.forEach((node) => {
            if (node.id === line.from) {
              this.fromsNodes.push(node)
              line.from && this.getLineFroms(node.id)
            }
          })
        }
      })
    },

    // 只支持一个入口
    is_oneImportLine(from, to) {
      const { lineList, nodeList } = this.data
      return lineList.some((line) => {
        return line.to === to
      })
    },

    // 开始节点判断
    start_node(from, to) {
      // 1-查找开始节点
      const { lineList, nodeList } = this.data
      let startNode = nodeList.find((v) => {
        return v.name === '开始'
      })
      // console.log(startNode)
      // console.log(to)
      if (to === startNode.id) {
        return true
      } else {
        return false
      }
    },

    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        if (!node.viewOnly) {
          this.jsPlumb.draggable(node.id, {
            containment: 'parent',
            stop: function (el) {
              // 拖拽节点结束后的对调
              // console.log('拖拽结束: ', el)
            },
          })
        }
      }
      // 初始化连线
      for (var i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i]
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : '',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined,
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }

      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },

    // 设置连线条件
    setLineLabel(from, to, label) {
      var conn = this.jsPlumb.getConnections({
        source: from,
        target: to,
      })[0]
      if (!label || label === '') {
        conn.removeClass('flowLabel')
        conn.addClass('emptyFlowLabel')
      } else {
        conn.addClass('flowLabel')
      }
      conn.setLabel({
        label: label,
      })
      this.data.lineList.forEach(function (line) {
        if (line.from == from && line.to == to) {
          line.label = label
        }
      })
    },

    // 删除激活的元素
    deleteElement() {
      if (this.activeElement.type === 'node') {
        this.deleteNode(this.activeElement.nodeId)
      } else if (this.activeElement.type === 'line') {
        const that = this
        this.$confirm({
          title: '提示',
          content: '确定删除所点击的线吗 ?',
          onOk() {
            var conn = that.jsPlumb.getConnections({
              source: that.activeElement.sourceId,
              target: that.activeElement.targetId,
            })[0]
            that.jsPlumb.deleteConnection(conn)
          },
          onCancel() {},
        })
      }
    },

    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function (line) {
        if (line.from == from && line.to == to) {
          return false
        }
        return true
      })
    },

    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },

    // 改变节点的位置
    changeNodeSite(data) {
      // console.log(2222)
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },

    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      var screenX = evt.originalEvent.clientX,
        screenY = evt.originalEvent.clientY
      let efContainer = this.$refs.efContainer
      var containerRect = efContainer.getBoundingClientRect()
      var left = screenX,
        top = screenY
      // 计算是否拖入到容器中
      if (
        left < containerRect.x ||
        left > containerRect.width + containerRect.x ||
        top < containerRect.y ||
        containerRect.y > containerRect.y + containerRect.height
      ) {
        this.$message.error('请把节点拖入到画布中')
        return
      }

      // left = left - containerRect.x + efContainer.scrollLeft
      const { nodeList } = this.data
      left = this.getMaxLsft(nodeList) + 280
      // console.log(left)
      top = top - containerRect.y + efContainer.scrollTop
      // 居中
      left -= 85
      top -= 16
      var nodeId = this.getUUID()
      // 动态生成名字
      var origName = nodeMenu.name
      var nodeName = origName
      var index = 1
      while (index < 10000) {
        var repeat = false
        for (var i = 0; i < this.data.nodeList.length; i++) {
          let node = this.data.nodeList[i]
          if (node.name === nodeName) {
            nodeName = origName + index
            repeat = true
          }
        }
        if (repeat) {
          index++
          continue
        }
        break
      }

      var s_ifNeedImage = 0
      var s_ifNeedSp = 0
      var s_imgUrl = ''
      var s_vedioUrl = ''

      if ('ifNeedImage' in nodeMenu) {
        s_ifNeedImage = nodeMenu.ifNeedImage
      }
      if ('ifNeedSp' in nodeMenu) {
        s_ifNeedSp = nodeMenu.ifNeedSp
      }
      if ('imgUrl' in nodeMenu) {
        s_imgUrl = nodeMenu.imgUrl
      }
      if ('vedioUrl' in nodeMenu) {
        s_vedioUrl = nodeMenu.vedioUrl
      }

      var node = {
        id: nodeId,
        name: nodeName, //名称
        type: nodeMenu.type,
        left: left + 'px',
        top: '280px',
        // top: top + 'px',
        ico: 'el-icon-user-solid',
        state: 'success',
        content: '', //详细内容
        ifNeedImage: s_ifNeedImage, //是否需要图片
        ifNeedSp: s_ifNeedSp, //是否需要音频
        imgUrl: s_imgUrl,
        flowNodeFiles: [],
        // vedioUrl: s_vedioUrl,
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      // console.log(node)
      this.title = '新建节点'
      this.data.nodeList.push(node)
      this.activeElement.type = 'node'
      this.activeElement.nodeId = nodeId
      this.$refs.nodeDialog.nodeInit(this.data, nodeId)
      // this.$bus.$emit('set_nodeForm', 'new', node)

      this.activeNode = node

      // 新建节点弹框
      this.nodeDialog = true
      this.$nextTick(function () {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(nodeId, {
          containment: 'parent',
          stop: function (el) {
            // 拖拽节点结束后的对调
            console.log('拖拽结束: ', el)
          },
        })
      })
    },

    getMaxLsft(nodeList) {
      let max = Math.max.apply(
        Math,
        nodeList.map(function (v) {
          return v.left.split('px')[0]
        })
      )
      return max
      // console.log(max)
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      const that = this
      this.$confirm({
        title: '提示',
        content: '确定要删除节点 ?',
        onOk() {
          /**
           * 这里需要进行业务判断，是否可以删除
           */
          that.data.nodeList = that.data.nodeList.filter(function (node) {
            if (node.id === nodeId) {
              // 伪删除，将节点隐藏，否则会导致位置错位
              // node.show = false
              return false
            }
            return true
          })
          that.$nextTick(function () {
            that.jsPlumb.removeAllEndpoints(nodeId)
          })
        },
        onCancel() {},
      })

      return true
    },

    // 取消节点
    cancelNode(nodeId) {
      const that = this
      that.data.nodeList = that.data.nodeList.filter(function (node) {
        if (node.id === nodeId) {
          // 伪删除，将节点隐藏，否则会导致位置错位
          // node.show = false
          return false
        }
        return true
      })
      that.$nextTick(function () {
        that.jsPlumb.removeAllEndpoints(nodeId)
      })
    },

    // 点击节点
    clickNode(nodeId) {
      // console.log(this.$parent.form)
      this.title = '编辑节点'
      this.activeElement.type = 'node'
      this.activeElement.nodeId = nodeId
      this.$refs.nodeDialog.nodeInit(this.data, nodeId)

      // let node = this.data.nodeList.find((v) => {
      //   return nodeId === v.id
      // })
      // this.$bus.$emit('set_nodeForm', 'edit', node)
    },

    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },

    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },

    nodeRightMenu(nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },

    repaintEverything() {
      this.jsPlumb.repaint()
    },

    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true
      this.$nextTick(function () {
        this.$refs.flowInfo.init()
      })
    },

    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.easyFlowVisible {
  /deep/.el-button {
    height: 35px;
  }

  /deep/.ant-spin-nested-loading,
  /deep/.ant-spin-container,
  /deep/.ant-form {
    height: 100% !important;
  }
  .easyFlowVisible {
    height: calc(100% - 267px);
  }
}
</style>

<style lang="less">
.ant-modal-body {
  padding: 0;
  padding-top: 8px;
}
</style>

<style>
.easyFlowVisible {
  height: calc(100vh - 267px);
}
</style>


