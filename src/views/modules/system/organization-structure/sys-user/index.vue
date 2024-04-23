<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchParam"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="昵称："
            prop="nickName"
          >
            <el-input
              v-model="searchParam.nickName"
              maxlength="30"
              placeholder="输入昵称"
              prop="nickName"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('联系方式') + '：'"
            prop="phoneNum"
          >
            <el-input
              v-model="searchParam.phoneNum"
              maxlength="11"
              placeholder="输入联系方式"
              prop="phoneNum"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <!-- <el-button @click="getPage()">{{ $t('table.search') }}</el-button> -->
        <el-button
          v-permission="['platform:sysUser:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageData.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 昵称 -->
          <el-table-column
            :label="$t('platform.shopUser.nickName')"
            prop="nickName"
            align="center"
          >
            <template #default="{row}">
              <div :class="{'name-cell': row.isAdmin === 1}">
                <div class="table-cell-text">
                  {{ row.nickName }}
                </div>
                <div
                  v-if="row.isAdmin === 1"
                  class="super-admin-tab"
                >
                  （超级管理员）
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 头像 -->
          <el-table-column
            :label="$t('platform.shopUser.avatar')"
            prop="avatar"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <ImgShow :src="row.avatar" />
              </div>
            </template>
          </el-table-column>
          <!-- 员工编号 -->
          <el-table-column
            :label="$t('platform.shopUser.code')"
            prop="code"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.code || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 联系方式 -->
          <el-table-column
            :label="$t('platform.shopUser.mobileNumber')"
            prop="phoneNum"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.phoneNum || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            :label="$t('platform.shopUser.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['禁用', '启用'][row.status] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-if="row.hasAccount === 0"
                  v-permission="['platform:account:save']"
                  link
                  type="primary"
                  @click="onAddOrUpdateAccount(row.platformUserId,row.hasAccount)"
                >
                  设置账号
                </el-button>
                <el-button
                  v-if="row.hasAccount === 1"
                  v-permission="['platform:account:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdateAccount(row.platformUserId,row.hasAccount)"
                >
                  修改账号
                </el-button>
                <el-button
                  v-if="row.hasAccount === 1"
                  v-permission="['platform:sysUser:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.platformUserId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="row.isAdmin !== 1"
                  v-permission="['platform:sysUser:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.platformUserId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total>0"
      v-model:page="searchParam.pageNum"
      v-model:limit="searchParam.pageSize"
      :total="pageData.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
    <!-- 账户弹窗, 新增 / 修改 -->
    <account-add-or-update
      v-if="accountAddOrUpdateVisible"
      ref="accountAddOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import AccountAddOrUpdate from './account-add-or-update.vue'
import * as api from '@/api/platform/sys-user'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchParam = reactive({
  pageSize: 10,
  pageNum: 1,
  phoneNum: '',
  nickName: ''
})

const pageLoading = ref(false)

// 保存上次点击查询的请求条件
let tempSearchForm = null
// 返回参数
const pageData = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchParam }
  } else {
    tempSearchForm.pageNum = searchParam.pageNum
    tempSearchForm.pageSize = searchParam.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(res => {
    pageData.value.list = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const onAddOrUpdate = (platformUserId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(platformUserId)
  })
}
const accountAddOrUpdateVisible = ref(false)
const accountAddOrUpdateRef = ref()
const onAddOrUpdateAccount = (platformUserId, hasAccount) => {
  accountAddOrUpdateVisible.value = true
  nextTick(() => {
    accountAddOrUpdateRef.value.init(platformUserId, hasAccount)
  })
}
const onDelete = (platformUserId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(platformUserId))
}

const deleteById = (platformUserId) => {
  api.deleteById(platformUserId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

const searchFormRef = ref(null)
const onResetSearch = () => {
  searchFormRef.value?.resetFields()
}

onMounted(() => {
  getPage()
})
</script>

<style lang="scss" scoped>
.name-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  .table-cell-text {
    max-width: 50%;
  }
  .super-admin-tab {
    color: #ff4949;
  }
}
</style>
