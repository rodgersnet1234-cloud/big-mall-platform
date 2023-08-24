<template>
  <!-- 会员分析 -->
  <div class="data-analysis page-member-analysis">
    <div class="board">
      <!-- 统计时间 -->
      <div class="date-type-select-box">
        <date-type-select
          v-model:dateType="dateType"
          @change-data="changeData"
        />
      </div>

      <!-- 会员概览 -->
      <membership-overview
        ref="overviewRef"
        :board-type="'overview'"
        :time-type="dateType"
        :date-range="dateRange"
      />
    </div>

    <div class="board">
      <!-- 会员人数趋势 -->
      <membership-overview
        ref="numTrendsRef"
        :board-type="'numTrends'"
        :time-type="dateType"
        :date-range="dateRange"
      />
    </div>

    <div class="board">
      <!-- 会员占比趋势 -->
      <membership-overview
        ref="percentageTrendRef"
        :board-type="'percentageTrend'"
        :time-type="dateType"
        :date-range="dateRange"
      />
    </div>

    <div class="board">
      <!-- 会员贡献价值分析 -->
      <member-contribution-value-analysis
        ref="memberContributionRef"
        :date-range="dateRange"
        :end-time-par="endTime"
        :start-time-par="startTime"
        :time-type="dateType"
      />
    </div>

    <div class="board">
      <!-- 新老会员成交分析 -->
      <transaction-analysis
        ref="transactionRef"
        :time-type="dateType"
        :start-time-par="startTime"
        :end-time-par="endTime"
        :date-range="dateRange"
      />
    </div>

    <div class="profile-trends-mod">
      <!-- 客户留存分析 -->
      <customer-retention-analysis
        ref="retentionRef"
        :date-range="dateRange"
        @change-data="changeData"
      />
    </div>
  </div>
</template>

<script setup>
import membershipOverview from './components/membership-overview.vue'
import memberContributionValueAnalysis from './components/member-contribution-value-analysis.vue'
import transactionAnalysis from './components/transaction-analysis.vue'
import customerRetentionAnalysis from './components/customer-retention-analysis.vue'
import dateTypeSelect from '../public-components/date-type-select.vue'

const dateType = ref(4)

const startTime = ref('')
const endTime = ref('')

const overviewRef = ref(null)
const numTrendsRef = ref(null)
const percentageTrendRef = ref(null)
const memberContributionRef = ref(null)
const transactionRef = ref(null)
const retentionRef = ref(null)
const dateRange = ref([])

const changeData = (val) => {
  dateRange.value = val
}

</script>

<style lang="scss" scoped>
.data-analysis.page-member-analysis {
  display: block;
  width: 100%;
  background: #f1f4f5;
  .date-type-select-box{
    padding: 10px;
    background-color: #f7f8fa;
    margin-bottom: 16px;
  }
  :deep(.board) {
    display: block;
    background: #fff;
    padding: 20px;
    margin-bottom: 15px;
    .board-title {
      font-size: 18px;
      color: #333;
      font-weight: bold;
      margin-bottom: 15px;
    }
  }
  .profile-trends-mod {
    display: block;
    width: 100%;
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
  }
}
</style>
