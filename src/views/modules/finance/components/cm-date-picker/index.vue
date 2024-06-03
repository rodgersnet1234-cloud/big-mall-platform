<template>
  <div class="component-cm-data-picker">
    <el-select
      v-model="datePickerType"
      class="date-picker-type"
      @change="onSetDatePickerType(datePickerType)"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-date-picker
      v-model="dateRangeParam"
      :type="datePickerType"
      :format="dateFormat"
      value-format="YYYY-MM-DD HH:mm:ss"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="defaultTime"
      @change="handleMonthRangeChange"
    />
  </div>
</template>

<script setup>
import { getParseTime } from '@/utils/datetime.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => [
      {
        label: '日期范围',
        value: 'daterange',
        format: 'YYYY-MM-DD'
      },
      {
        label: '月份范围',
        value: 'monthrange',
        format: 'YYYY-MM'
      }
    ]
  },
  defaultType: {
    type: String,
    default: 'daterange'
  },
  defaultTime: {
    type: Array,
    default: () => {
      return [
        new Date(2000, 1, 1, 0, 0, 0),
        new Date(2000, 2, 1, 23, 59, 59)
      ]
    }
  },
  isNeedDefVal: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:modelValue', 'date-change'])

const dateRangeParam = computed({
  get () {
    return props.modelValue
  },
  set (newValue) {
    emit('update:modelValue', newValue)
  }
})

onMounted(() => {
  init()
})

const init = () => {
  if (props.modelValue && props.modelValue.length > 0) return
  if (props.isNeedDefVal) {
    dateRangeParam.value = getMonthStartAndEnd()
  }
}

const datePickerType = ref(props.defaultType)
const dateFormat = ref('YYYY-MM-DD')
const onSetDatePickerType = (val) => {
  datePickerType.value = val
  const obj = props.options?.find(i => i.value === val)
  if (obj) dateFormat.value = obj.format || 'YYYY-MM-DD'
  dateRangeParam.value = getMonthStartAndEnd()
}

/**
 * 获取当月第一天与最后一天
 */
const getMonthStartAndEnd = () => {
  let val = []
  if (props.isNeedDefVal) {
    // 获取当前日期对象
    const now = new Date()
    // 获取当前月份第一天
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    // 获取当前月份最后一天
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    val = [
      getParseTime(firstDayOfMonth),
      getParseTime(lastDayOfMonth)
    ]
  }
  return val
}

/**
 * 处理结束月份，获取月份最后一天
 * @param value
 */
const handleMonthRangeChange = (value) => {
  if (datePickerType.value !== 'monthrange') return
  if (value && value.length === 2) {
    const endDate = new Date(value[1])
    // 设置结束月份的最后一天
    const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59)
    // 更新结束月份的最后一天
    dateRangeParam.value[1] = getParseTime(lastDayOfMonth)
  }

  emit('date-change', dateRangeParam.value)
}
</script>

<style scoped lang="scss">
.component-cm-data-picker {
  display: flex;
  align-items: center;

  :deep(.date-picker-type .el-input--suffix) {
    width: 120px !important;
  }

  &:deep(.el-select){
    width: 120px !important;

    .el-input {
      display: flex !important;
    }
  }
}

</style>
