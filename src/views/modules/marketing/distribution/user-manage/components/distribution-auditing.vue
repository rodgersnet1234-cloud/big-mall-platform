<template>
  <div class="components-distribution-auditing app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="分销员手机号："
            class="search-form-item"
            prop="userMobile"
          >
            <el-input
              v-model="searchForm.userMobile"
              type="text"
              placeholder="分销员手机号"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="审核状态："
            class="search-form-item"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              clearable
              placeholder="审核状态"
            >
              <el-option
                label="未审核"
                value="0"
              />
              <el-option
                label="已通过"
                value="1"
              />
              <el-option
                label="未通过"
                value="-1"
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
      <el-table
        v-loading="pageLoading"
        :data="pageData.dataList"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%;"
        @sort-change="onSortChange"
      >
        <!-- 昵称 -->
        <el-table-column
          label="昵称"
          prop="nickName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.nickName || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 分销员手机号 -->
        <el-table-column
          label="分销员手机号"
          prop="userMobile"
          align="center"
          min-width="120"
        >
          <template #default="{row}">
            <span>{{ row.userMobile || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 邀请人手机号 -->
        <el-table-column
          label="邀请人手机号"
          prop="inviteeMobile"
          align="center"
          min-width="120"
        >
          <template #default="{row}">
            <span>{{ row.inviteeMobile || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 邀请人 -->
        <el-table-column
          label="邀请人"
          prop="invitee"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.invitee || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 积累消费金额 -->
        <el-table-column
          label="积累消费金额"
          prop="sumOfConsumption"
          align="center"
          min-width="120"
        >
          <template #default="{row}">
            <span>{{ row.sumOfConsumption || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 积累消费笔数 -->
        <el-table-column
          label="积累消费笔数"
          prop="sumOfConsumption"
          align="center"
          min-width="120"
        >
          <template #default="{row}">
            <span>{{ row.expenseNumber || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 申请时间 -->
        <el-table-column
          label="申请时间"
          prop="auditingTime"
          align="center"
          min-width="150px"
          sortable
        >
          <template #default="{row}">
            <span>{{ row.auditingTime || '-' }}</span>
          </template>
        </el-table-column>
        <!--   审核状态：0 未审核 1已通过 -1未通过 -->
        <el-table-column
          label="审核状态"
          prop="state"
          align="center"
        >
          <template #default="{row}">
            <span v-if="row.state === 0">{{ '未审核' }}</span>
            <span v-if="row.state === 1">{{ '已通过' }}</span>
            <span v-if="row.state === -1">{{ '未通过' }}</span>
          </template>
        </el-table-column>
        <!-- 操作人 -->
        <el-table-column
          label="操作人"
          prop="modifierName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.modifierName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template #default="{row}">
            <el-button
              v-if="row.state === 0"
              v-permission="['distribution:auditing:update']"
              link
              type="primary"
              @click="onAddOrUpdate(row, true)"
            >
              {{ '审核' }}
            </el-button>
            <el-button
              v-if="row.state !== 0"
              link
              type="primary"
              @click="onAddOrUpdate(row, false)"
            >
              {{ '查看' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
      @close-add-or-update="closeAddOrUpdate()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './distribution-auditing-update.vue'
import * as api from '@/api/distribution/user/distribution-auditing.js'
import Big from 'big.js'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  userMobile: null,
  state: null
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

const addOrUpdateVisible = ref(false)
const sortParam = ref(null)
const sortType = ref(null)

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  let sortParamObj
  if (sortType.value) {
    sortParamObj = {
      sortParam: sortParam.value,
      sortType: sortType.value
    }
  } else {
    sortParamObj = {
      sortParam: 0,
      sortType: 0
    }
  }
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm, ...sortParamObj }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    data.list.forEach(el => {
      // 金额/100
      el.sumOfConsumption = bigActualTotal(el.sumOfConsumption, 100)
    })
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref(null)
const closeAddOrUpdate = () => {
  addOrUpdateVisible.value = false
}

const onAddOrUpdate = (data, isEdit) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(data, isEdit)
  })
}

// 排序
const onSortChange = (data) => {
  // 排序字段 0无
  switch (data.prop) {
    case 'auditingTime': sortParam.value = 1
      break
    default: sortParam.value = 0
      break
  }
  // 排序类型 0无 1 正序 2倒序
  switch (data.order) {
    case 'descending': sortType.value = 2
      break
    case 'ascending': sortType.value = 1
      break
    default: sortType.value = 0
      break
  }
  getPageData()
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}
</script>
