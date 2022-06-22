<template>
  <div>
    <el-card shadow="hover">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入搜索的订单"
            v-model="queryInfo.query"
            @keyup.enter.native="getOrderList"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-table :data="orderList" border stripe style="width: 100%">
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="220">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="60">
            </el-table-column>
            <el-table-column prop="order_pay" label="是否付款" width="90">
              <template v-slot="scope">
                <el-tag v-if="scope.row.order_pay === '0'" type="danger">
                  未付款
                </el-tag>
                <el-tag v-else type="success"> 已付款 </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="60">
            </el-table-column>
            <el-table-column prop="create_time" label="下单时间">
              <template v-slot="scope">
                {{ scope.row.create_time | dateFormat }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template v-slot="scope">
                <!-- 修改地址按钮 -->
                <el-button
                  @click="showAddrDia(scope.row)"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                ></el-button>
                <!-- 物流按钮 -->
                <el-button
                  type="success"
                  @click="showProgress(scope.row)"
                  size="mini"
                  icon="el-icon-location"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <!-- 分页  -->
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

      <!-- 修改地址 dialog  -->
      <el-dialog
        title="修改订单地址"
        :visible.sync="addrDialogVisible"
        width="50%"
        @close="addrFormDiaClose"
      >
        <el-form
          :model="addrForm"
          :rules="addrFormRules"
          ref="addrFormRef"
          label-width="80px"
        >
          <el-form-item label="省/市/县" prop="addr1">
            <el-cascader
              v-model="addrForm.addr1"
              :options="cityData"
              :props="cascaderProps"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="addr2">
            <el-input type="email" v-model="addrForm.addr2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addrDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAddr">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流信息对话框 dialog  -->
      <el-dialog
        title="修改订单地址"
        :visible.sync="progressVisible"
        width="50%"
      >
        <el-timeline reverse="reverse">
          <el-timeline-item
            v-for="(p, index) in logisticsData"
            :key="index"
            :timestamp="p.time"
          >
            {{ p.context }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import cityData from '../../utils/citydata'
import logisticsData from '../../utils/logisticsData'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      orderList: [],
      addrList: [],
      cascaderProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      addrDialogVisible: false,
      addrForm: {
        addr1: [],
        addr2: ''
      },
      addrFormRules: {
        addr1: [{ required: true, message: '必填', trigger: blur }],
        addr2: [{ required: true, message: '必填', trigger: blur }]
      },
      cityData,
      progressVisible: false,
      logisticsData
    }
  },
  methods: {
    // 物流进度
    showProgress() {
      this.progressVisible = true
      // 本来要发起请求但后端没有物流数据
      // const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      // if (res.meta.status !== 200) {
      //   return this.$message.error('获取物流信息失败！')
      // }
    },
    saveAddr() {
      this.$refs.addrFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请选择或填写详细地址')
        }
        console.log(this.addrForm)
        this.addrDialogVisible = false
      })
    },
    addrFormDiaClose() {
      this.$refs.addrFormRef.resetFields()
    },
    showAddrDia() {
      this.addrDialogVisible = true
    },
    handleChange() {
      console.log(this.addrForm)
    },
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('数据获取失败！')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(val) {
      // 改变每页展示的条数
      this.queryInfo.pagesize = val
      // 重新发起请求
      this.getOrderList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      // 重新发起请求
      this.getOrderList()
    }
  },
  created() {
    this.getOrderList()
  }
}
</script>
<style lang="less" scoped>
.el-button {
  margin: 0 !important;
  margin: 0 5px 0 0 !important;
}
</style>
