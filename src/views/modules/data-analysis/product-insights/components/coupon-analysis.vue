<template>
  <!-- 卡券分析 -->
  <div class="page-product-insights component-coupon-analysis">
    <!-- 卡券关键指标与趋势图 -->
    <title-bar :title="title1" />
    <div class="indicators-trends-mod">
      <!-- 昨日关键指标 -->
      <div class="indicators-trends-item yesterday-indicators">
        <div class="mod-tit">
          卡券昨日关键指标
        </div>
        <div class="indi">
          <div class="item">
            <img
              src="@/assets/icon/700@2x.png"
              class="left-img"
              alt
            >
            <div class="right-con">
              <p>领取次数</p>
              <p>2085</p>
            </div>
          </div>
          <div class="item">
            <img
              src="@/assets/icon/699@2x.png"
              class="left-img mini"
              alt
            >
            <div class="right-con">
              <p>微商城使用次数</p>
              <p>1483</p>
            </div>
          </div>
        </div>
      </div>
      <!-- 卡券趋势图 -->
      <div class="indicators-trends-item coupon-trend-chart-box">
        <div class="mod-tit">
          卡券趋势图
        </div>
        <!-- 折线图 -->
        <div class="chart-box">
          <div class="chart-content">
            <div
              id="prod-coupon-trend-chart"
              style="width: 1000px; height: 280px"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- /卡券关键指标与趋势图 -->

    <!-- 详细数据 -->
    <div class="detailed-data-mod">
      <title-bar :title="title2" />
      <!-- 表格 -->
      <div class="table">
        <el-table :data="tableData">
          <el-table-column
            prop="date"
            class="table-item"
            label="日期"
            width="400px"
          />
          <el-table-column
            prop="receiveTimes"
            class="table-item"
            label="领取次数"
          />
          <el-table-column
            prop="usesTimes"
            class="table-item"
            label="微商城使用次数"
          />
        </el-table>
      </div>
    </div>
    <!-- /详细数据 -->
  </div>
</template>

<script setup>
import titleBar from '../../public-components/title-bar.vue'
import * as $echarts from 'echarts'

const title1 = ref('卡券昨日关键指标')
const title2 = ref('详细数据')

const prodTrendDataXAxis = reactive(['2021-04-20', '2021-04-21', '2021-04-22', '2021-04-23', '2021-04-23', '2021-04-25', '2021-04-26', '2021-04-27', '2021-04-28']) // 实时数据的x轴数据
const prodShareVisitData = reactive([26, 17, 13, 12, 38, 25, 15, 9, 4]) // 领取次数
const prodVisitData = reactive([22, 3, 24, 12, 6, 32, 3, 33, 2]) // 微商城使用次数

const tableData = [{
  date: '2021-04-19',
  receiveTimes: '789',
  usesTimes: '695'
},
{
  date: '2021-04-20',
  receiveTimes: '789',
  usesTimes: '695'
},
{
  date: '2021-04-21',
  receiveTimes: '789',
  usesTimes: '695'
}]

onMounted(() => {
  getProductTrendChartData()
})

// 商品趋势分析折线图
const getProductTrendChartData = () => {
  const myChart = $echarts.init(document.getElementById('prod-coupon-trend-chart'))
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['领取次数', '微商城使用次数']
    },
    grid: {
      left: 20,
      right: 35,
      top: 55,
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: prodTrendDataXAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {

        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#155bd4'
            }
          }
        },
        areaStyle: {
          color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(24,144,255,0.6)'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        data: prodShareVisitData
      },
      {

        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#89EACD'
            }
          }
        },
        areaStyle: {
          color: new $echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(137,234,205,0.1)'
          }, {
            offset: 1,
            color: '#ffffff'
          }])
        },
        data: prodVisitData
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
// 卡券分析
.page-product-insights.component-coupon-analysis {
  // 卡券关键指标与趋势图
  .indicators-trends-mod {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    font-size: 14px;
    color: #333;
    margin-top: 20px;
    margin-bottom: 30px;

    .indicators-trends-item {
      display: block;
      height: 340px;
      border: 1px solid #EAF0F4;
      padding: 20px;
      .mod-tit {
        font-size: 16px;
        font-weight: bold;
      }
    }

    // 昨日关键指标
    .yesterday-indicators {
      width: 30%;
      padding: 20px;
      margin-right: 15px;
      .indi {
        .item {
          p {
            margin: 0;
          }
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          padding: 20px 25px;
          background: #f7f8fa;
          margin-top: 30px;
          img.left-img {
            display: block;
            width: 14px;
            height: 14px;
            margin-right: 10px;
          }
          img.left-img.mini {
            width: 12px;
            height: 14px;
          }
          .right-con {
            p:first-child {
              font-size: 14px;
              color: #999;
              margin-bottom: 15px;
              line-height: 1em;
            }
            p:last-child {
              font-size: 20px;
              color: #333;
              font-weight: bold;
              line-height: 1em;
            }
          }
        }
      }
    }

    // 卡券趋势图
    .coupon-trend-chart-box {
      display: block;
    }
  }

  // 详细数据
  .detailed-data-mod {
    // 表格
    :deep(.table) {
      margin-top: 15px;
      font-size: 14px;
      margin-bottom: 20px;
      .el-table {
        border-bottom: 0;
        th.is-leaf, td {
          border-color: #EAF0F4;
        }
        .has-gutter {
          tr {
            border-top: 1px solid #EAF0F4;
            border-left: 1px solid #EAF0F4;
            border-right: 1px solid #EAF0F4;
          }
          tr, th {
            background: #f7f8fa;
          }
          .cell {
            color: #000;
            font-weight: bold;
          }
        }
        tr {
          height: 56px;
        }
      }
      .el-table .cell {
        color: #666;
      }
    }
  }
}
</style>
