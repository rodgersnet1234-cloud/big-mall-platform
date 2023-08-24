<template>
  <!-- 流量趋势 -->
  <div class="page-flow-profile component-traffic-trends">
    <div class="module-title">
      <div class="tit-lf">
        流量趋势
      </div>
      <el-button
        v-permission="['platform:flowTrend:export']"
        type="primary"
        class="filter-item"
        @click="exportFrom()"
      >
        导出
      </el-button>
    </div>
    <!-- 选项 -->
    <div class="data-radio">
      <el-form>
        <el-form-item label="浏览访问：">
          <el-radio-group v-model="typeValue">
            <el-radio
              class="radio-item"
              :label="0"
            >
              访客数
            </el-radio>
            <el-radio
              class="radio-item"
              :label="1"
            >
              新访客数
            </el-radio>
            <el-radio
              class="radio-item"
              :label="2"
            >
              浏览量
            </el-radio>
            <el-radio
              class="radio-item"
              :label="3"
            >
              人均浏览量
            </el-radio>
            <el-radio
              class="radio-item"
              :label="4"
            >
              加购数量
            </el-radio>
            <el-radio
              class="radio-item"
              :label="5"
            >
              跳失率
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="成交转化：">
          <el-radio-group v-model="typeValue">
            <el-radio
              class="radio-item"
              :label="6"
            >
              下单人数
            </el-radio>
            <el-radio
              class="radio-item"
              :label="7"
            >
              支付人数
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 趋势图表 -->
    <div class="trend-chart">
      <!-- 选择显示不同端的数据 -->
      <div class="plat">
        <el-radio-group
          v-model="curSystemType"
          @change="systemTypeChange"
        >
          <el-radio-button :label="0">
            全部
          </el-radio-button>
          <el-radio-button :label="1">
            PC
          </el-radio-button>
          <el-radio-button :label="2">
            H5
          </el-radio-button>
          <el-radio-button :label="3">
            微信小程序
          </el-radio-button>
          <el-radio-button :label="4">
            安卓
          </el-radio-button>
          <el-radio-button :label="5">
            IOS
          </el-radio-button>
        </el-radio-group>
      </div>
      <!-- /选择显示不同端的数据 -->

      <!-- 图表 -->
      <div class="chart-content">
        <div id="real-time-data-chart" />
      </div>
      <!-- /图表 -->
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/flow-profile.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as $echarts from 'echarts'

const props = defineProps({
  // 系统类型 0:全部 1:pc  2:h5  3:小程序 4:安卓  5:ios
  systemType: {
    type: Number,
    default () {
      return 0
    }
  },
  // 时间类型 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
  timeType: {
    type: Number,
    default () {
      return null
    }
  },
  startTime: {
    type: String,
    default () {
      return ''
    }
  },
  endTime: {
    type: String,
    default () {
      return ''
    }
  }
})

const emit = defineEmits(['switchSystemType'])

// 流量趋势
const curSystemType = ref(props.systemType) // 系统类型 0:全部 1:pc  2:h5  3:小程序 4:安卓  5:ios
watch(() => props.systemType, () => {
  curSystemType.value = props.systemType
  init()
})

watch(() => props.timeType, () => {
  init()
})

const typeValue = ref(0) // radio
watch(() => typeValue.value, (newVal) => {
  handleFlowTrendData(newVal)
}, { deep: true })

const systemTypeChange = () => {
  emit('switchSystemType', curSystemType.value)
}

const eChartTitleArray = []
// 当前Echart的名字
let currEchartTitle = ''
let flowTrendData = {}
const init = () => {
  // 遍历Echart标题名
  const ele = document.getElementsByClassName('radio-item')
  for (let j = 0, len = ele.length; j < len; j++) {
    eChartTitleArray.push(ele[j].innerText)
  }
  // 默认第一个(访客数)
  currEchartTitle = eChartTitleArray[0]
  // 流量趋势
  api.flowTrend({
    dateType: props.timeType,
    startTime: props.startTime || '',
    endTime: props.endTime || '',
    systemType: curSystemType.value || 0
  }).then(data => {
    flowTrendData = data
    handleFlowTrendData(typeValue.value)
  })
}

