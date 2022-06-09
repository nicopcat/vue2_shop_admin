<template>
  <div>
    <el-card class="users_card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getUserList"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            class="user_manage_btn"
            type="primary"
            @click="dialogVisible = true"
            >操作按钮</el-button
          >
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <div class="text item">
            <el-table :data="userList" border stripe style="width: 100%">
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column prop="username" label="姓名"> </el-table-column>
              <el-table-column prop="mobile" label="电话" width="180">
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="180">
              </el-table-column>
              <el-table-column prop="role_name" label="角色" width="180">
              </el-table-column>
              <el-table-column label="权限状态">
                <template v-slot="scope">
                  <el-switch
                    @change="userState(scope.row)"
                    v-model="scope.row.mg_state"
                    active-color="#13ce66"
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180">
                <template>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                  ></el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-delete"
                  ></el-button>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="分配角色"
                    placement="bottom"
                    :enterable="false"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-setting"
                    >
                    </el-button
                  ></el-tooltip>
                </template>
              </el-table-column>
            </el-table>
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
            <el-dialog
              title="添加用户"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose"
            >
              <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input
                    type="password"
                    v-model="addForm.password"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input type="email" v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input type="mobile" v-model="addForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="addUser, (dialogVisible = false)"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (regEmail.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的邮箱地址'))
        }
      }, 1000)
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (regMobile.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }, 1000)
    }

    return {
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: checkMobile,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ]
      },

      dialogVisible: false,
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userList: [],
      total: 0
    }
  },
  methods: {
    addUser() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          this.$message.success('提交成功')
          const res = await this.$http.post('users', {
            username: this.addForm.username,
            passwword: this.addForm.password,
            email: this.addForm.email,
            mobile: this.addForm.mobile
          })
          console.log(res)
        } else {
          this.$message.error('信息错误，提交失败')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.addForm.resetFields()
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then((_) => {
      //     done()
      //   })
      //   .catch((_) => {})
    },
    async userState(info) {
      console.log(info)
      // 查看文档 使用api接口保存最新状态
      // - 请求路径：users/:uId/state/:type
      // - 请求方法：put
      const res = await this.$http.put(
        `users/${info.id}/state/${info.mg_state}`
      )
      if (res.status === 200) {
        this.$message.success('用户状态更新成功！')
      } else {
        return this.$message.error('用户状态更新失败')
      }
    },
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
    },
    async getUserList() {
      const res = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
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
