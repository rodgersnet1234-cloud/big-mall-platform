<template>
  <div class="page-order">
    <div class="screening-conditions">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        label-width="100px"
        @submit.prevent
        @keyup.enter="onGetDataList(0,true)"
      >
        <el-form-item :label="$t('order.order.number') + '：'">
          <el-input
            v-model="searchForm.orderId"
            :placeholder="$t('order.order.number')"
            :controls="false"
            maxlength="19"
            oninput="value=value.replace(/[^0-9]/g,'')"
            precision="0"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('order.order.shopName') + '：'">
          <el-input
            v-model.trim="searchForm.shopName"
            :placeholder="$t('order.order.shopName')"
            maxlength="100"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('order.order.supplierName') + '：'">
          <el-input
            v-model.trim="searchForm.supplierName"
            :placeholder="$t('order.order.supplierName')"
            maxlength="100"
            clearable
          />
        </el-form-item>

        <el-form-item :label="$t('order.order.orderType') + '：'">
          <el-select
            v-model="searchForm.orderType"
            clearable
            :placeholder="$t('order.order.pleaseSelectOrderType')"
          >
            <el-option
              v-for="item in orderType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.order.status') + '：'">
          <el-select
            v-model="status"
            clearable
            :placeholder="$t('order.order.statusMsg')"
            @change="onChangeOrderStatus"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('order.order.supplierDeliveryType') + '：'">
          <!-- 发货方式 -->
          <el-select
            v-model="searchForm.supplierDeliveryType"
            clearable
            :placeholder="$t('order.order.supplierDeliveryTypeMsg')"
          >
            <el-option
              v-for="item in supplierDeliveryType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('order.order.theRecipientSName') + '：'"
        >
          <el-input
            v-model="searchForm.consignee"
            :placeholder="$t('order.order.pleaseEnRecipName')"
            maxlength="100"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('constant.contactTel') + '：'">
          <el-input
            v-model="searchForm.mobile"
            :placeholder="$t('order.order.pleaseEnterNumber')"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('order.order.paymentMethod') + '：'"
        >
          <el-select
            v-model="searchForm.payType"
            clearable
            :placeholder="$t('order.order.pleaseSePayt')"
          >
            <el-option
              v-for="item in payType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('order.order.afterSalesStatus') + '：'"
        >
          <el-select
            v-model="searchForm.refundStatus"
            clearable
            :placeholder="$t('order.order.pleSelAfterSalesSta')"
          >
            <el-option
              v-for="item in refund"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('order.order.logisticsType') + '：'"
        >
          <el-select
            v-model="searchForm.deliveryType"
            clearable
            :placeholder="$t('order.order.pleSelTypeOfLog')"
          >
            <el-option
              v-for="item in deliveryType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类别：">
          <el-select
            v-model="searchForm.orderMold"
            clearable
            placeholder="请选择订单类别"
          >
            <el-option
              v-for="item in orderMold"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否预售：">
          <el-select
            v-model="searchForm.isPreSale"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in isPreSale"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div class="operation-box">
          <el-form-item :label="$t('order.order.createTime') + '：'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
              :default-time="defaultTime"
            />
            <el-button
              class="ml10"
              @click="onSetDateRange(1)"
            >
              {{
                $t("date.t")
              }}
            </el-button>
            <el-button
              @click="onSetDateRange(2)"
            >
              {{
                $t("date.y")
              }}
            </el-button>
            <el-button
              @click="onSetDateRange(3)"
            >
              {{
                $t("date.n")
              }}
            </el-button>
            <el-button
              @click="onSetDateRange(4)"
            >
              {{
                $t("date.m")
              }}
            </el-button>
          </el-form-item>
        </div>

        <div class="operation-box">
          <el-form-item>
            <el-button
              class="operation-btn"
              type="primary"
              @click="onSearch(true)"
            >
              {{ $t('table.search') }}
            </el-button>
            <el-button
              class="operation-btn"
              @click="onGetSoldExcel()"
            >
              {{ $t("table.export") }}
            </el-button>
            <el-button
              class="operation-btn"
              @click="onClear()"
            >
              {{ $t('table.reset') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main">
      <div class="content">
        <!-- 导航 -->
        <div class="status-nav clearfix">
          <ul class="nav-list clearfix">
            <li
              :class="['nav-item', sts === 0 ? 'selected' : '']"
              @click="onSelectNav(0)"
            >
              {{ $t("date.a") }}
            </li>
            <li
              :class="['nav-item', sts === 1 ? 'selected' : '']"
              @click="onSelectNav(1)"
            >
              {{ $t("pay.obligation") }}
            </li>
            <li
              :class="['nav-item', sts === 2 ? 'selected' : '']"
              @click="onSelectNav(2)"
            >
              {{ $t("order.order.toBeShipped") }}
            </li>
            <li
              :class="['nav-item', sts === 3 ? 'selected' : '']"
              @click="onSelectNav(3)"
            >
              {{ $t("order.order.pendingReceipt") }}
            </li>
            <li
              :class="['nav-item', sts === 5 ? 'selected' : '']"
              @click="onSelectNav(5)"
            >
              {{ $t("order.order.successfulTransaction") }}
            </li>
            <li
              :class="['nav-item', sts === 6 ? 'selected' : '']"
              @click="onSelectNav(6)"
            >
              {{ $t("order.order.transactionFailed") }}
            </li>
            <li
              :class="['nav-item', sts === 7 ? 'selected' : '']"
              @click="onSelectNav(7)"
            >
              {{ $t("group.waitGroup") }}
            </li>
            <li
              :class="['nav-item', sts === 8 ? 'selected' : '']"
              @click="onSelectNav(8)"
            >
              待采购
            </li>
          </ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit', showHeadScroll ? (sidebarOpenState?'fixed-top fixed-top-w1':'fixed-top fixed-top-w2') : '']">
          <el-row style="width: 100%">
            <el-col :span="5">
              <span class="item product">{{ $t("constant.product") }}</span>
            </el-col>
            <el-col
              :span="5"
              class="transaction-price"
            >
              <span class="item">{{ $t("order.order.transaQuantity") }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">{{
                $t("order.order.actualPaymentAmount")
              }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.paymentMethod") }}</span>
            </el-col>
            <el-col
              :span="3"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.buyerConsignee") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.status") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("order.order.afterSalesStatus") }}</span>
            </el-col>
            <el-col
              :span="2"
              class="column-title"
            >
              <span class="item">{{ $t("table.actions") }}</span>
            </el-col>
          </el-row>
        </div>

        <div
          v-for="order in dataList"
          :key="order.orderId"
          class="prod"
          style="margin-bottom: 15px"
        >
          <div class="prod-tit">
            <span>{{ $t("order.order.number") }}:{{ order.orderId }}</span>
            <span>{{ $t("order.order.createTime") }}:{{ order.createTime }}</span>
            <span>{{ $t("order.order.shopName") }}:{{ order.shopName }}</span>
            <span v-if="order.supplierName">{{ $t("order.order.supplierName") }}:{{ order.supplierName }}</span>
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="10">
                <order-prod-card
                  :order="order"
                />
              </el-col>
              <el-col
                :span="3"
                style="height: 100%"
              >
                <div class="item">
                  <div class="price-block">
                    <span
                      v-if="order.actualTotal"
                      class="totalprice"
                    >{{ formatPrice(order.actualTotal, 1).toFixed(2)
                    }}{{ $t("constant.dollar") }}</span>
                    <span
                      v-if="order.actualTotal && order.orderScore"
                      class="totalprice"
                    >+
                    </span>
                    <span
                      v-if="order.orderScore"
                      class="totalprice"
                    >{{ order.orderScore
                    }}{{ $t("order.order.integral") }}</span>
                    <br>
                    <span
                      v-if="order.freightAmount"
                      class="totalprice"
                    >

                      {{ $t("order.order.freightAmount") + '：￥' + formatPrice(order.freightAmount, 1).toFixed(2) }}
                    </span>
                    <span
                      v-if="order.platformFreeFreightAmount"
                      class="totalprice"
                    >

                      {{ $t("order.order.platformFreeFreightAmount") + '：￥' + formatPrice(order.platformFreeFreightAmount, 1).toFixed(2) }}
                    </span>
                    <br>
                    <span>{{ $t("order.order.total") }}{{ order.allCount
                    }}{{ $t("constant.piece") }}</span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div>
                    <span v-if="!order.payType && order.payType !== 0">{{
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
                        ][order.payType]
                      }}
                    </span>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%"
              >
                <div class="item">
                  <div class="buyer-info">
                    <div class="buyer-name">
                      {{ order.orderMold===1? order.userName : order.consignee }}
                    </div>
                    <div
                      v-if="order.orderMold!==1"
                      class="buyer-phone"
                    >
                      {{ order.mobile }}
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <span>
                    <span
                      v-if="order.status === 1||order.status === 9"
                      type="danger"
                    >{{ $t("pay.obligation") }}</span>
                    <span
                      v-else-if="order.status === 2"
                      type="danger"
                    >{{ order.waitPurchase === 1 ? '待采购' :$t("order.order.toBeShipped") }}</span>
                    <span
                      v-else-if="order.status === 3"
                      type="danger"
                    >{{ $t("order.order.pendingReceipt") }}</span>
                    <span
                      v-else-if="order.status === 7"
                      type="danger"
                    >{{ $t("group.waitGroup") }}</span>
                    <span
                      v-else-if="order.status === 5"
                      type="danger"
                    >{{ $t("order.order.successfulTransaction") }}</span>
                    <span
                      v-else-if="order.status === 6"
                    >{{
                      $t("order.order.transactionFailed")
                    }}</span>
                    <span
                      v-if="order.preSaleType === 1"
                      style="color: #999"
                    >
                      <span v-if="order.status === 1">(待付定金)</span>
                      <span v-if="order.status === 9">(待付尾款)</span>
                    </span>
                  </span>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <span
                    v-if="order.refundStatus === 1"
                    type="danger"
                  >{{ $t("order.order.refundApplication") }}</span>
                  <span
                    v-else-if="order.refundStatus === 2"
                    type="danger"
                  >{{ $t("order.order.refundsuccessfully") }}</span>
                  <span
                    v-else-if="order.refundStatus === 3"
                    type="danger"
                  >{{ $t("order.order.partialRefundSucc") }}</span>
                  <span
                    v-else-if="order.refundStatus === 4"
                    type="danger"
                  >{{ $t("order.order.refundFailed") }}</span>
                  <span
                    v-else
                    type="danger"
                  >{{
                    $t("order.order.noAfterSales")
                  }}</span>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div class="operate">
                    <el-button
                      v-permission="['order:order:info']"
                      link
                      type="primary"
                      @click="onAddOrUpdate(order.orderId)"
                    >
                      {{ $t("order.order.seeDetails") }}
                    </el-button>
                    <el-button
                      v-if="order.refundStatus"
                      v-permission="['order:order:refund:info']"
                      link
                      type="primary"
                      @click="onGoToRefund(order.orderId)"
                    >
                      {{ $t("order.order.refundInformation") }}
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div
          v-if="!dataList.length"
          class="empty"
        >
          {{ $t("order.order.noData") }}
        </div>
      </div>
    </div>
    <!-- 分页条 -->
    <pagination
      v-show="page.total > 0"
      v-model:page="page.pageNum"
      v-model:limit="page.pageSize"
      :total="page.total"
      @pagination="onGetDataList(1)"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetDataList"
    />
  </div>
