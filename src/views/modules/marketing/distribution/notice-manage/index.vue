<template>
  <div class="page-notice app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        class="search-form"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            prop="msgTitle"
            :label="'通知标题：'"
          >
            <el-input
              v-model="searchForm.msgTitle"
              type="text"
              clearable
              :placeholder="'通知标题'"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button @click="onResetSearch(searchFormRef)">
              重置
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          class="all-check-btn"
          @change="handleCheckAllChange"
        >
          当页全选
        </el-checkbox>
        <el-button
          v-permission="['distribution:msg:deleteBatch']"
          :disabled="selectedMsgList.length <= 0"
          @click="onDelete()"
        >
          批量删除
        </el-button>
        <el-button
          v-permission="['distribution:msg:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          ref="msgTableRef"
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            type="selection"
            width="50"
          />
          <!-- 公告标题 -->
          <el-table-column
            label="通知标题"
            prop="msgTitle"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.msgTitle }}</span>
            </template>
          </el-table-column>
          <!-- 指定上线时间 -->
          <el-table-column
            label="开始时间"
            prop="startTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.startTime }}</span>
            </template>
          </el-table-column>
          <!-- 指定下线时间 -->
          <el-table-column
            label="结束时间"
            prop="endTime"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.endTime }}</span>
            </template>
          </el-table-column>
          <!-- 是否置顶(0 不置顶 1 置顶) -->
          <el-table-column
            label="是否置顶"
            prop="isTop"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.isTop === 1">{{ '置顶' }}</span>
              <span v-if="row.isTop === 0">{{ '不置顶' }}</span>
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
                v-permission="['distribution:msg:update']"
                link
                type="primary"
                @click="onAddOrUpdate(row.msgId)"
              >
                {{ $t('table.edit') }}
              </el-button>
              <el-button
                v-permission="['distribution:msg:delete']"
                link
                type="primary"
                @click="onDelete(row.msgId)"
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
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/distribution/notice/distribution-msg'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  msgTitle: null
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})
const checkAll = ref(false)
const isIndeterminate = ref(false)
const selectedMsgList = ref([])
const addOrUpdateVisible = ref(false)

onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = JSON.parse(JSON.stringify(searchForm))
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 监听表格选中
const handleSelectionChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === pageData.value.dataList.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < pageData.value.dataList.length
  // 提取出公告id列表
  const selectedMsgs = []
  if (value.length > 0) {
    value.forEach(item => {
      selectedMsgs.push(item.msgId)
    })
  }
  selectedMsgList.value = selectedMsgs
}

const msgTableRef = ref(null)
// 表格全选/全不选
const handleCheckAllChange = () => {
  msgTableRef.value?.toggleAllSelection()
  isIndeterminate.value = false
}

const addOrUpdateRef = ref(null)
const onAddOrUpdate = (msgId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(msgId)
  })
}

const onDelete = (msgId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(msgId))
}

const deleteById = (msgId) => {
  if (msgId != null) {
    selectedMsgList.value = [msgId]
  }
  if (selectedMsgList.value.length <= 0) {
    ElMessage({
      message: '请选择公告',
      type: 'warning'
    })
    return
  }
  api.deleteById(selectedMsgList.value).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
  })
}
</script>
<style lang="scss" scoped>
.all-check-btn {
  margin-right: 10px;
}
</style>
