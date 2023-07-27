<template>
  <!-- 复选框选项组 -->
  <div class="component-checkbox-options-group">
    <!-- 选项 -->
    <div class="data-radio">
      <!-- 分组 -->
      <div class="select-box">
        <div class="select-item">
          <el-tooltip
            effect="dark"
            placement="right"
          >
            <span>时间：</span>
          </el-tooltip>
          <el-select
            v-model="value2"
            placeholder="请选择"
            @change="setDateRange(value2)"
          >
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-if="value2 === 1"
            v-model="natureDay"
            class="my-el-date-picker"
            type="date"
            placeholder="选择日期"
            :picker-options="PickerOptions"
            :clearable="false"
            @change="getNatureDay(natureDay)"
          />
          <el-date-picker
            v-if="value2 === 3"
            v-model="naturalMonth"
            class="my-el-date-picker"
            type="month"
            placeholder="选择日期"
            :picker-options="monthPickerOptions"
            :clearable="false"
            @change="getnaturalMonth(naturalMonth)"
          />
          <div v-if="value2 === 4">
            <span class="real-time">{{ endTime }}</span>
            <el-button
              class="refresh"
              link
              @click="setDateRange(value2)"
            >
              刷新
            </el-button>
          </div>
          <div v-if="value2 === 5 || value2 === 6">
            <span class="real-time">{{ startTime }} 至 {{ endTime }}</span>
          </div>
        </div>
        <div class="export-btn">
          <el-button
            v-permission="permission"
            type="primary"
            @click="exportFrom()"
          >
            导出
          </el-button>
        </div>
      </div>
      <el-form>
        <el-form-item label="销售指标：">
          <el-checkbox-group v-model="checkData.salesCheck">
            <!-- 浏览访问 -->
            <el-checkbox
              v-for="(item,index) in salesTargets"
              :key="index"
              :label="index"
              :disabled="list.length>=8 && showTableList(index)"
              @change="addColumn(index)"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="服务指标：">
          <el-checkbox-group v-model="checkData.serviceCheck">
            <!-- 引导转化 -->
            <el-checkbox
              v-for="(item,index) in serviceIndicators"
              :key="'serviceIndicators'+index"
              :label="10+index"
              :disabled="list.length>=8 && showTableList(10+index)"
              @change="addColumn(10+index)"
            >
              {{ item }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="check-list">
        <span class="red">最多选择8项</span>&nbsp;已选择<span class="mark">&nbsp;{{ checkData.salesCheck.length + checkData.serviceCheck.length }}&nbsp;</span>/8&nbsp;个指标
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
  permission: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'handleTable',
  'getTimeList',
  'getTimeList',
  'getGroupList',
  'getStatusList',
  'getTimeList',
  'handleTable',
  'handleTable',
  'exportFrom'
])

const checkData = reactive({
  salesCheck: [0, 1, 9],
  serviceCheck: [10, 12]
})
const options2 = [
  {
    value: 4,
    label: '今日实时'
  },
  {
    value: 5,
    label: '近7天'
  },
  {
    value: 6,
    label: '近30天'
  },
  {
    value: 1,
    label: '自然日'
  },
  {
    value: 3,
    label: '自然月'
  }
]

const value2 = ref(4)
const list = ref([0, 1, 9, 10, 12])
const salesTargets = reactive(['曝光次数', '曝光人数', '加购人数', '加购件数', '下单人数', '支付人数', '下单件数', '支付件数', '下单金额', '支付金额'])
const serviceIndicators = reactive(['申请退款订单数', '申请退款人数', '成功退款订单数', '成功退款人数', '成功退款金额', '退款率'])
const PickerOptions = reactive({
  disabledDate (time) {
    const date = moment().add(-1, 'days').startOf('day')
    return (
      time.getTime() > date.valueOf()
    )
  }
})
const monthPickerOptions = {
  disabledDate (time) {
    const month1 = moment().startOf('month')
    return (
      time.getTime() > month1.valueOf()
    )
  }
}

const showTableList = computed(() => {
  return function (index) {
    return list.value.indexOf(index) === -1
  }
})

onMounted(() => {
  emit('handleTable', list.value)
})