</template>

<script setup>
import moment from 'moment'
import * as api from '@/api/order/order'
import { formatPrice } from '@/utils/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddOrUpdate from './components/order-info/index.vue'
import Pagination from '@/components/pagination/index.vue'
import OrderProdCard from './components/order-prod-card/index.vue'

const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59)
]
let orderId = null
let oldPar = {}
const deliveryType = [{
  value: 1,
  label: $t('order.order.ordinaryExpress')
}, {
  value: 2,
  label: $t('order.order.selfMention')
}, {
  value: 3,
  label: $t('order.order.noNeedRequired')
}, {
  value: 4,
  label: $t('order.order.sameCityDelivery')
}]
const isPreSale = [{
  value: 1,
  label: '是'
}, {
  value: 0,
  label: '否'
}]
const options = [{
  value: 1,
  label: $t('pay.obligation')
}, {
  value: 2,
  label: $t('order.order.toBeShipped')
}, {
  value: 3,
  label: $t('order.order.pendingReceipt')
}, {
  value: 5,
  label: $t('order.order.successfulTransaction')
}, {
  value: 6,
  label: $t('order.order.transactionFailed')
}, {
  value: 7,
  label: $t('group.waitGroup')
}, {
  value: 8,
  label: '待采购'
}]
const supplierDeliveryType = [{
  value: 1,
  label: '供应商发货'
}, {
  value: 2,
  label: '商家发货'
}]
const orderMold = [{
  value: 0,
  label: '实物商品'
}, {
  value: 1,
  label: '虚拟商品'
}]
const orderType = [{
  value: 0,
  label: $t('order.order.normalOrder')
}, {
  value: 1,
  label: $t('order.order.groupPurchaseOrder')
}, {
  value: 2,
  label: $t('order.order.spikeOrder')
}]
const payType = [{
  value: -1,
  label: $t('admin.unpay')
}, {
  value: 1,
  label: $t('admin.weChatPay')
}, {
  value: 2,
  label: $t('admin.aliPay')
}, {
  value: 3,
  label: $t('admin.balancePay')
}, {
  value: 0,
  label: $t('order.order.pointsPayment')
}]
const refund = [{
  value: 0,
  label: $t('order.order.noAfterSales')
}, {
  value: 1,
  label: $t('order.order.refundApplication')
}, {
  value: 2,
  label: $t('order.order.refundsuccessfully')
}, {
  value: 3,
  label: $t('order.order.partialRefundSucc')
}, {
  value: 4,
  label: $t('order.order.refundFailed')
}]

