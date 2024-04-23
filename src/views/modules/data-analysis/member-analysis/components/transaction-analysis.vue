<template>
  <!-- 新老会员成交分析 -->
  <div class="page-member-analysis component-transaction-analysis">
    <div class="board-title">
      新老会员成交分析
    </div>

    <!-- 数据指标 -->
    <div class="data-indicators">
      <span>数据指标：</span>
      <el-radio
        v-model="dataIndicators"
        disabled
        :label="0"
      >
        客户数
      </el-radio>
    </div>

    <!-- 表格 -->
    <div class="table-box">
      <el-table
        :data="dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          prop="type"
          label="客户类型"
        />
        <el-table-column
          prop="payMemberNum"
          label="成交会员数"
        />
        <el-table-column
          prop="payMemberNumRate"
          label="成交会员占比"
        />
        <el-table-column
          prop="payOrderNum"
          label="支付订单数"
        />
        <el-table-column
          prop="pricePerMember"
          label="客单价"
        />
        <el-table-column
          prop="payAmount"
          label="支付金额"
        />
        <el-table-column
          prop="payAmountRate"
          label="支付金额占比"
        />
      </el-table>
    </div>

    <!-- 趋势指标 -->
    <div class="trend-indicators">
      <span>趋势指标：</span>
      <el-radio-group v-model="trendIndicators">
        <el-radio :label="0">
          成交会员数
        </el-radio>
        <el-radio :label="1">
          支付订单数
        </el-radio>
        <el-radio :label="2">
          客单价
        </el-radio>
        <el-radio :label="3">
          支付金额
        </el-radio>
      </el-radio-group>
    </div>

    <!-- 图表 -->
    <div class="chart-content">
      <div
        id="membership-transaction-analysis-chart"
        style="width: 100%; height: 230px;"
      />
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/member-analysis.js'
import * as $echarts from 'echarts'

const props = defineProps({
  timeType: {
    type: Number,
    default: null
  },
  dateRange: {
    type: Array,
    default: () => {
      return []
    }
  },
  startTimePar: {
    type: String,
    default: ''
  },
  endTimePar: {
    type: String,
    default: ''
  }
})

const dataIndicators = ref(0) // 数据指标
const dataList = ref([{
  type: '全部成交会员',
  payMemberNum: '0',
  payAmountRate: '100.00%',
  payAmount: '0.00',
  pricePerMember: '-',
  payMemberNumRate: '100.00%',
  payOrderNum: '0'
}, {
  type: '新成交会员',
  payMemberNum: '0',
  payAmountRate: '100.00%',
  payAmount: '0.00',
  pricePerMember: '-',
  payMemberNumRate: '100.00%',
  payOrderNum: '0'
}, {
  type: '老成交会员',
  payMemberNum: '0',
  payAmountRate: '100.00%',
  payAmount: '0.00',
  pricePerMember: '-',
  payMemberNumRate: '100.00%',
  payOrderNum: '0'
}])

let dateType = 1
watch(() => props.dateRange, () => {
  dateType = props.timeType
  // 会员概览后台数据
  getMemberOverviewData()
})

const trendIndicators = ref(0) // 趋势指标
watch(() => trendIndicators.value, (newVal) => {
  switchSixEchart(newVal)
})

onMounted(() => {
  dateType = props.timeType
})

let tempSixData = null
const getMemberOverviewData = () => {
  let startTime
  let endTime
  if (props.dateRange && props.dateRange.length > 0) {
    startTime = props.dateRange[0]
    endTime = props.dateRange[1]
  } else {
    startTime = props.startTimePar
    endTime = props.endTimePar
  }
  const param = {
    dateType,
    startTime,
    endTime
  }
  api.getMemberDeal(param).then(data => {
    if (data) {
      // 新老会员数据填充
      data.allMember.type = dataList.value[0].type
      data.newMember.type = dataList.value[1].type
      data.oldMember.type = dataList.value[2].type
      dataList.value = []
      dataList.value.push(data.allMember)
      dataList.value.push(data.newMember)
      dataList.value.push(data.oldMember)

      dataList.value.forEach(i => {
        i.payMemberNumRate = (i.payMemberNumRate * 100).toFixed(2) + '%'
        i.payAmountRate = (i.payAmountRate * 100).toFixed(2) + '%'
      })

      for (let i = 0; i < data.trendParam.length; i++) {
        data.trendParam[i].currentDay = formatDate(data.trendParam[i].currentDay)
      }
      tempSixData = data.trendParam
      switchSixEchart(trendIndicators.value)
    }
  })
}

