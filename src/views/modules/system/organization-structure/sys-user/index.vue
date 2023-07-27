<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="昵称：">
            <el-input
              v-model="pageQuery.nickName"
              maxlength="30"
              placeholder="输入昵称"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('联系方式') + '：'">
            <el-input
              v-model="pageQuery.phoneNum"
              maxlength="11"
              placeholder="输入联系方式"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('delivery.transport.query') }}
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
                  type="text"
                  @click="addOrUpdateAccountHandle(row.sysUserId,row.hasAccount)"
                >
                  设置账号
                </el-button>
                <el-button
                  v-if="row.hasAccount === 1"
                  v-permission="['platform:account:update']"
                  type="text"
                  @click="addOrUpdateAccountHandle(row.sysUserId,row.hasAccount)"
                >
                  修改账号
                </el-button>
                <el-button
                  v-if="row.hasAccount === 1"
                  v-permission="['platform:sysUser:update']"
                  type="text"
                  @click="onAddOrUpdate(row.sysUserId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="row.isAdmin !== 1"
                  v-permission="['platform:sysUser:delete']"
                  type="text"
                  @click="onDelete(row.sysUserId)"
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
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
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
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import AccountAddOrUpdate from './account-add-or-update.vue'
import * as api from '@/api/platform/sys-user'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  phoneNum: '',
  nickName: ''
})

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const accountAddOrUpdateVisible = ref(false)
const accountAddOrUpdateRef = ref()
const pageLoading = ref(false)
const searchFormRef = ref(null)
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
    tempSearchForm = { ...pageQuery }
  } else {
    tempSearchForm.pageNum = pageQuery.pageNum
    tempSearchForm.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(res => {
    pageData.value.list = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(err => {
    console.log(err)
    pageLoading.value = false
  })
}

const onAddOrUpdate = (sysUserId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(sysUserId)
  })
}

const onDelete = (sysUserId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(sysUserId))
}

const deleteById = (sysUserId) => {
  console.log(sysUserId)
  api.deleteById(sysUserId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
const onResetSearch = (formEl) => {
  formEl.resetFields()
}
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
