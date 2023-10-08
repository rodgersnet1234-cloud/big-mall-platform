<template>
  <!-- 访问地域分布 -->
  <div class="page-visitor-analytics component-geographical-distribution">
    <!-- 标题 -->
    <customerProfileTitle
      :title-info="titleInfo"
      :show-export="true"
      :permission="'platform:userAnalysis:export'"
      @export-from="exportFrom"
    />

    <!-- 图表 -->
    <div class="chart-mod">
      <!-- 左-地图 -->
      <div class="maps-chart">
        <div class="chart-content">
          <div
            :id="eChart"
            class="geo-maps-mod"
          />
        </div>
      </div>
      <!-- 右-饼图 -->
      <div class="pie-chart">
        <div class="chart-content">
          <div
            :id="eChartTwo"
            class="geo-pie-mod"
          />
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        :header-cell-style="{
          background:'#f9f9f9',
        }"
        stripe
      >
        <el-table-column
          prop="seq"
          class="table-item"
          label="序号"
        />
        <el-table-column
          prop="provinceName"
          class="table-item"
          label="地区"
        />
        <el-table-column
          prop="visitNums"
          class="table-item"
          label="浏览量"
          sortable
        >
          <template #default="scope">
            {{ scope.row.visitNums || 0 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="prodVisitUser"
          class="table-item"
          label="商品访客数"
        >
          <template #default="scope">
            {{ scope.row.prodVisitUser || 0 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="prodVisitNums"
          class="table-item"
          label="商品浏览量"
        >
          <template #default="scope">
            {{ scope.row.prodVisitNums || 0 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="plusShopCart"
          class="table-item"
          label="加购数量"
        >
          <template #default="scope">
            {{ scope.row.plusShopCart || 0 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="placeOrderAmount"
          class="table-item"
          label="下单金额"
        >
          <template #default="scope">
            {{ amount(scope.row.placeOrderAmount || 0) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="payAmount"
          class="table-item"
          label="支付金额"
        >
          <template #default="scope">
            {{ amount(scope.row.payAmount || 0) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import customerProfileTitle from '../../public-components/customer-profile-title.vue'
import Big from 'big.js'
import * as $echarts from 'echarts'
import { chinaMap } from './chinaJson.js'

const amount = (val) => {
  if (!val) {
    return 0
  }
  return new Big(val).div(100).toFixed(2)
}

const props = defineProps({
  echartData: {
    type: Object,
    default () {
      return {
        regionData: {
          xData: [],
          seriesData: [],
          seriesData2: []
        }
      }
    }
  },
  tableData: {
    type: Array,
    default () {
      return []
    }
  }
})

const emit = defineEmits(['exportFrom'])

const eChart = ref('eChart' + Date.now() + Math.random())
const eChartTwo = ref('eChartTwo' + Date.now() + Math.random())

const titleInfo = reactive({
  title: '访问地域分布',
  content: '用户所在地域'
})

watch(() => props.echartData, () => {
  nextTick(() => {
    refreshChart()
  })
}, { immediate: true, deep: true })

// 刷新图表数据
const refreshChart = () => {
  getGeographicalData()
  getGeographicalPieData()
}
// 导出
const exportFrom = () => {
  emit('exportFrom')
}

let oldDataList = []
// 地域数据处理
const mapsDate = () => {
  const oldDataListPar = [
    { name: '南海诸岛', label: '南海诸岛', value: 0 },
    { name: '北京市', label: '北京市', value: 0 },
    { name: '天津市', label: '天津市', value: 0 },
    { name: '上海市', label: '上海市', value: 0 },
    { name: '重庆市', label: '重庆市', value: 0 },
    { name: '河北省', label: '河北省', value: 0 },
    { name: '河南省', label: '河南省', value: 0 },
    { name: '云南省', label: '云南省', value: 0 },
    { name: '辽宁省', label: '辽宁省', value: 0 },
    { name: '黑龙江省', label: '黑龙江省', value: 0 },
    { name: '湖南省', label: '湖南省', value: 0 },
    { name: '安徽省', label: '安徽省', value: 0 },
    { name: '山东省', label: '山东省', value: 0 },
    { name: '新疆维吾尔自治区', label: '新疆维吾尔自治区', value: 0 },
    { name: '江苏省', label: '江苏省', value: 0 },
    { name: '浙江省', label: '浙江省', value: 0 },
    { name: '江西省', label: '江西省', value: 0 },
    { name: '湖北省', label: '湖北省', value: 0 },
    { name: '广西', label: '广西', value: 0 },
    { name: '甘肃省', label: '甘肃省', value: 0 },
    { name: '山西省', label: '山西省', value: 0 },
    { name: '内蒙古自治区', label: '内蒙古自治区', value: 0 },
    { name: '陕西省', label: '陕西省', value: 0 },
    { name: '吉林省', label: '吉林省', value: 0 },
    { name: '福建省', label: '福建省', value: 0 },
    { name: '贵州省', label: '贵州省', value: 0 },
    { name: '广东省', label: '广东省', value: 0 },
    { name: '青海省', label: '青海省', value: 0 },
    { name: '西藏自治区', label: '西藏自治区', value: 0 },
    { name: '四川省', label: '四川省', value: 0 },
    { name: '宁夏回族自治区', label: '宁夏回族自治区', value: 0 },
    { name: '海南省', label: '海南省', value: 0 },
    { name: '台湾省', label: '台湾省', value: 0 },
    { name: '香港', label: '香港', value: 0 },
    { name: '澳门', label: '澳门', value: 0 }
  ]

  const newDataList = props.echartData.regionData.seriesData2
  // 循环赋值，有数据的更新
  for (let i = 0; i < newDataList.length; i++) {
    for (let j = 0; j < oldDataListPar.length; j++) {
      if (newDataList[i].name === oldDataListPar[j].name) {
        oldDataListPar[j].value = newDataList[i].value
      }
    }
  }
  oldDataList = oldDataListPar
}

// 地域分布-地图
const getGeographicalData = async () => {
  await mapsDate()
  $echarts.registerMap('china', chinaMap)
  // 有的话就获取已有echarts实例的DOM节点
  let mapsChart = $echarts.getInstanceByDom(document.getElementById(eChart.value))
  // 如果不存在，就进行初始化
  if (mapsChart == null) {
    mapsChart = $echarts.init(document.getElementById(eChart.value))
  }
  const option = {
    tooltip: {
      formatter: (params) => {
        return params.seriesName + '<br />' + params.name + '：' + params.value
      } // 数据格式化
    },
    visualMap: {
      min: 0,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'], // 取值范围的文字
      inRange: {
        color: ['#eee', '#1989fa'] // 取值范围的颜色
      },
      show: true // 图注
    },
    geo: {
      map: 'china',
      roam: false, // 不开启缩放和平移
      zoom: 1.23, // 视角缩放比例
      label: {
        show: true,
        fontSize: '10',
        color: 'rgba(0,0,0,0.7)'
      },
      emphasis: {
        areaColor: '#258ffa', // 鼠标选择区域颜色
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 20,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        itemStyle: {
          borderColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
    },
    series: [
      {
        type: 'map',
        name: '访客数',
        map: 'china',
        geoIndex: 0,
        label: {
          show: true
        },
        data: oldDataList
      }
    ]
  }
  mapsChart.setOption(option)
  window.addEventListener('resize', function () {
    mapsChart.resize()
  })
}

// 地域分布-环形图
const getGeographicalPieData = () => {
  // 有的话就获取已有echarts实例的DOM节点
  let pieChart = $echarts.getInstanceByDom(document.getElementById(eChartTwo.value))
  // 如果不存在，就进行初始化
  if (pieChart == null) {
    pieChart = $echarts.init(document.getElementById(eChartTwo.value))
  }
  const option = {
    title: {
      text: '浏览量',
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
      type: 'scroll',
      orient: 'vertical',
      top: 20,
      left: 'right',
      data: props.echartData.regionData.xData
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
        data: props.echartData.regionData.seriesData2
      }
    ]
  }
  option && pieChart.setOption(option)
  window.addEventListener('resize', function () {
    pieChart.resize()
  })
}

</script>

<style lang="scss" scoped>
:deep(.component-geographical-distribution) {
  .tit-line {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}
.page-visitor-analytics.component-geographical-distribution {
  margin-top: 15px;
  background: #fff;
  padding: 20px;

  // 图表
  .chart-mod {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 30px;
    .maps-chart, .pie-chart {
      display: block;
      width: 50%;
      height: 360px;
      .chart-content {
        width: 100%;
        height: 100%;
        .geo-maps-mod, .geo-pie-mod {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
// 表格
:deep(.table) {
  .el-table th.is-leaf,
  .el-table td {
    border-bottom: none;
  }
  .el-table {
    .has-gutter {
      tr {
        border-bottom: 1px solid #EBEDF0;
        height: 55px;
      }
    }
    tr {
      height: 55px;
      th, .cell {
        text-align: center;
      }
    }
  }
}
</style>
