<template>
  <!-- 会员概览 -->
  <div class="page-member-analysis component-membership-overview">
    <div class="board-title">
      {{ title }}
    </div>

    <!-- 选项 -->
    <div class="membership-options">
      <el-radio-group
        v-if="boardType === 'overview'"
        v-model="membershipRadio"
        @change="getMemberOverviewData"
      >
        <el-radio-button :label="0">
          所有会员
        </el-radio-button>
        <el-radio-button :label="1">
          免费等级会员
        </el-radio-button>
        <el-radio-button :label="2">
          付费等级会员
        </el-radio-button>
      </el-radio-group>
      <el-radio-group
        v-if="boardType === 'numTrends' || boardType === 'percentageTrend'"
        v-model="membershipRadio"
        @change="getMemberNumTrendsData"
      >
        <el-radio-button :label="1">
          免费等级会员
        </el-radio-button>
        <el-radio-button :label="2">
          付费等级会员
        </el-radio-button>
      </el-radio-group>
      <el-button
        v-if="boardType === 'numTrends'"
        v-permission="['platform:memberTrend:export']"
        type="primary"
        class="filter-item"
        @click="exportFrom()"
      >
        导出
      </el-button>
    </div>

    <!-- 卡片栏 -->
    <membership-overview-card
      v-if="boardType === 'overview'"
      ref="overviewCardRef"
      :member-data="memberData"
      :one-echart-all-name="oneEchartAllName"
      :one-echart-current-name="oneEchartCurrentName"
      :rate-ratio="rateRatio"
      @update-echart="updateEchart"
    />

    <!-- 图表 -->
    <div class="chart-content">
      <!-- 会员概览 -->
      <div
        v-if="boardType === 'overview'"
        id="membership-overview-chart"
        style="width: 100%; height: 230px;"
      />
      <!-- 会员人数趋势 -->
      <div
        v-if="boardType === 'numTrends'"
        id="membership-num-trends-chart"
        style="width: 100%; height: 230px;"
      />
      <!-- 会员占比趋势 -->
      <div
        v-if="boardType === 'percentageTrend'"
        id="membership-percentage-trend-chart"
        style="width: 100%; height: 230px;"
      />
    </div>

    <!-- 数据分析思路 -->
    <div
      v-if="boardType === 'numTrends'"
      class="data-analysis-ideas"
    >
      <img
        src="@/assets/icon/data-nalysis-ideas@2x.png"
        class="left-icon"
        alt
      >
      <div class="txt">
        <p>数据分析思路</p>
        <p>通过等级会员人数趋势分析，可以观察一段时间内各个等级会员人数变化趋势，如果采取了会员招募计划，可通过数据验证招募会员活动是否有效，如果会员人数上升明显，说明招募活动取得了很好的效果。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { checkPermission } from '@/directive/permission/index.js'
import membershipOverviewCard from './membership-overview-card.vue'
import * as api from '@/api/data-analysis/member-analysis.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as $echarts from 'echarts'

const vPermission = checkPermission

const props = defineProps({
  boardType: {
    type: String,
    default: ''
  },
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

watch(() => props.dateRange, () => {
  if (props.boardType === 'overview') {
    // 会员概览后台数据
    getMemberOverviewData()
  }
  if (props.boardType === 'numTrends' || props.boardType === 'percentageTrend') {
    // 会员人数趋势后台数据
    getMemberNumTrendsData()
  }
})

onMounted(() => {
  // 标题
  getBoardTitle()
})

const title = ref('')
// 标题
const getBoardTitle = () => {
  switch (props.boardType) {
    case 'overview':
      title.value = '会员概览'
      break
    case 'numTrends':
      title.value = '会员人数趋势'
      break
    case 'percentageTrend':
      title.value = '会员占比趋势'
      break
    default:
      title.value = ''
  }
}

let isSubmit = false
const membershipRadio = ref(1)
/**
 * 导出
 */
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    const param = {
      memberType: membershipRadio.value,
      dateType: props.timeType,
      startTime: props.dateRange[0],
      endTime: props.dateRange[1]
    }
    api.soldExcel({ ...param }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '会员人数趋势.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit = false
    })
  })
}

