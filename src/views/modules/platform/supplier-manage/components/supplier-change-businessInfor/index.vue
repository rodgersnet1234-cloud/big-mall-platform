<template>
  <div class="supplier-change-businessInfor">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="供应商名称：">
            <el-input
              v-model="searchParam.supplierName"
              placeholder="供应商名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="申请时间: ">
            <el-date-picker
              v-model="timer"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
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
              @click="clearSearchInfo()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 表单内容 -->
    <div class="main-content">
      <div class="table-con">
        <el-table
          :key="activeName"
          v-loading="pageLoading"
          :data="pageVO.list"
          row-key="imgId"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <el-table-column
            label="供应商名称"
            align="left"
            width="auto"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.supplierName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="供应商简介"
            align="center"
            width="auto"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.intro || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申请时间"
            align="center"
            width="auto"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template #default="{row}">
              <el-button
                type="primary"
                link
                @click="toAudit(row.supplierId)"
              >
                审核
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹框 -->
    <audit-pop
      v-if="isAuditPop"
      ref="auditPopRef"
      @close-pop="closeAuditPop"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/platform/audit-shop'
import auditPop from './audit-pop.vue'
defineProps({
  activeName: {
    type: String,
    default: ''
  }
})

const timer = ref('')
const isAuditPop = ref(false)
// 搜索内容
const searchParam = reactive({
  supplierName: '',
  beginTime: '',
  endTime: ''
})
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
// 申请列表
const pageLoading = ref(false)
// // 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
onMounted(() => {
  getApplicationList()
})

// 获取审核列表数据
const getApplicationList = () => {
  pageLoading.value = true
  api.getSupplierCompanyAuditingPage(pageQuery.value).then(res => {
    pageVO.value = res
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const clearSearchInfo = () => {
  timer.value = ''
  for (const key in searchParam) {
    searchParam[key] = ''
  }
}
const getPage = (tag = false) => {
  searchParam.beginTime = ''
  searchParam.endTime = ''
  // 处理时间
  if (tag == true) {
    if (timer.value && timer.value.length > 0) {
      searchParam.beginTime = timer.value[0]
      searchParam.endTime = timer.value[1]
    }
    Object.assign(pageQuery.value, searchParam)
  }
  getApplicationList()
}
const auditPopRef = ref(null)
const toAudit = (id) => {
  isAuditPop.value = true
  nextTick(() => {
    auditPopRef.value?.init(id)
  })
}
const closeAuditPop = () => {
  isAuditPop.value = false
  nextTick(() => {
    getApplicationList()
  })
}

</script>

<style lang="scss" scoped>

</style>
