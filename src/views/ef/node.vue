<template>
  <div ref="node"
       :style="nodeContainerStyle"
       @click="clickNode"
       :class="nodeContainerClass"
       class="nodeContainerClass"
       v-if="[1,2,3,'form','picture','play-square'].indexOf(node.type)!==-1">

    <div class="node-left  flow-node-drag"
         :style="[{'cursor': 'crosshair'},{background:[1,'form'].indexOf(node.type) !==-1?'#ffaa22':[2,'picture'].indexOf(node.type) !==-1?'#3da500':'#006caf'}]">
      <!-- <a-icon :type="[1,'form'].indexOf(node.type) !==-1?'form':[2,'picture'].indexOf(node.type) !==-1?'picture':'play-square'"
              style="color:#fff" /> -->

      <!-- 拉线 -->
      <div class="node-center">
        <!-- <a-icon type="share-alt"
                style="color:#fff" /> -->
      </div>
    </div>

    <div class="node-right"
         @mouseup="changeNodeSite">
      <div class="ef-node-text"
           :show-overflow-tooltip="true">
        {{node.name}}
      </div>

      <!-- 设置节点 -->
      <el-dropdown @command="handleCommand"
                   class="node-drop"
                   placement="bottom-start"
                   v-if="node.id !== 'nodeA'">
        <span class="ef-node-right-ico">
          <i class="el-icon-setting"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">编辑节点</el-dropdown-item>
          <el-dropdown-item command="b">删除节点</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>

  <!-- 开始节点 -->
  <div ref="node"
       class="start-nodeContainerClass "
       :class="nodeContainerClass2"
       :style="nodeContainerStyle"
       v-else>
    <div class="start-node flow-node-drag">
      开始
    </div>
    <!-- <a-icon type="share-alt"
            class="flow-node-drag"
            style="color:#fff" /> -->

  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    activeElement: Object,
    form: Object,
  },
  data() {
    return {}
  },
  computed: {
    nodeContainerClass() {
      return {
        'ef-node-container': true,
        'ef-node-active': this.activeElement.type == 'node' ? this.activeElement.nodeId === this.node.id : false,
      }
    },

    nodeContainerClass2() {
      return {
        'ef-node-container2': true,
        'ef-node-active2': this.activeElement.type == 'node' ? this.activeElement.nodeId === this.node.id : false,
      }
    },
    // 节点容器样式
    nodeContainerStyle() {
      return {
        top: this.node.top,
        left: this.node.left,
      }
    },
    nodeIcoClass() {
      var nodeIcoClass = {}
      nodeIcoClass[this.node.ico] = true
      // 添加该class可以推拽连线出来，viewOnly 可以控制节点是否运行编辑
      nodeIcoClass['flow-node-drag'] = this.node.viewOnly ? false : true
      return nodeIcoClass
    },
  },
  methods: {
    // 设置节点
    handleCommand(command) {
      if (command === 'a') {
        // 编辑节点
        this.$parent.nodeDialog = true
        this.$bus.$emit('set_nodeForm', 'edit', this.node)
      } else if (command === 'b') {
        // 删除节点
        this.$parent.activeElement.nodeId = this.node.id
        this.$parent.activeElement.type = 'node'
        this.$parent.deleteElement()
      }
    },

    // 点击节点
    clickNode() {
      this.$emit('clickNode', this.node.id)
    },

    // 鼠标移动后抬起
    changeNodeSite() {
      // 避免抖动
      if (this.node.left == this.$refs.node.style.left && this.node.top == this.$refs.node.style.top) {
        return
      }
      this.$emit('changeNodeSite', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top,
      })
    },
  },
}
</script>



<style>
.nodeContainerClass .el-icon-setting {
  color: #fff;
}

.nodeContainerClass .el-icon-setting:hover {
  font-size: 16px;
  cursor: pointer;
}

.nodeContainerClass .node-drop {
  position: absolute;
  right: -25px;
  top: 2px;
}
</style>

<style lang="less" scoped>
.nodeContainerClass {
  .node-left {
    height: 25px;
    line-height: 25px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    position: relative;
    .node-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .node-right {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
  }
}

.start-nodeContainerClass {
  width: 100px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #00d3ab;
  border-radius: 30px;
  color: #fff;
  .start-node {
    width: 100%;
    line-height: 40px;
    text-align: center;
  }
}
</style>
