<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item :label="'报表名称'+':'">
            <el-input
              v-model="pageQuery.formName"
              type="text"
              clearable
              :placeholder="'请输入报表名称'"
            />
          </el-form-item>
          <el-form-item :label="'报表类型'+':'">
            <el-select
              v-model="pageQuery.timeType"
              clearable
              :placeholder="'报表类型'"
            >
              <el-option
                v-for="item in reportType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
              {{ $t('table.clear') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:recommend:save']"
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
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          highlight-current-row
          row-key="formId"
        >
          <el-table-column
            type="index"
            label="序号"
            fixed
            width="80"
          />
          <el-table-column
            label="报表名称"
            prop="formName"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
          />
          <el-table-column label="报表类型">
            <template #default="scope">
              <span v-if="scope.row.timeType === 1">{{ '天' }}</span>
              <span v-if="scope.row.timeType === 2">{{ '周' }}</span>
              <span v-if="scope.row.timeType === 3">{{ '月' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="200"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-permission="['platform:recommend:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(`${scope.row.formId}`)"
                >
                  {{ $t("table.edit") }}
                </el-button>
                <el-button
                  v-if="scope.row.formId > 0"
                  v-permission="['platform:recommend:delete']"
                  type="primary"
                  link
                  @click="onDelete(`${scope.row.formId}`)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination
        v-show="pageVO.total > 0"
        v-model:page="pageQuery.pageNum"
        v-model:limit="pageQuery.pageSize"
        :total="pageVO.total"
        @pagination="onGetPage()"
      />
    </div>
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
import * as api from '@/api/form/form'
import { ElMessageBox, ElMessage } from 'element-plus'
let tempSearchForm = null // 保存上次点击查询的请求条件
const pageLoading = ref(false)
const addOrUpdateVisible = ref(false)
let isSubmit = false
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1,
  timeType: null,
  formName: ''
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const reportType = [
  {
    label: '天',
    value: 1
  }, {
    label: '周',
    value: 2
  }, {
    label: '月',
    value: 3
  }
]
onMounted(() => {
  isSubmit = false
  onGetPage()
})

// 获取数据列表
const onGetPage = (newData = false) => {
  pageLoading.value = true
  pageVO.value.list = []
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery.value }
  } else {
    tempSearchForm.pageSize = pageQuery.value.pageSize
    tempSearchForm.pageNum = pageQuery.value.pageNum
  }
  api.pageRecommendForm(tempSearchForm).then(isPageVO => {
    pageVO.value = isPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(id)
  })
}
// 删除
const onDelete = (id) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'),
    {
      confirmButtonText: $t('table.confirm'),
      cancelButtonText: $t('table.cancel'),
      type: 'warning'
    }).then(() => {
    if (isSubmit) {
      return
    }
    isSubmit = true
    api.deleteById(id).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => onGetPage()
      })
      isSubmit = false
    }).catch(() => {
      isSubmit = false
    })
  })
}
// 清空搜索内容
const onClearSearchInfo = () => {
  pageQuery.value.formName = ''
  pageQuery.value.timeType = null
}

</script>
<style lang="scss" scoped>
</style>
