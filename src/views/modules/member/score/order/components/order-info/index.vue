<template>
  <div class="detail-dialog">
    <el-dialog
      v-model="visible"
      :title="
        !dataForm.orderId
          ? $t('table.add')
          : $t('order.order.orderDetail')
      "
      :close-on-click-modal="false"
      top="10vh"
      width="80%"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-width="80px"
        @submit.prevent
      >
        <div class="mod-order-orderInfo">
          <div class="content">
            <div class="order-number">
              <div class="number">
                <span class="text">{{ $t("order.order.number") }}:</span>
                {{ dataForm.orderId }}
              </div>
              <div class="time">
                <span class="text">{{ $t("order.order.createTime") }}:</span>
                {{ dataForm.createTime }}
              </div>
              <div class="type">
                {{
                  [
                    $t("order.order.normalOrder"),
                    $t("order.order.groupPurchaseOrder"),
                    $t("order.order.spikeOrder"),
                  ][dataForm.orderType]
                }}
              </div>
            </div>
            <div class="order-state">
              <div class="state-box">
                <div class="state">
                  {{
                    [
                      $t("order.order.waitingFosPayment"),
                      $t("order.order.waitiooShip"),
                      $t("order.order.waitingFeGoods"),
                      $t("order.order.waitingtion"),
                      $t("order.order.commoditful"),
                      $t("order.order.commodityFailed"),
                      $t("order.order.commodited"),
                    ][dataForm.status - 1]
                  }}
                </div>
                <div class="state-des">
                  <div v-if="dataForm.status === 1">
                    {{ $t("order.order.buyerDidNTime") }}
                  </div>
                  <div v-if="dataForm.status === 2">
                    {{ $t("order.order.buyPleF") }}
                  </div>
                  <div v-if="dataForm.status === 3 && dataForm.deliveryType !== 2">
                    {{ $t("order.order.shelF") }}
                  </div>
                  <div v-if="dataForm.status === 3 && dataForm.deliveryType === 2">
                    {{ $t("order.order.buyA") }}
                  </div>
                  <div v-if="dataForm.status === 5">
                    {{ $t("order.order.buyB") }}
                  </div>
                  <div v-if="dataForm.status === 6">
                    {{ $t("order.order.orderCanc") }}
                  </div>
                  <div v-if="dataForm.status === 7">
                    {{ $t("order.order.outTimeCanOrd") }}
                  </div>
                </div>
              </div>
              <div class="state-steps">
                <el-form-item>
                  <el-steps
                    :active="stepsStatus"
                    align-center
                    style="width: 100%;"
                    :process-status="dataForm.status === 6 ? 'error' : 'wait'"
                  >
                    <el-step
                      :title="$t('order.order.submitOrders')"
                      :description="dataForm.createTime"
                    />
                    <el-step
                      :title="$t('order.order.theBuyerHasPaid')"
                      :description="dataForm.payTime"
                    />
                    <el-step
                      :title="
                        dataForm.deliveryType === 2
                          ? $t('order.order.buyerHasMentioned')
                          : $t('order.order.shippedBySeller')
                      "
                      :description="dataForm.deliveryTime"
                    />
                    <el-step
                      :title="$t('order.order.buyerHasReceived')"
                      :description="dataForm.finallyTime"
                    />
                  </el-steps>
                </el-form-item>
              </div>
            </div>
            <div
              v-if="
                dataForm.deliveryExpresses && dataForm.deliveryExpresses.length
              "
              v-loading="loadingDelivery"
              class="packages"
            >
              <div
                v-if="dataForm.deliveryExpresses.length > 1"
                class="p-tab"
              >
                <div
                  v-for="(item,index) in dataForm.deliveryExpresses"
                  :key="index"
                  :class="indexs === index ? 'item active' : 'item'"
                  @click="onClickListDelivery(item, index)"
                >
                  {{ $t("order.order.package") }}{{ index + 1 }}
                </div>
              </div>

              <!-- 捣了 -->
              <div
                v-if="deliveryExpresse"
                class="p-con"
              >
                <div class="deliver-msg">
                  <div class="d-item">
                    <div class="text">
                      {{ $t("order.order.deliveryMethod") }}：
                    </div>
                    <div class="res">
                      {{
                        [
                          $t("order.order.ordinaryExpress"),
                          $t("order.order.ordinaryExpress"),
                          $t("order.order.selfMention"),
                          $t("order.order.noNeedRequired"),
                        ][deliveryExpresse.deliveryType]
                      }}
                    </div>
                  </div>
                  <div class="d-item">
                    <div class="text">
                      {{ $t("order.order.deliveryTime") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpresse.createTime }}
                    </div>
                  </div>
                  <div
                    v-if="deliveryExpresse.deliveryType === 1 || deliveryExpresse.deliveryType === 0"
                    class="d-item"
                  >
                    <div class="text">
                      {{ $t("order.order.courierCompany") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpresse.deliveryName }}
                    </div>
                  </div>
                  <div
                    v-if="deliveryExpresse.deliveryType === 1 || deliveryExpresse.deliveryType === 0"
                    class="d-item"
                  >
                    <div class="text">
                      {{ $t("order.order.waybillNumber") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpresse.deliveryNo }}
                    </div>
                  </div>

                  <div
                    class="d-goods"
                    :class="{ over: deliveryExpresse.orderItems.length > 5 }"
                  >
                    <div
                      class="arrow prev"
                      :class="{
                        disable:
                          deliveryExpresse.orderItems.length - 5 <= 0 ||
                          offsetCount < 1,
                      }"
                      @click="prevItem"
                    />
                    <div
                      class="arrow next"
                      :class="{
                        disable:
                          deliveryExpresse.orderItems.length - 5 <= 0 ||
                          offsetCount >= deliveryExpresse.orderItems.length - 5,
                      }"
                      @click="nextItem"
                    />
                    <div class="item-goods">
                      <div
                        ref="carouserRef"
                        class="goods-box"
                      >
                        <div
                          v-for="(
                            orderItem, index
                          ) in deliveryExpresse.orderItems"
                          :key="index"
                          class="item"
                        >
                          <div class="img">
                            <img-show :src="orderItem.imgUrl" />
                            <div class="number">
                              ×{{ orderItem.count }}
                            </div>
                          </div>
                          <div class="name">
                            {{ orderItem.spuName }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="logistics">
                  <div
                    v-if="deliveryExpresse && deliveryExpresse.delivery"
                    class="l-tit"
                  >
                    <span
                      class="text"
                    >{{ $t("order.order.logisticsStatus") }}：</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 0"
                      class="l-state"
                    >{{ $t("order.order.noRecord") }}</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 1"
                      class="l-state"
                    >{{ $t("order.order.collected") }}</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 2"
                      class="l-state"
                    >{{ $t("order.order.delivering") }}</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 3"
                      class="l-state"
                    >{{ $t("order.order.haveBeenReceived") }}</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 201"
                      class="l-state"
                    >{{ $t("order.order.reachTheDestinationCity") }}</span>
                    <span
                      v-if="deliveryExpresse.delivery.state === 4"
                      class="l-state"
                    >{{ $t("order.order.problemPiece") }}</span>
                  </div>
                  <div
                    v-if="deliveryExpresse && deliveryExpresse.delivery"
                    class="logistics-box"
                  >
                    <div
                      v-if="
                        deliveryExpresse.delivery.state === 0 &&
                          dataForm.status === 5 &&
                          dataForm.finallyTime !== null
                      "
                      class="item"
                    >
                      <div class="time">
                        {{ dataForm.finallyTime }}
                      </div>
                      <div class="text">
                        {{ $t("order.order.receivedGoods") }}
                      </div>
                    </div>
                    <div
                      v-for="(trace, index) in deliveryExpresse.delivery
                        .traces"
                      :key="index"
                      class="item"
                    >
                      <div class="time">
                        {{ trace.acceptTime }}
                      </div>
                      <div class="text">
                        {{ trace.acceptStation }}
                      </div>
                    </div>
                    <div
                      v-if="
                        deliveryExpresse.delivery.traces &&
                          deliveryExpresse.delivery.traces.length < 1
                      "
                      class="item"
                    >
                      {{ $t("order.order.noLogisticsInformation") }}
                    </div>
                    <div
                      v-if="dataForm.status >= 3 && dataForm.deliveryTime !== null"
                      class="item"
                    >
                      <div class="time">
                        {{ dataForm.deliveryTime }}
                      </div>
                      <div class="text">
                        {{ $t("order.order.merchantHasShippedWa") }}
                      </div>
                    </div>
                    <div
                      v-if="dataForm.status >= 2 && dataForm.payTime !== null"
                      class="item"
                    >
                      <div class="time">
                        {{ dataForm.payTime }}
                      </div>
                      <div class="text">
                        {{ $t("order.order.buyerHasPaidWa") }}
                      </div>
                    </div>
                    <div
                      v-if="dataForm.status >= 1"
                      class="item"
                    >
                      <div class="time">
                        {{ dataForm.createTime }}
                      </div>
                      <div class="text">
                        {{ $t("order.order.buyerSubmittedAnOrder") }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-info">
              <div
                v-if="dataForm.orderAddr"
                class="info-item"
              >
                <div class="item-tit">
                  {{ $t("order.order.recipientInformation") }}
                </div>
                <div class="item">
                  <div class="text">
                    {{
                      dataForm.deliveryType === 2
                        ? $t("order.order.deliveryPerson")
                        : $t("constant.consignee")
                    }}：
                  </div>
                  <div class="res">
                    {{ dataForm.orderAddr.consignee }}
                  </div>
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("constant.contactTel") }}：
                  </div>
                  <div class="res">
                    {{ dataForm.orderAddr.mobile }}
                  </div>
                </div>
                <div
                  v-if="dataForm.deliveryType !== 2"
                  class="item"
                >
                  <div class="text">
                    {{ $t("constant.deliveryAddr") }}：
                  </div>
                  <div class="res">
                    {{
                      dataForm.orderAddr.province
                    }}{{
                      dataForm.orderAddr.city
                    }}{{
                      dataForm.orderAddr.area
                    }}{{ dataForm.orderAddr.addr }}
                  </div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">
                  {{ $t("order.order.shippingInformation") }}
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.delType") }}：
                  </div>
                  <div class="res">
                    {{
                      [
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.ordinaryExpress"),
                        $t("order.order.buyerMention"),
                        $t("order.order.noNeedRequired"),
                        $t("order.order.sameCityDelivery"),
                      ][dataForm.deliveryType]
                    }}
                  </div>
                  <div
                    v-if="dataForm.deliveryType === null"
                    class="res"
                  >
                    {{ $t("order.order.notYet") }}
                  </div>
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.deliveryTime") }}：
                  </div>
                  <div class="res">
                    {{ dataForm.deliveryTime }}
                  </div>
                  <div
                    v-if="dataForm.deliveryTime === null"
                    class="res"
                  >
                    {{ $t("order.order.notYet") }}
                  </div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">
                  {{ $t("order.order.paymentInformation") }}
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.actualAmount") }}：
                  </div>
                  <span>
                    <span v-if="dataForm.actualTotal">{{
                      formatPrice(dataForm.actualTotal, 1).toFixed(2) +
                        $t("constant.dollar")
                    }}+</span>
                    <span>{{ (dataForm.orderScore ? (dataForm.orderScore + $t("order.order.integral")) : "") }}</span>
                  </span>
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.paymentMethod") }}：
                  </div>
                  <div
                    v-if="dataForm.payType || dataForm.payType === 0"
                    class="res"
                  >
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
                      ][dataForm.payType]
                    }}
                  </div>
                  <div v-if="!dataForm.payType && dataForm.payType !== 0">
                    {{ $t("pay.notPaid") }}
                  </div>
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.paymentTime") }}：
                  </div>
                  <div class="res">
                    {{ dataForm.payTime }}
                  </div>
                  <div
                    v-if="dataForm.payTime === null"
                    class="res"
                  >
                    {{ $t("order.order.notYet") }}
                  </div>
                </div>
              </div>
              <div class="info-item">
                <div class="item-tit">
                  {{ $t("order.order.buyerInformation") }}
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("order.order.buyerMessage") }}：
                  </div>
                  <div
                    v-if="dataForm.remarks === null || dataForm.remarks === ''"
                    class="res"
                  >
                    {{ $t("order.order.notYet") }}
                  </div>
                  <div
                    v-else
                    class="res"
                  >
                    {{ dataForm.remarks }}
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-list">
              <el-table
                :data="dataForm.orderItems"
                border
              >
                <el-table-column
                  prop=""
                  :label="$t('constant.product')"
                >
                  <template #default="scope">
                    <div class="df">
                      <img-show
                        :src="scope.row.pic"
                        :img-style="{width:'60px',height:'60px'}"
                      />
                      <div class="name">
                        {{ scope.row.spuName + ' ' + (scope.row.skuName === null ? ' ' : scope.row.skuName) }}
                        <div
                          v-if="
                            scope.row.returnMoneySts &&
                              scope.row.returnMoneySts < 6 &&
                              scope.row.returnMoneySts > 0
                          "
                          class="order-status"
                        >
                          {{
                            [
                              "",
                              $t("order.order.buyerApplication"),
                              $t("order.order.sellerAccepts"),
                              $t("order.order.selShipment"),
                              $t("order.order.sellerReceiving"),
                              $t("order.order.refundsuccessfully"),
                            ][scope.row.returnMoneySts]
                          }}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  :label="$t('order.order.unitPrice')"
                  width="180"
                  align="center"
                >
                  <template #default="scope">
                    <span>
                      {{ scope.row.useScore / scope.row.count }}积分
                      <span v-if="scope.row.price">+{{ formatPrice(scope.row.price, 1).toFixed(2) }}元</span>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  :label="$t('order.order.quantity')"
                  width="180"
                  align="center"
                >
                  <template #default="scope">
                    <span>{{ scope.row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="totalPrice"
                  :label="$t('order.order.totalPrice')"
                  width="180"
                  align="center"
                >
                  <template #default="scope">
                    <span>
                      {{ scope.row.useScore }}积分
                      <span v-if="scope.row.spuTotalAmount">
                        +{{ formatPrice(scope.row.spuTotalAmount, 1).toFixed(2) + '元' }}
                      </span>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="goods-total">
                <div class="text-box">
                  <div class="item">
                    <div class="text">
                      {{ $t("order.order.prodTotalPrice") }}:
                    </div>
                    <div class="number">
                      <span>{{ dataForm.orderScore }}积分</span>
                      <span v-if="dataForm.total">+￥{{ formatPrice(dataForm.total, 1).toFixed(2) }}</span>
                    </div>
                  </div>
                  <div
                    v-if="dataForm.freightAmount"
                    class="item"
                  >
                    <div class="text">
                      {{ $t("order.order.shippingFees") }}:
                    </div>
                    <div class="number">
                      ￥{{ formatPrice(dataForm.freightAmount, 1).toFixed(2) }}
                    </div>
                  </div>
                  <div class="item act-price">
                    <div class="text">
                      {{ $t("order.order.amountDue") }}:
                    </div>
                    <div class="number">
                      <span>{{ dataForm.orderScore }}积分</span>
                      <span v-if="dataForm.actualTotal">+￥{{ formatPrice(dataForm.actualTotal, 1).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order-log">
              <div class="log-title">
                {{ $t("order.order.logs") }}
              </div>
              <div
                v-if="dataForm.createTime"
                class="log-cont"
              >
                {{ dataForm.createTime }} {{ dataForm.nickName }}
                {{ $t("order.order.createOrder") }}
              </div>
              <div
                v-if="dataForm.payTime"
                class="log-cont"
              >
                {{ dataForm.payTime }} {{ dataForm.nickName }}
                {{ $t("order.order.payment") }}
              </div>
              <div
                v-if="dataForm.deliveryTime"
                class="log-cont"
              >
                {{ dataForm.deliveryTime }}
                {{
                  dataForm.deliveryType === 2
                    ? dataForm.nickName + $t("order.order.orderPickup")
                    : $t("order.order.deliverys")
                }}
              </div>
              <div
                v-if="dataForm.finallyTime"
                class="log-cont"
              >
                {{ dataForm.finallyTime }} {{
                  dataForm.nickName
                }}{{ $t("order.order.completed") }}
              </div>
              <div
                v-if="dataForm.cancelTime"
                class="log-cont"
              >
                {{ dataForm.cancelTime }} {{ dataForm.nickName }}
                {{ $t("order.order.cancelOrder") }}
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/order/order.js'
import { deliveryOrder } from '@/api/delivery/delivery-company.js'
import Big from 'big.js'

const dataForm = ref({
  orderId: '',
  remarks: '',
  shopRemarks: '',
  total: 0,
  deliveryExpresses: [],
  actualTotal: 0,
  deliveryType: '',
  status: 1,
  addrOrderId: 0,
  nickName: '',
  orderItems: [],
  orderTime: '',
  updateTime: '',
  payTime: '',
  deliveryTime: '',
  finallyTime: '',
  cancelTime: '',
  orderType: '',
  userAddrOrder: {}
})

const stepsStatus = computed(() => {
  if (dataForm.value.finallyTime) {
    return 4
  } else if (dataForm.value.deliveryTime) {
    return 3
  } else if (dataForm.value.payTime) {
    return 2
  } else if (dataForm.value.createTime) {
    return 1
  } else {
    return 0
  }
})

let deliveryExpresse = []
const offsetCount = ref(0) // 偏移量
const carouserRef = ref(null)
watch(deliveryExpresse, () => {
  nextTick(() => {
    offsetCount.value = 0 // 初始化变量
    if (deliveryExpresse) {
      carouserRef.value.style.left = '0px'
    }
  })
})

// 金额格式化 0:乘 1:除
const formatPrice = (price, type = 0) => {
  if (!price) {
    return 0
  }
  Big.DP = 2
  if (type === 0) {
    return +new Big(price).times(100).valueOf()
  }
  return +new Big(price).div(100).valueOf()
}

const dataFormRef = ref(null)
const visible = ref(false)
// eslint-disable-next-line no-unused-vars
const init = (orderId) => {
  dataForm.value.orderId = orderId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  if (dataForm.value.orderId) {
    getDataList()
  }
}

const indexs = ref(0)
const getDataList = () => {
  api.orderInfo(dataForm.value.orderId).then((data) => {
    dataForm.value = data
  })
  if (dataForm.value.deliveryType !== 3) {
    loadingDelivery.value = true
    api.deliveryExpresseInfo({ orderId: dataForm.value.orderId }).then((data) => {
      dataForm.value.deliveryExpresses = data
      deliveryExpresse = data[0]
      loadingDelivery.value = false
    })
  }
}

const loadingDelivery = ref(false)
/**
 * 物流事件
 */
const onClickListDelivery = (delivery, index) => {
  loadingDelivery.value = true
  deliveryOrder(delivery.deliveryOrderId).then((data) => {
    deliveryExpresse = data
    loadingDelivery.value = false
  })
  indexs.value = index
}
// 商品切换
const prevItem = () => {
  const len = deliveryExpresse.orderItems.length
  if (len - 5 > 0) {
    if (offsetCount.value > 0) {
      offsetCount.value--
      carouserRef.value.style.left = '-' + (70 * offsetCount.value) + 'px'
    } else {
      return false
    }
  } else if (len - 5 <= 0) {
    return false
  } else {
    return false
  }
}

const nextItem = () => {
  const len = deliveryExpresse.orderItems.length
  if (len - 5 > 0) {
    if (offsetCount.value < len - 5) {
      offsetCount.value++
      carouserRef.value.style.left = '-' + (70 * offsetCount.value) + 'px'
    } else if (len - 5 <= 0) {
      return false
    } else {
      return false
    }
  } else {
    return false
  }
}
defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
