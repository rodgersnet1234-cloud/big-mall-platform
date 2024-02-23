<template>
  <div class="app-container page-addr">
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:shopAddr:save']"
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
          style="width: 100%;"
        >
          <!-- 省市区地址 -->
          <el-table-column
            :label="$t('platform.shopAddr.addr')"
            prop="province"
            align="left"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.province + ' ' + row.city + ' ' + row.area + ' ' + row.addr }}</span>
            </template>
          </el-table-column>
          <!-- 邮编 -->
          <el-table-column
            :label="$t('platform.shopAddr.postCode')"
            prop="postCode"
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.postCode || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['platform:shopAddr:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.shopRefundAddrId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['platform:shopAddr:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.shopRefundAddrId, row)"
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
      v-show="pageVO.total>0"
      v-model:current-page="pageQuery.pageNum"
      v-model:page-size="pageQuery.pageSize"
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
import * as api from '@/api/platform/shop-addr'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = ''
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = reactive({
  mobile: null,
  consignee: null,
  isDefault: null
})
const addOrUpdateVisible = ref(false)
onMounted(() => {
  getPage()
})
const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
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
const onAddOrUpdate = (supplierRefundAddrId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(supplierRefundAddrId)
  })
}

const onDelete = (supplierRefundAddrId, row) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(supplierRefundAddrId))
}

const deleteById = (supplierRefundAddrId) => {
  api.deleteById(supplierRefundAddrId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

</script>
