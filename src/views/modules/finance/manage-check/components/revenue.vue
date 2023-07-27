<template>
  <div
    v-loading="loading"
    class="page-revenue"
  >
    <div class="export-btn">
      <el-button
        v-permission="['platform:accountDetail:export']"
        icon="el-icon-download"
        @click="onExportFrom()"
      >
        导出
      </el-button>
    </div>
    <div class="total-amount">
      <div class="item">
        <div class="pay-name">
          微信支付
        </div>
        <div class="pay-amount">
          ￥  {{ amount(reconciliationDetails.wechatAmount) }}
        </div>
        <div class="pay-percent">
          {{ percent(reconciliationDetails.wechatPercent) }}%
        </div>
      </div>
      <div class="item">
        <div class="pay-name">
          支付宝
        </div>
        <div class="pay-amount">
          ￥ {{ amount(reconciliationDetails.alipayAmount) }}
        </div>
        <div class="pay-percent">
          {{ percent(reconciliationDetails.alipayPercent ) }}%
        </div>
      </div>
      <div class="item">
        <div class="pay-name">
          积分
        </div>
        <div class="pay-amount">
          {{ reconciliationDetails.scoreCount ? reconciliationDetails.scoreCount : 0 }}
        </div>
      </div>
      <div class="item">
        <div class="pay-name">
          余额
          <el-tooltip
            effect="dark"
            placement="right"
          >
            <template #content>
              <div style="max-width:500px">
                买家账户余额支付的金额
              </div>
            </template>
            <el-icon class="question">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </div>
        <div class="pay-amount">
          ￥  {{ amount(reconciliationDetails.balanceAmount) }}
        </div>
        <div class="pay-percent">
          {{ percent(reconciliationDetails.balancePercent) }}%
        </div>
      </div>
      <div class="item marBottom">
        <div class="pay-name">
          合计
        </div>
        <div class="pay-amount">
          ￥  {{ amount(reconciliationDetails.total) }}
        </div>
      </div>
    </div>
    <!-- 平台收入-->
    <div
      v-if="hasPlatformDetail"
      class="module-title"
    >
      <div class="tit-lf">
        平台收入
      </div>
    </div>
    <div
      v-if="hasPlatformDetail"
      class="list"
    >
      <el-table
        :data="platformDetail"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          prop="alipayAmount"
          label="支付宝"
          align="center"
        >
          <span>￥ {{ amount(platformDetail[0].alipayAmount) }}</span>
        </el-table-column>
        <el-table-column
          prop="wechatAmount"
          label="微信支付"
          align="center"
        >
          <span>￥ {{ amount(platformDetail[0].wechatAmount) }}</span>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          label="余额支付"
          align="center"
        >
          <span>￥ {{ amount(platformDetail[0].balanceAmount) }}</span>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          label="积分支付"
          align="center"
        >
          <span>{{ platformDetail[0].scoreCount }}</span>
        </el-table-column>
        <el-table-column
          prop="total"
          label="合计"
          align="center"
        >
          <span>￥ {{ amount(platformDetail[0].total) }}</span>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center"
        >
          <el-button
            type="primary"
            link
            @click="onHandleDetail(0)"
          >
            明细
          </el-button>
        </el-table-column>
      </el-table>
    </div>
    <!-- 店铺收入-->
    <div class="module-title">
      <div class="tit-lf">
        店铺收入
      </div>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        style="width: 100%"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
      >
        <el-table-column
          label="序号"
          type="index"
          width="70"
        />
        <el-table-column
          label="店铺名称"
          prop="shopName"
        >
          <template #default="scope">
            <span> {{ scope.row.shopName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="alipayAmount"
          label="支付宝"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ amount(scope.row.alipayAmount ) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatAmount"
          label="微信支付"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ amount(scope.row.wechatAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          label="余额支付"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ amount(scope.row.balanceAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceAmount"
          label="积分支付"
          align="center"
        >
          <template #default="scope">
            <span>{{ scope.row.scoreCount }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="合计"
          align="center"
        >
          <template #default="scope">
            <span>￥ {{ amount(scope.row.total) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="onHandleDetail(scope.row.shopId)"
            >
              明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页条 -->
    <Pagination
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/Pagination/index.vue'
import { revenueDetail, soldExcel, revenueDetailInfo } from '@/api/funds-management/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import Big from 'big.js'

const props = defineProps({
  searchForm: {
    type: Object,
    default: () => {}
  },
  dateRangeParam: {
    type: Object,
    default: () => {}
  }
})
const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}
const percent = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).times(100).toFixed(2)
}
let timeData = ''
const loading = ref(false)
let total = ref(0)
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const tableData = ref([])
const onGetDataList = () => {
  const tempSearchForm = { ...timeData, ...params.value }
  tableData.value = []
  loading.value = true
  revenueDetailInfo(tempSearchForm).then(data => {
    tableData.value = data.list
    total = data.total
  }).finally(() => {
    loading.value = false
  })
}

// 导出
let isSubmit = false
const onExportFrom = () => {
  if (!props.searchForm.startTime || !props.searchForm.endTime) {
    ElMessage.warning('请选择时间范围')
    return
  }
  // eslint-disable-next-line vue/no-mutating-props
  props.searchForm.startTime = props.dateRangeParam ? props.dateRangeParam[0] : ''
  // eslint-disable-next-line vue/no-mutating-props
  props.searchForm.endTime = props.dateRangeParam ? props.dateRangeParam[1] : ''
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    soldExcel({ ...props.searchForm }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      // var blob = data
      let fileName = '收入对账'
      if (props.dateRangeParam[0].split(' ')[0] !== props.dateRangeParam[1].split(' ')[0]) {
        fileName = fileName + '(' + props.dateRangeParam[0].split(' ')[0] +
          ' ' + $t('date.tip') + ' ' +
          props.dateRangeParam[1].split(' ')[0] + ')'
      } else {
        fileName = fileName + `(${props.dateRangeParam[0].split(' ')[0]})`
      }
      fileName = fileName + '.xlsx'
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
const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
  onGetDataList()
}
// 跳转到明细详情页
const router = useRouter()
const onHandleDetail = (shopId) => {
  router.push({
    path: '/reconciliation-details',
    query: {
      type: 1,
      shopId,
      ...timeData
    }
  })
}
const hasPlatformDetail = ref(false)
const reconciliationDetails = ref({
  wechatAmount: 0,
  wechatPercent: 0,
  alipayAmount: 0,
  alipayPercent: 0,
  balanceAmount: 0,
  balancePercent: 0,
  scoreCount: 0,
  total: 0
})
const onGetDataDetail = (params) => {
  timeData = params
  loading.value = true
  revenueDetail(params).then(data => {
    reconciliationDetails.value = data
  }).finally(() => {
    loading.value = false
  })
  hasPlatformDetail.value = false
  if (!timeData.shopName || timeData.shopName === '') {
    onGetPlatformDataDetail()
  }
  onGetDataList()
}
const platformDetail = ref([])

const onGetPlatformDataDetail = () => {
  const shopId = 0
  const platformData = { ...timeData, shopId }
  platformDetail.value = []
  revenueDetail(platformData).then(data => {
    platformDetail.value.push(data)
    hasPlatformDetail.value = true
  }).finally(() => {
    loading.value = false
  })
}
defineExpose({ onGetDataDetail })
</script>

<style lang="scss" scoped>

  .page-revenue {
     padding-top: 40px;
    .export-btn {
      position: absolute;
      right: 0;
      top: 0;
    }
     .total-amount {
       flex-wrap: wrap;
       background: #F5F5F5;
       padding: 15px 30px;
       display: flex;
       .marBottom {
        margin-top: 30px;
       }
       .item {
         width: 25%;
         height: 70px;
         display: flex;
         flex-direction: column;
         .pay-name {
           color: #666;
           font-size: 14px;
            margin-bottom: 8px;
         }
         .pay-amount {
            color: #333;
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 8px;
         }
         .pay-percent {
           color: rgba(0, 0, 0, 0.4);
           font-size: 14px;
         }
       }
     }
     .list{
       padding: 20px 0;
     }
     .module-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    padding: 16px 10px;
    margin-top: 20px;
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

  }
   }
</style>
