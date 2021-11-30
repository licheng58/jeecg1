<template>
  <div class="bind-user">
    <myModel
      :visible="visible"
      title="绑定用户"
      okText="绑定"
      @handleOk="handleOk"
      @closeDialog="closeDialog"
      :width="1000"
    >
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

        <el-table-column prop="username" label="用户账号" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="realname" label="用户姓名" show-overflow-tooltip> </el-table-column>

        <el-table-column prop="roleCode" label="用户角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{
              scope.row.roleCode === '1'
                ? '平台用户'
                : scope.row.roleCode === '2'
                ? '头盔终端用户'
                : scope.row.roleCode === '3'
                ? '平台管理员'
                : scope.row.roleCode === 'admin'
                ? '管理员'
                : ''
            }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="sex"
                         label="性别"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.sex === 1?'男':scope.row.sex === 0?'女':''}}</span>
          </template>

        </el-table-column>

        <el-table-column prop="phone"
                         label="手机号码"
                         show-overflow-tooltip>
        </el-table-column> -->

        <el-table-column prop="workNo" label="工号" show-overflow-tooltip> </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1" @click="handleClick(scope.row)" type="text" size="small"
              >绑定远程协作账号</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 20px">
        <el-button @click="setCurrent()">取消选择</el-button>
      </div>
    </myModel>

    <!-- 绑定远程用户 -->
    <remoteModel ref="remoteModel" :tableData="remoteTableData" :userId="userId" />
  </div>
</template>

<script>
import myModel from '@/components/lc_commponents/myModel.vue'
import remoteModel from './remoteModel.vue'
import { lc_bindUsers, lc_getRemoteInfo } from '@/api/lc_api'
import { MessageBox } from 'element-ui'
export default {
  components: {
    myModel,
    remoteModel
  },

  props: {
    tableData: {
      type: Array,
      default: []
    },

    recordInfo: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      userId: '',
      visible: false,
      remoteTableData: [], //弹框table
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
      this.templateRadio = row.id
      this.selectRadio = row
    },

    // 弹框保存
    handleOk() {
      let industryHelmetUsers = [
        {
          helmetId: this.recordInfo.id,
          userId: this.selectRadio.id,
          realName: this.selectRadio.realname,
          serialNo: this.recordInfo.serialNo
        }
      ]

      MessageBox.confirm('您确定需要更改绑定用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          lc_bindUsers(industryHelmetUsers).then(res => {
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
      // console.log(123)
      this.visible = false
    },

    // 绑定远程协作账号
    handleClick(row) {
      //   console.log(row)
      this.$refs.remoteModel.visible = true
      let userId = row.id
      this.userId = row.id
      this.getRemoteInfo(userId)
    },

    // 获取绑定远程信息弹框数据
    async getRemoteInfo(userId) {
      this.$refs.remoteModel.templateRadio = ''
      this.remoteTableData = []
      const res = await lc_getRemoteInfo(userId)
      this.remoteTableData = res.result.records
      //   console.log(this.remoteTableData)
      let selectData = this.remoteTableData.filter(v => {
        return v.isBangding === 1
      })
      this.$refs.remoteModel.templateRadio = selectData[0].id
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
