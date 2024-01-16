<template>
  <div class="component-order-info">
    <el-dialog
      v-model="visible"
      :title="!dataForm.orderId ? $t('table.add') : $t('order.order.orderDetail')"
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
                      dataForm.preSaleType===1? '等待买家付定金':$t("order.order.waitingFosPayment"),
                      dataForm.deliveryType === 2 ? $t("order.order.waitToPickUp") : $t("order.order.waitiooShip"),
                      $t("order.order.waitingFeGoods"),
                      $t("order.order.waitingtion"),
                      $t("order.order.commoditful"),
                      $t("order.order.commodityFailed"),
                      $t("order.order.commodited"),
                      '',
                      '等待买家付尾款'
                    ][dataForm.status - 1]
                  }}
                </div>
                <div class="state-des">
                  <div v-if="dataForm.status === 1|| dataForm.status ===9">
                    {{ $t("order.order.buyerDidNTime") }}
                  </div>
                  <div v-if="dataForm.status === 2 && dataForm.deliveryType !== 2">
                    {{ $t("order.order.buyPleF") }}
                  </div>
                  <div v-if="dataForm.status === 2 && dataForm.deliveryType === 2">
                    {{ $t("order.order.shelPleF") }}
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
                    style="width: 100%"
                    :process-status="dataForm.status === 6 ? 'error' : 'wait'"
                  >
                    <el-step
                      :title="$t('order.order.submitOrders')"
                    >
                      <template
                        v-if="dataForm.createTime"
                        #description
                      >
                        <div class="description">
                          {{ dataForm.createTime.split(" ")[0] }}
                        </div>
                        <div class="description">
                          {{ dataForm.createTime.split(" ")[1] }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      :title="$t('order.order.theBuyerHasPaid')"
                    >
                      <template
                        v-if="dataForm.payTime"
                        #description
                      >
                        <div class="description">
                          {{ dataForm.payTime.split(" ")[0] }}
                        </div>
                        <div class="description">
                          {{ dataForm.payTime.split(" ")[1] }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      :title="
                        dataForm.deliveryType === 2
                          ? $t('order.order.buyerHasMentioned')
                          : $t('order.order.shippedBySeller')
                      "
                    >
                      <template
                        v-if="dataForm.deliveryTime"
                        #description
                      >
                        <div class="description">
                          {{ dataForm.deliveryTime.split(" ")[0] }}
                        </div>
                        <div class="description">
                          {{ dataForm.deliveryTime.split(" ")[1] }}
                        </div>
                      </template>
                    </el-step>
                    <el-step
                      :title="$t('order.order.buyerHasReceived')"
                      :description="dataForm.finallyTime"
                    >
                      <template
                        v-if="dataForm.finallyTime"
                        #description
                      >
                        <div class="description">
                          {{ dataForm.finallyTime.split(" ")[0] }}
                        </div>
                        <div class="description">
                          {{ dataForm.finallyTime.split(" ")[1] }}
                        </div>
                      </template>
                    </el-step>
                  </el-steps>
                </el-form-item>
              </div>
            </div>
            <div
              v-if="dataForm.deliveryType !== 3 && ((!loadingDelivery && dataForm.deliveryExpresses.length > 0) || loadingDelivery)"
              v-loading="loadingDelivery"
              class="packages"
            >
              <div
                v-if="dataForm.deliveryExpresses && dataForm.deliveryExpresses.length > 1"
                class="p-tab"
              >
                <div
                  v-for="(item, index) in dataForm.deliveryExpresses"
                  :key="index"
                  :class="indexs === index ? 'item active' : 'item'"
                  @click="onClickListDelivery(item, index)"
                >
                  {{ $t("order.order.package") }}{{ index + 1 }}
                </div>
              </div>
              <div
                v-if="deliveryExpress"
                class="p-con"
              >
                <div class="deliver-msg">
                  <div class="d-item">
                    <div class="text">
                      {{ $t("order.order.delType") }}：
                    </div>
                    <div class="res">
                      {{
                        [
                          $t("order.order.ordinaryExpress"),
                          $t("order.order.ordinaryExpress"),
                          $t("order.order.selfMention"),
                          $t("order.order.noNeedRequired"),
                        ][deliveryExpress.deliveryType]
                      }}
                    </div>
                  </div>
                  <div class="d-item">
                    <div class="text">
                      {{ $t("order.order.deliveryTime") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpress.createTime }}
                    </div>
                  </div>
                  <div
                    v-if="deliveryExpress.deliveryType === 1 || deliveryExpress.deliveryType === 0"
                    class="d-item"
                  >
                    <div class="text">
                      {{ $t("order.order.courierCompany") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpress.deliveryName }}
                    </div>
                  </div>
                  <div
                    v-if="deliveryExpress.deliveryType === 1 || deliveryExpress.deliveryType === 0"
                    class="d-item"
                  >
                    <div class="text">
                      {{ $t("order.order.waybillNumber") }}：
                    </div>
                    <div class="res">
                      {{ deliveryExpress.deliveryNo }}
                    </div>
                  </div>

                  <div
                    class="d-goods"
                    :class="{ over: deliveryExpress.orderItems && deliveryExpress.orderItems.length > 5 }"
                  >
                    <div
                      class="arrow prev"
                      :class="{
                        disable:
                          deliveryExpress.orderItems && deliveryExpress.orderItems.length - 5 <= 0 ||
                          offsetCount < 1,
                      }"
                      @click="onSwitchPrevItem"
                    />
                    <div
                      class="arrow next"
                      :class="{
                        disable:
                          deliveryExpress.orderItems && deliveryExpress.orderItems.length - 5 <= 0 ||
                          offsetCount >= deliveryExpress.orderItems && deliveryExpress.orderItems.length - 5,
                      }"
                      @click="onSwitchNextItem"
                    />
                    <div class="item-goods">
                      <div
                        ref="carouserRef"
                        class="goods-box"
                      >
                        <div
                          v-for="(
                            orderItem, index
                          ) in deliveryExpress.orderItems && deliveryExpress.orderItems"
                          :key="index"
                          class="item"
                        >
                          <div class="img">
                            <ImgShow :src="orderItem.imgUrl" />
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
                    v-if="deliveryExpress && deliveryExpress.delivery"
                    class="l-tit"
                  >
                    <span
                      class="text"
                    >{{ $t("order.order.logisticsStatus") }}：</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 0"
                      class="l-state"
                    >{{ $t("order.order.noRecord") }}</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 1"
                      class="l-state"
                    >{{ $t("order.order.collected") }}</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 2"
                      class="l-state"
                    >{{ $t("order.order.delivering") }}</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 3"
                      class="l-state"
                    >{{ $t("order.order.haveBeenReceived") }}</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 201"
                      class="l-state"
                    >{{ $t("order.order.reachTheDestinationCity") }}</span>
                    <span
                      v-if="deliveryExpress.delivery.state === 4"
                      class="l-state"
                    >{{ $t("order.order.problemPiece") }}</span>
                  </div>
                  <div
                    v-if="deliveryExpress && deliveryExpress.delivery"
                    class="logistics-box"
                  >
                    <div
                      v-if="
                        deliveryExpress.delivery.state === 0 &&
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
                      v-for="(trace, index) in deliveryExpress.delivery.traces"
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
                        deliveryExpress.delivery.traces &&
                          deliveryExpress.delivery.traces.length < 1
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
                v-if="(dataForm.orderAddr || dataForm.orderSelfStationVO) && dataForm.orderMold!==1"
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
                    {{ dataForm.deliveryType === 2 ? dataForm.orderSelfStationVO.stationUserName : dataForm.orderAddr.consignee }}
                  </div>
                </div>
                <div class="item">
                  <div class="text">
                    {{ $t("constant.contactTel") }}：
                  </div>
                  <div class="res">
                    {{ dataForm.deliveryType === 2 ? orderSelfStationVO.stationUserMobile : dataForm.orderAddr.mobile }}
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
                    {{ dataForm.orderAddr.province
                    }}{{ dataForm.orderAddr.city
                    }}{{ dataForm.orderAddr.area
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
                <div
                  v-if="dataForm.deliveryType === 2"
                  class="item"
                >
                  <div class="text">
                    门店名称：
                  </div>
                  <div class="res">
                    {{ orderSelfStationVO.stationName }}
                  </div>
                </div>
              </div>
              <!-- 虚拟商品的用户留言 -->
              <div
                v-if="dataForm.orderMold===1"
                class="info-item"
              >
                <div class="item-tit">
                  虚拟商品信息
                </div>
                <div
                  v-if="virtualRemarkList && virtualRemarkList.length"
                  class="item"
                >
                  <div class="text">
                    全部留言：
                  </div>
                  <div class="res">
                    <div
                      v-for="(virtualRemark,index) in virtualRemarkList"
                      :key="index"
                    >
                      {{
                        virtualRemark.name
                      }}：{{
                        virtualRemark.value
                      }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="!virtualRemarkList || !virtualRemarkList.length"
                  class="item"
                >
                  暂无
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
                  {{
                    formatPrice(dataForm.actualTotal, 1).toFixed(2) +
                      $t("constant.dollar") +
                      (dataForm.orderScore ? (" + " + dataForm.orderScore + $t("order.order.integral")) : "")
                  }}
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
                  <div class="res remarks">
                    {{ dataForm.remarks || $t("order.order.notYet") }}
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-list">
              <order-prod-table
                :data-form="dataForm"
              />
              <div class="goods-total">
                <div class="text-box">
                  <div class="item">
                    <div class="text">
                      {{ $t("order.order.prodTotalPrice") }}:
                    </div>
                    <div class="number">
                      ￥{{ formatPrice(dataForm.total, 1).toFixed(2) }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="text">
                      {{ $t("order.order.discountedPrice") }}:
                    </div>
                    <div class="number">
                      ￥{{ onFormatDiscountedPrice(dataForm.reduceAmount, dataForm.platformFreeFreightAmount) }}
                    </div>
                  </div>
                  <div class="item">
                    <div class="text">
                      {{ $t("order.order.platformFreeFreightAmount") }}:
                    </div>
                    <div class="number">
                      ￥{{ formatPrice(dataForm.platformFreeFreightAmount, 1).toFixed(2) }}
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
                      ￥{{ formatPrice(dataForm.actualTotal, 1).toFixed(2) +
                        (dataForm.orderScore ? (" + " + dataForm.orderScore + $t("order.order.integral")) : "") }}
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
                {{ dataForm.finallyTime }} {{ dataForm.nickName
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
import Big from 'big.js'
import * as api from '@/api/order/order.js'
import { deliveryOrder } from '@/api/delivery/delivery-company.js'
import { formatPrice } from '@/utils/index.js'
import OrderProdTable from '../order-prod-table/index.vue'

const carouserRef = ref()
const deliveryExpress = ref('')
const indexs = ref(0)
const loadingDelivery = ref(false)
const offsetCount = ref(0) // 偏移量
const dataForm = reactive({
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
  userAddrOrder: {},
  orderMold: 0,
  virtualRemark: [],
  reduceAmount: 0,
  platformFreeFreightAmount: 0
})

const stepsStatus = computed(() => {
  if (dataForm.finallyTime) {
    return 4
  } else if (dataForm.deliveryTime) {
    return 3
  } else if (dataForm.payTime && dataForm.status !== 9) {
    return 2
  } else if (dataForm.createTime) {
    return 1
  } else {
    return 0
  }
})

watch(() => deliveryExpress.value, () => {
  nextTick(() => {
    offsetCount.value = 0 // 初始化变量
    if (deliveryExpress.value) {
      carouserRef.value.style.left = '0px'
    }
  })
})

const dataFormRef = ref()
const visible = ref(false)
const init = (orderId) => {
  dataForm.orderId = orderId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  if (dataForm.orderId) {
    onGetDataList()
  }
}

const orderSelfStationVO = ref({})
const prodList = reactive([])
const virtualRemarkList = reactive([])
const onGetDataList = () => {
  api.orderInfo(dataForm.orderId).then((data) => {
    Object.assign(dataForm, data)
    orderSelfStationVO.value = data.orderSelfStationVO
    handleArr(virtualRemarkList, dataForm.orderItems[0].virtualRemark && dataForm.orderItems[0].virtualRemark !== 'null' ? JSON.parse(dataForm.orderItems[0].virtualRemark) : [])
    handleArr(virtualRemarkList, virtualRemarkList.filter((item) => {
      return item.value
    }))
    if (dataForm.deliveryType !== 3) {
      loadingDelivery.value = true
      api.deliveryExpresseInfo({ orderId: dataForm.orderId }).then((data) => {
        dataForm.deliveryExpresses = data
        deliveryExpress.value = data[0]
        indexs.value = 0
        loadingDelivery.value = false
      })
    }
    // 处理商品列表
    handleArr(prodList, data.orderItems)
    if (data.orderItems.length === 1 &&
      data.orderItems[0].giveawayList &&
      data.orderItems[0].giveawayList.length) {
      // 单个商品且有赠品时，将主商品和赠品放在同一级列表中展示
      handleArr(prodList, [...data.orderItems, ...data.orderItems[0].giveawayList])
    }
  })
}

const onFormatDiscountedPrice = (amount1, amount2) => {
  if (!amount1) {
    return 0
  }
  return new Big(amount1).minus(amount2).div(100).toFixed(2)
}

// 物流事件
const onClickListDelivery = (delivery, index) => {
  loadingDelivery.value = true
  deliveryOrder(delivery.deliveryOrderId).then((data) => {
    deliveryExpress.value = data
    loadingDelivery.value = false
  })
  indexs.value = index
}

// 商品切换
const onSwitchPrevItem = () => {
  const len = deliveryExpress.value.orderItems.length
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

const onSwitchNextItem = () => {
  const len = deliveryExpress.value.orderItems.length
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
@use 'index';
</style>
