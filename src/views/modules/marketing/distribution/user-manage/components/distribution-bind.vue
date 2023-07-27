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
            label="分销员："
            class="search-form-item"
            prop="nickName"
          >
            <el-input
              v-model="searchForm.nickName"
              type="text"
              placeholder="分销员"
            />
          </el-form-item>
          <el-form-item
            label="分销员号码："
            class="search-form-item"
            prop="userMobile"
          >
            <el-input
              v-model="searchForm.userMobile"
              type="text"
              placeholder="分销员号码"
              maxlength="11"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="当前关系："
            class="search-form-item"
            prop="state"
          >
            <el-select
              v-model="searchForm.state"
              clearable
              placeholder="当前关系"
            >
              <!-- <el-option label="预绑定" value="0" /> -->
              <el-option
                label="生效"
                value="1"
              />
              <el-option
                label="失效 "
                value="-1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              查询
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              重置
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
        <!-- 客户 -->
        <el-table-column
          label="客户"
          prop="userNickName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.userNickName || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 客户号码 -->
        <el-table-column
          label="客户号码"
          prop="userNickName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.cuserMobile || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 分销员 -->
        <el-table-column
          label="分销员"
          prop="nickName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.nickName || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 分销员号码 -->
        <el-table-column
          label="分销员号码"
          prop="nickName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.userMobile || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 绑定时间 -->
        <el-table-column
          label="绑定时间"
          prop="bindTime"
          min-width="150px"
          align="center"
          sortable
        >
          <template #default="{row}">
            <span>{{ row.bindTime || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 失效时间 -->
        <el-table-column
          label="失效时间"
          prop="invalidTime"
          min-width="150px"
          align="center"
          sortable
        >
          <template #default="{row}">
            <span v-if="row.state === 1">-</span>
            <span v-else>{{ row.invalidTime || "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="当前关系"
          prop="state"
          align="center"
        >
          <template #default="{row}">
            <!-- <span v-if="row.state === 0">{{ '预绑定' }}</span> -->
            <span v-if="row.state === 1">{{ '生效' }}</span>
            <span v-if="row.state === -1">{{ '失效' }}</span>
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
import * as api from '@/api/distribution/user/distribution-bind.js'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  userMobile: null,
  state: null,
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
    case 'bindTime': sortParam.value = 1
      break
    case 'invalidTime': sortParam.value = 2
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
