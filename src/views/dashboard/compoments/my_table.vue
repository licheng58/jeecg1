<template>
  <div class="my-table">
    <el-table :data="table.tableData"
              :height="table.height||'250'"
              style="width: 100%">
      <el-table-column type="index"
                       width="50"
                       label="序号"
                       align="center">
      </el-table-column>
      <el-table-column v-for="(item) in table.tableColumn"
                       :key="item.id"
                       :label="item.label"
                       :prop='item.prop'
                       :width="item.width"
                       align="center"
                       :border='false'
                       show-overflow-tooltip>
      </el-table-column>

      <el-table-column v-if="table.operator"
                       fixed="right"
                       label="操作"
                       width="60">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="toDetail">查看</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>

<script>
export default {
  props: {
    table: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {}
  },

  methods: {
    toDetail() {
      this.$router.push('/industry/IndustryWorkOrderList')
    },

    handleSelectionChange(val) {},

    goMore() {},
  },
}
</script>

<style lang="less" scoped>
.my-table {
  height: 100%;
  /deep/.el-table,
  /deep/.el-table thead {
    color: #05b2fb;
    font-weight: 700;
  }
  /deep/.el-table thead {
    font-size: 14px;
  }

  /deep/.el-table th {
    background-color: #172c61;
  }

  /deep/.el-table tr {
    background-color: #112151;
  }

  /deep/.el-table td,
  /deep/.el-table th.is-leaf {
    border-bottom: 2px solid #172c61;
  }

  /deep/.el-table--border::after,
  /deep/.el-table--group::after,
  /deep/.el-table::before {
    background-color: #172c61;
  }

  /deep/.el-table--small td,
  /deep/.el-table--small th {
    padding: 4px 0;
  }

  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #172c61;
  }

  /deep/.el-table__empty-block {
    background-color: #172c61;
  }

  /deep/.el-table__body-wrapper,
  /deep/.is-scrolling-none {
    background-color: #0b1946;
  }

  /deep/.el-table {
    height: 100% !important;
    background-color: #0b1946;
  }
  /deep/.el-table__fixed-right-patch,
  /deep/.el-table__fixed-right::before,
  /deep/.el-table__fixed::before {
    background-color: #172c61;
  }

  /deep/.el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
  /deep/.el-table__body tr.current-row > td,
  /deep/.el-table__body tr.hover-row.current-row > td,
  /deep/.el-table__body tr.hover-row.el-table__row--striped.current-row > td,
  /deep/.el-table__body tr.hover-row.el-table__row--striped > td,
  /deep/.el-table__body tr.hover-row > td {
    background-color: #172c61;
  }
}
</style>

<style >
.el-table {
  width: 100%;
}
.el-table__header-wrapper table,
.el-table__body-wrapper table {
  width: 100% !important;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: auto !important;
}
</style>