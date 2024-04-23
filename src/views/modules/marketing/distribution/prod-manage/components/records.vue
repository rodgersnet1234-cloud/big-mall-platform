<template>
  <div class="components-distribution-records app-container">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="100px"
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
          :label="$t('distribution.distributor') + '：'"
          prop="nickName"
        >
          <el-input
            v-model="searchForm.nickName"
            :placeholder="$t('distribution.distributor')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('distribution.phoneNum') + '：'"
          prop="userMobile"
        >
          <el-input
            v-model="searchForm.userMobile"
            :placeholder="$t('distribution.phoneNum')"
          />
        </el-form-item>
        <el-form-item
          :label="$t('distribution.distriStatus') + '：'"
          class="statusBottom"
          prop="state"
        >
          <el-select
            v-model="searchForm.state"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 订单号 -->
        <el-form-item
          :label="$t('distribution.orderNumber') + '：'"
          prop="orderId"
        >
          <el-input
            v-model="searchForm.orderId"
            :placeholder="$t('distribution.orderNumber')"
          />
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
            align="center"
            prop="shopName"
            :label="$t('distribution.shopName')"
          >
            <template #default="scope">
              <span class="table-cell-text">{{ scope.row.shopName }}</span>
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

          <!-- 佣金数额 -->
          <el-table-column
            prop="incomeAmount"
            align="center"
            :label="$t('distribution.commAmount')"
            sortable
          >
            <template #default="scope">
              <span>￥ {{ price(scope.row.incomeAmount) }}</span>
            </template>
          </el-table-column>
          <!-- 分销员 -->
          <el-table-column
            align="center"
            prop="nickName"
            :label="$t('distribution.distributor')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.distributionUser"
                class="table-cell-text"
              >{{ scope.row.distributionUser.nickName }}</span>
            </template>
          </el-table-column>

          <!-- 手机号 -->
          <el-table-column
            align="center"
            prop="userMobile"
            :label="$t('distribution.phoneNum')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.distributionUser"
                class="table-cell-text"
              >{{ scope.row.distributionUser.userMobile }}</span>
            </template>
          </el-table-column>

          <!-- 下单时间 -->
          <el-table-column
            align="center"
            prop="createTime"
            min-width="150"
            :label="$t('distribution.createTime')"
          />

          <!-- 订单号 -->
          <el-table-column
            align="center"
            prop="orderId"
            :label="$t('distribution.orderNumber')"
          />

          <!-- 分销状态 -->
          <el-table-column
            align="center"
            prop="state"
            :label="$t('distribution.distriStatus')"
          >
            <template #default="scope">
              <div
                v-if="scope.row.state>0"
                class="tag-text"
              >
                {{ ['', $t("distribution.waitSettle"), $t("distribution.settled")]
                  [scope.row.state] }}
              </div>
              <div
                v-else
                class="tag-text"
              >
                {{ $t('distribution.invOrder') }}
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
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/distributionProd/distributionProd.js'
import Big from 'big.js'

const price = (value) => {
  if (value) {
    if (!value) {
      return 0
    }
    return new Big(value).div(100).toFixed(2)
  }
  return 0
}

let tempSearchForm = null // 保存上次点击查询的请求条件

// 查询的参数
const searchForm = reactive({
  pageSize: 10,
  pageNum: 1,
  shopName: null,
  spuName: null,
  nickName: null,
  userMobile: null,
  state: null,
  orderId: ''
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
const statusList = ref([
  {
    label: $t('distribution.waitSettle'),
    value: 1
  }, {
    label: $t('distribution.settled'),
    value: 2
  }, {
    label: $t('distribution.invOrder'),
    value: -1
  }
])
onMounted(() => {
  getPageData()
})

const getPageData = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...searchForm }
  } else {
    tempSearchForm.pageSize = searchForm.pageSize
    tempSearchForm.pageNum = searchForm.pageNum
  }
  pageLoading.value = true
  api.distributionRecordsPage(tempSearchForm).then((data) => {
    pageData.value.dataList = data.list
    pageData.value.pages = data.pages
    pageData.value.total = data.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}
const onSearch = (newData = false) => {
  searchForm.pages = 1
  getPageData(newData)
}
</script>
<style scoped>
.statusBottom :deep(.el-select > .el-input){
  width: 200px;
}
</style>
