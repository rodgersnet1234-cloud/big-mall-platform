<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="Mall4j dashboard-container">
    <!-- 1.店铺状态信息提示 -->
    <div
      v-if="shopStatus === 2"
      class="shop-inf-imperfect-tips"
    >
      <div>
        <el-icon class="warning">
          <Warning />
        </el-icon>
        您的店铺已下线，原因是：
        <span>{{ offlineReason }}</span>
        <span>。如有问题可重新申请上线 &gt;</span>
      </div>
      <el-button
        type="primary"
        link
        @click="offlineManageHandle"
      >
        申请上线
      </el-button>
    </div>
    <div
      v-if="shopStatus === 5 || shopStatus === 3"
      class="shop-inf-imperfect-tips"
    >
      <div>
        <el-icon class="warning">
          <Warning />
        </el-icon>
        您的店铺正在申请上线，
        <span>店铺等待审核中</span>
      </div>
    </div>
    <div
      v-if="subjectType!==null&&subjectType===0"
      class="shop-inf-imperfect-tips"
    >
      <div>
        <el-icon class="warning">
          <Warning />
        </el-icon>
        <router-link
          to="/system/system-config/principal-config"
        >
          为了不影响商城日常经营，建议及时选择主体认证方式并完成相关操作 &gt;
        </router-link>
      </div>
    </div>
    <!-- 今日指数 -->
    <div class="today-index item-wrapper first-layer layer">
      <div class="title">
        <div class="t-title">
          今日指数
        </div>
        <div class="t-explain-item t-explain-first-item t-small-text t-red">
          较昨日增长
        </div>
        <div class="t-explain-item t-explain-second-item t-small-text t-dark-green">
          较昨日下降
        </div>
      </div>
      <div class="data-content">
        <div class="check-pending-shop-num d-item">
          <div class="di-title">
            待审核店铺
          </div>
          <div class="di-num">
            {{ pendingShop }}
          </div>
        </div>
        <div class="today-pay-customer-num d-item">
          <div class="di-title">
            今日支付客户数(个)
          </div>
          <div class="di-num">
            {{ isTrueData(todayInfoData.todayData.payUserCount) }}
          </div>
          <div :class="'di-trend di-trend-' + (todayInfoData.todayData.yesterdayPayUserRate >= 0 ? 'rise' : 'reduce')">
            {{ dataFormat(isTrueData(todayInfoData.todayData.yesterdayPayUserRate)) }}%
            <el-icon>
              <Top v-if="todayInfoData.todayData.yesterdayPayUserRate >= 0" />
              <Bottom v-else />
            </el-icon>
          </div>
        </div>
        <div class="pay-order-num d-item">
          <div class="di-title">
            今日支付订单数(笔)
          </div>
          <div class="di-num">
            {{ isTrueData(todayInfoData.todayData.payOrderCount) }}
          </div>
          <div :class="'di-trend di-trend-' + (todayInfoData.todayData.yesterdayPayOrderRate >= 0 ? 'rise' : 'reduce')">
            {{ dataFormat(isTrueData(todayInfoData.todayData.yesterdayPayOrderRate)) }}%
            <el-icon>
              <Top v-if="todayInfoData.todayData.yesterdayPayOrderRate >= 0" />
              <Bottom v-else />
            </el-icon>
          </div>
        </div>
        <div class="refund-amount-num d-item">
          <div class="di-title">
            今日退款金额(元)
          </div>
          <div class="di-num">
            {{ conversionActual(isTrueData(todayInfoData.todayData.refund)) }}
          </div>
          <div :class="'di-trend di-trend-' + (todayInfoData.todayData.yesterdayRefundRate >= 0 ? 'rise' : 'reduce')">
            {{ dataFormat(isTrueData(todayInfoData.todayData.yesterdayRefundRate)) }}%
            <el-icon>
              <Top v-if="todayInfoData.todayData.yesterdayRefundRate >= 0" />
              <Bottom v-else />
            </el-icon>
          </div>
        </div>
        <div class="single-customer-price d-item">
          <div class="di-title">
            今日客单价(元)
          </div>
          <div class="di-num">
            {{ conversionActual(isTrueData(todayInfoData.todayData.onePrice)) }}
          </div>
          <div :class="'di-trend di-trend-' + (todayInfoData.todayData.yesterdayOnePriceRate >= 0 ? 'rise' : 'reduce')">
            {{ dataFormat(isTrueData(todayInfoData.todayData.yesterdayOnePriceRate)) }}%
            <el-icon>
              <Top v-if="todayInfoData.todayData.yesterdayOnePriceRate >= 0" />
              <Bottom v-else />
            </el-icon>
          </div>
        </div>
        <div class="pay-amount-num d-item">
          <div class="di-title">
            今日支付金额(元)
          </div>
          <div class="di-num">
            {{ conversionActual(isTrueData(todayInfoData.todayData.payActual)) }}
          </div>
          <div
            :class="'di-trend di-trend-' + (todayInfoData.todayData.yesterdayPayActualRate >= 0 ? 'rise' : 'reduce')"
          >
            {{ dataFormat(isTrueData(todayInfoData.todayData.yesterdayPayActualRate)) }}%
            <el-icon>
              <Top v-if="todayInfoData.todayData.yesterdayPayActualRate >= 0" />
              <Bottom v-else />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
    <div class="second-layer layer">
      <!-- 实时数据 -->
      <div class="real-time-data item-wrapper">
        <div class="chart-content">
          <common-chart
            class="real-time-data-chart"
            :options="realTimeDataChart"
          />
        </div>
      </div>

      <!-- 今日客户概况 -->
      <div class="today-customer-survey item-wrapper">
        <div class="title">
          <div class="t-title">
            客户概况
          </div>
        </div>
        <div class="data-content">
          <div class="customer-total d-item">
            <div class="di-title">
              <el-icon class="icon">
                <User />
              </el-icon>
              <span class="text">客户总数</span>
            </div>
            <div class="di-num">
              {{ customerCountInfo.totalMember }}
            </div>
          </div>
          <div class="customer-total d-item">
            <div class="di-title">
              <el-icon class="icon">
                <User />
              </el-icon>
              <span class="text">付费客户数</span>
            </div>
            <div class="di-num">
              {{ customerCountInfo.paidMember }}
            </div>
          </div>
          <div class="customer-total d-item">
            <div class="di-title">
              <el-icon class="icon">
                <User />
              </el-icon>
              <span class="text">今日新增客户</span>
            </div>
            <div class="di-num">
              {{ customerCountInfo.newMember }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 整体看板 -->
    <div class="entirety-plate item-wrapper third-layer layer">
      <div class="title">
        <div class="t-title">
          整体看板
        </div>
        <div class="t-explain-item t-explain-first-item t-small-text t-today-data">
          平台支付金额
        </div>
        <div class="t-pay-amount">
          <div class="t-today t-pay-item">
            <div class="tt-title">
              当天支付金额(元)
            </div>
            <div class="tt-num">
              {{ conversionActual(todayInfoData.todayData.payActual) }}
            </div>
          </div>
          <div class="t-month t-pay-item">
            <div class="tt-title">
              本月支付金额(元)
            </div>
            <div class="tt-num">
              {{ currentMonthPayActual }}
            </div>
          </div>
        </div>
      </div>
      <div class="chart-content">
        <common-chart
          class="entirety-data-chart"
          :options="entiretyDataChart"
        />
      </div>
    </div>

    <!-- 第五层 -->
    <div class="fifth-layer layer">
      <!-- 店铺流量排行Top10 -->
      <div class="shop-flow-rank item-wrapper">
        <div class="title">
          <div class="t-title">
            店铺流量排行Top10
          </div>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="table-content">
          <table>
            <tr class="table-title">
              <td class="tt-item">
                {{ '序号' }}
              </td>
              <td class="tt-item">
                {{ '店铺名称' }}
              </td>
              <td class="tt-item">
                {{ '商品访客数' }}
              </td>
              <td class="tt-item">
                {{ '商品浏览量' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in shopFlowRankData"
              :key="index"
              class="table-item"
            >
              <td class="ti-item">
                {{ index + 1 }}
              </td>
              <td class="ti-item">
                {{ item.shopName }}
              </td>
              <td class="ti-item">
                {{ item.visitUserCount }}
              </td>
              <td class="ti-item">
                {{ item.visitCount }}
              </td>
            </tr>
          </table>
          <div
            v-if="shopFlowRankData.length === 0"
            class="empty-data"
          >
            暂无数据显示
          </div>
        </div>
      </div>
      <!-- 店铺交易排行Top10 -->
      <div class="shop-deal-rank item-wrapper">
        <div class="title">
          <div class="t-title">
            店铺交易排行Top10
          </div>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="table-content">
          <table>
            <tr class="table-title">
              <td class="tt-item">
                {{ '序号' }}
              </td>
              <td class="tt-item">
                {{ '店铺名称' }}
              </td>
              <td class="tt-item">
                {{ '下单笔数' }}
              </td>
              <td class="tt-item">
                {{ '下单人数' }}
              </td>
              <td class="tt-item">
                {{ '下单金额' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in shopDealRankData"
              :key="index"
              class="table-item"
            >
              <td class="ti-item">
                {{ index + 1 }}
              </td>
              <td class="ti-item">
                {{ item.shopName }}
              </td>
              <td class="ti-item">
                {{ item.placeOrderNum }}
              </td>
              <td class="ti-item">
                {{ item.placeOrderPeopleNum }}
              </td>
              <td class="ti-item">
                ￥{{ conversionActual(item.placeOrderAmount) }}
              </td>
            </tr>
          </table>
          <div
            v-if="shopDealRankData.length === 0"
            class="empty-data"
          >
            暂无数据显示
          </div>
        </div>
      </div>
    </div>
    <!-- 第六层 -->
    <div class="sixth-layer layer">
      <!-- 店铺流量排行Top10 -->
      <div class="prod-sale-rank item-wrapper">
        <div class="title">
          <div class="t-title">
            商品销售排行Top10
          </div>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="table-content">
          <table>
            <tr class="table-title">
              <td class="tt-item">
                {{ '序号' }}
              </td>
              <td class="tt-item">
                {{ '商品名称' }}
              </td>
              <td class="tt-item">
                {{ '下单笔数' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in prodSaleRankData"
              :key="index"
              class="table-item"
            >
              <td class="ti-item">
                {{ index + 1 }}
              </td>
              <td class="ti-item">
                {{ item.prodName }}
              </td>
              <td class="ti-item">
                {{ item.placeOrderNum }}
              </td>
            </tr>
          </table>
          <div
            v-if="prodSaleRankData.length === 0"
            class="empty-data"
          >
            暂无数据显示
          </div>
        </div>
      </div>

      <!-- 店铺交易排行Top10 -->
      <div class="refund-order-rank item-wrapper">
        <div class="title">
          <div class="t-title">
            退单店铺排行Top10
          </div>
          <span class="update-time">仅展示最近30天</span>
        </div>
        <div class="table-content">
          <table>
            <tr class="table-title">
              <td class="tt-item">
                {{ '序号' }}
              </td>
              <td class="tt-item">
                {{ '店铺名称' }}
              </td>
              <td class="tt-item">
                {{ '成功退款订单数' }}
              </td>
            </tr>
            <tr
              v-for="(item, index) in refundShopRankData"
              :key="index"
              class="table-item"
            >
              <td class="ti-item">
                {{ index + 1 }}
              </td>
              <td class="ti-item">
                {{ item.shopName }}
              </td>
              <td class="ti-item">
                {{ item.refundOrderNum }}
              </td>
            </tr>
          </table>
          <div
            v-if="refundShopRankData.length === 0"
            class="empty-data"
          >
            暂无数据显示
          </div>
        </div>
      </div>
    </div>
  </div>
  <apply-online
    v-if="applyOnlineVisible"
    ref="applyOnlineRef"
    @on-re-apply-data-submit="reReapplyDataSubmit"
  />
</template>

<script setup>
import applyOnline from '@/components/apply-online/index.vue'
import {
  getDetailByHour,
  getCurrentMonthByDay,
  listShopRankingByPayActual,
  listShopRankingByRefundCount,
  listSpuRankingByPayActual
} from '@/api/order/order-statistics'
import {
  getUserCountInfo
} from '@/api/user/user-manager'
import {
  countByShopStatus,
  listShopRankIngByFlow
} from '@/api/multishop/shop-detail'
import { mallUserStore } from '@/stores/modules/mallUser.js'
import { getEventInfo, auditApply } from '@/api/multishop/shop-event'
import { ElMessage } from 'element-plus'

import Big from 'big.js'
const applyOnlineVisible = ref(false)
const offlineReason = ref('')
let eventInfoData = null
const getMallEventInfo = () => {
  getEventInfo().then(res => {
    if (res) {
      eventInfoData = res
      offlineReason.value = res.offlineReason
    }
  })
}
const applyOnlineRef = ref(null)
const offlineManageHandle = () => {
  applyOnlineVisible.value = true
  nextTick(() => {
    applyOnlineRef.value.init(eventInfoData)
  })
}
const reReapplyDataSubmit = (data) => {
  const param = {
    eventId: data.eventId,
    reapplyReason: data.reapplyReason // 申请理由
  }

  auditApply(param).then(() => {
    applyOnlineVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000
    })
  })
}
const mallStore = mallUserStore()
const shopStatus = computed(() => mallStore.platformStatus)
const subjectType = computed(() => mallStore.subjectType)
const pendingShop = ref(0)
// 客户数量概况
const customerCountInfo = reactive({
  totalMember: '',
  newMember: '',
  paidMember: ''
})

const todayInfoData = reactive({
  todayData: {}
})
/**
 * 获取今日客户概况
 */
const getTodayInfo = () => {
  countByShopStatus(3).then(res => {
    if (res) {
      pendingShop.value = res
    }
  })
  getUserCountInfo().then(res => {
    if (res) {
      customerCountInfo.totalMember = res.totalMember
      customerCountInfo.newMember = res.newMember
      customerCountInfo.paidMember = res.paidMember
    }
  })
}

/**
 * 获取两天的实时数据
 */
// 实时数据的x轴数据
const realTimeDataXAxis = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
const realTimeDataChart = ref({})
const getRealTimeData = () => {
  getDetailByHour().then(res => {
    todayInfoData.todayData = res
    // 今昨两日实时数据对比图表
    realTimeDataChart.value = {
      title: {
        text: '实时数据',
        left: 'left',
        textStyle: {
          fontSize: 18,
          color: '#333',
          fontWeight: 'bold'
        }
      },
      legend: {
        left: 128,
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
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: 20,
        right: 20,
        top: 75,
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
        type: 'value',
        name: '交易金额'
      },
      series: [
        {
          name: '今日数据',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#155bd4'
          },
          areaStyle: {
            opacity: 0.8,
            colorType: 'LinearGradient',
            colorOption: {
              direction: [0, 0, 0, 1],
              color: [
                { offset: 0, color: 'rgba(24,144,255,0.6)' },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' }
              ]
            }
          },
          data: todayInfoData.todayData.payActualList
        },
        {
          name: '昨日数据',
          type: 'line',
          smooth: true,
          lineStyle: {
            color: '#89EACD'
          },
          areaStyle: {
            opacity: 0.8,
            colorType: 'LinearGradient',
            colorOption: {
              direction: [0, 0, 0, 1],
              color: [
                { offset: 0, color: 'rgba(137,234,205,0.1)' },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' }
              ]
            }
          },
          data: todayInfoData.todayData.yesterdayPayActualList
        }
      ]
    }
  })
}

// 本月支付金额（元）
const currentMonthPayActual = ref(0)
const monthNumberData = ref([])
const monthTimeData = ref([])
const entiretyDataChart = ref({})

/**
 * 获取当月订单统计数据
 */
const getEntiretyData = () => {
  getCurrentMonthByDay().then(res => {
    monthNumberData.value = res.payActualList
    monthTimeData.value = res.dateToStringList
    currentMonthPayActual.value = res.currentMonthPayActual
    // 整体看板图表
    entiretyDataChart.value = {
      color: ['red'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
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
        data: monthTimeData.value
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      series: [
        {
          name: '平台支付金额',
          type: 'bar',
          itemStyle: {
            color: '#e8f0ff',
            borderRadius: [15, 15, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#155bd4'
            }
          },
          barWidth: 30,
          data: monthNumberData.value
        }
      ]
    }
  })
}
// 店铺流量排行数据
const shopFlowRankData = ref([])

/**
 * 获取店铺流量排行数据
 */
const getShopFlowRankData = () => {
  listShopRankIngByFlow().then(res => {
    if (res) {
      shopFlowRankData.value = res
    }
  })
}
// 店铺交易排行数据
const shopDealRankData = ref([])
/**
 * 获取店铺交易排行数据
 */
const getShopDealRankData = () => {
  listShopRankingByPayActual().then(res => {
    res.forEach(item => {
      shopDealRankData.value.push({
        shopName: item.shopName,
        placeOrderNum: item.payOrderCount,
        placeOrderPeopleNum: item.payUserCount,
        placeOrderAmount: item.payActual
      })
    })
  })
}
// 店铺销售排行
const prodSaleRankData = ref([])
/**
 * 获取退单店铺排行数据
 */
const getRefundShopRankData = () => {
  listShopRankingByRefundCount().then(res => {
    res.forEach(item => {
      refundShopRankData.value.push({
        shopName: item.shopName,
        refundOrderNum: item.refundCount
      })
    })
  })
}
/**
 * 获取商品销售排行数据
 */
const getProdSaleRankData = () => {
  listSpuRankingByPayActual().then(res => {
    res.forEach(item => {
      prodSaleRankData.value.push({
        prodName: item.spuName,
        placeOrderNum: item.payOrderCount
      })
    })
  })
}
// 退单店铺排行
const refundShopRankData = ref([])
onMounted(() => {
  getMallEventInfo()
  getTodayInfo()
  getRealTimeData()
  getEntiretyData()
  getShopFlowRankData()
  getShopDealRankData()
  getProdSaleRankData()
  getRefundShopRankData()
})

// filters
const dataFormat = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).times(100).toFixed(2).valueOf()
}
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

const isTrueData = (data) => {
  if (data) {
    return data
  }
  return 0
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: #f9f9f9;
  min-height: 850px;
  // min-width: 1200px;
  width: 100%;

  /****** 通用样式 ******/
  // 层
  .shop-inf-imperfect-tips {
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 30px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .warning {
      top:2px
    }
  }
  .layer {
    margin-top: 20px;
    overflow: hidden;

    &:first-child {
      margin-top: 0;
    }
  }

  // 包裹元素
  .item-wrapper {
    display: inline-block;
    padding: 20px 20px 0;
    background: #FFFFFF;
    overflow: hidden;

    .chart-content {
      .real-time-data-chart,
      .entirety-data-chart {
        width: 100%;
        height: 100%;
      }
    }
  }

  // 表格
  .table-content {
    margin-top: 20px;

    table {
      width: 100%;
      border-collapse: collapse;

      .table-title {
        font-size: 14px;
        color: #666;
        height: 41px;
        line-height: 41px;
        padding: 0 20px;
        background: #FAFAFA;

        .tt-item {
          // max-width: 0;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .tt-item:nth-child(1) {
          padding-left: 20px;
        }

        .tt-item:nth-last-child(1) {
          text-align: right;
          padding-right: 20px;
        }
      }

      .table-item {
        .ti-item {
          max-width: 0;
          font-size: 14px;
          padding-top: 26px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .ti-item:nth-child(1) {
          padding-left: 20px;
        }

        .ti-item:nth-last-child(1) {
          text-align: right;
          padding-right: 20px;
        }
      }
    }

    .empty-data {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 14px;
    }
  }

  // 标题
  .title {
    position: relative;
    display: flex;
    align-items: center;

    .t-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .update-time {
      font-size: 12px;
      color: #999999;
      margin-left: 10px;
    }

    .t-small-text {
      font-size: 12px;
      color: #999;
    }

    .t-explain-item::before {
      display: inline-block;
      content: '';
      width: 18px;
      height: 8px;
      background: #FF4141;
      border-radius: 8px;
      margin-right: 10px;
    }

    .t-explain-first-item {
      margin-left: 50px;
    }

    .t-explain-second-item {
      margin-left: 40px;
    }

    .t-red::before {
      background: #FF4141;
    }

    .t-dark-green::before {
      background: #42B983;
    }

    .t-today-data::before {
      background: #155bd4;
    }

    .t-pay-amount {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;

      .t-pay-item {
        color: #333;
        text-align: left;
        margin-right: 30px;

        .tt-title {
          font-size: 14px;
        }

        .tt-num {
          font-size: 20px;
          font-weight: bold;
          margin-top: 13px;
        }
      }

      .t-today {
        margin-right: 150px;
      }
    }
  }

  /****** /通用样式 ******/

  // 今日指数
  .today-index {
    width: 100%;
    height: 225px;
    background: #FFFFFF;

    .data-content {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin-top: 37px;

      .d-item {
        max-width: 15%;
        overflow: hidden;
        text-align: center;

        .di-title {
          font-size: 14px;
          color: #666;
        }

        .di-num {
          font-size: 28px;
          font-weight: bold;
          color: #155bd4;
          margin: 20px 0;
        }

        .di-trend {
          font-size: 12px;
          color: #FF4141;
        }

        .di-trend-rise {
          color: #FF4141;
        }

        .di-trend-reduce {
          color: #42B983;
        }
      }
    }
  }

  // 第二层
  .second-layer {
    display: flex;
    height: 426px;
    margin-top: 20px;
    // 实时数据
    .real-time-data {
      width: calc((100% - 20px) * 0.7);
      margin-right: 20px;

      .chart-content {
        width: 100%;
        height: 360px;
      }
    }

    // 今日客户概况
    .today-customer-survey {
      width: calc((100% - 20px) * 0.3);

      .data-content {
        .d-item {
          width: 100%;
          height: 90px;
          background: #FAFAFA;
          margin-top: 23px;

          .di-title {
            position: relative;
            font-size: 14px;
            color: #999999;
            padding: 18px 0 6px 51px;

            .icon {
              position: absolute;
              left: 25px;
              top: 18px;
              font-size: 16px;
              color: #155bd4;
            }
          }

          .di-num {
            font-size: 20px;
            font-weight: bold;
            color: #333333;
            padding-left: 51px;
            overflow: hidden;
          }
        }

        .d-item:nth-child(1) {
          margin-top: 30px;
        }
      }
    }
  }

  // 整体看板
  .entirety-plate {
    width: 100%;
    height: 460px;
    margin-top: 20px;

    .chart-content {
      width: 100%;
      height: 360px;
      margin-top: 40px;
    }
  }

  // 第五层
  .fifth-layer {
    height: 570px;

    .shop-flow-rank,
    .shop-deal-rank {
      width: calc((100% - 20px) * 0.5);
      height: 100%;
    }

    // 店铺流量排行Top10
    .shop-flow-rank {
      margin-right: 20px;

      table {
        .table-item {
          .ti-item {
            width: 16%;
          }

          .ti-item:nth-child(1) {
            width: 12%;
          }

          .ti-item:nth-child(2) {
            width: 24%;
          }
        }
      }
    }

    // 店铺交易排行Top10
    .shop-deal-rank {
      table {
        .table-item {
          .ti-item {
            width: 19%;
          }

          .ti-item:nth-child(1) {
            width: 12%;
          }

          .ti-item:nth-child(2) {
            width: 31%;
          }
        }
      }
    }
  }

  // 第六层
  .sixth-layer {
    height: 570px;

    .prod-sale-rank,
    .refund-order-rank {
      width: calc((100% - 20px) * 0.5);
      height: 100%;

      table {
        .table-title {
          .tt-item:nth-child(1) {
            padding-left: 50px;
          }

          .tt-item:nth-child(2) {
            text-align: center;
          }

          .tt-item:nth-child(3) {
            padding-right: 50px;
          }
        }

        .table-item {
          .ti-item:nth-child(1) {
            width: 20%;
            padding-left: 50px;
          }

          .ti-item:nth-child(2) {
            width: 60%;
            text-align: center;
          }

          .ti-item:nth-child(3) {
            width: 20%;
            padding-right: 50px;
          }
        }
      }
    }

    // 商品销售排行Top10
    .prod-sale-rank {
      margin-right: 20px;
    }
  }
}
</style>
