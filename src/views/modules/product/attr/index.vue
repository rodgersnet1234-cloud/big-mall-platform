<template>
  <div class="app-container mod-attr">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="属性名称：">
            <el-input
              v-model="pageQuery.name"
              placeholder="属性名称"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item label="搜索参数：">
            <el-select
              v-model="pageQuery.searchType"
              placeholder="请选择搜索参数"
              :clearable="true"
            >
              <el-option
                label="否"
                value="0"
              />
              <el-option
                label="是"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onGetPage(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onClearSearchInfo()"
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
          v-permission="['product:attr:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 属性名称 -->
          <el-table-column
            :label="$t('product.attr.name')"
            prop="name"
            align="left"
          >
            <template #default="{row}">
              <span
                v-for="(name, index) in row.attrLangList"
                :key="index"
              >{{ language === name.lang ? name.name : '' }}</span>
            </template>
          </el-table-column>
          <!-- 属性描述 -->
          <!-- 0:不需要，1:需要 -->
          <el-table-column
            :label="$t('product.attr.searchType')"
            prop="searchType"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['否', '是'][row.searchType] }}</span>
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
                  v-permission="['product:attr:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.attrId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['product:attr:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.attrId)"
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
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="onGetPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetPage()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/product/attr'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
  onGetPage()
})

const language = computed(() => {
  return useAppStore().language === 'zh' ? 1 : 2
})

let tempSearchForm = null
const searchParam = {}
const pageLoading = ref(true)
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  attrType: null
})
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const onGetPage = (newData = false) => {
  pageLoading.value = true
  searchParam.attrType = 1
  if (newData || !tempSearchForm) {
    pageQuery.pageNum = 1
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(date => {
    pageVO.value = date
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref(null)
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (attrId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(attrId)
  })
}
const onDelete = (attrId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => onDeleteById(attrId))
}
const onDeleteById = (attrId) => {
  api.deleteById(attrId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => onGetPage()
    })
  })
}

// 清空搜索内容
const onClearSearchInfo = () => {
  pageQuery.name = ''
  pageQuery.attrType = null
  pageQuery.searchType = null
}

</script>
