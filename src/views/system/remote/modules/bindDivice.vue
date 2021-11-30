<template>
  <div class="bind-divice">
    <myModel :visible='visible'
             title="绑定设备"
             okText='绑定'
             @handleOk='handleOk'
             @closeDialog="closeDialog">
      <el-table ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @row-click="singleElection"
                :header-cell-style="{textAlign: 'center'}"
                :cell-style="{ textAlign: 'center' }">

        <el-table-column label=""
                         width="65">
          <template slot-scope="scope">
            <el-radio class="radio"
                      v-model="templateRadio"
                      :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>

        <el-table-column prop="realname"
                         label="用户名称"
                         show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="departIds_dictText"
                         label="部门"
                         show-overflow-tooltip>
        </el-table-column>

        <el-table-column prop="status_dictText"
                         label="状态"
                         show-overflow-tooltip>

        </el-table-column>

        <el-table-column prop="workNo"
                         label="工号"
                         show-overflow-tooltip>

        </el-table-column>

      </el-table>
      <div class="footer_">
        <el-button @click="setCurrent()">取消选择</el-button>
        <el-pagination :page-size="10"
                       :current-page="pageNo"
                       layout="prev, pager, next"
                       :total="total"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </myModel>
  </div>
</template>

<script>
import myModel from '@/components/lc_commponents/myModel.vue'
import { lc_bindDivices } from '@/api/lc_api'
import { MessageBox } from 'element-ui'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  mixins: [JeecgListMixin],
  components: {
    myModel,
  },

  props: {
    tableData: {
      type: Array,
      default: [],
    },

    recordInfo: {
      type: Object,
      default: {},
    },

    total: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      pageNo: 1,
      visible: false,
      templateRadio: '', //table单选ID
      selectRadio: {}, //单选row数据
      disableMixinCreated: true,
    }
  },

  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
      this.$emit('getDiviceInfo')
    },

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
      // console.log(this.recordInfo)
      // console.log(this.selectRadio)
      let industryHelmetUsers = {
        ...this.recordInfo,
        userId: this.selectRadio.id,
        userName: this.selectRadio.realname,
        userDept: this.selectRadio.departIds_dictText,
        workNo: this.selectRadio.workNo,
      }

      MessageBox.confirm('您确定需要更改绑定用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          lc_bindDivices(industryHelmetUsers).then((res) => {
            // console.log(res)
            if (res.code === 200) {
              let msg = '绑定成功'
              // this.selectRadio.id ? (msg = '绑定成功') : (msg = '解绑成功')
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
    },
  },
}
</script>

<style lang="less" scoped>
.bind-divice {
  /deep/.el-checkbox {
    display: none !important;
  }

  .unbind {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.footer_ {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
