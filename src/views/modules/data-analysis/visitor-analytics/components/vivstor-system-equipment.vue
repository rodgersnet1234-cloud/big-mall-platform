<template>
  <!-- 系统设备 -->
  <div class="page-visitor-analytics component-system-equipment">
    <!-- 标题 -->
    <customerProfileTitle :title-info="titleInfo" />

    <!-- 图表 -->
    <div class="chart-mod">
      <!-- 系统设备 -->
      <div class="pie-chart">
        <div class="chart-content">
          <div id="plant-pie-mod" />
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
        equiData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        }
      }
    }
  }
})

const titleInfo = reactive({
  title: '系统设备',
  content: 'IOS：使用iPhone、iPad、iPod 等 Apple设备访问的浏览人数。Android：使用Android内核的操作系统设备访问的浏览人数。'
})

watch(() => props.echartData, () => {
  nextTick(() => {
    getChart()
  })
}, { immediate: true, deep: true })

const getChart = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let plantPieChart = $echarts.getInstanceByDom(document.getElementById('plant-pie-mod'))
  // 如果不存在，就进行初始化
  if (plantPieChart == null) {
    plantPieChart = $echarts.init(document.getElementById('plant-pie-mod'))
  }
  const option = {
    title: {
      // text: '访客数',
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
      data: props.echartData.equiData.xData
    },
    series: [
      {
        type: 'pie',
        name: '访客数',
        radius: ['70%', '30%'],
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
        data: props.echartData.equiData.seriesData
      }
    ]
  }
  option && plantPieChart.setOption(option)
  window.addEventListener('resize', function () {
    plantPieChart.resize()
  })
}

</script>

<style lang="scss" scoped>
:deep(.component-system-equipment) {
  .tit-line {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}

.page-visitor-analytics.component-system-equipment {
  margin-top: 15px;
  background: #fff;
  padding: 20px;
  // 图表
  .chart-mod {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .pie-chart {
      display: block;
      width: 100%;
      height: 360px;
      .chart-content {
        width: 100%;
        height: 100%;
        #plant-pie-mod {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
