<template>
  <div>
    <el-card class="users_card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="12">
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
              <el-table-column type="index" label="#" width="60">
              </el-table-column>
              <el-table-column prop="username" label="姓名"> </el-table-column>
              <el-table-column prop="mobile" label="电话"> </el-table-column>
              <el-table-column prop="email" label="邮箱"> </el-table-column>
              <el-table-column prop="role_name" label="角色"> </el-table-column>
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
              <el-table-column label="操作">
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
                    type="danger"
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
                      @click="setRole(scope.row)"
                      type="warning"
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
            <!-- 添加用户 dialog -->
            <el-dialog
              title="添加用户"
              :visible.sync="AddUserDialogVisible"
              width="40%"
              @close="resetForm('addFormRef')"
            >
              <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="addFormRef"
                label-width="80px"
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

            <!-- 修改信息 dialog  -->

            <el-dialog
              title="修改用户信息"
              :visible.sync="EditUserDialogVisible"
              width="40%"
              @close="resetForm('editFormRef')"
            >
              <el-form
                :model="editForm"
                :rules="addFormRules"
                ref="editFormRef"
                label-width="80px"
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
            <!-- 分配角色 dialog  -->
            <el-dialog
              title="分配角色"
              :visible.sync="setRoleDialogVisible"
              width="40%"
              @close="closeSetRoleDialog"
            >
              <div>
                <p>
                  <i class="el-icon-user-solid"></i> 当前用户名：{{
                    userInfo.username
                  }}
                </p>
                <p>
                  <i class="el-icon-star-on"></i> 当前角色：
                  {{ userInfo.role_name }}
                </p>
                <p>
                  <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="saveRoleInfo"
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
    const checkEmail = (rule, value, callback) => {
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

    const checkMobile = (rule, value, callback) => {
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
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
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
      setRoleDialogVisible: false,
      userList: [],
      total: 0,
      userInfo: {},
      roleList: [],
      selectedRoleId: ''
    }
  },
  methods: {
    // 展示分配角色对话框
    async setRole(row) {
      this.userInfo = row
      // 查询文档 角色列表 这一项
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200 || res.meta.status === 500) {
        this.$message.error('获取失败！')
      }
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮 分配橘色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选一个新的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      )
      if (res.meta.status !== 200) {
        this.$message.error('角色分配失败')
      }
      // this.$message.success('角色分配成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配橘色对话框的关闭事件
    closeSetRoleDialog() {
      this.selectedRoleId = ''
    },
    // 打开修改用户信息
    showEditDialog(r) {
      this.EditUserDialogVisible = true
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
        // console.log(res)
        if (res.meta.status !== 200 || res.meta.status === 500) {
          this.$message.error(`修改失败！ ${res.meta.msg}`)
        } else {
          this.$message.success('修改成功')
          this.EditUserDialogVisible = false
          this.getUserList()
        }
      })
    },

    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('信息错误，提交失败')
          return false
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败！' + res.meta.msg)
        } else {
          this.$message.success('提交成功')
          this.AddUserDialogVisible = false
          this.getUserList()
        }
      })
    },
    addDialogClose() {
      this.$refs.addFormRef.resetForm()
    },
    deleteUser(r) {
      // 再确认是否删除
      this.$confirm('确认删除用户数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + r.id, r.id)
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('删除失败！')
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
      this.$refs[formRef].resetFields()
    },

    // 获取和更改用户权限状态
    async userState(info) {
      // console.log(info)
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

.el-table__row .el-button {
  margin: 0 5px 2px 0;
}
</style>
