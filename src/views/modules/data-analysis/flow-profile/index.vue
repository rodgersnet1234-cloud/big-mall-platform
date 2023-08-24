<template>
  <!-- 流量概况 -->
  <div class="data-analysis page-flow-profile">
    <!-- 流量总览 -->
    <traffic-Overview
      :system-type="systemType"
      :time-type="timeType"
      :start-time="startTime"
      :end-time="endTime"
      :sys-data="sysData"
      @switch-system-type="switchSystemType"
      @get-date-time="getDateTime"
    />

    <!-- 流量趋势 -->
    <trafficTrends
      :system-type="systemType"
      :time-type="timeType"
      :start-time="startTime"
      :end-time="endTime"
      @switch-system-type="switchSystemType"
    />

    <!-- 成交转换 -->
    <transactionConversion
      :time-type="timeType"
      :start-time="startTime"
      :end-time="endTime"
      @set-sys-data="onSetSysData"
    />
  </div>
</template>

<script setup>
import trafficOverview from './components/flow-traffic-overview.vue'
import trafficTrends from './components/flow-traffic-trends.vue'
import transactionConversion from './components/flow-transaction-conversion.vue'

const systemType = ref(0)
/**
 * 切换系统类型
 */
const switchSystemType = (type) => {
  systemType.value = type
}

const timeType = ref(1)
const startTime = ref('')
const endTime = ref('')
/**
 * 获取筛选时间
 */
const getDateTime = (data) => {
  timeType.value = data.timeType
  startTime.value = data.startTime
  endTime.value = data.endTime
}

const sysData = ref([])
const onSetSysData = (data) => {
  if (data && data.length) {
    data.sort((a, b) => a.systemType - b.systemType)
    sysData.value = data
  } else {
    sysData.value = []
  }
}
</script>

<style lang="scss" scoped>
:deep(.page-flow-profile) {
  background-color: #fff !important;
  min-width: 950px;
  padding: 20px;
  box-sizing: border-box;
  // 板块标题栏
  .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    padding: 16px 10px;
    .tit-lf {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      font-size: 17px;
      font-weight: bold;
      padding-left: 6px;
      color: #333;
    }
    .tit-lf::before {
      display: block;
      content: '';
      width: 3px;
      height: 16px;
      background: #155bd4;
      margin-right: 5px;
      border-radius: 8px;
    }
    .tit-rg {
      display: flex;
      align-items: center;
      font-size: 14px;
      .statistics-time {
        margin-right: 10px;
        .select-mod {
          width: 120px;
        }
      }
      .date-display {
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
