<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="queryInfo.pagenum"
    :page-sizes="[1, 5, 10, 20]"
    :page-size="queryInfo.pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="this.total"
  >
  </el-pagination>
</template>

<script>
export default {
  methods: {
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // 改变每页展示的条数
      this.queryInfo.pagesize = val
      // 重新发起请求
      this.getUserList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新发起请求
      this.getUserList()
    }
  }
}
</script>