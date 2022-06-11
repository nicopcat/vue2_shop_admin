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
            @click="AddUserDialogVisible = true"
            >添加用户</el-button
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
                <template v-slot="scope">
                  <!-- 修改按钮  -->
                  <el-button
                    @click="showEditDialog(scope.row)"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                  ></el-button>
                  <!-- 删除按钮 -->
                  <el-button
                    type="primary"
                    @click="deleteUser(scope.row)"
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
            <!-- 添加用户dialog -->
            <el-dialog
              title="添加用户"
              :visible.sync="AddUserDialogVisible"
              width="30%"
              @close="resetForm('addFormRef')"
            >
              <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="70px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="addForm.username"></el-input>
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
                <el-button @click="AddUserDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="addUser">确 定</el-button>
              </span>
            </el-dialog>

            <!-- 修改信息dialog  -->
            <el-dialog
              title="修改用户信息"
              :visible.sync="EditUserDialogVisible"
              width="30%"
              @close="resetForm('editFormRef')"
            >
              <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="70px"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input type="email" v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                  <el-input type="mobile" v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="EditUserDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="editUser">确 定</el-button>
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
      // add数据
      AddUserDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入符合规则的用户名',
            trigger: 'blur'
          },
          { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入符合规则的密码', trigger: 'blur' },
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
      // edit数据
      EditUserDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
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
    // 打开修改用户信息
    showEditDialog(r) {
      this.EditUserDialogVisible = true
      console.log('edit dialog open')
      console.log(r)
      this.editForm.id = r.id
      this.editForm.username = r.username
      this.editForm.email = r.email
      this.editForm.mobile = r.mobile
    },
    // 修改用户信息
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('信息错误，提交失败')
          return false
        }
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          this.editForm
        )
        console.log(res)
        if (res.meta.status !== 200 || res.meta.status === 500) {
          this.$message.error(`修改失败！错误代码 ${res.meta.status}`)
        } else {
          this.$message.success('修改成功')
          this.EditUserDialogVisible = false
          this.getUserList()
        }
      })
    },
    // editDialogClose() {
    //   this.resetForm('editFormRef')
    // },
    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('信息错误，提交失败')
          return false
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error(`登录失败！错误代码 ${res.meta.status}`)
        } else {
          this.$message.success('提交成功')
          this.AddUserDialogVisible = false
          this.getUserList()
        }
      })
    },
    // addDialogClose() {
    //   this.resetForm('addFormRef')
    // },
    deleteUser(r) {
      console.log(r.id)
      // 再确认是否删除
      this.$confirm('确认删除用户数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + r.id, r.id)
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(
              `删除失败！错误代码 ${res.meta.status}，${res.meta.msg}`
            )
          } else {
            this.$message.success('删除成功')
            this.AddUserDialogVisible = false
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 重置功能
    resetForm(formRef) {
      console.log('test')
      this.$refs[formRef].resetFields()
    },

    // 获取和更改用户权限状态
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

    // 获取用户列表
    async getUserList() {
      const res = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log('UserList获取成功')
      if (res.status === 200) {
        this.userList = res.data.data.users
        this.total = res.data.data.total
      } else {
        return this.$message.error('数据获取失败！')
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
    }
  },
  // 组件创建时获取用户列表信息
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