const oneEchartAllName = ref([]) // 会员概览数据图下的所有名称
let timeArray = []
const oneEchartCurrentName = ref('') // 会员概览数据图下的所选中的名称
let dataArray = []
// 会员概览图表
const getOverviewDataChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let myChart = $echarts.getInstanceByDom(document.getElementById('membership-overview-chart'))
  // 如果不存在，就进行初始化
  if (myChart == null) {
    myChart = $echarts.init(document.getElementById('membership-overview-chart'))
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: [oneEchartCurrentName.value]
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
      boundaryGap: false,
      data: timeArray
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: oneEchartCurrentName.value,
        type: 'line',
        smooth: true,
        itemStyle: {
          lineStyle: {
            color: '#155bd4'
          },
          // 点的颜色
          color: '#155bd4'
        },
        areaStyle: {
          color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#155bd4'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        data: dataArray
      }
    ]
  }
  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

const overviewCardRef = ref(null)
const memberData = reactive({
  totalMember: 0, // 累积会员数
  newMember: 0, // 新增会员数
  payMember: 0, // 支付会员数
  couponMember: 0, // 领券会员数
  memberPayAmount: 0, // 会员支付金额
  memberPayOrder: 0, // 会员支付订单数
  memberSingleAmount: 0 // 会员客单价
})
const rateRatio = ref({})
const getMemberOverviewData = () => {
  const param = {
    memberType: membershipRadio.value,
    dateType: props.timeType,
    startTime: props.dateRange[0],
    endTime: props.dateRange[1]
  }
  api.getMemberSurvey(param).then(data => {
    if (data) {
      // 会员概览信息填充，少一个储值会员
      memberData.totalMember = data.memberOverviewModel.totalMember
      memberData.newMember = data.memberOverviewModel.newMember
      memberData.payMember = data.memberOverviewModel.payMember
      memberData.couponMember = data.memberOverviewModel.couponMember
      memberData.memberPayAmount = data.memberOverviewModel.memberPayAmount
      memberData.memberPayOrder = data.memberOverviewModel.memberPayOrder
      memberData.memberSingleAmount = data.memberOverviewModel.memberSingleAmount
      rateRatio.value = data.memberOverviewModel
      const index = overviewCardRef.value.indexSwitch
      oneEchartCurrentName.value = oneEchartAllName.value[index]
      updateOneEchart(data.memberOverviewModelList, index)
    }
  })
}

let startTime = ''
let endTime = ''
let rateArray = []
const getMemberNumTrendsData = () => {
  if (props.dateRange && props.dateRange.length > 0) {
    startTime = props.dateRange[0]
    endTime = props.dateRange[1]
  } else {
    startTime = props.startTimePar
    endTime = props.endTimePar
  }
  const param = {
    memberType: membershipRadio.value,
    dateType: props.timeType,
    startTime,
    endTime
  }
  api.getMemberTrend(param).then(data => {
    if (data) {
      dataArray = []
      rateArray = []
      timeArray = []
      for (let i = 0; i < data.length; i++) {
        data[i].currentDay = formatDate(data[i].currentDay)
        timeArray.push(data[i].currentDay)
        dataArray.push(data[i].memberNum)
        rateArray.push(data[i].memberNumRate)
      }
      if (props.boardType === 'numTrends') {
        // 会员人数趋势图表
        getNumTrendsDataChart()
      } else {
        // 会员占比趋势图表
        getPercentageTrendDataChart()
      }
    }
  })
}

let dataList = []
const updateEchart = (index) => {
  oneEchartCurrentName.value = oneEchartAllName.value[index]
  updateOneEchart(dataList, index)
}

