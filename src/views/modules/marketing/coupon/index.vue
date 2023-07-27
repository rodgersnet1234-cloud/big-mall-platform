<template>
  <div class="page-coupon app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            label="优惠券名称："
            prop="couponName"
          >
            <el-input
              v-model="searchForm.couponName"
              maxlength="20"
              placeholder="优惠券名称"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="优惠券类型："
            prop="couponType"
          >
            <el-select
              v-model="searchForm.couponType"
              placeholder="请选择优惠券类型"
              clearable
            >
              <el-option
                label="代金券"
                value="1"
              />
              <el-option
                label="折扣券"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="过期状态："
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="请选择优惠券过期状态"
              clearable
            >
              <el-option
                label="过期"
                value="0"
              />
              <el-option
                label="未过期"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态："
            prop="putonStatus"
          >
            <el-select
              v-model="searchForm.putonStatus"
              placeholder="请选择优惠券状态"
              clearable
            >
              <el-option
                label="取消投放"
                value="-1"
              />
              <el-option
                label="自动投放"
                value="0"
              />
              <el-option
                label="投放"
                value="1"
              />
              <el-option
                label="违规下架"
                value="2"
              />
              <el-option
                label="等待审核"
                value="3"
              />
              <el-option
                label="暂不投放"
                value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPageData(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              @click="onResetSearch(searchFormRef)"
            >
              重置
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
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 店铺名称 -->
          <el-table-column
            :label="$t('table.shopName')"
            prop="couponName"
            align="left"
            width="160"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 优惠券名称 -->
          <el-table-column
            :label="$t('coupon.coupon.couponName')"
            prop="couponName"
            align="center"
            min-width="100"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.couponName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 优惠类型 1:代金券 2:折扣券 3:兑换券 -->
          <el-table-column
            :label="$t('coupon.coupon.couponType')"
            prop="couponType"
            align="center"
            min-width="100"
          >
            <template #default="{row}">
              <span>{{ ['', '代金券', '折扣券', '兑换券'][row.couponType] }}</span>
            </template>
          </el-table-column>
          <!-- 开始时间 -->
          <el-table-column
            :label="$t('coupon.coupon.startTime')"
            prop="startTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.startTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 结束时间 -->
          <el-table-column
            :label="$t('coupon.coupon.endTime')"
            prop="endTime"
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.endTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 优惠券状态 0:过期 1:未过期 -1:删除 -->
          <el-table-column
            :label="$t('coupon.coupon.status')"
            prop="status"
            align="center"
          >
            <template #default="{row}">
              <span>{{ ['过期','未过期'][row.status] }}</span>
              <span v-if="row.status === -1">删除</span>
            </template>
          </el-table-column>
          <!-- 优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
          <el-table-column
            :label="$t('coupon.coupon.putonStatus')"
            prop="putonStatus"
            align="center"
          >
            <template #default="{row}">
              <span v-if="row.putonStatus === -1">取消投放</span>
              <span v-if="row.putonStatus === 0">自动投放</span>
              <span v-if="row.putonStatus === 1">投放</span>
              <span v-if="row.putonStatus === 2">违规下架</span>
              <span v-if="row.putonStatus === 3">等待审核</span>
              <span v-if="row.putonStatus === 4">暂不投放</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('coupon.coupon.deliveryTime')"
            prop="launchTime"
            align="center"
            min-width="180"
          >
            <template #default="{ row }">
              {{ row.launchTime || '-' }}
            </template>
          </el-table-column>
          <!-- 库存 -->
          <el-table-column
            :label="$t('coupon.coupon.stocks')"
            prop="stocks"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.stocks || '-' }}</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
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
                  v-permission="['shop:coupon:info']"
                  type="text"
                  @click="onAddOrUpdate(row.couponId)"
                >
                  {{ $t("table.view") }}
                </el-button>
                <!--   优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
                <el-button
                  v-if="row.putonStatus < 2 && row.status === 1"
                  v-permission="['shop:coupon:offline']"
                  type="text"
                  @click="onOfflineManage(row, 'offline')"
                >
                  下线活动
                </el-button>
                <el-button
                  v-if="row.putonStatus === 2 && row.status === 1"
                  v-permission="['shop:coupon:offline:manage']"
                  type="text"
                  @click="onOfflineManage(row, 'offlineManage')"
                >
                  下线管理
                </el-button>
                <el-button
                  v-if="row.putonStatus === 3 && row.status === 1"
                  v-permission="['shop:coupon:audit']"
                  type="text"
                  @click="onOfflineManage(row, 'offlineManage')"
                >
                  审核申请
                </el-button>
              </div>
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

    <!-- 下架管理 -->
    <offline-manage
      v-if="operateDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="onOfflineDataSubmit"
    />
    <!-- 下架管理 end -->
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/coupon/coupon'
import { ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  couponName: '',
  couponType: '',
  getWay: '',
  status: null,
  putonStatus: null
})

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

const isSubmit = ref(false)
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const operateDialogVisible = ref(false)
const couponId = ref(null)
const offlineDataRef = ref(null)
const offlineDetail = ref({})

onMounted(() => {
  isSubmit.value = false
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
  api.page(tempSearchForm).then(res => {
    pageData.value.dataList = res.list
    pageData.value.pages = res.pages
    pageData.value.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const onAddOrUpdate = (couponId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(couponId)
  })
}

/**
 * 商品违规下架操作
 */
const onOfflineManage = (row, key) => {
  operateDialogVisible.value = true
  couponId.value = row.couponId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineHandleEvent(row.couponId)
  }
}

/**
 * 获取最新下线商品的事件
 */
const getOfflineHandleEvent = (couponId) => {
  api.getOfflineHandleEvent(couponId).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    })
  })
}
// 下线
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: couponId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.offline(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '优惠券已下架',
      type: 'success',
      duration: 1000,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
/**
 * 上架申请审核
 */
const onOfflineDataSubmit = (data) => {
  const param = {
    handleId: couponId,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.audit(param).then(() => {
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