const dateRange = ref([])
const status = ref(null)
const sts = ref(0)
const dataList = reactive([])
const page = reactive({
  pageSize: 10,
  pageNum: 1,
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const searchForm = reactive({
  consignee: null,
  deliveryType: null,
  isPreSale: null,
  mobile: null,
  orderId: null,
  orderMold: null,
  orderType: null,
  payType: null,
  refundStatus: null,
  shopName: null,
  supplierName: null,
  supplierDeliveryType: null
})

const appStore = useAppStore()
const sidebarOpenState = computed(() => {
  return appStore.sidebar.opened
})

onMounted(() => {
  // 获取首页跳转传递的参数
  if (useRoute().query.orderNumber) {
    orderId = useRoute().query.orderNumber
    onAddOrUpdate(orderId)
  }
  if (Object.keys(useRoute().params).length > 0) {
    onSelectNav(useRoute().params.orderStatus)
  } else {
    onGetDataList()
  }
  // 监听页面滚动
  window.addEventListener('scroll', onScrollToTop)
})

// 页面滚动事件
const showHeadScroll = ref(false)
const onScrollToTop = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showHeadScroll.value = scrollTop > 350
}

// 获取数据列表
const dataListLoading = ref(false)
let tempSearchForm = null // 保存上次点击查询的请求条件
const onGetDataList = (type = 0, newData = false) => {
  let par = {
    orderId: orderId === 1 ? searchForm.orderId : useRoute().query.orderNumber,
    shopName: searchForm.shopName,
    supplierName: searchForm.supplierName,
    orderType: searchForm.orderType,
    orderMold: searchForm.orderMold,
    payType: searchForm.payType,
    consignee: searchForm.consignee,
    mobile: searchForm.mobile,
    status: status.value,
    isPreSale: searchForm.isPreSale,
    deliveryType: searchForm.deliveryType,
    supplierDeliveryType: searchForm.supplierDeliveryType,
    refundStatus: searchForm.refundStatus,
    startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
    endTime: dateRange.value === null ? null : dateRange.value[1] // 结束时间
  }
  if (type === 0) {
    oldPar = par
  } else {
    par = oldPar
  }
  dataListLoading.value = true
  if (newData || !tempSearchForm) {
    tempSearchForm = {
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      ...par
    }
  } else {
    tempSearchForm = {
      ...tempSearchForm,
      pageNum: page.pageNum,
      pageSize: page.pageSize,
      status: status.value
    }
  }
  api.page(Object.assign(tempSearchForm)).then(data => {
    handleArr(dataList, data.list)
    page.total = data.total
    page.pages = data.pages
    sts.value = !status.value ? 0 : status.value
    dataListLoading.value = false
    orderId = 1
  })
}

// 导航选择状态
const onSelectNav = (stsVal) => {
  sts.value = parseInt(stsVal)
  status.value = sts.value === 0 ? null : parseInt(stsVal)
  page.pageNum = 1
  onGetDataList()
}

const onChangeOrderStatus = (val) => {
  status.value = val
}

/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const onSetDateRange = (val) => {
  let startDay = null
  let endDay = null
  if (val === 1) {
    startDay = 0
    endDay = 0
  } else if (val === 2) {
    startDay = -1
    endDay = -1
  } else if (val === 3) {
    startDay = -7
    endDay = -1
  } else if (val === 4) {
    startDay = -30
    endDay = -1
  } else {
    return
  }
  // 开始时间
  const startTime = moment().add(startDay, 'days').startOf('days').format('LL')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('LL')
  dateRange.value = [startTime, endTime]
}

// 新增 / 修改
const addOrUpdateRef = ref()
const addOrUpdateVisible = ref(false)
const onAddOrUpdate = (val) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(val)
  })
}

