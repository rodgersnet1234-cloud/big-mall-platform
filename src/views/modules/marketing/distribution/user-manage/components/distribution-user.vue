<template>
  <div class="components-distribution-user app-container">
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
            label="邀请人手机号："
            class="search-form-item"
            prop="inviteeMobile"
          >
            <el-input
              v-model="searchForm.inviteeMobile"
              type="text"
              placeholder="邀请人手机号"
              maxlength="11"
              clearable
            />
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
      <div class="table-con">
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
          <!-- 加入时间 -->
          <el-table-column
            label="加入时间"
            prop="bindTime"
            align="center"
            min-width="150px"
            sortable
          >
            <template #default="{row}">
              <span>{{ row.bindTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 累计客户 -->
          <el-table-column
            label="累计客户"
            prop="boundCustomers"
            align="center"
            sortable
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.boundCustomers }}</span>
            </template>
          </el-table-column>
          <!-- 累计邀请 -->
          <el-table-column
            label="累计邀请"
            prop="invitedVeeker"
            align="center"
            sortable
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.invitedVeeker }}</span>
            </template>
          </el-table-column>
          <!-- 累计收益 -->
          <el-table-column
            label="累计收益"
            prop="accumulateAmount"
            align="center"
            sortable
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.accumulateAmount }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            label="状态"
            prop="state"
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
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                type="text"
                @click="onGetInfo(row)"
              >
                查看
              </el-button>
              <el-button
                v-if="row.state !== -1"
                v-permission="['distribution:user-manage:update']"
                type="text"
                @click="onAddOrUpdate(row)"
              >
                修改状态
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
    <!-- 弹窗, 新增 / 修改 -->
    <info
      v-if="infoVisible"
      ref="infoRef"
    />
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import info from './distribution-user-info.vue'
import AddOrUpdate from './distribution-user-update.vue'
import * as api from '@/api/distribution/user/distribution-user-basic.js'

let tempSearchForm = null // 保存上次点击查询的请求条件
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  userMobile: '',
  inviteeMobile: '',
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
const sortParam = ref(0) // 0无 1加入时间 2累计客户 3累计邀请 4累计收益
const sortType = ref(0) // 0无 1 正序 2倒序
const infoVisible = ref(false)
const infoRef = ref(null)
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)

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
  api.page(tempSearchForm).then((data) => {
    data.list.forEach(item => {
      item.accumulateAmount = formatPrice(item.accumulateAmount, 1)
    })
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
// 刷新函数
const refreshChange = () => {
  searchForm.pageNum = 1
  getPageData()
}
// 查看
const onGetInfo = (data) => {
  infoVisible.value = true
  nextTick(() => {
    infoRef.value?.init(data)
  })
}

// 排序
const onSortChange = (data) => {
  // 排序字段 0无 1加入时间 2累计客户 3累计邀请 4累计收益
  switch (data.prop) {
    case 'bindTime': sortParam.value = 1
      break
    case 'boundCustomers': sortParam.value = 2
      break
    case 'invitedVeeker': sortParam.value = 3
      break
    case 'accumulateAmount': sortParam.value = 4
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

const onAddOrUpdate = (data) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(data)
  })
}
</script>
