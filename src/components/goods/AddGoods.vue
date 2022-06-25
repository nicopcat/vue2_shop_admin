<template>
  <div>
    <el-card>
      <el-alert
        title="添加商品的信息"
        type="info"
        center
        show-icon
        :closibke="false"
      >
      </el-alert>
      <el-steps
        align-center
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          @tab-click="handleClick"
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0"
            >基本信息
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="goods_price">
              <el-input
                type="number"
                label="价格"
                v-model="addForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="goods_number">
              <el-input
                type="number"
                label="数量"
                v-model="addForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="介绍" prop="goods_introduce">
              <el-input
                label="介绍"
                v-model="addForm.goods_introduce"
              ></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              closable
              type="primary"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="vals"
                  v-for="(vals, i) in item.attr_vals"
                  :key="i"
                  closable
                  type="primary"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :on-success="handleSuccess"
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button class="addBtn" type="primary" @click="addGoods"
              >提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      @close="closePreDialog"
    >
      <img class="preImg" :src="previewPath" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
        goods_cat: []
      },
      addFormRules: {
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
        ],
        goods_introduce: [
          { required: false, message: '请输入商品介绍', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      cateId: '',
      manyTableData: [],
      onlyTableData: [],
      headerObj: {
        Authorization: sessionStorage.getItem('token')
      },
      previewVisible: false,
      previewPath: '',
      GoodsCat: ''
    }
  },
  methods: {
    // 图片上传成功时间
    handleSuccess(response) {
      const tempPath = { pic: response.data.tmp_path }
      this.addForm.pics.push(tempPath)
    },
    // 文件移除的回调
    handleRemove(file) {
      const idx = this.addForm.pics.findIndex(
        (i) => i.pic === file.response.data.tmp_path
      )
      this.addForm.pics.splice(idx, 1)
    },
    handlePreview(file) {
      this.previewVisible = true
      this.previewPath = file.response.data.url
    },
    closePreDialog() {
      this.previewVisible = false
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error('提交失败，请完成所有必填项')
          return false
        }
        // if (this.addForm.attrs.length === 0) {
        //   return this.$message.error('请选择商品参数和属性！')
        // }
        this.GoodsCat = this.addForm.goods_cat.join(',')
        const theForm = {
          goods_name: this.addForm.goods_name,
          goods_price: this.addForm.goods_price - 0,
          goods_number: this.addForm.goods_number - 0,
          goods_weight: this.addForm.goods_weight - 0,
          goods_introduce: this.addForm.goods_introduce,
          pics: this.addForm.pics,
          attrs: this.addForm.attrs,
          goods_cat: this.GoodsCat
        }

        const { data: res } = await this.$http.post('goods', theForm)
        console.log(res)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败！' + res.meta.msg)
        } else {
          this.$message.success('创建商品成功')
          this.$router.push('/goods')
        }
      })
      // this.$emit('callGetGoodList')
    },
    // 切换标签页
    handleClick() {
      if (this.activeIndex === '1') {
        // 获取商品参数  many
        this.getPramsData('many')
      } else if (this.activeIndex === '2') {
        // 获取商品属性 sel
        this.getPramsData('only')
      }
    },
    // 发起 获取参数信息的请求
    async getPramsData(params) {
      // - 请求路径：categories/:id/attributes
      // - 请求方法：get
      // sel ： [only,many]
      // 不能为空,通过 only 或 many 来获取分类静态参数还是动态参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: params } }
      )
      if (res.meta.status !== 200 && this.addDialogVisible === true) {
        this.$message.error('获取商品分类参数失败')
      }
      // console.log(res)
      // attrs_val 以空白分割 把它们转换为数组
      if (res.data) {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中的值
          item.newTagValue = ''
        })
      }
      if (params === 'many') {
        this.manyTableData = res.data
        this.manyTableData.forEach((item) => {
          const newData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addForm.attrs.push(newData)
        })
      } else {
        this.onlyTableData = res.data
        this.onlyTableData.forEach((item) => {
          const newData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newData)
        })
      }
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        return false
      }
      this.cateId = this.addForm.goods_cat[2]
    },
    beforeTabLeave(_, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length === 0) {
        this.$message.error('请先选择商品分类')
        return false
      }
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
  created() {
    this.getCateList()
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 5px 0 0 !important;
}

.preImg {
  width: 100%;
}

.addBtn {
  margin-top: 15px;
}
</style>
