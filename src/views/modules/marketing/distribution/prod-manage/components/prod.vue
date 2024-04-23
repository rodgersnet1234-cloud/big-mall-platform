<template>
  <div class="components-distribution-prod app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
      >
        <el-form-item
          :label="$t('distribution.shopName') + '：'"
          prop="shopName"
        >
          <el-input
            v-model="searchForm.shopName"
            :placeholder="$t('distribution.shopName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('distribution.prodName') + '：'"
          prop="spuName"
        >
          <el-input
            v-model="searchForm.spuName"
            :placeholder="$t('distribution.prodName')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('distribution.status') + '：'"
          prop="distributionState"
        >
          <el-select
            v-model="searchForm.distributionState"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch(true)"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            @click="onResetSearch(searchFormRef)"
          >
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 主体区域 -->
    <div class="main-content">
      <div class="table-con">
        <el-table
          v-loading="pageLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          highlight-current-row
          style="width: 100%"
        >
          <!-- 店铺名称 -->
          <el-table-column
            :label="$t('distribution.shopName')"
            prop="spuName"
            align="left"
            width="280"
          >
            <template #default="{ row }">
              <span class="table-cell-text">{{ row.shopName }}</span>
            </template>
          </el-table-column>
          <!-- 商品信息 -->
          <el-table-column
            min-width="260"
            :label="$t('distribution.prodInfo')"
          >
            <template #default="{row}">
              <div class="table-cell-con">
                <div class="table-cell-image">
                  <ImgShow :src="row.mainImgUrl" />
                </div>
                <span class="table-cell-text">{{ row.spuName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('distribution.status')"
            prop="state"
            align="center"
          >
            <template #default="{ row }">
              <span v-if="row.distributionInfo.state === 0">商家下架</span>
              <span v-else-if="row.distributionInfo.state === 1">商家上架</span>
              <span v-else-if="row.distributionInfo.state === 2">违规下架</span>
              <span v-else-if="row.distributionInfo.state === 3">待审核</span>
            </template>
          </el-table-column>

          <!-- 奖励比例 -->
          <el-table-column
            prop="state"
            label="奖励方式"
          >
            <template #default="{row}">
              <div
                v-if="row.distributionInfo.awardMode === 0"
                class="tag-text"
              >
                按比例奖励
              </div>
              <div
                v-if="row.distributionInfo.awardMode === 1"
                class="tag-text"
              >
                按固定数值奖励
              </div>
            </template>
          </el-table-column>
          <!-- 间推奖励 -->
          <el-table-column
            prop="state"
            label="间推奖励"
          >
            <template #default="{row}">
              <div
                v-if="row.distributionInfo.parentAwardSet === 0"
                class="tag-text"
              >
                关闭
              </div>
              <div
                v-if="row.distributionInfo.parentAwardSet === 1"
                class="tag-text"
              >
                开启
              </div>
            </template>
          </el-table-column>

          <el-table-column
            width="150"
            align="center"
            :label="$t('table.actions')"
          >
            <template #default="{ row }">
              <div class="table-btn-con">
                <el-button
                  v-permission="['distribution:spu:get:offline']"
                  link
                  type="primary"
                  @click="onProdInfo(row)"
                >
                  {{ $t("table.view") }}
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state <= 1"
                  v-permission="['distribution:spu:offline']"
                  link
                  type="primary"
                  @click="onOfflineManage(row, 'offline')"
                >
                  下架
                </el-button>
                <el-button
                  v-if="row.distributionInfo.state >= 2"
                  v-permission="['distribution:spu:audit']"
                  link
                  type="primary"
                  @click="onOfflineManage(row, 'offlineManage')"
                >
                  下线管理
                </el-button>
                <el-button
                  v-permission="['distribution:spu:delete']"
                  link
                  type="primary"
                  @click="onDelete(row)"
                >
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 列表相关区域 -->
    <!-- 分页条 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <prod-info
      v-if="prodInfoVisible"
      ref="prodInfoRef"
      @close-dialog="closeDialog()"
    />
    <!-- 下架管理 -->
    <offline-manage
      v-if="offlineDialogVisible"
      ref="offlineDataRef"
      @on-or-off-the-shelf="onOrOffTheShelf"
      @offline-data-submit="offlineDataSubmit"
    />
  </div>
</template>

<script setup>
import OfflineManage from '@/components/offline-manage/index.vue'
import ProdInfo from './prod-info.vue'
import * as api from '@/api/distribution/distributionProd/distributionProd.js'
import { ElMessage, ElMessageBox } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 当前操作的分销商品id
const distributionSpuId = ref(null)
// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  distributionSpu: true,
  shopName: null,
  spuName: null,
  distributionState: null
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

const stateList = ref([
  {
    label: '商家下架',
    value: 0
  }, {
    label: '商家上架',
    value: 1
  }, {
    label: '违规下架',
    value: 2
  }, {
    label: '待审核',
    value: 3
  }
])

const offlineDetail = reactive({})
const isSubmit = ref(false)
const prodInfoVisible = ref(false)
const offlineDialogVisible = ref(false)

onMounted(() => {
  isSubmit.value = false
  prodInfoVisible.value = false
  getPageData()
})

const closeDialog = () => {
  prodInfoVisible.value = false
}
const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
  }
  pageLoading.value = true
  api.distributionPage(tempSearchForm).then((data) => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const onSearch = (newData = false) => {
  searchForm.pageNum = 1
  getPageData(newData)
}

const prodInfoRef = ref(null)
const onProdInfo = (info) => {
  prodInfoVisible.value = true
  nextTick(() => {
    prodInfoRef.value?.init(info)
  })
}

const offlineDataRef = ref(null)
// 商品违规下线操作
const onOfflineManage = (row, key) => {
  offlineDialogVisible.value = true
  distributionSpuId.value = row.distributionInfo.distributionSpuId
  if (key === 'offline') {
    nextTick(() => {
      offlineDataRef.value?.init('offline')
    })
  } else if (key === 'offlineManage') {
    getOfflineHandleEvent(distributionSpuId.value)
  }
}
/**
 * 获取最新商品下线事件
 */
const getOfflineHandleEvent = (id) => {
  api.getOfflineHandleEvent(id).then((data) => {
    offlineDetail.value = data
    nextTick(() => {
      offlineDataRef.value?.init('offlineManage', data)
    }).catch(() => {
      isSubmit.value = false
    })
  })
}

// 下线
const onOrOffTheShelf = (data) => {
  const param = {
    handleId: distributionSpuId.value,
    offlineReason: data
  }
  if (isSubmit.value) {
    return
  }
  api.offline(param).then(() => {
    ElMessage({
      message: '分销商品已下线',
      type: 'success',
      duration: 1000,
      onClose: () => {
        offlineDialogVisible.value = false
        getPageData()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}

// 上架申请审核
const offlineDataSubmit = (data) => {
  const param = {
    handleId: distributionSpuId.value,
    eventId: data.eventId,
    status: data.status, // 审核状态
    refuseReason: data.refuseReason // 拒绝理由
  }
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.audit(param).then(() => {
    ElMessage({
      message: '提交成功',
      type: 'success',
      duration: 1000,
      onClose: () => {
        offlineDialogVisible.value = false
        getPageData()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
/**
 * 删除
 */
const onDelete = (row) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(row.distributionInfo.distributionSpuId))
}
const deleteById = (distributionSpuId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.deleteById(distributionSpuId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPageData()
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
</script>
