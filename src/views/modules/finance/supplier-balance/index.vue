<template>
  <div class="page-supplier-balance">
    <div class="shop-walletLog">
      <!-- <div class="title">供应商总余额</div> -->
      <div class="head">
        <div class="head-item">
          <div class="text">
            <span style="margin-right:10px">可用店铺余额(元)</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户确认收货15天后，增加店铺余额，可用于店铺提现"
              placement="right"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span
              v-if="shopWalletInfo?.settledAmount === null"
              style="margin-right:20px"
            > {{ '-' }}</span>
            <span
              v-else
              style="margin-right:20px"
            >{{ amount(shopWalletInfo?.settledAmount) }}</span>
          </div>
        </div>
        <div
          class="head-item"
          style="margin-left:20px"
        >
          <div class="text">
            <span style="margin-right:10px">待结算金额(元)</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户购买商品之后，等待用户确认收货15天后，将会变成店铺余额"
              placement="right"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span style="margin-right:30px">{{ amount(shopWalletInfo?.unsettledAmount) }}</span>
          </div>
        </div>
        <div class="head-item">
          <div class="text">
            <span style="margin-right:10px">冻结金额(元)</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="商城进行提现申请的时候，将会把余额冻结，增加冻结金额"
              placement="right"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span style="margin-right:30px">{{ amount(shopWalletInfo?.freezeAmount) }}</span>
          </div>
        </div>
        <div class="head-item">
          <div class="text">
            <span style="margin-right:10px">总结算金额(元)</span>
            <el-tooltip
              class="item"
              effect="dark"
              content="用户确认收货15天后结算的所有金额"
              placement="left"
            >
              <span><el-icon class="question"><QuestionFilled /></el-icon></span>
            </el-tooltip>
          </div>
          <div class="balance">
            <span style="margin-right:30px">{{ amount(shopWalletInfo?.totalSettledAmount ) }}</span>
          </div>
        </div>
      </div>

      <div class="search-bar">
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          clearable
          :inline="true"
          :model="searchForm"
          class="demo-form-inline from"
          @submit.prevent
        >
          <div class="form-item">
            <el-form-item
              label="供应商名称："
              label-width="120px"
            >
              <el-input
                v-model="searchForm.supplierName"
                style="width: 240px;"
                placeholder="请输入供应商名称"
              />
            </el-form-item>
            <el-form-item
              label="时间范围："
              label-width="120px"
              class="date-range-param"
            >
              <el-select
                v-model="datePickerType"
                class="date-picker-type"
                @change="setdatePickerType(datePickerType)"
              >
                <el-option
                  v-for="item in datePickerTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-date-picker
                v-model="dateRangeParam"
                :type="datePickerType"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button
                type="primary"
                @click="onSearch()"
              >
                <i class="el-icon-search" />搜索
              </el-button>
              <el-button @click="onClear">
                {{ $t('table.reset') }}
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="table">
        <el-tabs
          v-model="activeName"
        >
          <el-tab-pane
            label="交易记录"
            name="first"
          >
            <Trading
              ref="tradingRef"
              :search="searchForm"
            />
          </el-tab-pane>
        </el-tabs>
        <div class="export-btn">
          <el-button
            v-permission="['platform:supplierWallet:export']"
            icon="el-icon-download"
            @click="onExportFrom()"
          >
            导出
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Trading from './components/trading.vue'
import { shopWallet, soldExcel } from '@/api/supplier-balance/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import Big from 'big.js'

const amount = (value) => {
  if (!value) {
    return 0
  }
  return new Big(value).div(100).toFixed(2)
}
const activeName = 'first'
const searchForm = ref({
  startTime: '',
  endTime: '',
  supplierName: ''
})
const datePickerType = ref('daterange') // 日期筛选类型
const dateRangeParam = ref([])
const datePickerTypeOptions = [
  {
    label: '日期范围',
    value: 'daterange'
  },
  {
    label: '月份范围',
    value: 'monthrange'
  }
]

const shopWalletInfo = ref('')
let isSubmit = false

onMounted(() => {
  onGetShopWallet()
  onSearch()
})

const setdatePickerType = (val) => {
  datePickerType.value = val
}
const tradingRef = ref(null)
const onSearch = () => {
  if (!dateRangeParam.value) {
    return ElMessage.error('请选择时间范围')
  }
  searchForm.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  searchForm.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''
  tradingRef.value.onGetData(searchForm.value, true)
  onGetShopWallet()
}
// 清空查询 的表单
const onClear = () => {
  searchForm.value = {
    startTime: '',
    endTime: '',
    supplierName: ''
  }
  dateRangeParam.value = []
}
// 获取店铺余额信息
const onGetShopWallet = () => {
  shopWallet(searchForm.value).then(data => {
    shopWalletInfo.value = data
  })
}
// 导出
const onExportFrom = () => {
  if (!dateRangeParam.value) {
    ElMessage.warning('请选择时间范围')
    return
  }
  searchForm.value.startTime = dateRangeParam.value ? dateRangeParam.value[0] : ''
  searchForm.value.endTime = dateRangeParam.value ? dateRangeParam.value[1] : ''

  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    soldExcel({ ...searchForm.value }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = '供应商结算.xlsx'
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
</script>
<style lang="scss" scoped>
  .page-supplier-balance {
    background: #F5F5F5;
    width: 100%;
    min-height: 100vh;
    .shop-walletLog {
   background: #FFFFFF;
   width: 100%;
   padding: 24px;
   .search-bar {
    margin-top: 20px;
    margin-bottom: 25px;
    padding-bottom: 25px;
      :deep(.date-picker-type .el-input--suffix) {
        width: 120px !important;
      }
   }
   .head {
     background: #F5F5F5;
     height: 130px;
     padding: 20px;
     display: flex;
     justify-content: space-around;
     margin-bottom: 30px;
     .head-item {
       height: 100%;
       width: 230px;
       display: flex;
       flex-direction: column;
       justify-content: space-around;
       .balance {
         font-size: 22px;
       }
     }
   }
   .table {
    position: relative;
    .export-btn {
      position: absolute;
      right: 0;
      top: -5px;
    }
   }
 }
  }

</style>
