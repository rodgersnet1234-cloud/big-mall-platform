<template>
  <!-- 成交转换 -->
  <div class="page-flow-profile component-transaction-conversion">
    <div class="module-title">
      <div class="tit-lf">
        成交转换
      </div>
      <el-button
        v-permission="['platform:flowSour:export']"
        type="primary"
        class="filter-item"
        @click="exportFrom()"
      >
        导出
      </el-button>
    </div>

    <!-- 选项 -->
    <div class="data-radio">
      <el-form
        :model="form"
        @submit.prevent
      >
        <el-form-item label="浏览访问：">
          <el-checkbox-group
            v-model="form.saleIndex"
            @change="changeData"
          >
            <el-checkbox
              label="访客数(占比)"
              name="saleIndex"
            />
            <el-checkbox
              label="新访客数"
              name="saleIndex"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="成交转化：">
          <el-checkbox-group
            v-model="form.serviceIndex"
            @change="changeData"
          >
            <el-checkbox
              label="UV价值"
              name="saleIndex"
            />
            <el-checkbox
              label="加购人数"
              name="saleIndex"
            />
            <el-checkbox
              label="下单人数"
              name="saleIndex"
            />
            <el-checkbox
              label="下单金额"
              name="saleIndex"
            />
            <el-checkbox
              label="访问-下单转化率"
              name="saleIndex"
            />
            <el-checkbox
              label="支付人数"
              name="saleIndex"
            />
            <el-checkbox
              label="支付金额"
              name="payAmount"
            />
            <el-checkbox
              label="访问-支付转化率"
              name="saleIndex"
            />
            <el-checkbox
              label="客单价"
              name="saleIndex"
            />
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div class="check-list">
        <span id="maxSelectSpan">最多选择5项</span>，已选择&nbsp;<span class="mark">{{ selectNum }}</span>&nbsp;/5&nbsp;个指标
      </div>
    </div>

    <!-- 表格 -->
    <div class="table">
      <div class="tips">
        <p>列表中已隐藏所选时间范围内无数据的流浪来源。</p>
        <p>转化效果归属于：最后一次访问来源</p>
      </div>
      <el-table
        :data="tableData"
        header-cell-class-name="table-header"
        row-class-name="table-row"
      >
        <el-table-column
          class="table-item"
          prop="prodInfo"
          label="来源类型"
        />
        <el-table-column
          v-if="tableItemShow.isVisible1"
          prop="userNums"
          class="table-item"
          label="访客数/占比"
          sortable
        >
          <template #default="scope">
            <span>{{ conversionPercentage(totalUserNums === 0? 0 : scope.row.userNums / totalUserNums) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible2"
          prop="newUserNums"
          class="table-item"
          label="新访客数"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible3"
          prop="uvAmount"
          class="table-item"
          label="UV价值"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible4"
          prop="plusShopCartUser"
          class="table-item"
          label="加购人数"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible5"
          prop="placeOrderUser"
          class="table-item"
          label="下单人数"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible6"
          prop="placeOrderAmount"
          class="table-item"
          label="下单金额"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible7"
          prop="placeOrderRate"
          class="table-item"
          label="访问-下单转化率"
          sortable
        >
          <template #default="scope">
            <span>{{ scope.row.placeOrderRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible8"
          prop="payUser"
          class="table-item"
          label="支付人数"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible9"
          prop="payAmount"
          class="table-item"
          label="支付金额"
          sortable
        />
        <el-table-column
          v-if="tableItemShow.isVisible10"
          prop="payRate"
          class="table-item"
          label="访问-支付转化率"
          sortable
        >
          <template #default="scope">
            <span>{{ scope.row.payRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="tableItemShow.isVisible11"
          prop="customerAmount"
          class="table-item"
          label="客单价"
          sortable
        />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/flow-profile.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const conversionPercentage = (val) => {
  if (val == null) {
    return ''
  }
  return (val * 100).toFixed(2) + '%'
}

const props = defineProps({
  // 时间类型 1:自然日  2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
  timeType: {
    type: Number,
    default () {
      return null
    }
  },
  startTime: {
    type: String,
    default () {
      return ''
    }
  },
  endTime: {
    type: String,
    default () {
      return ''
    }
  }
})
const emit = defineEmits(['setSysData'])

const systemTypeName = reactive(['全部', 'PC', 'H5', '小程序', 'android', 'IOS']) // 0 1 2 3 4 5

const tableItemShow = reactive({
  isVisible1: false,
  isVisible2: false,
  isVisible3: false,
  isVisible4: false,
  isVisible5: false,
  isVisible6: false,
  isVisible7: false,
  isVisible8: false,
  isVisible9: false,
  isVisible10: false,
  isVisible11: false,
  isVisible12: false
})

const form = reactive({
  // 浏览访问
  saleIndex: [
    '访客数(占比)',
    '新访客数'
  ],
  // 成交转换
  serviceIndex: [
    '支付人数',
    '支付金额'
  ]
})

onMounted(() => {
  changeData()
})

// 所有指标
const sumData = ref([])
// 已选数量

watch(() => sumData.value, () => {
  changVisibles()
}, { deep: true })

watch(() => props.timeType, () => {
  init()
}, { deep: true })

const selectNum = ref(0)
// 第三部分的最多项多选款监听
const changeData = () => {
  selectNum.value = form.saleIndex.length + form.serviceIndex.length
  // sumData是用来存放点击选中的文本框信息
  sumData.value = []
  sumData.value = sumData.value.concat(form.saleIndex).concat(form.serviceIndex)

  const checks = document.getElementsByName('saleIndex')
  const span = document.getElementById('maxSelectSpan')
  if (selectNum.value >= 5) {
    textShare(span, 'red')
    checks.forEach(i => {
      if (!i.checked) {
        i.setAttribute('disabled', 'true')
      }
    })
  }
  if (selectNum.value < 5) {
    textShare(span, 'grey')
    checks.forEach(i => {
      i.removeAttribute('disabled')
    })
  }
}

/**
 * 文字效果
 */
const textShare = (div, color) => {
  div.style.color = color
}

// 总访客数
const totalUserNums = ref(0)
const tableData = ref([])
/**
 * 请求成交转换数据
 */
const init = () => {
  totalUserNums.value = 0
  api.flowSour({
    dateType: props.timeType,
    startTime: props.startTime,
    endTime: props.endTime
  }).then(data => {
    if (data) {
      let name = null
      tableData.value = []
      for (let i = 0; i < data.length; i++) {
        // 如果是全部，就跳出本次循环（“全部不显示在成交转换表格中”）
        if (data[i].systemType === 0) {
          continue
        }
        if (!data[i].systemType) {
          name = '全部'
        } else {
          name = systemTypeName[data[i].systemType]
        }
        totalUserNums.value += data[i].userNums
        data[i].prodInfo = name
        data[i].payAmount = data[i].payAmount ? formatPrice(data[i].payAmount, 1).toFixed(2) : 0
        data[i].placeOrderAmount = data[i].placeOrderAmount ? formatPrice(data[i].placeOrderAmount, 1).toFixed(2) : 0
        data[i].customerAmount = data[i].customerAmount ? formatPrice(data[i].customerAmount, 1).toFixed(2) : 0
        data[i].uvAmount = data[i].uvAmount ? formatPrice(data[i].uvAmount, 1).toFixed(2) : 0
        tableData.value.push(data[i])
      }
    }
    // 将数据传递给父组件
    emit('setSysData', data)
  })
}

let isSubmit = false
/**
 * 导出
 */
const exportFrom = () => {
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    const param = {
      dateType: props.timeType,
      startTime: props.startTime,
      endTime: props.endTime
    }
    api.soldExcelSour({ ...param }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '成交转换.xlsx'
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
      isSubmit = false
    }).catch((e) => {
      ElMessage.error(e)
      isSubmit = false
    })
  })
}

/**
 * 控制表格列显隐
 */
const changVisibles = () => {
  tableItemShow.isVisible1 = judgeStrArrIncludeOtherString('访客数(占比)')
  tableItemShow.isVisible2 = judgeStrArrIncludeOtherString('新访客数')
  tableItemShow.isVisible3 = judgeStrArrIncludeOtherString('UV价值')
  tableItemShow.isVisible4 = judgeStrArrIncludeOtherString('加购人数')
  tableItemShow.isVisible5 = judgeStrArrIncludeOtherString('下单人数')
  tableItemShow.isVisible6 = judgeStrArrIncludeOtherString('下单金额')
  tableItemShow.isVisible7 = judgeStrArrIncludeOtherString('访问-下单转化率')
  tableItemShow.isVisible8 = judgeStrArrIncludeOtherString('支付人数')
  tableItemShow.isVisible9 = judgeStrArrIncludeOtherString('支付金额')
  tableItemShow.isVisible10 = judgeStrArrIncludeOtherString('访问-支付转化率')
  tableItemShow.isVisible11 = judgeStrArrIncludeOtherString('客单价')
}
const judgeStrArrIncludeOtherString = (str) => {
  return sumData.value.includes(str)
}

</script>

<style lang="scss" scoped>
// 成交转换
.page-flow-profile.component-transaction-conversion {
  margin-bottom: 30px;
  color: #333;
  // 选项
  .data-radio {
    display: block;
    padding: 25px 16px;
    font-size: 14px;
    .check-list {
      display: block;
      margin-top: 20px;
      margin-left: 70px;
      font-size: 12px;
      color: #999;
      .mark {
        color: #155bd4;
        font-weight: bold;
      }
    }
  }

  // 表格
  :deep(.table) {
    padding: 20px 0;
    border-top: 1px solid #EAF0F4;
    .tips {
      margin-bottom: 10px;
      p {
        font-size: 14px;
        color: #666;
        margin: 0;
        line-height: 1em;
        padding: 5px 0;
      }
    }
    .el-table {
      tr {
        height: 56px;
      }
    }
  }
}
</style>
