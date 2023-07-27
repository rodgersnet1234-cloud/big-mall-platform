<template>
  <div class="page-platform-coupon app-container">
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
            label="优惠券名称："
            prop="couponName"
          >
            <el-input
              v-model="searchForm.couponName"
              placeholder="优惠券名称"
              maxlength="20"
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
                label="暂不投放"
                value="4"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="获取方式："
            prop="getWay"
          >
            <el-select
              v-model="searchForm.getWay"
              placeholder="请选择优惠券获取方式"
              clearable
            >
              <el-option
                label="用户领取"
                value="0"
              />
              <el-option
                label="系统发放"
                value="1"
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
      <div class="operation-bar">
        <el-button
          v-permission="['platform:coupon:save']"
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
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 优惠券名称 -->
          <el-table-column
            :label="$t('coupon.coupon.couponName')"
            prop="couponName"
            align="left"
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
          <!-- putonStatus  优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
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
              <span>{{ row.stocks }}</span>
            </template>
          </el-table-column>
          <!--          获取方式-->
          <el-table-column
            :label="$t('coupon.coupon.getWay')"
            prop="getway"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.getWay == 0 ? $t('coupon.coupon.ways1') : $t('coupon.coupon.ways2') }}</span>
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
                  v-permission="['platform:coupon:update']"
                  type="text"
                  @click="onAddOrUpdate(row.couponId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['platform:coupon:delete']"
                  type="text"
                  @click="onDelete(row.couponId)"
                >
                  {{ $t('table.delete') }}
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
      @refresh-data-list="getPageData"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './add-or-update.vue'
import * as api from '@/api/coupon/coupon'
import { ElMessageBox, ElMessage } from 'element-plus'

let tempSearchForm = null // 保存上次点击查询的请求条件

// 头部搜索表单
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  couponName: '',
  couponType: '',
  getWay: '',
  putonStatus: null,
  status: null
})

const pageLoading = ref(true)
const pageData = ref({
  dataList: [],
  total: 0,
  pages: 0
})
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const isSubmit = ref(false)
const couponId = ref(null)

const searchFormRef = ref(null)
const onResetSearch = (formEl) => {
  formEl.resetFields()
}

onMounted(() => {
  couponId.value = null
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

const onDelete = (couponId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    deleteById(couponId)
  })
}

const deleteById = (couponId) => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  api.deleteById(couponId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        getPageData()
      }
    })
    isSubmit.value = false
  }).catch(() => {
    isSubmit.value = false
  })
}
</script>
