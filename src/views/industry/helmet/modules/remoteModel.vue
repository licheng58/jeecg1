<template>
  <div class="bind-user">
    <myModel :visible="visible" title="绑定用户列表" okText="绑定" @handleOk="handleOk" @closeDialog="closeDialog">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="singleElection"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column label="" width="65">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateRadio" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="菊风云code" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="userAcount" label="用户账号" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="userName" label="绑定用户" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="userDept" label="设备部门" show-overflow-tooltip> </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-button @click="setCurrent()">取消选择</el-button>
      </div>
    </myModel>
  </div>
</template>

<script>
import myModel from '@/components/lc_commponents/myModel.vue'
import { lc_BindRemote } from '@/api/lc_api'
import { MessageBox } from 'element-ui'
export default {
  components: {
    myModel
  },

  props: {
    tableData: {
      type: Array,
      default: []
    },

    userId: String
  },

  data() {
    return {
      visible: false,
      templateRadio: '', //table单选ID
      selectRadio: {} //单选row数据
    }
  },

  methods: {
    setCurrent() {
      this.templateRadio = ''
      this.selectRadio.id = ''
      this.selectRadio.realname = ''
    },

    // 表格单选
    singleElection(row) {
      //   console.log(row)
      this.templateRadio = row.id
      this.selectRadio = row
    },

    // 弹框保存
    handleOk() {
      let account = this.templateRadio
      MessageBox.confirm('您确定需要更改绑定用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          lc_BindRemote(this.userId, account).then(res => {
            if (res.code === 200) {
              let msg = ''
              this.selectRadio.id ? (msg = '绑定成功') : (msg = '解绑成功')
              this.$message.success(msg)
              this.$emit('loadData')
              this.visible = false
            }
          })
        })
        .catch(() => {
          this.visible = false
        })
    },

    closeDialog() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.bind-user {
  /deep/.el-checkbox {
    display: none !important;
  }

  .unbind {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
