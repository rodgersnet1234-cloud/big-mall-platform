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
          <el-form-item label="品牌名称：">
            <el-input
              v-model="searchForm.name"
              placeholder="品牌名称"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item label="首字母：">
            <el-input
              v-model="searchForm.firstLetter"
              maxlength="1"
              placeholder="首字母"
              clearable
            />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              :clearable="true"
            >
              <el-option
                :label="$t('product.category.offline')"
                value="0"
              />
              <el-option
                :label="$t('product.category.normal')"
                value="1"
              />
            </el-select>
          </el-form-item>
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
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['product:brand:save']"
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
          :data="page.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 品牌logo图片 -->
          <el-table-column
            :label="$t('product.brand.imgUrl')"
            prop="imgUrl"
            align="center"
            min-width="100"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <ImgShow :src="row.imgUrl" />
              </div>
            </template>
          </el-table-column>
          <!-- 品牌名称 -->
          <el-table-column
            :label="$t('product.brand.name')"
            prop="name"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <!-- 品牌描述 -->
          <el-table-column
            :label="$t('product.brand.desc')"
            prop="desc"
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.desc || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 检索首字母 -->
          <el-table-column
            :label="$t('product.brand.firstLetter')"
            prop="firstLetter"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.firstLetter }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
            min-width="180"
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
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.updateTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 排序 -->
          <el-table-column
            :label="$t('product.brand.seq')"
            prop="seq"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 状态 1:enable, 0:disable, -1:deleted -->
          <el-table-column
            :label="$t('product.brand.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.status === 0">{{ $t("product.category.offline") }}</span>
              <span v-else>{{ $t("product.category.normal") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            fixed="right"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['product:brand:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.brandId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="row.status === 0"
                  v-permission="['product:brand:updateStatus']"
                  link
                  type="primary"
                  @click="enableOrDisable(row.brandId,row.status)"
                >
                  <!-- 上架 -->
                  {{ $t('action.putOnShelf') }}
                </el-button>
                <el-button
                  v-if="row.status === 1"
                  v-permission="['product:brand:updateStatus']"
                  link
                  type="primary"
                  @click="enableOrDisable(row.brandId,row.status)"
                >
                  <!-- 下架 -->
                  {{ $t('action.offShelf') }}
                </el-button>
                <el-button
                  v-permission="['product:brand:delete']"
                  link
                  type="primary"
                  @click="onDelete(row.brandId)"
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
      v-show="page.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="page.total"
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
import * as api from '@/api/product/brand'
import { ElMessageBox, ElMessage } from 'element-plus'

onMounted(() => {
  getPage()
})

let tempSearchForm = null // 保存上次点击查询的请求条件
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const page = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
// 查询参数
const searchForm = ref({})
const addOrUpdateVisible = ref(false)

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchForm.value }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    page.list = data.list
    page.total = data.total
    page.pages = data.pages
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (brandId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(brandId)
  })
}
const onDelete = (brandId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(brandId))
}
const deleteById = (brandId) => {
  api.deleteById(brandId).then(() => {
    page.total = page.total - 1
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

/**
 * 上架/下架品牌
 */
const enableOrDisable = (brandId, sts) => {
  const brandObj = {}
  brandObj.brandId = brandId
  brandObj.status = sts === 0 ? 1 : 0
  ElMessageBox.confirm(sts === 1 ? '下架当前品牌后，当前品牌下的所有商品也将被下架，是否确认下架当前品牌?' : '是否确认上架当前品牌?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.enableOrDisable(brandObj).then((data) => {
      ElMessage({
        message: data || '操作成功',
        type: data ? 'error' : 'success',
        duration: 1500,
        onClose: () => getPage()
      })
    })
  }).catch(() => { })
}
// 清空搜索内容
const onResetSearch = () => {
  searchForm.value.name = ''
  searchForm.value.firstLetter = ''
  searchForm.value.status = null
}

</script>

<style lang="scss" scoped>
.search-bar :deep(.el-button) {
  margin-bottom: 18px;
}
</style>
