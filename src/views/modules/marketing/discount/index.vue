<template>
  <div class="page-discount app-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item
            :label="$t('discount.discount.shopName') + '：'"
            prop="shopName"
          >
            <el-input
              v-model="searchForm.shopName"
              :placeholder="$t('discount.discount.shopName')"
              maxlength="20"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('discount.discount.actName') + '：'"
            prop="discountName"
          >
            <el-input
              v-model="searchForm.discountName"
              :placeholder="$t('discount.discount.actName')"
              maxlength="50"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('discount.discount.typeOfActivity') + '：'"
            prop="discountRule"
          >
            <el-select
              v-model="searchForm.discountRule"
              placeholder="请选择活动类型"
              clearable
            >
              <el-option
                :label="$t('discount.discount.fullMoneoney')"
                value="0"
              />
              <el-option
                :label="$t('discount.discount.fullMoneyDiscount')"
                value="3"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('discount.discount.status') + '：'"
            prop="status"
          >
            <el-select
              v-model="searchForm.status"
              placeholder="请选择活动状态"
              clearable
            >
              <el-option
                :label="$t('discount.discount.close')"
                value="0"
              />
              <el-option
                :label="$t('discount.discount.turnOn')"
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
          :data="pageData.dataList"
          stripe
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          row-key="imgId"
          highlight-current-row
          style="width: 100%"
        >
          <!-- 店铺名称 -->
          <el-table-column
            :label="$t('table.shopName')"
            prop="shopName"
            align="center"
            width="300px"
          >
            <template #default="{ row }">
              <span>{{ row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 名称 -->
          <el-table-column
            :label="$t('discount.discount.actName')"
            prop="discountName"
            align="center"
            width="300px"
          >
            <template #default="{ row }">
              <span>{{ row.discountName }}</span>
            </template>
          </el-table-column>
          <!-- 移动端活动图 -->
          <el-table-column
            min-width="130"
            align="center"
            :label="$t('discount.discount.mobiltyDiagram')"
          >
            <template #default="scope">
              <div class="table-cell-image">
                <ImgShow
                  :src="scope.row.mobilePic"
                  :img-alt="scope.row.prodName"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 创建时间 -->
          <el-table-column
            :label="$t('table.createTime')"
            prop="createTime"
            align="center"
            min-width="180"
          >
            <template #default="{ row }">
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
            <template #default="{ row }">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
          <!-- 活动类型 -->
          <el-table-column
            :label="$t('discount.discount.typeOfActivity')"
            prop="status"
            align="center"
          >
            <template #default="{ row }">
              <!-- 满钱减钱 -->
              <span v-if="row.discountRule === 0">{{ $t('discount.discount.fullMoneoney') }}</span>
              <!-- 满件打折 -->
              <span v-else-if="row.discountRule === 3">{{ $t('discount.discount.fullMoneyDiscount') }}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column
            :label="$t('table.status')"
            prop="status"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="row.status === 0">{{ $t("discount.discount.close") }}</span>
              <span v-else-if="row.status === 1">{{ $t("discount.discount.turnOn") }}</span>
              <span v-else-if="row.status === 2">违规下架</span>
              <span v-else-if="row.status === 3">等待审核</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            fixed="right"
            width="230"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['marketing:discount:info']"
                  type="text"
                  @click="onAddOrUpdate(row.discountId)"
                >
                  {{ $t("table.view") }}
                </el-button>
                <!--   优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
                <el-button
                  v-if="row.status < 2"
                  v-permission="['marketing:discount:offline']"
                  type="text"
                  @click="onOfflineManage(row, 'offline')"
                >
                  下线活动
                </el-button>
                <el-button
                  v-if="row.status === 2 || row.status === 3"
                  v-permission="['marketing:discount:audit']"
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
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
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
import * as api from '@/api/discount/discount'
import { ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  shopName: '',
  discountName: '',
  discountRule: null,
  status: null
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

const isSubmit = ref(false)
const operateDialogVisible = ref(false) // 下线管理弹窗
const offlineDataRef = ref(null)
const offlineDetail = ref({})
const discountId = ref(null)

onMounted(() => {
  discountId.value = null
  isSubmit.value = false
  getPageData()
})

// 获取数据列表
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

const router = useRouter()
// 新增
const onAddOrUpdate = (id) => {
  router.push({
    path: '/marketing/discount/add-or-update',
    query: {
      discountId: id
    }
  })
}

// 商品违规下架操作
const onOfflineManage = (row, key) => {
  operateDialogVisible.value = true
  discountId.value = row.discountId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineDetail(row.discountId)
  }
}

// 获取最新下线商品的事件
const getOfflineDetail = (rowDiscountId) => {
  api.getOfflineHandleEvent(rowDiscountId).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    })
  })
}

// 下架
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: discountId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.offline(param).then(() => {
    operateDialogVisible.value = false
    ElMessage({
      message: '活动已下架',
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
    handleId: discountId.value,
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
