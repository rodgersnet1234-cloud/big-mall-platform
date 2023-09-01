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
          <el-form-item label="店铺名称">
            <el-input
              v-model="searchParam.shopName"
              placeholder="店铺名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="店铺类型">
            <el-select
              v-model="searchParam.type"
              placeholder="请选择店铺类型"
              clearable
            >
              <el-option
                label="自营店"
                value="1"
              />
              <el-option
                label="第三方店铺"
                value="2"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="店铺状态">
            <el-select
              v-model="searchParam.shopStatus"
              placeholder="请选择店铺状态"
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
          <el-form-item label="店铺标签">
            <el-select
              v-model="searchParam.isPreferred"
              placeholder="请选择店铺标签"
              clearable
            >
              <el-option
                label="普通店铺"
                value="0"
              />
              <el-option
                label="优选好店"
                value="1"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="getPage(true)"
            >
              查询
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
          v-permission="['platform:shopManage:save']"
          type="primary"
          @click="createStore()"
        >
          {{ $t('table.create') }}
        </el-button>
        <el-button
          @click="onCopyLink()"
        >
          {{ $t('table.getLink') }}
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
          <!-- 店铺名称 -->
          <el-table-column
            label="店铺名称"
            align="left"
            width="200"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.shopName || '-' }}</span>
            </template>
          </el-table-column>
          <!-- 店铺类型1自营店 2普通店 -->
          <el-table-column
            label="店铺类型"
            prop="type"
            align="center"
            width="120"
          >
            <template #default="{row}">
              <span v-if="row.type === 1">自营店</span>
              <span v-if="row.type === 2">第三方店铺</span>
            </template>
          </el-table-column>
          <!-- 店铺logo -->
          <el-table-column
            label="店铺logo"
            prop="imgUrl"
            align="center"
            width="200"
          >
            <template
              #default="{row}"
            >
              <div
                v-if="row.shopLogo"
                class="table-cell-image"
              >
                <ImgShow :src="row.shopLogo" />
              </div>
            </template>
          </el-table-column>
          <!-- 店铺简介 -->
          <el-table-column
            label="店铺简介"
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
          <!-- 店铺状态 shopStatus (-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:店铺申请中 5.审核失败 -->
          <el-table-column
            label="店铺状态"
            prop="shopStatus"
            align="center"
            width="120px"
          >
            <template #default="{row}">
              <span
                v-if="row.shopStatus === -1"
                type="danger"
              >未开通</span>
              <span
                v-if="row.shopStatus === 0"
                type="danger"
              >停业中</span>
              <span
                v-if="row.shopStatus === 1"
                type="success"
              >营业中</span>
              <span
                v-if="row.shopStatus === 2"
                type="danger"
              >平台下线</span>
              <span
                v-if="row.shopStatus === 3"
                type="warning"
              >开店待审核</span>
              <span
                v-if="row.shopStatus === 4"
                type="warning"
              >店铺申请中</span>
              <span
                v-if="row.shopStatus === 5"
                type="danger"
              >上线待审核</span>
              <span
                v-if="paySettlementType===1 && row.shopStatus === 6"
                type="danger"
              >上线审核失败</span>
            </template>
          </el-table-column>
          <!-- 店铺标签  -->
          <el-table-column
            label="店铺标签"
            prop="shopStatus"
            align="center"
            width="120px"
          >
            <template #default="{row}">
              <span
                v-if="row.isPreferred === 1"
                type="success"
              >优选好店</span>
              <span
                v-if="row.isPreferred === 0"
              >普通店铺</span>
            </template>
          </el-table-column>

          <!-- 操作 -->
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            min-width="300"
          >
            <template #default="{row}">
              <el-button
                v-permission="['platform:shopManage:info']"
                link
                type="primary"
                @click="toShopDetailPage(row.shopId)"
              >
                详情
              </el-button>
              <!-- 上线审核失败显示编辑按钮 -->
              <el-button
                v-if="row.shopStatus < 3 && row.shopStatus !== -1 || (row.shopStatus === 6 && row.type === 1) && paySettlementType===1"
                v-permission="['platform:shopManage:update','platform:shopManage:updateCompany']"
                link
                type="primary"
                @click="toShopEditPage(row.shopId)"
              >
                <i class="el-icon-edit" />编辑
              </el-button>
              <el-button
                v-if="row.shopStatus === 1 || row.shopStatus === 0"
                v-permission="['platform:shopManage:closeStore']"
                link
                type="primary"
                @click="offlineManageHandle(row, 'offline')"
              >
                <i class="el-icon-lock" />下线店铺
              </el-button>
              <el-button
                v-if="(row.shopStatus === 2 || row.shopStatus === 5)&&(paySettlementType!==1 || (paySettlementType===1 && row.companyInfoProcessStatus!==0))"
                v-permission="['platform:shopManage:openStore']"
                link
                type="primary"
                @click="offlineManageHandle(row, 'offlineManage')"
              >
                <i class="el-icon-unlock" />下线管理
              </el-button>
              <!-- isPreferred是否优选好店 0否 1是 -->
              <el-button
                v-if="row.shopStatus !== -1"
                v-permission="['platform:shopManage:preferred']"
                link
                type="primary"
                @click="preferredById(row)"
              >
                <i class="el-icon-setting" />{{ row.isPreferred === 0 ?'设为好店': row.isPreferred === 1 ? '取消好店' : '' }}
              </el-button>
              <el-button
                v-permission="['platform:shopManage:updatePassword']"
                link
                type="primary"
                @click="accountManageHandle(row.shopId)"
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/pagination/index.vue'
import accountManage from './account-manage.vue'
import * as api from '@/api/platform/audit-shop.js'
import { ElMessage } from 'element-plus'

const tempSearchForm = ref(null) // 保存上次点击查询的请求条件
// 当前选中的店铺id
const shopId = ref('')
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
const searchParam = ref({
  shopName: '', // 店铺名称
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
const accountManageRef = ref(null)
const offlineDataRef = ref(null)
const resaonIntError = ref(false)
// 违规下线对话框
const offlineDialogVisible = ref(false)

const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
watchEffect((offlineReason) => {
  if (offlineReason) {
    resaonIntError.value = false
  }
})
onMounted(() => {
  getPage()
})
const onCopyLink = () => {
  api.getLink().then(res => {
    navigator.clipboard.writeText(res).then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
        duration: 1000
      })
    }).catch(() => {
      ElMessage({
        message: '复制失败',
        type: 'error',
        duration: 1000
      })
    })
  })
}
const getPage = (newData = false) => {
  if (newData || !tempSearchForm.value) {
    tempSearchForm.value = { ...pageQuery.value, ...searchParam.value }
  } else {
    tempSearchForm.value.pageSize = pageQuery.value.pageSize
    tempSearchForm.value.pageNum = pageQuery.value.pageNum
  }
  pageLoading.value = true
  api.managePage(tempSearchForm.value).then(pageVal => {
    pageVO.value = pageVal
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const router = useRouter()
// 查看
const createStore = () => {
  router.push('/platform/shop-process')
}

/**
 * 跳转到店铺详情页
 */
const toShopDetailPage = (shopId) => {
  router.push('/platform/shop-detail?shopId=' + shopId + '&pageType=' + 'toDetail')
}

/**
 * 跳转到店铺编辑页
 */
const toShopEditPage = (shopId) => {
  router.push('/platform/shop-edit?shopId=' + shopId)
}

// 账号管理
const accountManageHandle = (shopId) => {
  accountManageVisible.value = true
  nextTick(() => {
    accountManageRef.value?.init(shopId)
  })
}

const preferredById = (row) => {
  api.updateShopPreferred({ shopId: row.shopId }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

/**
 * 店铺违规下线操作
 */
const offlineManageHandle = (row, key) => {
  offlineDialogVisible.value = true
  shopId.value = row.shopId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineDetailByShopId(row.shopId)
  }
}

/**
 * 获取最新店铺下线事件
 */
const getOfflineDetailByShopId = (shopId) => {
  api.getEventsOfOfflineStores(shopId).then((data) => {
    nextTick(() => {
      offlineDataRef.value.init('offlineManage', data || {}, paySettlementType === 1 ? 'canDirectOnline' : '')
    })
  })
}

const isSubmit = ref(null)
/**
 * 直接上线
 */
const directOnline = (data) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const param = {
    handleId: shopId.value,
    eventId: data.eventId
  }
  api.onlineStore(param).then(() => {
    ElMessage({
      message: '店铺已上线',
      type: 'success',
      duration: 1000,
      onClose: () => {
        offlineDialogVisible.value = false
        getPage()
        isSubmit.value = false
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}

/**
 * 下线
 */
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: shopId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  api.closeStore(param).then(() => {
    offlineDialogVisible.value = false
    ElMessage({
      message: '店铺已下线',
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
    handleId: shopId.value,
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
  searchParam.value.shopName = ''
  searchParam.value.type = null
  searchParam.value.shopStatus = null
  searchParam.value.isPreferred = null
}

</script>
