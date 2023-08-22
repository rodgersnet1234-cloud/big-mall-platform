<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="物流公司名称：">
            <el-input
              v-model="pageQuery.name"
              placeholder="物流公司名称"
              maxlength="50"
              style="width: 190px"
              clearable
            />
          </el-form-item>
          <el-form-item label="物流公司编号（阿里）：">
            <el-input
              v-model="pageQuery.aliNo"
              placeholder="物流公司编号（阿里）"
              style="width: 190px"
              maxlength="50"
              clearable
            />
          </el-form-item>
          <el-form-item label="物流公司编号（快递鸟）：">
            <el-input
              v-model="pageQuery.birdNo"
              placeholder="物流公司编号（快递鸟）"
              style="width: 190px"
              maxlength="50"
              clearable
            />
          </el-form-item>
          <el-form-item label="物流公司编号（快递100）：">
            <el-input
              v-model="pageQuery.hundredNo"
              placeholder="物流公司编号（快递100）"
              style="width: 190px"
              maxlength="50"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              查询
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

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['delivery:company:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 物流公司名称 -->
          <el-table-column
            :label="$t('delivery.deliveryCompany.name')"
            prop="name"
            align="left"
          >
            <template #default="{row}">
              <span>{{ row.name || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 公司主页 -->
          <el-table-column
            :label="$t('delivery.deliveryCompany.homeUrl')"
            prop="homeUrl"
            align="left"
          >
            <template #default="{row}">
              <span>{{ row.homeUrl || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 物流公司编号(阿里) -->
          <el-table-column
            :label="$t('delivery.deliveryCompany.aliNo')"
            prop="aliNo"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.aliNo? row.aliNo : '-' }}</span>
            </template>
          </el-table-column>
          <!-- 物流公司编号(快递鸟) -->
          <el-table-column
            :label="$t('delivery.deliveryCompany.birdNo')"
            prop="birdNo"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.birdNo || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 物流公司编号(快递100) -->
          <el-table-column
            :label="$t('delivery.deliveryCompany.hundredNo')"
            prop="hundredNo"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.hundredNo ? row.hundredNo : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                v-permission="['delivery:company:edit']"
                link
                type="primary"
                @click="onAddOrUpdate(row.deliveryCompanyId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['delivery:company:delete']"
                link
                type="primary"
                @click="onDelete(row.deliveryCompanyId)"
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
import * as api from '@/api/delivery/delivery-company'
import { ElMessageBox, ElMessage } from 'element-plus'

// 保存上次点击查询的请求条件
let tempSearchForm = {}
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null, // 物流公司名称
  aliNo: null, // 阿里编号
  birdNo: null, // 快递鸟编号
  hundredNo: null // 快递100编号
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const pageLoading = ref(true)
const addOrUpdateVisible = ref(false)

onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery }
  } else {
    tempSearchForm.pageNum = pageQuery.pageNum
    tempSearchForm.pageSize = pageQuery.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref('')
const onAddOrUpdate = (deliveryCompanyId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(deliveryCompanyId)
  })
}
const onDelete = (deliveryCompanyId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(deliveryCompanyId))
}
const deleteById = (deliveryCompanyId) => {
  api.deleteById(deliveryCompanyId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
// 清空搜索内容
const clearSearchInfo = () => {
  pageQuery.name = null
  pageQuery.aliNo = null
  pageQuery.birdNo = null
  pageQuery.hundredNo = null
}
</script>
