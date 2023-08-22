<template>
  <!-- 复选框选项组 -->
  <div class="component-checkbox-options-group">
    <!-- 选项 -->
    <div class="data-radio">
      <!-- 分组 -->
      <div class="select-box">
        <DateTypeSelect
          v-model:dateType="dateType"
          @change-data="changeData"
        />
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
import DateTypeSelect from '../../public-components/date-type-select.vue'
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
  'exportFrom'
])

const checkData = reactive({
  salesCheck: [0, 1, 9],
  serviceCheck: [10, 12]
})

const dateType = ref(4)
const changeData = (val) => {
  emit('getTimeList', {
    startTime: val[0],
    endTime: val[1],
    value: dateType.value
  })
}

const list = ref([0, 1, 9, 10, 12])
const salesTargets = reactive(['曝光次数', '曝光人数', '加购人数', '加购件数', '下单人数', '支付人数', '下单件数', '支付件数', '下单金额', '支付金额'])
const serviceIndicators = reactive(['申请退款订单数', '申请退款人数', '成功退款订单数', '成功退款人数', '成功退款金额', '退款率'])

const showTableList = computed(() => {
  return function (index) {
    return list.value.indexOf(index) === -1
  }
})

onMounted(() => {
  emit('handleTable', list.value)
})

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
    }
  }
}
</style>
