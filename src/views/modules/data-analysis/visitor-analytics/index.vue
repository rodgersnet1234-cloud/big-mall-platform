<template>
  <!-- 访客分析 -->
  <div class="data-analysis page-visitor-analytics">
    <!-- 第一模块 -->
    <div class="visitor-mod">
      <!-- 统计时间 -->
      <path-analysis-header
        :date-options="dateOptions"
        @change-data="changeData"
      />

      <!-- 访问深度 -->
      <access-depth
        v-if="accessDepthVisible"
        :echart-data="echartData"
      />
    </div>

    <!-- 访问地域分布 -->
    <geographical-distribution
      v-if="areaDistributionVisible"
      :echart-data="echartData"
      :table-data="tableData2"
      @export-from="exportFrom"
    />

    <!-- 系统设备 -->
    <system-equipment
      v-if="systemPlantVisible"
      :echart-data="echartData"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/data-analysis/visitor-analytics'
import pathAnalysisHeader from '../public-components/path-analysis-header.vue'
import accessDepth from './components/visitor-access-depth.vue'
import geographicalDistribution from './components/visitor-geographical-distribution.vue'
import systemEquipment from './components/vivstor-system-equipment.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'

// 页面总数据
const echartData = reactive({
  depthData: {
    xData: [],
    seriesData: [],
    seriesData2: []
  },
  regionData: {
    xData: [],
    seriesData: [],
    seriesData2: []
  },
  equiData: {
    xData: [],
    seriesData: [],
    seriesData2: []
  }
})

// 时间类型列表
const dateOptions = [
  {
    label: '近7天',
    value: 5
  },
  {
    label: '近30天',
    value: 6
  },
  {
    label: '自定义',
    value: 7
  }
]

const dateRange = ref('')
watch(() => dateRange.value, () => {
  // 先重置数据再获取数据重新渲染
  resetData()
  queryVisitorAnalysisData()
})

const changeData = (val) => {
  dateRange.value = val
}

// 时间类型 1:自然日 2:自然周 3:自然月 4:今日实时 5:近七天 6:近30天
const timeType = 5
/**
 * 查询访客分析数据
 */
const queryVisitorAnalysisData = () => {
  const params = {
    timeType,
    startTime: dateRange.value ? parseTime(dateRange.value[0], '{y}-{m}-{d} {h}:{i}:{s}') : '',
    endTime: dateRange.value ? parseTime(dateRange.value[1], '{y}-{m}-{d} {h}:{i}:{s}') : ''
  }
  api.getUserAnalysisData(params).then(data => {
    // 处理访问深度数据
    handleAccessDepthData(data.visitPageList)
    // 处理访问地域分布数据
    handleAreaDistributionData(data.visitUserList)
    // 处理系统设备数据
    handleSystemPlantData(data)
  })
}

// 访问深度
const accessDepthVisible = ref(false)
/**
 * 处理访问深度数据
 * @param visitPageList 访问深度数据
 */
const handleAccessDepthData = (visitPageList) => {
  if (!visitPageList) {
    return
  }
  // ES6 遍历所需数组，获取内部对象，放到声明的数组对象中
  let visit = ''
  visitPageList.forEach(item => {
    // 1:1 2:2 3:3 4:4 5:5 6:6-10 7:11-20 8:20+
    if (item.visitId <= 5) {
      visit = item.visitId
    } else if (item.visitId === 6) {
      visit = '6-10'
    } else if (item.visitId === 7) {
      visit = '11-20'
    } else if (item.visitId === 8) {
      visit = '20+'
    }
    echartData.depthData.xData.push(visit + '页')
    echartData.depthData.seriesData.push(item.userNums)
    // 将数据放到数组对象里面
    echartData.depthData.seriesData2.push({ value: item.userNums, name: visit + '页' })
  })
  if (visitPageList.length === 0) {
    for (let i = 1; i < 9; i++) {
      if (i <= 5) {
        visit = i + ''
      } else if (i === 6) {
        visit = '6-10'
      } else if (i === 7) {
        visit = '11-20'
      } else if (i === 8) {
        visit = '20+'
      }
      visit = visit + '页'
      echartData.depthData.xData.push(visit)
      echartData.depthData.seriesData.push(0)
      echartData.depthData.seriesData2.push({ value: 0, name: visit })
    }
  }
  accessDepthVisible.value = true
}

