<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="1">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-table :data="roleList" border stripe style="width: 100%">
            <!-- 展开列 -->
            <el-table-column type="expand" width="60">
              <template v-slot="scope">
                <el-row
                  :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                  v-for="(role1, i1) in scope.row.children"
                  :key="role1.id"
                >
                  <!-- 一级权限 -->
                  <el-col :span="6">
                    <el-tag closable @close="removeTags(scope.row, role1.id)">{{
                      role1.authName
                    }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二/三级权限 -->
                  <el-col :span="18">
                    <!-- 再次for循环 -->
                    <el-row
                      :class="[
                        role1.children.length === 1
                          ? ''
                          : i2 === 0
                          ? ''
                          : 'bdtop',
                        'vcenter'
                      ]"
                      v-for="(role2, i2) in role1.children"
                      :key="role2.id"
                    >
                      <el-col :span="8"
                        ><el-tag
                          closable
                          @close="removeTags(scope.row, role2.id)"
                          type="success"
                          >{{ role2.authName }}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="10"
                        ><el-tag
                          closable
                          @close="removeTags(scope.row, role3.id)"
                          type="warning"
                          :class="[
                            role2.children.length === 1
                              ? ''
                              : i3 === 0
                              ? 'bdbottom'
                              : 'bdtop'
                          ]"
                          v-for="(role3, i3) in role2.children"
                          :key="role3.id"
                          >{{ role3.authName }}
                        </el-tag></el-col
                      >
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <!-- 编辑按钮  -->
                <el-button type="primary" size="mini" icon="el-icon-edit"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button type="danger" size="mini" icon="el-icon-delete"
                  >删除</el-button
                >
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-setting"
                  @click="showRightsDialog(scope.row)"
                  >分配权限
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      @close="setDialogClose"
      width="50%"
    >
      <el-tree
        ref="treeRef"
        :data="rightList"
        :props="treeProps"
        node-key="id"
        showCheckbox
        default-expand-all
        :default-checked-keys="defKeys"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      rightList: [],
      roleList: [],
      roleId: '',
      currentRow: []
    }
  },
  methods: {
    async allotRights() {
      let keys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      //  以 `,` 分割的权限 ID 列表
      keys = keys.join(',')

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: keys }
      )
      if (res.meta.status !== 200) {
        console.log(res)
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 重新加载列表
      this.getRoleList()
      this.rightsDialogVisible = false
    },
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则为三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    async showRightsDialog(role) {
      // 调用递归
      this.currentRow = role
      console.log(role)
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error(
          `获取列表权限失败！错误代码 ${res.meta.status}，${res.meta.msg}`
        )
      } else {
        this.$message.success('获取权限列表成功')
        // console.log(res.data)
        this.rightList = res.data
        this.getLeafKeys(role, this.defKeys)
        this.rightsDialogVisible = true
      }
    },
    setDialogClose() {
      this.defKeys = []
    },
    removeTags(row, rightId) {
      console.log(row, rightId)
      this.$confirm('确认该取消？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${row.id}/rights/${rightId}`
          )
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(
              `删除失败！错误代码 ${res.meta.status}，${res.meta.msg}`
            )
          } else {
            this.$message.success('取消权限成功')
            // 为 row 重新赋值权限
            row.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消权限成功'
          })
        })
    },
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) this.$message.error('获取角色列表失败')
      // console.log(res)
      this.roleList = res.data
      this.$message.success('获取角色列表成功')
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>