// 更新会员概览Echart数据图的数据
const updateOneEchart = (data, echartType) => {
  dataList = data
  timeArray = []
  dataArray = []
  // 通过判断传入的类型来填充不同数据
  switch (echartType) {
    case 0:
      for (let j = 0, len = dataList.length; j < len; j++) {
        timeArray.push(dataList[j].currentDay)
        dataArray.push(dataList[j].totalMember)
      }
      break
    case 1:
      for (let j2 = 0, len2 = dataList.length; j2 < len2; j2++) {
        timeArray.push(dataList[j2].currentDay)
        dataArray.push(dataList[j2].newMember)
      }
      break
    case 2:
      for (let j3 = 0, len3 = dataList.length; j3 < len3; j3++) {
        timeArray.push(dataList[j3].currentDay)
        dataArray.push(dataList[j3].payMember)
      }
      break
    case 3:
      for (let j4 = 0, len4 = dataList.length; j4 < len4; j4++) {
        timeArray.push(dataList[j4].currentDay)
        dataArray.push(dataList[j4].couponMember)
      }
      break
    case 4:
      for (let j5 = 0, len5 = dataList.length; j5 < len5; j5++) {
        timeArray.push(dataList[j5].currentDay)
        dataArray.push(dataList[j5].memberPayAmount)
      }
      break
    case 5:
      for (let j6 = 0, len6 = dataList.length; j6 < len6; j6++) {
        timeArray.push(dataList[j6].currentDay)
        dataArray.push(dataList[j6].memberPayOrder)
      }
      break
    case 6:
      for (let j7 = 0, len7 = dataList.length; j7 < len7; j7++) {
        timeArray.push(dataList[j7].currentDay)
        dataArray.push(dataList[j7].memberSingleAmount)
      }
      break
    default:
      for (let j0 = 0, len0 = dataList.length; j0 < len0; j0++) {
        timeArray.push(dataList[j0].currentDay)
        dataArray.push(dataList[j0].totalMember)
      }
      break
  }
  for (let i = 0; i < timeArray.length; i++) {
    timeArray[i] = formatDate(timeArray[i])
  }
  // 会员概览图表
  getOverviewDataChart()
}

// 会员人数趋势图表
const getNumTrendsDataChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let myChart = $echarts.getInstanceByDom(document.getElementById('membership-num-trends-chart'))
  // 如果不存在，就进行初始化
  if (myChart == null) {
    myChart = $echarts.init(document.getElementById('membership-num-trends-chart'))
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['注册会员数']
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
      boundaryGap: false,
      data: timeArray
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '注册会员数',
        type: 'line',
        smooth: true,
        itemStyle: {
          lineStyle: {
            color: '#155bd4'
          },
          // 点的颜色
          color: '#155bd4'
        },
        areaStyle: {
          color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#155bd4'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        data: dataArray
      }
    ]
  }
  option && myChart.setOption(option)
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

/**
 * 格式化时间
 */
const formatDate = (date) => {
  const tempDate = date + ''
  return tempDate.substring(0, 4) + '-' + tempDate.substring(4, 6) + '-' + tempDate.substring(6, 8)
}

// 会员占比趋势图表
const getPercentageTrendDataChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let myChart = $echarts.getInstanceByDom(document.getElementById('membership-percentage-trend-chart'))
  // 如果不存在，就进行初始化
  if (myChart == null) {
    myChart = $echarts.init(document.getElementById('membership-percentage-trend-chart'))
  }
  const option = {
    color: ['red'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      data: ['注册会员数']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        showMaxLabel: true
      },
      data: timeArray
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    series: [
      {
        name: '注册会员数',
        type: 'bar',
        itemStyle: {
          color: '#d8effb',
          borderRadius: [15, 15, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: '#155bd4'
          }
        },
        barWidth: 25,
        data: dataArray
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
.page-member-analysis.component-membership-overview {
  // radio-button选项
  :deep(.membership-options) {
    margin-top: 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    .el-radio-button__orig-radio:checked .el-radio-button__inner {
      color: #02A1E9;
      background-color: transparent;
      border-color: #02A1E9;
    }
    .el-radio-button__inner:hover {
      color: #02A1E9;
    }
  }

  // 图表
  .chart-content {
    margin-bottom: 20px;
  }

  // 数据分析思路
  .data-analysis-ideas {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f7f8fa;
    padding: 20px;
    .left-icon {
      display: block;
      width: 52px;
      height: 52px;
      margin-right: 20px;
    }
    .txt {
      font-size: 14px;
      color: #333;
      line-height: 1.5em;
      p {
        margin: 0;
      }
      p:first-child {
        font-size: 16px;
        margin-bottom: 8px;
      }
      p:last-child {
        color: #666;
      }
    }
  }
}
</style>
