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
            :label="'分销员昵称' + '：'"
            prop="nickName"
          >
            <el-input
              v-model="searchForm.nickName"
              placeholder="分销员昵称"
              maxlength="11"
              clearable
            />
          </el-form-item>
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
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 分销员昵称 -->
          <el-table-column
            label="分销员昵称"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            label="分销员手机号"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.userMobile }}</span>
            </template>
          </el-table-column>
          <!-- 待结算金额 -->
          <el-table-column
            label="待结算金额"
            prop="unsettledAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.unsettledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 可提现金额 -->
          <el-table-column
            label="可提现金额"
            prop="settledAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.settledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 已失效金额 -->
          <el-table-column
            label="已失效金额"
            prop="invalidAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.invalidAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 积累收益 -->
          <el-table-column
            label="积累收益"
            prop="accumulateAmount"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.accumulateAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="paySettlementType!==1"
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['distribution:distributionUserWallet:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row)"
              >
                {{ $t('table.edit') }}
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './distribution-user-wallet-update.vue'
import * as api from '@/api/distribution/user/distribution-user-wallet.js'
import Big from 'big.js'

// filters
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联

let tempSearchForm = null // 保存上次点击查询的请求条件
const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  // 手机号
  userMobile: null,
  nickName: null
})
const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}
const addOrUpdateVisible = ref(false)

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
  api.achievementPage(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref(null)
const onAddOrUpdate = (row) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(row)
  })
}
</script>
