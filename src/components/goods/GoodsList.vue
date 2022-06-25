<template>
  <div>
    <el-card v-if="this.$route.path === '/goods'">
      <!-- 搜索、添加用户区  -->
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- 将 query 传给后台 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <!-- 调用获取商品列表函数  -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品 </el-button>
        </el-col>
      </el-row>

      <!-- 表单区 -->
      <el-row>
        <el-col>
          <el-table :data="goodsList" border stripe style="width: 100%">
            <el-table-column type="index" label="#" width="40">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" min-width="220">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="80">
            </el-table-column>
            <el-table-column prop="goods_number" label="商品数量" width="80">
            </el-table-column>
            <el-table-column prop="add_time" label="创建时间" width="160">
              <template v-slot="scope">
                <!-- 竖线 | 调用过滤器 -->
                {{ scope.row.add_time | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template v-slot="scope">
                <el-button
                  @click="showEditDialog(scope.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  @click="delGoods(scope.row)"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 编辑弹窗 dialog  -->
      <el-dialog
        title="修改商品信息"
        :visible.sync="editGoodsDialogVisible"
        width="40%"
        @close="resetEditForm"
      >
        <el-form
          :model="editGoodsForm"
          :rules="editGoodsRules"
          ref="editGoodsFormRef"
          label-width="80px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="editGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="editGoodsForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGoods">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加分页 -->
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
    </el-card>
    <router-view v-else></router-view>
  </div>
</template>
<script>
// import AddGodds from './AddGoods.vue'
export default {
  // componets:{AddGodds},

  data() {
    return {
      inputVal: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      goodsList: [],
      searchVal: '',
      editGoodsDialogVisible: false,
      editGoodsForm: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: {},
        attrs: [],
        goods_cat: ''
      },
      editGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async showEditDialog(row) {
      this.editGoodsDialogVisible = true

      this.editGoodsForm.goods_id = row.goods_id
      this.editGoodsForm.goods_name = row.goods_name
      this.editGoodsForm.goods_price = row.goods_price
      this.editGoodsForm.goods_number = row.goods_number
      this.editGoodsForm.goods_weight = row.goods_weight

      const { data: res } = await this.$http.get('categories/' + row.goods_id)
      if (res.meta.status !== 200) {
        this.$message.error(`获取商品分类失败！${res.meta.msg}`)
      }

      this.editGoodsForm.goods_cat = res.data.cat_name
    },
    editGoods() {
      this.$refs.editGoodsFormRef.validate(async (valid) => {
        if (!valid) {
          // this.$message.error('请输入新的分类名称')
          return false
        }
        const { data: res } = await this.$http.put(
          'goods/' + this.editGoodsForm.goods_id,
          this.editGoodsForm
        )

        if (res.meta.status !== 200) {
          this.$message.error(`商品修改失败！${res.meta.msg}`)
        }
        this.$message.success('商品修改成功')
        this.getGoodsList()
        this.editGoodsDialogVisible = false
      })
    },
    delGoods(row) {
      // 再确认是否删除
      this.$confirm('确认删除此分类参数？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('goods/' + row.goods_id)
          // console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error(`删除失败！${res.meta.msg}`)
          }
          this.$message.success('删除成功')
          this.getGoodsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    resetEditForm() {
      this.$refs.editGoodsFormRef.resetFields()
      this.editGoodsDialogVisible = false
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取列表失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // 改变每页展示的条数
      this.queryInfo.pagesize = val
      // 重新发起请求
      this.getGoodsList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新发起请求
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  },
  watch: {
    $route: {
      handler() {
        // console.log(route)
        this.getGoodsList()
      },
      immediate: true // 此项须设置为true
    }
  }
}
</script>
<style lang="less" scoped>
.el-table__row .el-button {
  margin: 0 5px 2px 0;
}
</style>
