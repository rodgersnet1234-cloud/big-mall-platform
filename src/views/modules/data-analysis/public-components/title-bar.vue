<template>
  <!-- 数据分析板块标题栏组件 -->
  <div class="data-analysis component-title-bar">
    <div class="module-title">
      <div class="tit-lf">
        {{ title }}
      </div>
      <div
        v-if="showExport"
        class="tit-rg"
      >
        <div
          v-if="showTimeScreening"
          class="tit-rg"
          style="margin-right: 10px"
        >
          <div class="statistics-time">
            <span>统计时间：</span>
            <el-select
              v-model="timeType"
              class="select-mod"
              placeholder="请选择"
              @change="setDateRange(timeType)"
            >
              <el-option
                v-for="item in dateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <!-- 自然日 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 1 "
              v-model="dateRange[0]"
              type="date"
              style="width: 150px"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              :clearable="false"
              @change="changeDate"
            />
          </div>
          <!-- 自然周 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 2 "
              v-model="preWeek"
              style="width: 230px;"
              type="week"
              :picker-options="weekPickerOptions"
              :clearable="false"
              :format="weekRangeFormat"
              placeholder="自然周"
              @change="changeDate"
            />
          </div>
          <!-- 自然月 -->
          <div class="title-picker">
            <el-date-picker
              v-if="timeType === 3 "
              v-model="preMonth"
              style="width: 150px;"
              type="month"
              placeholder="自然月"
              :picker-options="monthPickerOptions"
              :clearable="false"
              @change="changeDate"
            />
          </div>

          <div class="date-display">
            <!-- 今日实时 -->
            <span
              v-if="timeType === 4"
              class="title-time"
            >{{ nowDate }}</span>
            <!-- 刷新 -->
            <button
              v-if="timeType === 4"
              class="el-button el-button--text el-button--small"
              type="button"
              @click="flushDateTime"
            >
              刷新
            </button>
            <!-- 近7天/近30天 -->
            <span
              v-if="timeType === 5 || timeType === 6"
              class="title-time"
            >{{ dateRange[0] }} 至 {{ dateRange[1] }}</span>
          </div>
        </div>
        <el-button
          v-permission="permission"
          type="primary"
          class="filter-item"
          @click="exportFrom()"
        >
          导出
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from 'moment'
import { checkPermission } from '@/directive/permission/index.js'

const vPermission = checkPermission

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showTimeScreening: {
    type: Boolean,
    default: false
  },
  showExport: {
    type: Boolean,
    default: false
  },
  permission: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['getDateTime', 'exportFrom'])

// 时间类型列表
const dateOptions = [
  {
    label: '自然日',
    value: 1
  },
  {
    label: '自然周',
    value: 2
  },
  {
    label: '自然月',
    value: 3
  },
  {
    label: '今日实时',
    value: 4
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
// 自然日
const pickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() >= date.valueOf()
    )
  }
})

// 自然周
const weekPickerOptions = reactive({
  disabledDate (time) {
    const month = moment().add(-1, 'week').endOf('week')
    return (
      time.getTime() > month.valueOf()
    )
  }
})

// 自然月
const monthPickerOptions = reactive({
  disabledDate (time) {
    const month = moment().startOf('month')
    return (
      time.getTime() >= month.valueOf()
    )
  }
})

// 今日实时时间
let nowDate = null
// 自然周默认格式
const weekRangeFormat = ref('')

// 自然周
const preWeek = ref('')
watch(() => preWeek.value, (newVal) => {
  const d = moment(newVal).startOf('week').format('YYYY-MM-DD HH:mm:ss')
  weekRangeFormat.value = 'yyyy-MM-dd - ' + moment(d).endOf('week').format('YYYY-MM-DD')
})

onMounted(() => {
  // 初始化自然日
  setDateRange(1)
})

// 时间选择状态 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天 7:自定义
const timeType = ref(1)
// 前一个月
const preMonth = ref('')
// 时间选择范围
const dateRange = ref([])
/**
 * 切换时间类型
 * timeType 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天 7:自定义
 */
const setDateRange = (val) => {
  let startDay = null
  let endDay = null
  timeType.value = val
  if (val === 4) {
    startDay = 1
    endDay = 1
    flushDateTime()
    return
  } else if (val === 5) {
    startDay = -7
    endDay = -1
  } else if (val === 6) {
    startDay = -31
    endDay = -1
  } else if (val === 1) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    preMonth.value = getPreMonth()
    changeDate(preMonth.value)
    return
  } else if (val === 2) {
    preWeek.value = moment(moment().add(-1, 'week')).startOf('week')
    changeDate(preWeek.value)
    return
  } else {
    return
  }
  const startTimePar = moment().add(startDay, 'days').startOf('day').format('YYYY-MM-DD')
  const endTimePar = moment().add(endDay, 'days').endOf('day').format('YYYY-MM-DD')
  dateRange.value = [startTimePar, endTimePar]
  emit('getDateTime', {
    startTime: moment().add(startDay, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().add(endDay, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    timeType: val
  })
}

const startTime = ref('')
const endTime = ref('')
/**
 * 改变日期选择
 */
const changeDate = (val) => {
  if (timeType.value === 2) {
    // 自然周
    startTime.value = moment(val).startOf('week').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(val).endOf('week').format('YYYY-MM-DD HH:mm:ss')
  } else if (timeType.value === 3) {
    // 自然月
    startTime.value = moment(val).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(val).endOf('month').format('YYYY-MM-DD HH:mm:ss')
  } else if (timeType.value === 4) {
    // 今日实时
    startTime.value = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
  } else {
    // 自然日/近7天/近30天
    startTime.value = moment(val).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(val).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  }
  emit('getDateTime', {
    startTime: startTime.value,
    endTime: endTime.value,
    timeType: timeType.value
  })
}

// 导出
const exportFrom = () => {
  emit('exportFrom')
}

/**
 * 刷新时间
 */
const flushDateTime = () => {
  const date = new Date()
  nowDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
  changeDate(nowDate)
}

/**
 * 获取前一个月的时间
 */
const getPreMonth = () => {
  return moment(moment().add(-1, 'month')).startOf('month')
}

</script>

<style lang="scss" scoped>
// 数据分析板块标题栏
.data-analysis.component-title-bar {
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
        .title-time {
          padding: 0 6px;
        }
      }
    }
  }
}
</style>
