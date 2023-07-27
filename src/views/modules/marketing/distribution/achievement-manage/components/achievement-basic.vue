<template>
  <div class="components-distribution-achievement-basic app-container">
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
            label="状态："
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              clearable
              placeholder="状态"
            >
              <el-option
                label="永久封禁"
                :value="-1"
              />
              <el-option
                label="正常"
                :value="1"
              />
              <el-option
                label="暂时封禁"
                :value="2"
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
              <span>{{ row.nickName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 分销员手机号 -->
          <el-table-column
            label="分销员手机号"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.userMobile || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            label="状态"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.state === -1 ">永久封禁</span>
              <span v-else-if="row.state === 0 ">待审核状态</span>
              <span v-else-if="row.state === 1 ">正常</span>
              <span v-else-if="row.state === 2 ">暂时封禁</span>
              <span v-else>审核未通过</span>
            </template>
          </el-table-column>
          <!-- 积累收益 -->
          <el-table-column
            label="积累收益"
            align="center"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.accumulateAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 直推奖励 -->
          <el-table-column
            label="直推奖励"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.aGenerationCommission) }}</span>
            </template>
          </el-table-column>
          <!-- 间推奖励 -->
          <el-table-column
            label="间推奖励"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.secondGenerationCommission) }}</span>
            </template>
          </el-table-column>
          <!-- 待结算金额 -->
          <el-table-column
            label="待结算金额"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.unsettledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 可提现金额 -->
          <el-table-column
            label="可提现金额"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.settledAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 已失效金额 -->
          <el-table-column
            label="已失效金额"
            align="center"
            sortable="custom"
          >
            <template #default="{row}">
              <span>{{ conversionActual(row.invalidAmount) }}</span>
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
import * as api from '@/api/distribution/user/distribution-user.js'
import Big from 'big.js'
// filters
const conversionActual = (val) => {
  // 精度运算-除法
  if (val == null) {
    return ''
  }
  return new Big(val).div(100).toFixed(2).valueOf()
}

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  // 手机号
  userMobile: null,
  // 排序字段 0无 1一代佣金 2二代佣金 3邀请奖励 4待结算金额 5可提现金额 6已失效金额
  sortParam: 0,
  // 排序类型 0无 1 正序 2倒序
  sortType: 0,
  // 状态
  state: ''
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})
onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.sortParam = searchForm.sortParam
    tempSearchForm.sortType = searchForm.sortType
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

// 对应6种排序
const onSortChange = (data) => {
  // 排序字段 0无 1一代佣金 2二代佣金 3邀请奖励 4待结算金额 5可提现金额 6已失效金额
  switch (data.column.label) {
    case '直推奖励': searchForm.sortParam = 1
      break
    case '间推奖励': searchForm.sortParam = 2
      break
    case 'invitationRewards': searchForm.sortParam = 3
      break
    case '待结算金额': searchForm.sortParam = 4
      break
    case '可提现金额': searchForm.sortParam = 5
      break
    case '已失效金额': searchForm.sortParam = 6
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
</script>
