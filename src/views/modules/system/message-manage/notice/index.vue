<template>
  <div class="app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="公告标题："
            prop="title"
          >
            <el-input
              v-model="searchParam.title"
              placeholder="公告标题"
              maxlength="30"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="是否置顶："
            prop="isTop"
          >
            <el-select
              v-model="searchParam.isTop"
              clearable
              placeholder="公告是否置顶"
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
          <el-form-item
            label="类型："
            prop="type"
          >
            <el-select
              v-model="searchParam.type"
              clearable
              placeholder="类型"
            >
              <el-option
                label="在商家端展示"
                value="1"
              />
              <el-option
                label="在用户端展示"
                value="2"
              />
              <el-option
                label="在供应商端展示"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="公告状态："
            prop="status"
          >
            <el-select
              v-model="searchParam.status"
              clearable
              placeholder="公告状态"
            >
              <el-option
                label="撤销"
                value="0"
              />
              <el-option
                label="公布"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="getPage(true)"
            >
              查询
            </el-button>
            <el-button
              icon="el-icon-delete"
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- <el-button icon="el-icon-search" class="filter-item" @click="getPage()">{{ $t('table.search') }}</el-button> -->
    </div>

    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:notice:save']"
          icon="el-icon-plus"
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
          <!-- 公告标题 -->
          <el-table-column
            :label="$t('platform.notice.title')"
            prop="title"
            align="left"
            width="500"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.title }}</span>
            </template>
          </el-table-column>
          <!-- 是否置顶 -->
          <el-table-column
            :label="$t('platform.notice.isTop')"
            prop="isTop"
            align="center"
          >
            <template #default="{row}">
              <span :type="row.isTop === 0 ? 'warning' : ''">{{ ['否','是'][row.isTop] }}</span>
            </template>
          </el-table-column>
          <!-- 是否置顶 -->
          <el-table-column
            :label="$t('platform.notice.type')"
            prop="type"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.exhibition }}</span>
            </template>
          </el-table-column>
          <!-- 发布时间 -->
          <el-table-column
            :label="$t('platform.notice.publishTime')"
            prop="publishTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.publishTime }}</span>
            </template>
          </el-table-column>
          <!-- 状态(1:公布 0:撤回) -->
          <el-table-column
            :label="$t('platform.notice.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span :type="row.status === 0 ? 'danger' : ''">{{ ['撤销','公布'][row.status] }}</span>
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
                v-permission="['platform:notice:update']"
                type="text"
                @click="onAddOrUpdate(row.id)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['platform:notice:delete']"
                type="text"
                @click="onDelete(row.id)"
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
      v-if="pageVO.total>0"
      v-model:page="searchParam.pageNum"
      v-model:limit="searchParam.pageSize"
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
import Pagination from '@/components/Pagination/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/platform/notice'
// 表单
const searchForm = reactive({
  title: ''
})
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref()
const searchParam = reactive({
  pageSize: 10,
  pageNum: 1,
  title: '',
  startTime: null,
  endTime: null
})
const pageLoading = ref(true)
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}
const getPage = () => {
  pageLoading.value = true
  api.page(searchParam).then(res => {
    pageVO.list = res.list
    pageVO.pages = res.pages
    pageVO.total = res.total
    pageLoading.value = false
  }).catch(err => {
    console.log(err)
    pageLoading.value = false
  })
}

const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(id)
  })
}

onMounted(() => {
  getPage()
})
</script>
