<template>
  <div class="container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchParam"
        class="demo-form-inline"
        @submit.prevent
      >
        <div class="input-row">
          <el-form-item label="供应商名称">
            <el-input
              v-model="searchParam.supplierName"
              placeholder="供应商名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="供应商状态">
            <el-select
              v-model="searchParam.supplierStatus"
              placeholder="请选择供应商状态"
              clearable
            >
              <el-option
                label="停业中"
                value="0"
              />
              <el-option
                label="营业中"
                value="1"
              />
              <el-option
                label="平台下线"
                value="2"
              />
              <el-option
                v-if="paySettlementType===1"
                label="开店待审核"
                value="3"
              />
              <el-option
                label="上线待审核"
                value="5"
              />
              <el-option
                v-if="paySettlementType===1"
                label="上线审核失败"
                value="6"
              />
            </el-select>
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
    <!-- 列表相关区域 -->
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['platform:supplierManage:save']"
          type="primary"
          @click="createStore()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          row-key="imgId"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%;"
        >
          <!-- 供应商名称 -->
          <el-table-column
            label="供应商名称"
            align="left"
            width="200"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.supplierName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 供应商简介 -->
          <el-table-column
            label="供应商简介"
            prop=""
            align="center"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.intro || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 申请时间 -->
          <el-table-column
            label="申请时间"
            prop=""
            align="center"
            min-width="180"
          >
            <template #default="{row}">
              <span>{{ row.createTime || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 供应商状态 supplierStatus (-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:供应商申请中 5.审核失败 -->
          <el-table-column
            label="供应商状态"
            prop="supplierStatus"
            align="center"
            width="120px"
          >
            <template #default="{row}">
              <span
                v-if="row.supplierStatus === -1"
                type="danger"
              >未开通</span>
              <span
                v-if="row.supplierStatus === 0"
                type="danger"
              >停业中</span>
              <span
                v-if="row.supplierStatus === 1"
                type="success"
              >营业中</span>
              <span
                v-if="row.supplierStatus === 2"
                type="danger"
              >平台下线</span>
              <span
                v-if="row.supplierStatus === 3"
                type="warning"
              >开店待审核</span>
              <span
                v-if="row.supplierStatus === 4"
                type="warning"
              >供应商申请中</span>
              <span
                v-if="row.supplierStatus === 5"
                type="danger"
              >上线待审核</span>
              <span
                v-if="paySettlementType === 1 && row.supplierStatus === 6"
                type="danger"
              >上线审核失败</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            min-width="250"
          >
            <template #default="{row}">
              <el-button
                v-permission="['platform:shopManage:info']"
                link
                type="primary"
                @click="toShopDetailPage(row.supplierId)"
              >
                详情
              </el-button>
              <el-button
                v-if="row.supplierStatus < 3 && row.supplierStatus !== -1|| (row.supplierStatus === 6 && row.type === 1) && paySettlementType===1"
                v-permission="['platform:shopManage:update','platform:shopManage:updateCompany']"
                link
                type="primary"
                @click="toShopEditPage(row.supplierId)"
              >
                <i class="el-icon-edit" />编辑
              </el-button>
              <el-button
                v-if="row.supplierStatus === 1 || row.supplierStatus === 0"
                v-permission="['platform:shopManage:closeStore']"
                link
                type="primary"
                @click="offlineManageHandle(row, 'offline')"
              >
                <i class="el-icon-lock" />下线供应商
              </el-button>
              <el-button
                v-if="(row.supplierStatus === 2 || row.supplierStatus === 5)&&(paySettlementType!==1 || (paySettlementType===1 && row.companyInfoProcessStatus!==0))"
                v-permission="['platform:shopManage:openStore']"
                link
                type="primary"
                @click="offlineManageHandle(row, 'offlineManage')"
              >
                <i class="el-icon-unlock" />下线管理
              </el-button>
              <el-button
                v-permission="['platform:shopManage:updatePassword']"
                link
                type="primary"
                @click="accountManageHandle(row.supplierId)"
              >
                <i class="el-icon-setting" />账号管理
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
    <!-- 弹窗, 账号管理 -->
    <account-manage
      v-if="accountManageVisible"
      ref="accountManageRef"
      @refresh-data-list="getPage()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="offlineDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="offlineDataSubmit"
      @direct-online="directOnline"
    />
  </div>
</template>

<script setup>
import accountManage from './account-manage.vue'
import * as api from '@/api/platform/audit-supplier'
import { ElMessage } from 'element-plus'

const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 是否开启通联支付
let tempSearchForm = null // 保存上次点击查询的请求条件
// 当前选中的供应商id
const supplierId = ref('')
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
const searchParam = reactive({
  supplierName: '', // 供应商名称
  noticeMobile: '' // 接收短信号码
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// loading
const pageLoading = ref(true)
const accountManageVisible = ref(false)

const resaonIntError = ref(false)

// 违规下线对话框
const offlineDialogVisible = ref(false)
watchEffect((offlineReason) => {
  if (offlineReason) {
    resaonIntError.value = false
  }
})
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
  api.managePage(tempSearchForm).then(page => {
    pageVO.value = page
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const router = useRouter()

// 查看
const createStore = () => {
  router.push('/platform/supplier-process')
}

/**
 * 跳转到供应商详情页
 */
const toShopDetailPage = (supplierId) => {
  router.push('/platform/supplier-detail?supplierId=' + supplierId + '&pageType=' + 'toDetail')
}

/**
 * 跳转到供应商编辑页
 */
const toShopEditPage = (supplierId) => {
  router.push('/platform/supplier-edit?supplierId=' + supplierId)
}

const accountManageRef = ref(null)
// 账号管理
const accountManageHandle = (supplierId) => {
  accountManageVisible.value = true
  nextTick(() => {
    accountManageRef.value?.init(supplierId)
  })
}

const offlineDataRef = ref(null)
/**
 * 供应商违规下线操作
 */
const offlineManageHandle = (row, key) => {
  offlineDialogVisible.value = true
  supplierId.value = row.supplierId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineDetailByShopId(row.supplierId)
  }
}

/**
 * 获取最新供应商下线事件
 */
const getOfflineDetailByShopId = (supplierId) => {
  api.getEventsOfOfflineStores(supplierId).then((data) => {
    nextTick(() => {
      offlineDataRef.value.init('offlineManage', data, paySettlementType === 1 ? 'canDirectOnline' : '')
    })
  })
}

const isSubmit = ref(null)
/**
 * 直接上线供应商
 */
const directOnline = (data) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const param = {
    handleId: supplierId.value,
    eventId: data.eventId
  }
  api.onlineSupplier(param).then(() => {
    ElMessage({
      message: '供应商已上架',
      type: 'success',
      duration: 1000,
      onClose: () => {
        offlineDialogVisible.value = false
        getPage()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

/**
 * 下线
 */
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: supplierId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  api.closeStore(param).then(() => {
    offlineDialogVisible.value = false
    ElMessage({
      message: '供应商已下线',
      type: 'success',
      duration: 1000,
      onClose: () => {
        getPage()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

/**
 * 上架申请审核
 */
const offlineDataSubmit = (data) => {
  const param = {
    handleId: supplierId.value,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.onlineAudit(param).then(() => {
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => {
        offlineDialogVisible.value = false
        getPage()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
// 清空搜索内容
const clearSearchInfo = () => {
  searchParam.supplierName = ''
  searchParam.type = null
  searchParam.supplierStatus = null
  searchParam.isPreferred = null
}

</script>
