<template>
  <!-- 访问深度 -->
  <div class="page-visitor-analytics component-access-depth-mod">
    <!-- 标题 -->
    <customerProfileTitle :title-info="titleInfo" />

    <!-- 图表区域 -->
    <div class="chart-mod">
      <!-- 柱状图 -->
      <div class="histogram-chart">
        <div class="chart-content">
          <div
            :id="eChart"
            class="access-depth-histogram-chart"
          />
        </div>
      </div>
      <!-- 环形图 -->
      <div class="pie-chart">
        <div class="chart-content">
          <div
            :id="eChartTwo"
            class="access-depth-pie-chart"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import customerProfileTitle from '../../public-components/customer-profile-title.vue'
import * as $echarts from 'echarts'
const props = defineProps({
  echartData: {
    type: Object,
    default () {
      return {
        depthData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        }
      }
    }
  }
})

const eChart = ref('eChart' + Date.now() + Math.random())
const eChartTwo = ref('eChartTwo' + Date.now() + Math.random())

const titleInfo = {
  title: '访问深度',
  content: '每个用户当天所有访问页面总和'
}

watch(() => props.echartData, () => {
  nextTick(() => {
    refreshChart()
  })
}, { immediate: true, deep: true })

// 刷新图表数据
const refreshChart = () => {
  // 访问深度柱状图
  getAccessDataHistogramChart()
  // 访问深度环形图
  getAccessDataPieChart()
}

// 访问深度柱状图
const getAccessDataHistogramChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let histogramChart = $echarts.getInstanceByDom(document.getElementById(eChart.value))
  // 如果不存在，就进行初始化
  if (histogramChart == null) {
    histogramChart = $echarts.init(document.getElementById(eChart.value))
  }
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {},
    grid: {
      left: 30,
      right: 40,
      top: 55,
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: props.echartData.depthData.xData,
      // xAxis的属性，设置x轴文本不隐藏，同理yAxis也有
      axisLabel: {
        interval: 0, // 坐标轴刻度标签的显示间隔
        rotate: 40 // 标签倾斜的角度
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '访客数',
      type: 'bar',
      data: props.echartData.depthData.seriesData,
      barWidth: '45%',
      itemStyle: {
        color: '#155bd4',
        borderRadius: [4, 4, 0, 0]
      }
    }]
  }
  option && histogramChart.setOption(option)
  window.addEventListener('resize', function () {
    histogramChart.resize()
  })
}

// 访问深度环形图
const getAccessDataPieChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let depthPieChart = $echarts.getInstanceByDom(document.getElementById(eChartTwo.value))
  // 如果不存在，就进行初始化
  if (depthPieChart == null) {
    depthPieChart = $echarts.init(document.getElementById(eChartTwo.value))
  }
  const option = {
    title: {
      text: '访客数',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#666',
        fontWeight: '500',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} <br/>{a}: {c} <br/>占比：{d}%' // a:series.data.name\b:series.name\c:series.data.value\d:自动计算百分比
    },
    legend: {
      orient: 'vertical',
      top: 20,
      left: 'right',
      data: props.echartData.depthData.xData
    },
    series: [
      {
        type: 'pie',
        name: '访客数',
        radius: ['72%', '28%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: { // 相应数据展示，饼图内部样式的设置
            show: true,
            fontSize: '14',
            color: '#888'
          }
        },
        labelLine: {
          show: false
        },
        data: props.echartData.depthData.seriesData2
      }
    ]
  }
  option && depthPieChart.setOption(option)
  window.addEventListener('resize', function () {
    depthPieChart.resize()
  })
}

</script>

<style lang="scss" scoped>
:deep(.component-access-depth-mod) {
  .tit-line {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}

.page-visitor-analytics.component-access-depth-mod {
  background: #fff;
  padding: 15px;
  // 图表
  .chart-mod {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px;
    .histogram-chart, .pie-chart {
      display: block;
      width: 50%;
      height: 360px;
      .chart-content {
        display: block;
        width: 100%;
        height: 100%;
        .access-depth-histogram-chart, .access-depth-pie-chart {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