const startTime = ref('')
const endTime = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
// 获取某一天的时间
const getNatureDay = (natureDayPar) => {
  startTime.value = moment(natureDayPar).startOf('day').format('YYYY-MM-DD HH:mm:ss')
  endTime.value = moment(natureDayPar).endOf('day').format('YYYY-MM-DD HH:mm:ss')
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value: value2
  }
  emit('getTimeList', param)
}

// 获取月份
const getnaturalMonth = (naturalMonthPar) => {
  startTime.value = moment(naturalMonthPar).startOf('month').format('YYYY-MM-DD HH:mm:ss')
  endTime.value = moment(naturalMonthPar).endOf('month').format('YYYY-MM-DD HH:mm:ss')
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value: value2
  }
  emit('getTimeList', param)
}

const naturalMonth = ref('')
const natureDay = ref('')
/**
 * 获取时间 4:实时 5: 近七天 6:近30天 1:自然日 3:自然月
 */
const getTime = (startDay, endDay, value) => {
  if (value === 4) {
    startTime.value = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment().format('YYYY-MM-DD HH:mm:ss')
  } else if (value === 3) { // 默认选择当前月份
    const startDate = moment().month(moment().month()).startOf('month').valueOf()
    const endDate = moment().month(moment().month()).endOf('month').valueOf()
    startTime.value = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss') // 每月的第一天的0点开始
    endTime.value = moment(endDate).format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(endTime.value).endOf('day').format('YYYY-MM-DD HH:mm:ss') // 每月的第最后一天的23点结束
    naturalMonth.value = startTime.value
  } else {
    endTime.value = moment().add(startDay, 'd').format('YYYY-MM-DD HH:mm:ss')
    endTime.value = moment(endTime.value).endOf('day').format('YYYY-MM-DD HH:mm:ss') // 获取 23:59:59 点的时间
    startTime.value = moment().add(endDay, 'd').format('YYYY-MM-DD HH:mm:ss')
    startTime.value = moment(startTime.value).startOf('day').format('YYYY-MM-DD HH:mm:ss') // 获取 0 点的时间
    natureDay.value = startTime.value
  }
  const param = {
    startTime: startTime.value,
    endTime: endTime.value,
    value
  }
  emit('getTimeList', param)
}

/** 选择时间段
 * 4:实时 5: 近七天 6:近30天 1:自然日 3:自然月
 */
const setDateRange = (value) => {
  let startDay = 0
  let endDay = 0
  if (value === 4) {
    startDay = 0
    endDay = 0
  } else if (value === 6) {
    startDay = -1
    endDay = -30
  } else if (value === 5) {
    startDay = -1
    endDay = -7
  } else if (value === 1) {
    startDay = -1
    endDay = -1
  }
  getTime(startDay, endDay, value)
}

const addColumn = (index) => {
  if (list.value.indexOf(index) === -1) {
    if (list.value.length < 8) {
      list.value.push(index)
      emit('handleTable', list.value)
    }
  } else if (list.value.indexOf(index) !== -1) {
    list.value.splice(list.value.indexOf(index), 1)
    emit('handleTable', list.value)
  }
}

const exportFrom = () => {
  emit('exportFrom')
}

</script>

<style lang="scss" scoped>
.component-checkbox-options-group{
  // 选项
  .data-radio {
    display: block;
    padding: 30px 25px;
    font-size: 14px;
    background: #f7f8fa;
    .check-list {
      display: block;
      margin-top: 23px;
      margin-left: 70px;
      font-size: 12px;
      color: #999;
      .mark {
        color: #155bd4;
        font-weight: bold;
      }
      .red {
        color: #FF4141;
      }
    }
  }

  // 下拉框
  .data-radio {
    .select-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 30px;
      :deep(.select-item) {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-right: 20px;
        .el-select.el-select--mini {
          margin-right: 10px;
        }
        .el-input--mini .el-input__inner {
          width: 150px;
          font-size: 12px;
          color: #666;
        }
        .real-time {
          padding-right: 10px;
          color: #666;
          font-size: 12px;
        }
        .refresh {
          font-size: 12px;
          color: #155bd4;
        }
        .my-el-date-picker {
          .el-input__suffix {
            right: 35px;
          }
        }
      }
    }
  }
}
</style>
