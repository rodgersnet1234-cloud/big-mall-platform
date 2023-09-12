<template>
  <div class="page-refund-order-info">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t('order.order.refundDetails') }}
      </div>
    </div>
    <div class="order-refund-info">
      <div class="refundId">
        <span class="title">{{ $t('order.order.refundId') }}</span>
        <span class="text">{{ dataForm.refundId }}</span>
      </div>
      <div class="content">
        <div class="order-number">
          <div class="num-cont">
            <div class="state-title">
              <div class="item">
                <div class="title">
                  {{ $t('order.order.refundType') }}：
                </div>
                <div class="text">
                  <div v-if="dataForm.refundType === 1">
                    {{ $t("order.order.wholeOrderRefund") }}
                  </div>
                  <div v-if="dataForm.refundType === 2">
                    {{ $t("order.order.singleItemRefund") }}
                  </div>
                </div>
              </div>
              <p />
              <div class="item">
                <div class="title">
                  {{ $t('order.order.refundMethod') }}：
                </div>
                <div class="text">
                  <div v-if="dataForm.applyType === 1">
                    {{ $t("order.order.onlyRefund") }}
                  </div>
                  <div v-if="dataForm.applyType === 2">
                    {{ $t("order.order.refundAndMoney") }}
                  </div>
                </div>
              </div>
            </div>
            <div class="refund-progress">
              <div
                v-if="dataForm.applyType === 1"
                class="item"
              >
                <el-steps
                  :active="onlyRefundStepsStatus"
                  align-center
                  :process-status="onlyRefundProcessStatus"
                >
                  <el-step
                    :title="
                      $t('order.order.buyer') +
                        $t('order.order.requestARefund')
                    "
                  />
                  <el-step
                    :title=" $t('order.order.merchant') +
                      $t('order.order.confirmTreatmented')"
                  />
                  <el-step :title="$t('order.order.refundsuccessfully')" />
                </el-steps>
              </div>
              <div
                v-else
                class="item"
              >
                <el-steps
                  :active="stepsStatus"
                  align-center
                  :process-status="dataForm.returnMoneySts === -1 ? 'error' : 'wait'"
                >
                  <el-step
                    :title="
                      $t('order.order.buyer') +
                        $t('order.order.requestARefundT')
                    "
                  />
                  <el-step
                    :title="
                      $t('order.order.merchant') +
                        $t('order.order.agreeToReturnAndRefund')
                    "
                  />
                  <el-step :title="$t('order.order.shipped')" />
                  <el-step
                    :title="
                      $t('order.order.merchant') +
                        $t('order.order.confirmTreatmented')
                    "
                  />
                  <el-step :title="$t('order.order.refundsuccessfully')" />
                </el-steps>
              </div>
            </div>
          </div>
        </div>
        <div class="order-state">
          <div class="state-cont">
            <div class="order-info">
              <div class="order-details">
                <div class="detail-title">
                  <span class="prompt">{{ $t("order.order.refundDetails") }}</span>
                </div>
                <div class="detail-cont">
                  <div class="detail01">
                    <div class="text-width">
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.number') }}：</span>
                        <span class="text">{{ dataForm.orderId }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.orderActuallyPaid') }}：</span>
                        <span
                          v-if="dataForm.actualTotal"
                          class="text"
                        >{{ formatPrice(dataForm.actualTotal, 1).toFixed(2) }}{{ $t("constant.dollar") }}</span>
                        <span
                          v-if="dataForm.actualTotal && dataForm.orderScore"
                          class="totalprice"
                        >+
                        </span>
                        <span
                          v-if="dataForm.orderScore"
                          class="totalprice"
                        >{{ dataForm.orderScore
                        }}{{ $t("order.order.integral") }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundAmount') }}：</span>
                        <span
                          v-if="dataForm.refundAmount"
                          class="text"
                        >{{ formatPrice(dataForm.refundAmount, 1).toFixed(2)
                        }}{{ $t("constant.dollar") }}</span>
                        <span
                          v-if="dataForm.refundAmount && dataForm.refundScore"
                          class="text"
                        >+
                        </span>
                        <span
                          v-if="dataForm.refundScore"
                          class="text"
                        >{{ dataForm.refundScore
                        }}{{ $t("order.order.integral") }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.applicationTime') }}：</span>
                        <span class="text">{{ dataForm.createTime }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.reasonForReturn') }}：</span>
                        <span class="text">{{ dataForm.buyerReasonValue }}</span>
                      </div>
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundInstructions') }}：</span>
                        <span class="text">{{ dataForm.buyerDesc }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 退款凭证 -->
              <div class="buyers">
                <div class="detail-title">
                  {{ $t('order.order.refundCertificate') }}
                </div>
                <div class="buyers-info">
                  <div v-if="dataForm.imgUrls?.length">
                    <el-image
                      v-for="(picItem,picInx) in dataForm.imgUrls"
                      :key="picInx"
                      :src="picItem"
                      class="img-box"
                      :preview-src-list="dataForm.imgUrls"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <div v-else>
                    无
                  </div>
                </div>
              </div>
              <!-- / 退款凭证 -->
            </div>
            <div
              v-if="dataForm.orderRefundAddr && dataForm.orderRefundAddr.deliveryName"
              class="order-info"
            >
              <div class="order-details">
                <div class="detail-title">
                  <span class="prompt">{{ $t("order.order.logisticsDetails") }}</span>
                </div>
                <div class="detail-cont">
                  <div class="detail01">
                    <div class="text-width">
                      <div
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.logisticsName') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.deliveryName }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.deliveryNo"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.trackingNumber') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.deliveryNo }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.senderRemarks"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.compradorMsg') }}：</span>
                        <span class="text">{{ dataForm.orderRefundAddr.senderRemarks }}</span>
                      </div>
                      <div
                        v-if="dataForm.orderRefundAddr?.senderMobile"
                        class="text-width-item"
                      >
                        <span class="title">{{ $t('order.order.buyerPhone') }}：</span>
                        <span>{{ dataForm.orderRefundAddr.senderMobile }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 物流凭证 -->
              <div class="buyers">
                <div class="detail-title">
                  {{ $t('order.order.logisticsCertificate') }}
                </div>
                <div class="buyers-info">
                  <div v-if="orderRefundAddrPhotos?.length">
                    <el-image
                      v-for="(picItem,picInx) in orderRefundAddrPhotos"
                      :key="picInx"
                      :src="picItem"
                      class="img-box"
                      :preview-src-list="orderRefundAddrPhotos"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <div v-else>
                    无
                  </div>
                </div>
              </div>
            <!-- 物流凭证 / -->
            </div>
            <div class="item-list">
              <el-table
                :data="dataForm.orderItems"
                header-cell-class-name="table-header"
                row-class-name="table-row-row"
                :row-style="{ height:'82px'}"
              >
                <el-table-column
                  :label="$t('order.order.refundGoods')"
                  width="400"
                >
                  <template #default="scope">
                    <div class="prod-info">
                      <ImgShow
                        :src="scope.row.pic"
                        :style="{width:'100px',height:'100px'}"
                      />
                      <div class="con">
                        <span
                          v-if="scope.row.giveawayOrderItemId"
                          class="gift-icon"
                        >赠品</span>
                        <div
                          class="prod-info-text"
                          :class="{'gift-prod-text': scope.row.giveawayOrderItemId}"
                        >
                          {{ scope.row.spuName }}
                        </div>
                        <div
                          v-if="scope.row.skuName"
                          class="prod-info-sku"
                        >
                          {{ scope.row.skuName }}
                        </div>
                      </div>
                    </div>
                    <!-- 赠品 -->
                    <div
                      v-if="scope.row.giveawayList && !prodLength"
                      class="gift-prod table-cell-text"
                    >
                      <div
                        v-for="(item,index) in scope.row.giveawayList"
                        :key="index"
                        class="item"
                      >
                        <div class="name prod-info-text">
                          【赠品】{{ item.spuName }}
                        </div>
                        <span class="num">{{ item.skuName }} ×{{ item.count }}</span>
                      </div>
                    </div>
                  <!-- / 赠品 -->
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
                  :label="$t('order.order.unitPrice')"
                >
                  <template #default="scope">
                    <span>{{ formatPrice(scope.row.price, 1).toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="count"
                  :label="$t('order.order.quantity')"
                >
                  <template #default="scope">
                    <span v-if="dataForm.refundType === 1 || scope.row.giveawayOrderItemId">{{
                      scope.row.count
                    }}</span>
                    <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">{{
                      dataForm.refundCount
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="spuTotalAmount"
                  :label="$t('order.order.prodTotalPrice')"
                >
                  <template #default="scope">
                    <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">{{
                      formatPrice(scope.row.spuTotalAmount, 1).toFixed(2)
                    }}</span>

                    <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">{{
                      bigspuTotalAmount(scope.row.price, dataForm.refundCount)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">{{ formatPrice(scope.row.giveawayAmount, 1).toFixed(2) }}</span>
                  </template>
                </el-table-column>

                <el-table-column
                  prop="actualTotal"
                  :label="$t('order.order.actualAmount')"
                >
                  <template #default="scope">
                    <span v-if="dataForm.refundType === 1 && !scope.row.giveawayOrderItemId">{{
                      formatPrice(scope.row.actualTotal, 1).toFixed(2)
                    }}</span>
                    <span v-if="dataForm.refundType === 2 && !scope.row.giveawayOrderItemId">{{
                      bigActualTotal(scope.row.actualTotal, scope.row.count)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                    <el-tag
                      v-if="scope.row.shareReduce > 0"
                      type="danger"
                      size="small"
                      effect="dark"
                    >
                      {{ $t("order.order.discount") }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="actualTotal"
                  :label="$t('order.order.refundPlatformDiscountAmount')"
                  align="center"
                >
                  <template #default="scope">
                    <span v-if="!scope.row.giveawayOrderItemId">{{
                      formatPrice((dataForm.refundType === 1 ? scope.row.platformShareReduce : dataForm.platformRefundAmount), 1).toFixed(2)
                    }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="productTotalAmount"
                  :label="$t('order.order.returnAmount')"
                  width="180"
                >
                  <template #default="scope">
                    <span
                      v-if="dataForm.refundAmount && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >{{ formatPrice((dataForm.refundType === 1 ? scope.row.actualTotal : dataForm.refundAmount), 1).toFixed(2)
                    }}{{ $t("constant.dollar") }}</span>
                    <span
                      v-if="dataForm.refundAmount && dataForm.refundScore && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >+
                    </span>
                    <span
                      v-if="dataForm.refundScore && !scope.row.giveawayOrderItemId"
                      class="totalprice"
                    >{{ dataForm.refundType === 1 ? scope.row.refundScore : dataForm.refundScore }}{{ $t("order.order.integral") }}</span>
                    <span v-if="scope.row.giveawayOrderItemId">-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <!-- 退款日志 -->
        <div class="order-log">
          <div class="log-title">
            <span>{{ $t("order.order.refundLog") }}</span>
          </div>
          <div class="log-cont">
            <div v-if="dataForm.createTime">
              <span>{{ dataForm.createTime }}
                {{ $t("order.order.submitARefundRequestWa") }}</span>
            </div>
            <div v-if="dataForm.applyType === 2 && dataForm.handelTime && !dataForm.closeType">
              <span>{{ dataForm.handelTime }}
                {{ $t("order.order.merchantHasProcessedWaBuy") }}</span>
            </div>

            <div v-if="dataForm.applyType === 1 && dataForm.handelTime && !dataForm.closeType && dataForm.buyerReason !== 7">
              <span>{{ dataForm.handelTime }}
                {{ $t("order.order.merchantHasProcessedWaSh") }}</span>
            </div>
            <div v-if="dataForm.deliveryTime">
              <span>{{ dataForm.deliveryTime }}
                {{ $t("order.order.buyerShipmentWaPro") }}</span>
            </div>
            <div v-if="dataForm.receiveTime">
              <span>{{ dataForm.receiveTime }}
                {{ $t("order.order.merchantHasReceivedWaShGr") }}</span>
            </div>
            <div v-if="dataForm.applyType === 2 && !dataForm.receiveTime && dataForm.isReceived === 0">
              <span>{{ dataForm.updateTime }}
                {{ $t("order.order.merchantHasProcessedWaSh") }}</span>
            </div>
            <div v-if="dataForm.decisionTime">
              <span>{{ dataForm.decisionTime }}
                {{ $t("order.order.agreeToRefund") }}</span>
            </div>
            <div v-if="dataForm.refundTime">
              <span>{{ dataForm.refundTime }}
                {{ $t("order.order.refundsuccessfully") }}</span>
            </div>
            <div v-if="dataForm.returnMoneySts === -1 && dataForm.closeType === 1">
              <span>{{ dataForm.closeTime }} {{ $t("order.order.refundClosed") }} {{ $t("order.order.buyerHasWithdrawn") }}
              </span>
            </div>
            <div v-if="dataForm.handelTime && dataForm.returnMoneySts === -1">
              <span>{{ dataForm.updateTime }}
                {{ dataForm.closeType === 1 ? $t("order.order.buyerHasWithdrawn"):
                  dataForm.closeType === 2 ? $t("order.order.merchantRejected") : $t("order.order.requestTimeOut")
                }}{{ '，'+ $t("order.order.refundClosed") }}
              </span>
            </div>
          </div>
        </div>
      <!-- 退款日志 / -->
      </div>
    </div>
  </div>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/order/order-refund'
import { formatPrice } from '@/utils/index.js'

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const dataForm = ref({})

const onlyRefundStepsStatus = computed(() => {
  let index = 0
  if (dataForm.value.handelTime) {
    index++
  }
  if (dataForm.value.cancelTime || dataForm.value.refundTime || dataForm.value.rejectTime || dataForm.value.refundTime) {
    index += 2
  }
  return index
})

const onlyRefundProcessStatus = computed(() => {
  switch (dataForm.value.returnMoneySts) {
    case 1:
    case 2:
      return 'finish'
    case 5:
      return 'success'
    default:
      return 'error'
  }
})

const stepsStatus = computed(() => {
  let index = 1
  if (dataForm.value.handelTime) {
    index++
  }
  if (dataForm.value.deliveryTime) {
    index++
  }
  if ((dataForm.value.deliveryTime && dataForm.value.closeTime && dataForm.value.closeType === 2) || dataForm.value.receiveTime || dataForm.value.returnMoneySts === 5) {
    index++
  }
  // 退款成功的情况下进度条也要加2
  if (dataForm.value.returnMoneySts === 5) {
    index += 2
  }
  return index
})

const route = useRoute()
onMounted(() => {
  if (route.query.refundId) {
    getRefundOrderInfo(route.query.refundId)
  }
})

const prodLength = ref(false) // 是否为单个赠品
const orderRefundAddrPhotos = ref([])
const isReceived = ref(0)
const getRefundOrderInfo = (id) => {
  dataForm.value.refundId = id
  if (dataForm.value.refundId) {
    api.info(dataForm.value.refundId).then((data) => {
      dataForm.value = data
      // 处理商品列表
      const prods = data.orderItems
      if (prods && prods.length === 1 && prods[0].giveawayList && prods[0].giveawayList.length) {
        // 单个商品且有赠品时，将主商品和赠品放在同一级列表中展示
        prods[0].giveawayList.forEach(item => {
          item.giveawayOrderItemId = item.orderItemId
        })
        dataForm.value.orderItems = prods.concat(prods[0].giveawayList)
        prodLength.value = true
      }
      if (dataForm.value.isReceived) {
        isReceived.value = 1
      } else {
        isReceived.value = 0
      }
      // 物流凭证
      if (dataForm.value.orderRefundAddr && dataForm.value.orderRefundAddr.imgs) {
        const imgUrls = dataForm.value.orderRefundAddr.imgs.split(',')
        orderRefundAddrPhotos.value = onHandleImgUrl(imgUrls)
      }

      // 退款凭证
      if (data.imgUrls) {
        const imgUrls = data.imgUrls.split(',')
        dataForm.value.imgUrls = onHandleImgUrl(imgUrls)
      } else {
        dataForm.value.imgUrls = []
      }
    })
  }
}

const onHandleImgUrl = (imgUrls) => {
  const imgs = []
  imgUrls.forEach((img) => {
    if (img.indexOf('http') === -1 && img.indexOf('https') === -1) {
      const image = resourcesUrl + img
      imgs.push(image)
    } else {
      imgs.push(img)
    }
  })
  return imgs
}

// 精度运算-乘法
const bigspuTotalAmount = (a, b) => {
  return new Big(a).times(b).div(100).toFixed(2)
}

// 精度运算-除法
const bigActualTotal = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).times(dataForm.value.refundCount).div(100).toFixed(2)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
