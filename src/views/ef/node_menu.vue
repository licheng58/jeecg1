<template>
  <div class="flow-menu"
       ref="tool">
    <draggable v-model="menuList"
               :options="draggableOptions"
               @start="move"
               @end="end"
               v-for="menu in menuList"
               :key="menu.id">

      <li class="ef-node-menu-li"
          :type="menu.type"
          style="position: relative">

        <!-- 节点上 -->
        <div class="new-node-top"
             :style="{background:menu.color}">

          <div class="new-node-top-left">
            <!-- <a-icon :type="menu.icon"
                    style="color:#fff" /> -->
          </div>
          <div class="new-node-top-right">
            <a-icon type="setting"
                    style="color:#fff" />
          </div>
        </div>

        <!-- 节点下 -->
        <div class="new-node-bottom">{{menu.name}}</div>

      </li>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: '-1',
  top: '-1',
}

export default {
  data() {
    return {
      imgSrc: './images/text.png',
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        forceFallback: true,
      },
      menuList: [
        {
          id: '1',
          name: '文本',
          type: 'form',
          icon: 'form',
          color: '#ffaa22',
        },
        {
          id: '2',
          name: '图片/视频',
          type: 'picture',
          icon: 'picture',
          color: '#3da500',
        },
        // {
        //   id: '3',
        //   name: '视频',
        //   type: 'play-square',
        //   icon: 'play-square',
        //   color: '#006caf',
        // },
      ], //页面渲染访视节点

      nodeMenu: {}, //被拖拽的节点
    }
  },

  components: {
    draggable,
  },

  props: {
    form: {
      type: Object,
      default: {},
    },
  },

  created() {
    /**
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
  },

  methods: {
    // 根据类型获取左侧菜单对象
    getMenuByType(type) {
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].type == type) {
          return this.menuList[i]
        }
      }
    },

    // 拖拽开始时触发
    move(evt, a, b, c) {
      // console.log(evt)
      // if (!this.form.getFieldsValue().productNo) {
      //   this.$message.error('请先选择工作流和产品型号!')
      // }

      var type = evt.item.attributes.type.nodeValue
      this.nodeMenu = this.getMenuByType(type)
      console.log(this.nodeMenu)
    },

    // 拖拽结束时触发
    end(evt, e) {
      if (!this.form.getFieldsValue().productNo) {
        this.$message.error('请先选择工作流和产品型号!')
      } else {
        this.$emit('addNode', evt, this.nodeMenu, mousePosition)
      }
    },

    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {
        return true
      }
      return false
    },
  },
}
</script>
<style lang="less" scoped>
.flow-menu {
  .new-node {
    display: flex;
    justify-content: center;
    align-items: center;
    .new-node-img {
      position: absolute;
      left: 5px;
    }
  }
}
</style>
<style>
.flow-menu {
  overflow: visible;
  height: auto;
}

.flow-menu .ef-node-menu-li {
  margin-right: 20px;
  border-radius: 10px;
}

.ef-node-menu-li:hover {
  cursor: move;
}

.flow-menu .el-checkbox__input {
  position: absolute !important;
  right: -25px !important;
  top: 3px !important;
}

.flow-menu .el-checkbox:last-of-type {
  position: relative;
  margin-right: 50px;
}

.flow-menu .new-node {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  /* color: #67c23a; */
  height: 35px;
  line-height: 35px;
  display: flex;
}
</style>

<style lang="less" scoped>
.flow-menu {
  display: flex;

  .new-node-top {
    height: 25px;
    line-height: 25px;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    &-left {
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
    }
  }
  .new-node-bottom {
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    background-color: #fff;
    border-radius: 0 0 10px 10px;
  }
}
</style>

