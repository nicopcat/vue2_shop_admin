<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意：只允许设置第三级分类"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span
            >选择商品分类：
            <!-- options为数据源 -->
            <el-cascader
              v-model="selectedCate"
              :options="cateList"
              :props="cateProps"
              @change="handleChange"
            ></el-cascader>
          </span>
        </el-col>
      </el-row>
      <!-- tab 标签区 -->
      <el-row>
        <el-col>
          <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                :disabled="isBtnDisabled"
                size="mini"
                @click="addDialogVisible = true"
                >添加参数</el-button
              >
              <!-- 动态参数表格  -->
              <el-table :data="manyTableData" border stripe>
                <!-- 展开 -->
                <el-table-column type="expand" width="60px">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      type="primary"
                      @close="delTag(scope.row, i)"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.newTagValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <!-- 序号 -->
                <el-table-column type="index" label="#" width="60px">
                </el-table-column>
                <!-- 名称  -->
                <el-table-column label="参数名称" prop="attr_name">
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      @click="showEditDialog(scope.row)"
                    >
                      <i class="el-icon-edit" size="mini">编辑</i>
                    </el-button>
                    <el-button type="danger"
                      ><i
                        class="el-icon-delete"
                        size="mini"
                        @click="delConfirm(scope.row)"
                        >删除</i
                      >
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="静态属性" name="only">
              <el-button
                type="primary"
                :disabled="isBtnDisabled"
                size="mini"
                @click="addDialogVisible = true"
                >添加属性</el-button
              >
              <!-- 静态属性表格  -->
              <el-table :data="onlyTableData" border stripe>
                <!-- 展开 -->
                <el-table-column type="expand" width="60px">
                  <template v-slot="scope">
                    <el-tag
                      v-for="(item, i) in scope.row.attr_vals"
                      :key="i"
                      closable
                      type="primary"
                      @close="delTag(scope.row, i)"
                    >
                      {{ item }}
                    </el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.newTagValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope.row)"
                      >+ New Tag</el-button
                    >
                  </template>
                </el-table-column>
                <!-- 序号 -->
                <el-table-column type="index" label="#" width="60px">
                </el-table-column>
                <!-- 名称  -->
                <el-table-column label="属性名称" prop="attr_name">
                </el-table-column>

                <!-- 操作 -->
                <el-table-column label="操作">
                  <template v-slot="scope">
                    <el-button type="primary">
                      <i
                        class="el-icon-edit"
                        size="mini"
                        @click="showEditDialog(scope.row)"
                        >编辑</i
                      >
                    </el-button>
                    <el-button type="danger"
                      ><i
                        class="el-icon-delete"
                        size="mini"
                        @click="delConfirm(scope.row)"
                        >删除</i
                      >
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'新增' + titleText"
        :visible.sync="addDialogVisible"
        @close="addDialogClose"
      >
        <!-- 添加参数的表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
          <el-form-item
            :label="'新增' + titleText"
            prop="attr_name"
            width="120px"
          >
            <el-input v-model="addForm.attr_name" width="30%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        @close="editDialogClose"
      >
        <!-- 修改参数的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
          <el-form-item :label="'修改' + titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name" width="30%"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cateList: [],
      // 级联选择框双向绑定到的数组
      selectedCate: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      attr_valsArr: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数/属性', trigger: 'blur' }
        ]
      },
      // 编辑参数区
      editDialogVisible: false,
      editForm: {
        attr_name: '',
        attr_id: 0
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数/属性', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      )

      if (res.meta.status !== 200) {
        row.newTagValue = ''
        row.inputVisible = false
        return this.$message.error('修改参数失败')
      }

      this.$message.success('修改参数成功')
    },
    handleInputConfirm(row) {
      if (row.newTagValue.trim().length === 0) {
        row.newTagValue = ''
        row.inputVisible = false
        return false
      }

      row.attr_vals.push(row.newTagValue.trim())

      row.newTagValue = ''
      row.inputVisible = false

      this.saveAttrVals(row)
    },
    delTag(row, i) {
      // console.log(row)
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    showInput(row) {
      row.inputVisible = true
      // 自动获得焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除参数功能区
    delConfirm(row) {
      // 再确认是否删除
      this.$confirm('确认删除此属性？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${row.attr_id}`
          )
          if (res.meta.status !== 200) {
            this.$message.error('删除商品分类参数失败')
          }
          this.$message.success('删除商品分类参数成功')
          this.getPramsData()
          this.editDialogVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 编辑参数功能区
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.attr_id = row.attr_id
      this.editForm.attr_name = row.attr_name
    },
    editParams() {
      // 先验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('参数不能为空')
        }

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('修改商品分类参数失败')
        }
        this.$message.success('修改商品分类参数成功')
        this.getPramsData()
        this.editDialogVisible = false
      })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    // 新增参数功能区
    addParams() {
      // 先验证
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('参数不能为空')
        }

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          { attr_name: this.addForm.attr_name, attr_sel: this.activeName }
        )
        if (res.meta.status !== 201) {
          this.$message.error('增加商品分类参数失败')
        }
        this.$message.success('增加商品分类参数成功')
        this.getPramsData()
        this.addDialogVisible = false
      })
    },
    // tab 标签 点击事件
    handleTabClick() {
      this.getPramsData()
    },
    // 级联选择框变化时触发的函数
    handleChange() {
      if (this.selectedCate.length !== 3) {
        this.selectedCate = []
      } else {
        this.getPramsData()
      }
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 发起 获取参数信息的请求
    async getPramsData() {
      // - 请求路径：categories/:id/attributes
      // - 请求方法：get
      // sel ： [only,many]
      // 不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200 && this.addDialogVisible === true) {
        this.$message.error('获取商品分类参数失败')
      }

      // attrs_val 以空白分割 把它们转换为数组
      if (res.data) {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中的值
          item.newTagValue = ''
        })
        if (this.activeName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      }

      this.getCateList()
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // this.$message.success('获取商品分类列表成功')
      this.cateList = res.data
    }
  },
  computed: {
    isBtnDisabled() {
      return this.selectedCate.length !== 3
    },
    cateId() {
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2]
      }
      return null
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  },
  created() {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-input {
  width: 75%;
}

.el-tag + .el-tag {
  margin: 8px 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
