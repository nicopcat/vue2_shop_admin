<template>
  <div>
    <el-card><div ref="main" class="chart"></div></el-card>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import mergeObj from '../../utils/mergeObj.js'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    this.createChart()
  },
  methods: {
    async createChart() {
      // 请求一下数据
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        this.$message.error('获取报表错误！')
      }
      const option = mergeObj(this.options, res.data)

      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.main)
      // 指定图表的配置项和数据

      option && myChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.chart {
  display: flex;
  max-width: 900px;
  height: 500px;
}
</style>
