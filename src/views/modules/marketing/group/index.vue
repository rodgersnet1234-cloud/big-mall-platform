<template>
  <div class="page-group app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="$t('group.shopName') + '：'"
            prop="shopName"
          >
            <el-input
              v-model="searchForm.shopName"
              :placeholder="$t('group.shopName')"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('group.activityName') + '：'"
            prop="activityName"
          >
            <el-input
              v-model="searchForm.activityName"
              :placeholder="$t('group.activityName')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('group.status') + '：'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
              @click="onResetSearch(searchFormRef)"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="main-content">
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          class="el-table"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 店铺名称 -->
          <el-table-column
            :label="$t('group.shopName')"
            prop="shopName"
            align="left"
            width="280"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 活动名称 -->
          <el-table-column
            :label="$t('group.activityName')"
            prop="activityName"
            align="left"
            width="280"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.activityName }}</span>
            </template>
          </el-table-column>
          <!-- 商品信息 -->
          <el-table-column
            class="table-item"
            :label="$t('group.prodInfo')"
            width="320"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainImgUrl" />
                </div>
                <div class="table-cell-text">
                  {{ row.spuName }}
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 成团人数 -->
          <el-table-column
            :label="$t('group.groupsNum')"
            prop="groupOrderCount"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <span>{{ row.groupNumber }}</span>
            </template>
          </el-table-column>
          <!-- 活动开始时间（活动状态：未开始、经行中、已结束） -->
          <el-table-column
            :label="$t('group.startTime')"
            prop="startTime"
            align="center"
            min-width="200"
          >
            <template #default="{row}">
              <span>{{ row.startTime }}</span>
            </template>
          </el-table-column>
          <!-- 活动结束时间（活动状态：未开始、经行中、已结束） -->
          <el-table-column
            :label="$t('group.endTime')"
            prop="endTime"
            align="center"
            min-width="200"
          >
            <template #default="{row}">
              <span>{{ row.endTime }}</span>
            </template>
          </el-table-column>
          <!-- 已成团订单数（统计） -->
          <el-table-column
            :label="$t('group.groupOrderCount')"
            prop="groupOrderCount"
            align="center"
            width="120"
          >
            <template #default="{row}">
              <span>{{ row.groupOrderCount }}</span>
            </template>
          </el-table-column>
          <!-- 已成团人数（统计） -->
          <el-table-column
            :label="$t('group.groupNumberCount')"
            prop="groupNumberCount"
            align="center"
            width="120"
          >
            <template #default="{row}">
              <span>{{ row.groupNumberCount }}</span>
            </template>
          </el-table-column>
          <!-- 拼团状态(-1:删除、0:未启用、1:启用、2:违规下架、3:等待审核 4:已失效 5:已结束) -->
          <el-table-column
            :label="$t('group.status')"
            prop="status"
            align="center"
            width="100"
          >
            <template #default="{row}">
              <span v-if="row.status === 0">未启用</span>
              <span v-else-if="row.status === 1">启用</span>
              <span v-else-if="row.status === 2">违规下架</span>
              <span v-else-if="row.status === 3">等待审核</span>
              <span v-else-if="row.status === 4">已失效</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            min-width="180"
            fixed="right"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['marketing:group:info']"
                  type="text"
                  @click="onAddOrUpdate(row.groupActivityId)"
                >
                  {{ $t('table.view') }}
                </el-button>
                <el-button
                  v-if="row.status < 2"
                  v-permission="['marketing:group:offline']"
                  type="text"
                  @click="onOfflineManage(row, 'offline')"
                >
                  下线活动
                </el-button>
                <el-button
                  v-if="row.status === 2 || row.status === 3"
                  v-permission="['marketing:group:audit']"
                  type="text"
                  @click="onOfflineManage(row, 'offlineManage')"
                >
                  {{ row.status === 2 ? '下线管理' : '审核申请' }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageData.total>0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPageData()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="offlineDataSubmit"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/group/group'
import OfflineManage from '@/components/offline-manage/index.vue'
import { ElMessage } from 'element-plus'

let tempSearchForm = null
// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  activityName: null,
  status: null,
  shopName: ''
})
// 返回参数
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const groupActivityId = ref(null)
const isSubmit = ref(false)
const addOrUpdateVisible = ref(false)
const operateDialogVisible = ref(false)
const offlineDetail = ref({})

const statusOptions = [{
  value: 0,
  label: '未启用'
}, {
  value: 1,
  label: '启用'
}, {
  value: 2,
  label: '平台下架'
}, {
  value: 3,
  label: '等待审核'
}, {
  value: 4,
  label: '已失效'
}]
onMounted(() => {
  isSubmit.value = false
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageNum = searchForm.pageNum
    tempSearchForm.pageSize = searchForm.pageSize
  }
  pageLoading.value = true
  addOrUpdateVisible.value = false
  api.page(tempSearchForm).then(data => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const getSearchList = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const addOrUpdateRef = ref(null)
const onAddOrUpdate = (rowGroupActivityId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(rowGroupActivityId)
  })
}

const offlineDataRef = ref(null)
// 商品违规下架操作
const onOfflineManage = (row, key) => {
  operateDialogVisible.value = true
  groupActivityId.value = row.groupActivityId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineHandleEvent(row.groupActivityId)
  }
}

// 获取最新下线商品的事件
const getOfflineHandleEvent = (groupActivityId) => {
  api.getOfflineHandleEvent(groupActivityId).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    })
  })
}
// 下线
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: groupActivityId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.offline(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '活动已下线',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

// 上架申请审核
const offlineDataSubmit = (data) => {
  const param = {
    handleId: groupActivityId.value,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.apply(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
</script>
<style lang="scss" scoped>
:deep(.el-table__fixed::before) {
  height: 0 !important;
}
:deep(.el-table__fixed-right::before) {
  height: 0 !important;
}
</style>