let isSubmit = false
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
      dateType: props.timeType,
      startTime: props.startTime || '',
      endTime: props.endTime || '',
      systemType: curSystemType.value || 0
    }
    api.soldExcelTrend({ ...param }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '流量趋势.xlsx'
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

let realTimeDataXAxis = [] // 实时数据的x轴数据
let dataArray = [] // 实时数据表的今日数据
/**
 * 处理流量趋势数据
 */
const handleFlowTrendData = (flowType) => {
  currEchartTitle = eChartTitleArray[flowType]
  const realTimeDataXAxisPar = []
  const dataArrayPar = []
  flowTrendData.forEach(data => {
    realTimeDataXAxisPar.push(data.dateTime)
    if (flowType === 0) {
      // 访客数
      dataArrayPar.push(data.userNums)
    } else if (flowType === 1) {
      // 新访客数
      dataArrayPar.push(data.newUserNums)
    } else if (flowType === 2) {
      // 访问量
      dataArrayPar.push(data.visitNums)
    } else if (flowType === 3) {
      // 人均访问量
      dataArrayPar.push(data.averageVisitNums)
    } else if (flowType === 4) {
      // 加购人数
      dataArrayPar.push(data.plusShopCartUser)
    } else if (flowType === 5) {
      // 跳失率
      dataArrayPar.push(data.lossUserRate)
    } else if (flowType === 6) {
      // 下单用户
      dataArrayPar.push(data.placeOrderUser)
    } else if (flowType === 7) {
      // 支付用户
      dataArrayPar.push(data.payUser)
    }
  })
  realTimeDataXAxis = realTimeDataXAxisPar
  dataArray = dataArrayPar
  getRealTimeDataChart()
}

// 获取流量趋势图表
const getRealTimeDataChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let myChart = $echarts.getInstanceByDom(document.getElementById('real-time-data-chart'))
  // 如果不存在，就进行初始化
  if (myChart == null) {
    myChart = $echarts.init(document.getElementById('real-time-data-chart'))
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 0,
      top: 4,
      selectedMode: false, // 关闭图例选择
      itemHeight: 8, // 图例标记的图形宽度。
      itemWidth: 18, // 图例标记的图形高度。
      icon: 'roundRect', // 图例项的 icon。
      itemGap: 40, // 图例每项之间的间隔
      textStyle: { // 图例的公用文本样式。
        color: '#999999',
        size: 12,
        padding: [0, 0, 0, 10]
      }
    },
    grid: {
      left: 30,
      right: 40,
      top: 55,
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: '下载',
          show: true
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: realTimeDataXAxis
    },
    yAxis: {
      type: 'value'
      // name: '交易金额'
    },
    series: [
      {
        name: currEchartTitle,
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
            color: 'rgba(2,161,233,0.5)'
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

</script>

<style lang="scss" scoped>
// 流量趋势
.page-flow-profile.component-traffic-trends {
  .radio-item {
    width: 135px;
    margin: 0 40px 0 0;
  }
  // 选项
  .data-radio {
    display: block;
    padding: 16px;
    font-size: 14px;
  }

  // 趋势图表
  .trend-chart {
    display: block;
    border: 1px solid #EAF0F4;
    padding: 20px;
    // 图表
    .chart-content {
      width: 100%;
      height: 360px;
      #real-time-data-chart {
        width: 100%;
        height: 100%;
      }
    }
    // 选择显示不同端的数据
    :deep(.plat) {
      .el-radio-button__orig-radio:checked .el-radio-button__inner {
        border-color: #155bd4;
        background: #f5f9ff;
        color: #155bd4;
      }
      .el-radio-button__inner:hover {
        color: #155bd4;
      }
      .cur-item {
        display: inline-block;
        margin-left: 100px;
        font-size: 12px;
        line-height: 1em;
        color: #999;
        padding-left: 50px;
      }
      .cur-item::before {
        display: inline-block;
        content: "";
        width: 18px;
        height: 8px;
        // background: #155bd4;
        background: #155bd4;
        border-radius: 8px;
        margin-right: 10px;
      }
    }
  }
}
</style>
