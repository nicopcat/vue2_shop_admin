<template>
  <div>
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col :span="1">
          <el-button type="primary" @click="setAddCateDialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <!-- 表格区 -->
        <el-col>
          <!-- 使用 ZkTable 插件 -->
          <zk-table
            ref="tableRef"
            sum-text="sum"
            index-text="#"
            :data="cateList"
            :columns="columns"
            :stripe="props.stripe"
            :border="props.border"
            :show-header="props.showHeader"
            :show-summary="props.showSummary"
            :show-row-hover="props.showRowHover"
            :show-index="props.showIndex"
            :tree-type="props.treeType"
            :is-fold="props.isFold"
            :expand-type="props.expandType"
            :selection-type="props.selectionType"
          >
            <template slot="cat_deleted" slot-scope="scope">
              <i
                v-if="scope.row.cat_deleted === false"
                class="el-icon-success iconTruthy"
              ></i>
              <i v-else class="el-icon-error iconFalsy"></i>
            </template>

            <template slot="cat_level" slot-scope="scope">
              <el-tag type="success" v-if="scope.row.cat_level === 0"
                >一级</el-tag
              >
              <el-tag type="" v-else-if="scope.row.cat_level === 1"
                >二级</el-tag
              >
              <el-tag type="warning" v-else>三级</el-tag>
            </template>

            <template slot="cat_actions" slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="showEditCateDialog(scope.row.cat_id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="delCate(scope.row.cat_id)"
                >删除</el-button
              >
            </template>
          </zk-table>
          <!-- 分页区 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.cateTotal"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options为数据源 -->
          <el-cascader
            v-model="selectedCateIds"
            :options="parentCate"
            :props="cateOps"
            @change="selectedCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类 dialog  -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editCateDialogVisible"
      width="40%"
      @close="resetEditForm"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      cateList: [],
      queryInfo: {
        pagenum: 1,
        pagesize: 5
      },
      cateTotal: 0,
      props: {
        stripe: true,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false
      },
      columns: [
        {
          label: '#',
          prop: 'name',
          width: '60px'
        },
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'cat_actions'
        }
      ],
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        // 当前默认添加的分类
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 14, message: '长度在 1 到 14 个字符', trigger: 'blur' }
        ]
      },
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      },
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 14, message: '长度在 1 到 14 个字符', trigger: 'blur' }
        ]
      },
      parentCate: [],
      selectedCateIds: [],
      cateOps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        multiple: false,
        checkStrictly: true
      }
    }
  },
  methods: {
    // 打开编辑 dialog
    showEditCateDialog(id) {
      this.editCateDialogVisible = true
      this.editCateForm.cat_id = id
    },
    // 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) {
          // this.$message.error('请输入新的分类名称')
          return false
        }
        const { data: res } = await this.$http.put(
          'categories/' + this.editCateForm.cat_id,
          { cat_name: this.editCateForm.cat_name }
        )

        if (res.meta.status !== 200) {
          this.$message.error(`分类名修改失败！错误代码 ${res.meta.status}`)
        }
        this.$message.success('分类名修改成功')
        this.editCateDialogVisible = false
        this.getCateList()
      })
    },
    resetEditForm() {
      this.$refs.editCateFormRef.resetFields()
      this.editCateDialogVisible = false
    },
    // 删除分类
    delCate(id) {
      // 再确认是否删除
      this.$confirm('确认删除此分类参数？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + id)
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(
              `删除失败！错误代码 ${res.meta.status}，${res.meta.msg}`
            )
          }
          this.$message.success('删除成功')
          this.getCateList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 监听对话框的关闭 重置数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm = {
        cat_name: '',
        cat_pid: 0,
        // 当前默认添加的分类
        cat_level: 0
      }
      this.selectedCateIds = []
    },
    selectedCateChange() {
      // console.log(this.addCateForm)
      if (this.selectedCateIds.length > 0) {
        this.addCateForm.cat_pid =
          this.selectedCateIds[this.selectedCateIds.length - 1]
        this.addCateForm.cat_level = this.selectedCateIds.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 获取父级分类数据列表
    // 只需要拿到二级分类 且不需要Page信息
    async getParentCate() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      this.parentCate = res.data
    },
    // 添加新分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品分类列表失败')
        }
        this.$message.success('添加商品分类列表成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    setAddCateDialogVisible() {
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // 改变每页展示的条数
      this.queryInfo.pagesize = val
      // 重新发起请求
      this.getCateList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新发起请求
      this.getCateList()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // this.$message.success('获取商品分类列表成功')
      this.cateList = res.data.result
      this.cateTotal = res.data.total
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
.iconTruthy {
  font-size: 18px;
  color: rgb(103, 194, 58);
}
.iconFalsy {
  font-size: 18px;
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>