/**
 * 格式化时间
 */
const formatDate = (date) => {
  const tempDate = date + ''
  return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
}

let trendDateArray = [] // 新老会员成交分析 时间数据
let trendNewArray = [] //  新老会员成交分析 新成交会员数据
let trendOldArray = [] //  新老会员成交分析 老成交会员数据
let radio6BNewTitil = 0 // Echart新成交会员的标题名
let radio6BOldTitil = 0 // Echart老成交会员的标题名
const radio6BNewTitilArray = ['新成交会员数', '新成交会员支付订单数', '新成交会员客单价', '新成交会员支付金额'] // 第六部分 Echart新成交会员的标题名列表
const radio6BOldTitilArray = ['老成交会员数', '老成交会员支付订单数', '老成交会员客单价', '老成交会员支付金额'] // 第六部分 Echart老成交会员的标题名列表
// 第六部分Echart图切换选项
const switchSixEchart = (trendType) => {
  const myData = tempSixData
  trendDateArray = []
  trendNewArray = []
  trendOldArray = []
  radio6BNewTitil = radio6BNewTitilArray[trendType]
  radio6BOldTitil = radio6BOldTitilArray[trendType]
  switch (trendType) {
    case 0:
      for (let i = 0; i < myData.length; i++) {
        trendDateArray[i] = myData[i].currentDay
        trendNewArray[i] = myData[i].newPayMemberNum
        trendOldArray[i] = myData[i].oldPayMemberNum
      }
      break
    case 1:
      for (let i = 0; i < myData.length; i++) {
        trendDateArray[i] = myData[i].currentDay
        trendNewArray[i] = myData[i].newPayOrderNum
        trendOldArray[i] = myData[i].oldPayOrderNum
      }
      break
    case 2:
      for (let i = 0; i < myData.length; i++) {
        trendDateArray[i] = myData[i].currentDay
        trendNewArray[i] = myData[i].newPricePerMember
        trendOldArray[i] = myData[i].oldPricePerMember
      }
      break
    case 3:
      for (let i = 0; i < myData.length; i++) {
        trendDateArray[i] = myData[i].currentDay
        trendNewArray[i] = myData[i].newPayAmount
        trendOldArray[i] = myData[i].oldPayAmount
      }
      break

    default:
      for (let i = 0; i < myData.length; i++) {
        trendDateArray[i] = myData[i].currentDay
        trendNewArray[i] = myData[i].newPayMemberNum
        trendOldArray[i] = myData[i].oldPayMemberNum
      }
      break
  }
  getChartData()
}

// 柱状图数据
const getChartData = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let myChart = $echarts.getInstanceByDom(document.getElementById('membership-transaction-analysis-chart'))
  // 如果不存在，就进行初始化
  if (myChart == null) {
    myChart = $echarts.init(document.getElementById('membership-transaction-analysis-chart'))
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [radio6BNewTitil, radio6BOldTitil]
    },
    grid: {
      left: 30,
      right: 40,
      top: 55,
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: trendDateArray
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: radio6BNewTitil,
        type: 'bar',
        data: trendNewArray,
        itemStyle: {
          // 定制显示
          color: '#155bd4'
        }
      },
      {
        name: radio6BOldTitil,
        type: 'bar',
        data: trendOldArray,
        itemStyle: {
          // 定制显示
          color: '#3DD86B'
        }
      }
    ]
  }
  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

</script>

<style lang="scss" scoped>
.page-member-analysis.component-transaction-analysis {
  // 数据指标
  .data-indicators {
    font-size: 14px;
    color: #333;
    padding-top: 10px;
  }

  // 趋势指标
  :deep(.trend-indicators) {
    margin-bottom: 30px;
    font-size: 14px;
    color: #333;
    background: #f7f8fa;
    padding: 20px;
    .el-radio__input.is-checked .el-radio__label {
      color: #333;
    }
  }

  // 表格
  :deep(.table-box) {
    margin: 20px 0;
    .table-header {
      height: 60px;
    }
    .table-row {
      height: 56px;
    }
  }

  // 图表
  .chart-content {
    margin-bottom: 20px;
  }
}
</style>