// 退款路由跳转
const router = useRouter()
const onGoToRefund = (val) => {
  router.push({
    path: '/order/refund-order',
    query: { orderId: val }
  })
}

// 清空按钮
const searchFormRef = ref()
const onClear = () => {
  onHandleSearchForm({})
  dateRange.value = []
  status.value = null
}
// 搜索查询
const onSearch = (newData = false) => {
  page.pageNum = 1
  onGetDataList(0, newData)
}

const onGetSoldExcel = () => {
  if (!dateRange.value || dateRange.value.length < 2) {
    ElMessage.error($t('order.order.pleExpOrderFirst'))
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.soldExcel({
      orderId: searchForm.orderId,
      shopName: searchForm.shopName,
      supplierName: searchForm.supplierName,
      orderType: searchForm.orderType,
      payType: searchForm.payType,
      consignee: searchForm.consignee,
      mobile: searchForm.mobile,
      status: status.value,
      deliveryType: searchForm.deliveryType,
      supplierDeliveryType: searchForm.supplierDeliveryType,
      refundStatus: searchForm.refundStatus,
      startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
      endTime: dateRange.value === null ? null : dateRange.value[1], // 结束时间
      exOrderType: 3,
      orderMold: searchForm.orderMold,
      isPreSale: searchForm.isPreSale
    }).then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
      const fileName = $t('order.order.orderInfCollationXls')
      const elink = document.createElement('a')
      if ('download' in elink) { // 非IE下载
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch((e) => {
      ElMessage.error(e)
    })
  })
}

// searchForm赋值
const onHandleSearchForm = (data) => {
  searchForm.consignee = data.consignee
  searchForm.deliveryType = data.deliveryType
  searchForm.isPreSale = data.isPreSale
  searchForm.mobile = data.mobile
  searchForm.orderId = data.orderId
  searchForm.orderMold = data.orderMold
  searchForm.orderType = data.orderType
  searchForm.payType = data.payType
  searchForm.refundStatus = data.refundStatus
  searchForm.shopName = data.shopName
  searchForm.supplierName = data.supplierName
  searchForm.supplierDeliveryType = data.supplierDeliveryType
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
