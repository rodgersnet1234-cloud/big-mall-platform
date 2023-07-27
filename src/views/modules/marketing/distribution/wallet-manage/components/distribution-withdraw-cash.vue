<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="'分销员手机号' + '：'"
            prop="userMobile"
          >
            <el-input
              v-model="searchForm.userMobile"
              placeholder="分销员手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'流水号' + '：'"
            prop="merchantOrderId"
          >
            <el-input
              v-model="searchForm.merchantOrderId"
              placeholder="流水号"
              maxlength="255"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="'提现状态' + '：'"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
          @sort-change="onSortChange"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            label="分销员昵称"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.distributionUserVO.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            label="分销员手机号"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.distributionUserVO.userMobile }}</span>
            </template>
          </el-table-column>
          <!-- 流水号（商户订单号） -->
          <el-table-column
            label="流水号"
            prop="merchantOrderId"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.merchantOrderId }}</span>
            </template>
          </el-table-column>
          <!-- 金额 -->
          <el-table-column
            label="金额"
            prop="amount"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ bigActualTotal(row.amount, 100) }}</span>
            </template>
          </el-table-column>
          <!-- 提现时间 -->
          <el-table-column
            label="提现时间"
            prop="createTime"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 提现类型(0 手动提现 1自动提现) -->
          <el-table-column
            label="提现类型"
            prop="moneyFlow"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.moneyFlow ===1 ? '线上打款' : '线下打款' }}</span>
            </template>
          </el-table-column>
          <!-- 提现状态(0:申请中 1:提现成功 -1:提现失败) -->
          <el-table-column
            label="提现状态"
            prop="state"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.state === 0">{{ '申请中' }}</span>
              <span v-if="row.state === 1">{{ '提现成功' }}</span>
              <span v-if="row.state === -1">{{ '提现失败' }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            label="更新时间"
            prop="updateTime"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            v-if="paySettlementType !== 1"
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-if="row.state === 0"
                v-permission="['distribution:distributionWithdrawCash:updateToSuccess']"
                type="text"
                @click="onUpdate(row.withdrawCashId)"
              >
                {{ '设为已提现' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/user/distribution-withdraw-cash.js'
import Big from 'big.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
let tempSearchForm = null // 保存上次点击查询的请求条件
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  // 手机号
  userMobile: null,
  // 流水号
  merchantOrderId: null,
  // 提现状态
  state: null,
  // 0无 1金额 2手续费 3提现时间 4更新时间
  sortParam: 3,
  // 0无 1 正序 2倒序
  sortType: 2
})
// 返回参数
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})
// loading
const pageLoading = ref(true)
const options = [
  {
    value: 0,
    label: '申请中'
  },
  {
    value: 1,
    label: '提现成功'
  },
  {
    value: -1,
    label: '提现失败'
  }
]
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}
onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onSortChange = (data) => {
  // 排序字段 0无 1金额 2手续费 3提现时间 4更新时间
  switch (data.prop) {
    case 'amount': searchForm.sortParam = 1
      break
    case 'fee': searchForm.sortParam = 2
      break
    case 'createTime': searchForm.sortParam = 3
      break
    case 'updateTime': searchForm.sortParam = 4
      break
    default: searchForm.sortParam = 0
      break
  }
  // 排序类型 0无 1 正序 2倒序
  switch (data.order) {
    case 'descending': searchForm.sortType = 2
      break
    case 'ascending': searchForm.sortType = 1
      break
    default: searchForm.sortType = 0
      break
  }
  getPageData()
}

const onUpdate = (withdrawCashId) => {
  ElMessageBox.confirm('确定进行[设为已提现]操作?', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => onUpdateToSuccess(withdrawCashId))
}

const onUpdateToSuccess = (withdrawCashId) => {
  api.updateToSuccess(withdrawCashId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}

</script>
