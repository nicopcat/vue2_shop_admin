<template>
  <div>
    <el-card class="users_card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="user_manage_btn" type="primary">操作按钮</el-button>
        </el-col>
      </el-row>

      <!-- 头部：搜索与添加用户 -->
      <!-- <div slot="header" class="clearfix user_card_header">

      </div> -->
      <!-- 列表展示区 -->
      <el-row>
        <el-col>
          <div class="text item">
            <el-table :data="userList" border stripe style="width: 100%">
              <el-table-column prop="create_time" label="日期" width="180">
              </el-table-column>
              <el-table-column prop="role_name" label="姓名" width="180">
              </el-table-column>
              <el-table-column prop="mobile" label="电话"> </el-table-column>
              <el-table-column prop="email" label="邮箱"> </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: []
    }
  },
  methods: {
    async getUserList() {
      const res = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.status === 200) {
        this.userList = res.data.data.users
        console.log(this.userList)
      } else {
        return this.$message.error('数据获取失败！')
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-card {
  width: 100%;
}
</style>
