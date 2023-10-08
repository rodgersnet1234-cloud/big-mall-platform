<template>
  <div class="app-container mod-hot-search">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="热搜标题：">
            <el-input
              v-model="pageQuery.title"
              placeholder="热搜标题"
              maxlength="36"
            />
          </el-form-item>
          <el-form-item label="热搜内容：">
            <el-input
              v-model="pageQuery.content"
              placeholder="热搜内容"
            />
          </el-form-item>
          <el-form-item label="启用状态：">
            <el-select
              v-model="pageQuery.status"
              placeholder="启用状态"
              clearable
            >
              <el-option
                label="启用"
                value="1"
              />
              <el-option
                label="未启用"
                value="0"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="热搜类型：">
            <el-select
              v-model="pageQuery.type"
              placeholder="热搜类型"
              clearable
            >
              <el-option
                label="商品"
                value="1"
              />
              <el-option
                label="店铺"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getSearchList(true)"
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

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:hotSearch:save']"
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
          <!-- 热搜标题 -->
          <el-table-column
            :label="$t('platform.hotSearch.title')"
            prop="title"
            align="left"
            width="300"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.title }}</span>
            </template>
          </el-table-column>
          <!-- 内容 -->
          <el-table-column
            :label="$t('platform.hotSearch.content')"
            prop="content"
            align="left"
            width="300"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.content }}</span>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('platform.hotSearch.createDate')"
            prop="createTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 顺序 -->
          <el-table-column
            :label="$t('platform.hotSearch.seq')"
            prop="seq"
            align="center"
            min-width="150"
          >
            <template #default="{row}">
              <span>{{ row.seq }}</span>
            </template>
          </el-table-column>
          <!-- 状态 0下线 1上线 -->
          <el-table-column
            :label="$t('platform.hotSearch.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span
                v-if="row.status === 0"
                type="danger"
              >{{ '未启用' }}</span>
              <span
                v-else
              >{{ '启用' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="热搜类型"
            prop="content"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.type === 1 ? '商品' : '店铺' }}</span>
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
              <el-button
                v-permission="['platform:hotSearch:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.hotSearchId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['platform:hotSearch:delete']"
                link
                type="primary"
                @click="onDelete(row.hotSearchId)"
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
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/platform/hot-search'
import { ElMessageBox, ElMessage } from 'element-plus'
// 保存上次点击查询的请求条件
let tempSearchForm = reactive({})
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  title: null,
  content: null,
  status: null,
  type: null
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const pageLoading = ref(true)
// 查询参数
const searchParam = reactive({})
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
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    Object.assign(pageVO, data)
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const addOrUpdateRef = ref('')
const onAddOrUpdate = (hotSearchId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(hotSearchId)
  })
}
const onDelete = (hotSearchId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(hotSearchId))
}

const deleteById = (hotSearchId) => {
  api.deleteById(hotSearchId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

const getSearchList = (newData = false) => {
  pageQuery.pageNum = 1
  // 若请求参数某项没值，则不传此参数
  pageQuery.title = pageQuery.title || null
  pageQuery.content = pageQuery.content || null
  pageQuery.status = pageQuery.status || null
  pageQuery.type = pageQuery.type || null
  getPage(newData)
}

const clearSearchInfo = () => {
  // 若请求参数某项没值，则不传此参数
  pageQuery.title = null
  pageQuery.content = null
  pageQuery.status = null
  pageQuery.type = null
}

</script>
