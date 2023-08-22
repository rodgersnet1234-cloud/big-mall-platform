<template>
  <div class="app-container mod-spu-tag">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <!-- 分组名称 -->
        <div class="input-row">
          <el-form-item :label="$t('product.spuTag.tagName') + '：'">
            <el-input
              v-model="searchParam.title"
              :placeholder="$t('product.spuTag.tagName')"
              maxlength="36"
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
          v-permission="['product:spuTag:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t("table.create") }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="page.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 分组名称 -->
          <el-table-column
            :label="$t('product.spuTag.tagName')"
            prop="title"
            align="center"
          />

          <!-- 分组类型 -->
          <el-table-column
            :label="$t('product.spuTag.type')"
            prop="isDfault"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.isDefault === 0">{{
                $t("product.spuTag.customType")
              }}</span>
              <span v-else>{{ $t("product.spuTag.defaultType") }}</span>
            </template>
          </el-table-column>

          <!-- 商品数量 -->
          <el-table-column
            :label="$t('product.spuTag.prodCount')"
            prop="prodCount"
            align="center"
          />
          <!-- 排序号 -->
          <el-table-column
            :label="$t('product.spuTag.seq')"
            prop="seq"
            align="center"
          />
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
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
              <span>{{ row.updateTime }}</span>
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
                  v-permission="['product:spuTag:update']"
                  link
                  type="primary"
                  @click="onAddOrUpdate(row.id)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-permission="['product:spuTag:addProdForTag']"
                  link
                  type="primary"
                  @click="prodHandle(row.id)"
                >
                  {{ $t("product.spuTag.prodManage") }}
                </el-button>
                <el-button
                  v-permission="['product:spuTag:delete']"
                  link
                  type="primary"
                  @click.stop="onDelete(row.id)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="page.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="page.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
    <!-- <prod-manage
      v-if="prodManageVisible"
      ref="prodManageRef"
      @refreshDataList="refreshChange"
    /> -->
  </div>
</template>

<script setup>
import Pagination from '@/components/pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/product/spu-tag'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件
const dataList = ref([])
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
const searchParam = reactive({
  title: ''
})
const searchForm = reactive({})
const dataListLoading = ref(false)
const prodManageVisible = ref(false)
const addOrUpdateVisible = ref(false)

onMounted(() => {
  getPage()
})

const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  dataListLoading.value = true
  api.page(tempSearchForm).then(pageVO => {
    page.list = pageVO.list
    page.total = pageVO.total
    page.pages = pageVO.pages
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}
const route = useRouter()
/**
 * 管理分组商品
 */
const prodHandle = (id) => {
  // visible.value = false
  route.push({
    path: '/product/tag-prod',
    query: { id }
  })
}
const onDelete = (spuId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(spuId))
}
const deleteById = (spuId) => {
  api.deleteById(spuId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
// 刷新回调用
const refreshChange = () => {
  console.log('dddd')
  getPage()
}
const onSearch = () => {
  getPage()
}
// 清空搜索内容
const clearSearchInfo = () => {
  searchParam.title = ''
}

</script>

<style lang="scss" scoped>
</style>
