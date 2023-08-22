<template>
  <!-- <div class="app-container"> -->
  <div class="container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="资源关联菜单：">
            <el-input
              v-model="pageQuery.menuTitle"
              placeholder="输入资源关联菜单"
              clearable
            />
          </el-form-item>
          <el-form-item label="资源名称：">
            <el-input
              v-model="pageQuery.name"
              placeholder="输入资源名称"
              maxlength="32"
              clearable
            />
          </el-form-item>
          <el-form-item label="权限对应的编码：">
            <el-input
              v-model="pageQuery.permission"
              placeholder="输入权限对应的编码"
              maxlength="32"
              clearable
            />
          </el-form-item>
          <el-form-item label="资源对应服务器路径：">
            <el-input
              v-model="pageQuery.uri"
              placeholder="输入资源对应服务器路径"
              maxlength="100"
              clearable
            />
          </el-form-item>
          <el-form-item label="请求方式：">
            <el-select
              v-model="pageQuery.method"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in requestList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['rbac:shopMenuPermission:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      <!-- <el-button @click="getPage()">{{ $t('table.search') }}</el-button> -->
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 资源关联菜单 -->
          <el-table-column
            :label="$t('rbac.menuPermission.menuTitle')"
            prop="menuTitle"
            align="center"
            width="160"
          >
            <template #default="{row}">
              <span>{{ row.menuTitle }}</span>
            </template>
          </el-table-column>
          <!-- 资源名称 -->
          <el-table-column
            :label="$t('rbac.menuPermission.name')"
            prop="name"
            align="center"
            width="200"
          >
            <template #default="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <!-- 权限对应的编码 -->
          <el-table-column
            :label="$t('rbac.menuPermission.permission')"
            prop="permission"
            align="left"
            width="500"
          >
            <template #default="{row}">
              <span>{{ row.permission }}</span>
            </template>
          </el-table-column>
          <!-- 资源对应服务器路径 -->
          <el-table-column
            :label="$t('rbac.menuPermission.uri')"
            prop="uri"
            align="left"
            width="500"
          >
            <template #default="{row}">
              <span>{{ row.uri }}</span>
            </template>
          </el-table-column>
          <!-- 请求方法 -->
          <el-table-column
            :label="$t('rbac.menuPermission.method')"
            prop="method"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['', 'GET', 'POST', 'PUT', 'DELETE'][row.method] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['rbac:shopMenuPermission:update']"
                type="primary"
                link
                @click="onAddOrUpdate(row.menuPermissionId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['rbac:shopMenuPermission:delete']"
                type="primary"
                link
                @click="onDelete(row.menuPermissionId)"
              >
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import Pagination from '@/components/pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/rbac/menu-permission.js' // 保存上次点击查询的请求条件
import { ElMessageBox, ElMessage } from 'element-plus'
let theData = null

const pageQuery = ref({
  menuTitle: null,
  name: null,
  permission: null,
  uri: null,
  method: null,
  pageSize: 10,
  pageNum: 1,
  bizType: 1
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = {
}
const addOrUpdateVisible = ref(false)
const requestList = [{
  value: 1,
  label: 'GET'
},
{
  value: 2,
  label: 'POST'
},
{
  value: 3,
  label: 'PUT'
},
{
  value: 4,
  label: 'DELETE'
}]
onMounted(() => {
  getPage()
})
const getPage = (newData = false) => {
  if (newData || !theData) {
    theData = { ...pageQuery.value, ...searchParam }
  } else {
    theData.pageSize = pageQuery.value.pageSize
    theData.pageNum = pageQuery.value.pageNum
  }
  pageLoading.value = true
  api.page(theData).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (menuPermissionId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(menuPermissionId)
  })
}
const onDelete = (menuPermissionId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(menuPermissionId))
}
const deleteById = (menuPermissionId) => {
  api.deleteById(menuPermissionId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
const clearSearchInfo = () => {
  pageQuery.value.menuTitle = null
  pageQuery.value.name = null
  pageQuery.value.permission = null
  pageQuery.value.uri = null
  pageQuery.value.method = null
}
</script>
