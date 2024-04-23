<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        v-model="pageQuery"
        :inline="true"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="密钥名称：">
            <el-input
              v-model="pageQuery.name"
              placeholder="输入密钥名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="账号ID：">
            <el-input
              v-model="pageQuery.accessId"
              placeholder="输入账号ID"
              maxlength="32"
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
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['admin:sysAccessKey:save']"
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
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 名称 -->
          <el-table-column
            label="密钥名称"
            prop="name"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.name || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 账号id -->
          <el-table-column
            label="账号ID"
            prop="accessId"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.accessId || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            label="备注"
            prop="remark"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['admin:sysAccessKey:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.sysAccessKeyId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['admin:sysAccessKey:reset']"
                link
                type="primary"
                @click="reset(row.sysAccessKeyId)"
              >
                {{ $t('table.reset') }}
              </el-button>
              <el-button
                v-permission="['admin:sysAccessKey:delete']"
                link
                type="primary"
                @click="onDelete(row.sysAccessKeyId)"
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
  </div>
</template>
<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/rbac/sys-access-key'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  phoneNum: '',
  nickName: ''
})
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
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
  }).catch(() => {
    pageLoading.value = false
  })
}

const onAddOrUpdate = (sysAccessKeyId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(sysAccessKeyId)
  })
}

const onDelete = (sysAccessKeyId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(sysAccessKeyId))
}

const deleteById = (sysAccessKeyId) => {
  api.deleteById(sysAccessKeyId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
const reset = (sysAccessKeyId) => {
  api.reset(sysAccessKeyId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

onMounted(() => {
  getPage()
})
</script>
