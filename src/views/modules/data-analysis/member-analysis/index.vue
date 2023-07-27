<template>
  <!-- 会员分析 -->
  <div class="data-analysis page-member-analysis">
    <div class="board">
      <!-- 统计时间 -->
      <path-analysis-header
        :date-options="dateOptions"
        :time-type-par="timeType"
        @change-data="changeData"
      />

      <!-- 会员概览 -->
      <membership-overview
        ref="overviewRef"
        :board-type="'overview'"
        :time-type="timeTypePar"
        :date-range="dateRange"
        :start-time-par="startTime"
        :end-time-par="endTime"
      />
    </div>

    <div class="board">
      <!-- 会员人数趋势 -->
      <membership-overview
        ref="numTrendsRef"
        :board-type="'numTrends'"
        :time-type="timeTypePar"
        :date-range="dateRange"
        :start-time-par="startTime"
        :end-time-par="endTime"
      />
    </div>

    <div class="board">
      <!-- 会员占比趋势 -->
      <membership-overview
        ref="percentageTrendRef"
        :board-type="'percentageTrend'"
        :time-type="timeTypePar"
        :date-range="dateRange"
        :start-time-par="startTime"
        :end-time-par="endTime"
      />
    </div>

    <div class="board">
      <!-- 会员贡献价值分析 -->
      <member-contribution-value-analysis
        ref="memberContributionRef"
        :date-range="dateRange"
        :end-time-par="endTime"
        :start-time-par="startTime"
        :time-type="timeType"
      />
    </div>

    <div class="board">
      <!-- 新老会员成交分析 -->
      <transaction-analysis
        ref="transactionRef"
        :time-type="timeType"
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
import pathAnalysisHeader from '../public-components/path-analysis-header.vue'
import membershipOverview from './components/membership-overview.vue'
import memberContributionValueAnalysis from './components/member-contribution-value-analysis.vue'
import transactionAnalysis from './components/transaction-analysis.vue'
import customerRetentionAnalysis from './components/customer-retention-analysis.vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  timeType: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:timeType'])

const startTime = ref('')
const endTime = ref('')

// 时间类型列表
const dateOptions = [
  {
    label: '今日实时',
    value: 4
  },
  {
    label: '自然日',
    value: 1
  },
  {
    label: '自然月',
    value: 3
  },
  {
    label: '近 7 天',
    value: 5
  },
  {
    label: '近 30 天',
    value: 6
  }
]

const overviewRef = ref(null)
const numTrendsRef = ref(null)
const percentageTrendRef = ref(null)
const memberContributionRef = ref(null)
const transactionRef = ref(null)
const retentionRef = ref(null)
const timeTypePar = ref(0)
const dateRange = ref([])
watch(() => dateRange.value, () => {
  emit('update:timeType', timeTypePar.value)
})

const changeData = (val) => {
  dateRange.value = val
}

</script>

<style lang="scss" scoped>
.data-analysis.page-member-analysis {
  display: block;
  width: 100%;
  background: #f1f4f5;
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
