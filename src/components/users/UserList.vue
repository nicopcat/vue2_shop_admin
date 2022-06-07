<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div slot="header" class="clearfix user_card_header">
        <el-input placeholder="请输入搜索内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" style="float: right">操作按钮</el-button>
      </div>
      <div v-for="o in 1" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.el-card {
  width: 100%;
  .user_card_header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.el-input {
  max-width: 400px;
  margin-right: 15px;
}
</style>
