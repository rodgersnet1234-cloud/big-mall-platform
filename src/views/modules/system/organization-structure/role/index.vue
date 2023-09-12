<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="角色名称：">
            <el-input
              v-model="pageQuery.roleName"
              placeholder="输入角色名称"
              maxlength="30"
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
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['rbac:role:save']"
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
          <!-- 角色名称 -->
          <el-table-column
            :label="$t('rbac.role.roleName')"
            prop="roleName"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.roleName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 备注 -->
          <el-table-column
            :label="$t('rbac.role.remark')"
            prop="remark"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 更新时间 -->
          <el-table-column
            :label="$t('table.updateTime')"
            prop="updateTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.updateTime || '-' }}</span>
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
                  v-permission="['rbac:role:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.roleId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['rbac:role:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.roleId)"
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
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/rbac/role'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  phoneNum: '',
  nickName: ''
})
const searchFormRef = ref(null)
const pageLoading = ref(false)
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
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

const onAddOrUpdate = (roleId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(roleId)
  })
}

const onDelete = (roleId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(roleId))
}

const deleteById = (roleId) => {
  api.deleteById(roleId).then(() => {
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
