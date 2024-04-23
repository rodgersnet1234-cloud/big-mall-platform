<template>
  <div class="app-container">
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
            label="分销员昵称："
            class="search-form-item"
            prop="nickName"
          >
            <el-input
              v-model="searchForm.nickName"
              type="text"
              placeholder="分销员昵称"
              maxlength="11"
              clearable
            />
          </el-form-item>
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
            label="原因："
            class="search-form-item"
            prop="banReason"
          >
            <el-select
              v-model="searchForm.banReason"
              clearable
              placeholder="原因"
            >
              <el-option
                label="失去联系"
                value="0"
              />
              <el-option
                label="恶意刷单"
                value="1"
              />
              <el-option
                label="其他"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态："
            class="search-form-item"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              clearable
              placeholder="状态"
            >
              <el-option
                label="正常"
                value="1"
              />
              <el-option
                label="暂时封禁"
                value="2"
              />
              <el-option
                label="永久封禁"
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
          label="分销员昵称"
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
        >
          <template #default="{row}">
            <span>{{ row.userMobile || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 邀请人手机号 -->
        <el-table-column
          label="原因"
          prop="banReason"
          align="center"
        >
          <template #default="{row}">
            <span>{{ ['失去联系','恶意刷单','其他'][row.banReason] || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 邀请人 -->
        <el-table-column
          label="备注"
          prop="remarks"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.remarks || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 积累消费金额 -->
        <el-table-column
          label="操作人"
          prop="username"
          align="center"
        >
          <template #default="{row}">
            <span v-if="row.modifierName">{{ row.modifierName || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 积累消费笔数 -->
        <el-table-column
          label="操作时间"
          min-width="150px"
          prop="updateTime"
          align="center"
          sortable
        >
          <template #default="{row}">
            <span v-if="!row.updateTime">无</span>
            <span v-else>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <!--   审核状态：0 未审核 1已通过 -1未通过 -->
        <el-table-column
          label="审核状态"
          prop="state"
          align="center"
        >
          <template #default="{row}">
            <span v-if="row.state === 1">正常</span>
            <span v-if="row.state === 2">暂时封禁</span>
            <span v-if="row.state === -1">永久封禁</span>
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
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/user/distribution-ban.js'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  userMobile: null,
  state: null,
  banReason: null,
  nickName: null
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
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 排序
const onSortChange = (data) => {
  // 排序字段 0无
  switch (data.prop) {
    case 'updateTime': sortParam.value = 1
      break
    case 'auditingTime': sortParam.value = 2
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
</script>
