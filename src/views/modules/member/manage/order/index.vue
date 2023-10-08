<template>
  <div class="page-user-order">
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="searchParam"
        @submit.prevent
      >
        <el-form-item label="用户昵称：">
          <el-input
            v-model="searchParam.nickName"
            placeholder="用户昵称"
            maxlength="30"
            clearable
          />
        </el-form-item>
        <el-form-item label="购买时间：">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            :range-separator="$t('date.tip')"
            value-format="YYYY-MM-DD HH:mm:ss"
            :start-placeholder="$t('date.start')"
            :end-placeholder="$t('date.end')"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="searchParamChange(true)"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            @click="clear()"
          >
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          row-key="levelLogId"
          highlight-current-row
          style="width: 100%;"
        >
          <!-- 用户昵称 -->
          <el-table-column
            label="用户昵称"
            align="center"
            fixed
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.nickName }}</span>
            </template>
          </el-table-column>
          <!-- 用户头像 -->
          <el-table-column
            label="用户头像"
            prop="pic"
            align="center"
            width="80px;"
            fixed
          >
            <template #default="{row}">
              <img
                v-if="!row.pic"
                src="../../../../../assets/images/user_img.jpg"

                class="img"
                alt="暂无图片"
              >
              <img
                v-else
                :src="(row.pic).indexOf('http')===-1 ? resourcesUrl + row.pic : row.pic"
                class="img"
                style="width:60px;height:60px"
                alt=""
              >
            </template>
          </el-table-column>

          <!-- 会员等级 -->
          <el-table-column
            label="付费会员等级"
            align="center"
            min-width="120"
          >
            <template #default="{row}">
              <span>{{ row.levelName }}</span>
            </template>
          </el-table-column>

          <!-- 会员期数类型 -->
          <el-table-column
            label="会员期数类型"
            align="center"
          >
            <template #default="{row}">
              <span>
                {{
                  [
                    $t("user.level.month"),
                    $t("user.level.season"),
                    $t("user.level.year"),

                  ][row.termType]
                }}
              </span>
            </template>
          </el-table-column>
          <!-- 购买时间 -->
          <el-table-column
            label="购买时间"
            align="center"
          >
            <template #default="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <!-- 支付金额 -->
          <el-table-column
            label="支付金额"
            align="center"
          >
            <template #default="{row}">
              <span>{{ formatPrice(row.payAmount,1).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <!-- 支付方式 -->
          <el-table-column
            label="支付方式"
            align="center"
          >
            <template #default="{row}">
              <span v-if="!row.payType && row.payType !== 0">{{
                $t("pay.notPaid")
              }}</span>
              <span v-else>
                {{
                  [
                    $t("order.order.pointsPayment"),
                    $t("order.order.wecProPay"),
                    $t("order.order.alipayPCPayment"),
                    $t("order.order.wechatScanCodePayment"),
                    $t("order.order.wechatH5Payment"),
                    $t("order.order.weclAccountPay"),
                    $t("order.order.alipayH5Payment"),
                    $t("order.order.alipayAPPPayment"),
                    $t("order.order.wechatAPPPayment"),
                    $t("order.order.balancePayment"),
                  ][row.payType]
                }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页条 -->
    <Pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="pagination"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/user/user-order.js'
import { formatPrice } from '@/utils/index.js'
let tempSearchForm = null // 保存上次点击查询的请求条件

const dateRange = ref([])
const searchParam = ref({
  // 用户昵称
  nickName: null,
  // 接收短信号码
  phone: null,
  // 注册开始时间
  createStartTime: null,
  // 注册结束时间
  createEndTime: null
})
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询的参数
const pageQuery = ref({
  pageSize: 10,
  pageNum: 1
})
// loading
const pageLoading = ref(true)

onMounted(() => {
  getPage()
})
const pagination = (page) => {
  pageQuery.value.pageNum = page.pageNum
  pageQuery.value.pageSize = page.pageSize
  getPage()
}
/**
 * 获取数据列表
 */
const getPage = (newData = false) => {
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery.value, ...searchParam.value }
  } else {
    tempSearchForm.pageSize = pageQuery.value.pageSize
    tempSearchForm.pageNum = pageQuery.value.pageNum
  }
  pageLoading.value = true
  api.pageBuyLevelLog(tempSearchForm).then(resPageVO => {
    pageVO.value = resPageVO
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const searchParamChange = (newData = false) => {
  pageQuery.value.pageNum = 1
  // 时间范围
  if (dateRange.value) {
    searchParam.value.createStartTime = dateRange.value[0]
    searchParam.value.createEndTime = dateRange.value[1]
  } else {
    searchParam.value.createStartTime = null
    searchParam.value.createEndTime = null
  }
  getPage(newData)
}

// 清空按钮
const clear = () => {
  dateRange.value = []
  searchParam.value.nickName = null
  searchParam.value.phone = null
  searchParam.value.createStartTime = null
  searchParam.value.createEndTime = null
}

</script>

<style lang="scss" scoped>
.page-user-order {
  background-color: #fff;
  padding: 20px;
   :deep(.el-input-number--medium .el-input-number__increase),
   :deep(.el-input-number--medium .el-input-number__decrease) {
    width: 36px;
    font-size: 12px;
    height: 30px;
    line-height: 32px;
  }

  .prod-tit span {
    margin-right: 15px;
  }
  .item span {
    display: inline-block !important;
  }

  .prod-price span:first-child {
    margin-bottom: 10px;
  }

  .img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100px;
  }

  .item span {
    display: block;
  }

  .item .price-block span {
    display: inline-block;
  }
  :deep(.el-input__inner){
    font-size: 12px;
  }
}

</style>
