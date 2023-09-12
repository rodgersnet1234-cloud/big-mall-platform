<template>
  <div class="component-mod-header">
    <el-form
      :inline="true"
      :model="dataForm"
      class="form-inline"
      @submit.prevent
    >
      <!-- 头部统计时间栏start -->
      <el-form-item label="统计时间：">
        <div class="title-right">
          <el-select
            v-model="timeType"
            style="width:100px;"
            @change="setDateRange()"
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
            v-model="preDay"
            type="date"
            style="width: 150px"
            placeholder="选择日期"
            :disabled-date="dayPickerOptions.disabledDate"
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
            :disabled-date="weekPickerOptions.disabledDate"
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
            popper-class="month-picker"
            type="month"
            placeholder="自然月"
            :disabled-date="monthPickerOptions.disabledDate"
            @change="changeDate"
          />
        </div>
        <!-- 自定义 -->
        <div
          class="title-picker"
          style="padding-top: 4px"
        >
          <el-date-picker
            v-if="timeType === 7"
            v-model="timeRange"
            type="daterange"
            unlink-panels
            range-separator="-"
            :start-placeholder="$t('date.start')"
            :end-placeholder="$t('date.end')"
            :shortcuts="pickerOptions.shortcuts"
            :disabled-date="pickerOptions.disabledDate"
            :clearable="false"
            @change="updateDateTime"
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
          >{{ dateRangePar[0] }} 至 {{ dateRangePar[1] }}</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import moment from 'moment'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  dateType: {
    type: Number,
    default: null
  },
  dateOptions: {
    type: Array,
    default: () => {
      return [
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
        // {
        //   label: '自定义',
        //   value: 7
        // }
      ]
    }
  }
})

const emit = defineEmits(['changeData', 'update:dateType'])

const dataForm = reactive({
  group: 0,
  status: 0
})

// 自然日
const dayPickerOptions = reactive({
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
      time.getTime() > month.valueOf()
    )
  }
})
// 今日实时时间
let nowDate = null

// 自定义
const pickerOptions = reactive({
  shortcuts: [{
    text: '最近一周',
    value: () => {
      const date = new Date()
      const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
      const start = moment(moment(date).add(-7, 'days')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    }
  }, {
    text: '最近一个月',
    value: () => {
      const date = new Date()
      const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
      const start = moment(moment(date).add(-1, 'month')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    }
  }, {
    text: '最近三个月',
    value: () => {
      const date = new Date()
      const end = moment(moment(date).add(-1, 'days')).endOf('days').format('YYYY-MM-DD HH:mm:ss')
      const start = moment(moment(date).add(-3, 'month')).startOf('days').format('YYYY-MM-DD HH:mm:ss')
      return [start, end]
    }
  }],
  disabledDate (time) {
    const date = moment().add(0, 'days').startOf('days')
    return (
      time.getTime() >= date.valueOf()
    )
  }
})

const timeType = ref(props.dateType) // 时间下拉选择框的几种范围
// 时间选择范围
const dateRangePar = ref([])
watch(() => dateRangePar.value, () => {
  emit('update:dateType', timeType.value)
  changeData(dateRangePar.value)
})

const changeData = (val) => {
  let emitParams = val
  if ([4, 5, 6].includes(timeType.value)) {
    emitParams = [null, null]
  }
  emit('changeData', emitParams)
}

// 自然周
const preWeek = ref('')
// 自然周默认格式
const weekRangeFormat = ref('')
watch(() => preWeek.value, (newVal) => {
  const startD = moment(newVal).add(1, 'days').format('YYYY-MM-DD')
  const endD = moment(startD).add(6, 'days').endOf('day').format('YYYY-MM-DD')
  weekRangeFormat.value = startD + ' - ' + endD
})

onMounted(() => {
  setDateRange()
})

// 自然日
const preDay = ref('')
// 前一个月
const preMonth = ref('')
const timeRange = ref('') // 自定义
/**
 * 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天 7:自定义
 */
const setDateRange = () => {
  let startDay = null
  let endDay = null
  let startTime = null
  let endTime = null
  if (timeType.value === 1) {
    startTime = moment().add(-1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
    preDay.value = startTime
    dateRangePar.value = [startTime, endTime]
    return
  } else if (timeType.value === 2) {
    preWeek.value = moment(moment().add(-1, 'week')).startOf('week').add(-1, 'days').format('YYYY-MM-DD HH:mm:ss')
    changeDate(preWeek.value)
    return
  } else if (timeType.value === 3) {
    preMonth.value = getPreMonth()
    changeDate(preMonth.value)
    return
  } else if (timeType.value === 4) {
    startDay = 1
    endDay = 1
    flushDateTime()
    return
  } else if (timeType.value === 5) {
    startDay = -7
    endDay = -1
  } else if (timeType.value === 6) {
    startDay = -31
    endDay = -1
  } else if (timeType.value === 7) {
    startTime = moment().add(-2, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment().add(-1, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
    timeRange.value = [startTime, endTime]
    dateRangePar.value = timeRange.value
    return
  } else {
    return
  }
  startTime = moment().add(startDay, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
  endTime = moment().add(endDay, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
  dateRangePar.value = [startTime, endTime]
}

/**
 * 改变日期选择
 */
const changeDate = (val) => {
  let startTime
  let endTime
  if (timeType.value === 2) {
    // 自然周
    startTime = moment(val).add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment(startTime).add(6, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
  } else if (timeType.value === 3) {
    // 自然月
    startTime = moment(val).startOf('month').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment(val).endOf('month').format('YYYY-MM-DD HH:mm:ss')
  } else if (timeType.value === 4) {
    // 今日实时
    startTime = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment().format('YYYY-MM-DD HH:mm:ss')
  } else {
    // 自然日/近7天/近30天
    startTime = moment(val).startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime = moment(val).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    preDay.value = startTime
  }
  dateRangePar.value = [startTime, endTime]
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
  return moment(moment().add(-1, 'month')).startOf('month').format('YYYY-MM')
}

/**
 * 自定义
 */
const updateDateTime = (val) => {
  const end = moment(val[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  dateRangePar.value = [val[0], end]
}

</script>

<style lang="scss" scoped>
.component-mod-header {
  // 栏目标题行
  :deep(.form-inline) {
    margin-left: 0;
    margin-bottom: 0;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 10px;
    }
  }
  .title-right{
    margin-right: 5px;
  }
  .title-time {
    color: #999999;
    vertical-align: middle;
    margin-left: 5px;
    font-size: 12px;
  }
  .date-display {
    display: inline-block;
    .title-time {
      margin-right: 6px;
    }
  }
}
</style>
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style>
.month-picker .el-month-table td.today .cell  {
  color: var(--el-datepicker-text-color);
  font-weight: normal;
}
</style>