let isSubmit = false
// 导出
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
      timeType,
      startTime: dateRange.value ? parseTime(dateRange.value[0], '{y}-{m}-{d} {h}:{i}:{s}') : '',
      endTime: dateRange.value ? parseTime(dateRange.value[1], '{y}-{m}-{d} {h}:{i}:{s}') : ''
    }
    api.soldExcelSystem({ ...param }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      // const blob = data
      const fileName = '访问地域分布.xlsx'
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

// 访问地域分布
const tableData2 = ref([])
const areaDistributionVisible = ref(false)
/**
 * 处理访问地域分布数据
 * @param visitUserList 访问地域分布数据
 */
const handleAreaDistributionData = (visitUserList) => {
  if (!visitUserList) {
    return
  }
  let i = 1
  visitUserList.forEach(item => {
    echartData.regionData.xData.push(item.provinceName)
    echartData.regionData.seriesData2.push({ value: item.visitNums, name: item.provinceName })
    let stopTime = item.stopTime + '秒'
    if (item.stopTime > 60) {
      stopTime = parseFloat(item.stopTime / 60).toFixed(0) + '分钟' + item.stopTime % 60 + '秒'
    }
    tableData2.value.push({
      // 序号
      seq: i++,
      // 省名称
      provinceName: item.provinceName,
      // 浏览量
      visitNums: item.visitNums,
      // 商品访客数
      prodVisitUser: item.prodVisitUser,
      // 商品浏览量
      prodVisitNums: item.prodVisitNums,
      // 下单金额
      placeOrderAmount: item.placeOrderAmount,
      // 支付金额
      payAmount: item.payAmount,
      // 点击量
      clickNums: item.clickNums,
      // 加购数量
      plusShopCart: item.plusShopCart,
      // 页面总停留时长
      stopTime

    })
  })
  if (visitUserList.length === 0) {
    echartData.regionData.xData.push('无')
    echartData.regionData.seriesData2.push({ value: 0, name: '无' })
    tableData2.value.push({ seq: 0, provinceName: '无', visitNums: 0, visitUser: 0, prodVisitNums: 0, stopTime: 0 })
  }
  areaDistributionVisible.value = true
}

// 系统设备
const systemPlantVisible = ref(false)
/**
 * 处理系统设备数据
 * @param data
 */
const handleSystemPlantData = (data) => {
  if (!data) {
    return
  }
  echartData.equiData.xData.push('android', '微信小程序', 'h5', 'ios', 'pc')
  echartData.equiData.seriesData.push(
    { value: data.android, name: 'android' },
    { value: data.applets, name: '微信小程序' },
    { value: data.h5, name: 'h5' },
    { value: data.ios, name: 'ios' },
    { value: data.pc, name: 'pc' }
  )
  systemPlantVisible.value = true
}

/**
 * 重置数据
 */
const resetData = () => {
  echartData.depthData = {
    xData: [],
    seriesData: [],
    seriesData2: []
  }
  echartData.regionData = {
    xData: [],
    seriesData: [],
    seriesData2: []
  }
  echartData.equiData = {
    xData: [],
    seriesData: [],
    seriesData2: []
  }

  tableData2.value = []
}

</script>

<style lang="scss" scoped>
:deep(.page-visitor-analytics) {
  // 统计时间栏样式
  .statistics-time-mod {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    background: #f7f8fa;
    font-size: 14px;
    line-height: 1em;
    padding: 15px;
    margin-right: 10px;
    color: #333;
    .select-mod {
      width: 120px;
    }
    .date-display {
      font-size: 12px;
      color: #666;
      margin-left: 10px;
    }
  }
}

.page-visitor-analytics {
  display: block;
  background: #f1f4f5;
  :deep(.visitor-mod) {
    background: #fff;
    padding: 20px;
    .statistics-time-mod {
      margin-bottom: 20px;
    }
  }
}
#app .page-data-analysis.page-visitor-analytics:deep(.tit-mod-btn.el-button--default),
#app .page-data-analysis.page-visitor-analytics:deep(.tit-mod-btn.el-button--default:active),
#app .page-data-analysis.page-visitor-analytics:deep(.tit-mod-btn.el-button--default:focus){
  border: none;
}
</style>
