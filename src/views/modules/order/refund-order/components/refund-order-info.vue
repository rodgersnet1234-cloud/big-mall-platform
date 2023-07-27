<template>
  <el-dialog
    v-model="visible"
    :title="$t('order.order.refundProcessing')"
    :close-on-click-modal="false"
    width="80%"
    class="component-refund-order-info"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <div class="mod-order-refundOrderInfo">
        <div class="content">
          <div class="order-number">
            <div class="num-cont">
              <el-form-item :label="$t('order.order.refundId') + ':'">
                <span class="text">{{ dataForm.refundId }}</span>
              </el-form-item>
              <el-form-item>
                <div
                  v-if="dataForm.applyType === 1"
                  style="width: 100%;"
                >
                  <el-steps
                    :active="onlyRefundStepsStatus"
                    align-center
                    style="width: 100%;"
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
                  style="width: 100%;"
                >
                  <el-steps
                    :active="stepsStatus"
                    align-center
                    style="width: 100%;"
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
              </el-form-item>
            </div>
          </div>
          <div class="order-state">
            <div class="state-cont">
              <div class="state-title">
                <el-form-item :label="$t('order.order.refundType') + ':'">
                  <el-tag
                    v-if="dataForm.refundType === 1"
                    type="warning"
                  >
                    {{ $t("order.order.wholeOrderRefund") }}
                  </el-tag>
                  <el-tag
                    v-if="dataForm.refundType === 2"
                    type="warning"
                  >
                    {{ $t("order.order.singleItemRefund") }}
                  </el-tag>
                </el-form-item>
                <el-form-item :label="$t('order.order.refundMethod') + ':'">
                  <el-tag
                    v-if="dataForm.applyType === 1"
                    type="warning"
                  >
                    {{ $t("order.order.onlyRefund") }}
                  </el-tag>
                  <el-tag
                    v-if="dataForm.applyType === 2"
                    type="warning"
                  >
                    {{ $t("order.order.refundAndMoney") }}
                  </el-tag>
                </el-form-item>
              </div>
              <div class="order-info">
                <div class="order-details">
                  <div class="detail-title">
                    <img
                      src="~@/assets/images/car.png"
                      alt
                    >
                    <span class="prompt">{{
                      $t("order.order.refundDetails")
                    }}</span>
                  </div>
                  <div class="detail-cont">
                    <div class="detail01">
                      <div class="text-width">
                        <el-form-item :label="$t('order.order.number') + '：'">
                          <span>{{ dataForm.orderId }}</span>
                        </el-form-item>
                        <el-form-item
                          :label="$t('order.order.orderActuallyPaid') + '：'"
                        >
                          <span
                            v-if="dataForm.actualTotal"
                            class="totalprice"
                          >{{ formatPrice(dataForm.actualTotal, 1).toFixed(2)
                          }}{{ $t("constant.dollar") }}</span>
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
                        </el-form-item>
                        <el-form-item
                          :label="$t('order.order.refundAmount') + '：'"
                        >
                          <span
                            v-if="dataForm.refundAmount"
                          >{{ formatPrice(dataForm.refundAmount, 1).toFixed(2)
                          }}{{ $t("constant.dollar") }}</span>
                          <span
                            v-if="dataForm.refundAmount && dataForm.refundScore"
                          >+
                          </span>
                          <span
                            v-if="dataForm.refundScore"
                          >{{ dataForm.refundScore
                          }}{{ $t("order.order.integral") }}</span>
                        </el-form-item>
                        <el-form-item
                          :label="$t('order.order.applicationTime') + '：'"
                        >
                          <span>{{ dataForm.createTime }}</span>
                        </el-form-item>
                        <el-form-item
                          :label="$t('order.order.reasonForReturn') + '：'"
                        >
                          <span>{{ dataForm.buyerReasonValue }}</span>
                        </el-form-item>
                        <el-form-item
                          :label="$t('order.order.refundInstructions') + '：'"
                        >
                          <span class="text-line-feed">{{ dataForm.buyerDesc }}</span>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <template
                    v-if="dataForm.orderRefundAddr && dataForm.orderRefundAddr.deliveryName"
                  >
                    <div class="detail-title">
                      <img
                        src="~@/assets/images/car.png"
                        alt
                      >
                      <span class="prompt">{{
                        $t("order.order.logisticsDetails")
                      }}</span>
                    </div>
                    <div class="detail-cont">
                      <div class="detail01">
                        <div class="text-width">
                          <el-form-item
                            v-if="
                              dataForm.orderRefundAddr &&
                                dataForm.orderRefundAddr.deliveryName
                            "
                            :label="
                              $t('order.order.logisticsName') + '：'
                            "
                          >
                            <span>{{ dataForm.orderRefundAddr.deliveryName }}</span>
                          </el-form-item>
                          <el-form-item
                            v-if="
                              dataForm.orderRefundAddr &&
                                dataForm.orderRefundAddr.deliveryNo
                            "
                            :label="
                              $t('order.order.trackingNumber') + '：'
                            "
                          >
                            <span>{{ dataForm.orderRefundAddr.deliveryNo }}</span>
                          </el-form-item>
                          <el-form-item
                            v-if="
                              dataForm.orderRefundAddr &&
                                dataForm.orderRefundAddr.senderRemarks
                            "
                            :label="
                              $t('order.order.compradorMsg') + '：'
                            "
                          >
                            <span class="text-line-feed">{{
                              dataForm.orderRefundAddr.senderRemarks
                            }}</span>
                          </el-form-item>
                          <el-form-item
                            v-if="
                              dataForm.orderRefundAddr &&
                                dataForm.orderRefundAddr.senderMobile
                            "
                            :label="
                              $t('order.order.buyerPhone') + '：'
                            "
                          >
                            <span>{{
                              dataForm.orderRefundAddr.senderMobile
                            }}</span>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="buyers">
                  <div class="detail-title">
                    <img
                      width="18px"
                      height="18px"
                      src="~@/assets/images/buyer.png"
                      alt
                      style="margin-right: 15px"
                    >
                    <el-form-item
                      :label="
                        $t('order.order.refundCertificate')
                      "
                      style="margin-top: 22px"
                      label-width="82px"
                    />
                  </div>
                  <div class="buyers-info">
                    <el-image
                      v-for="(img,index) in dataForm.imgUrls"
                      :key="index"
                      class="rotating-img"
                      style="width: 100px; height: 100px"
                      :src="img"
                      :preview-src-list="dataForm.imgUrls"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                          alt
                        >
                      </template>
                    </el-image>
                  </div>
                  <template
                    v-if="
                      dataForm.orderRefundAddr && dataForm.orderRefundAddr.imgs
                    "
                  >
                    <div
                      class="detail-title"
                      style="margin-top: 40px"
                    >
                      <img
                        width="18px"
                        height="18px"
                        src="~@/assets/images/buyer.png"
                        alt
                        style="margin-right: 15px"
                      >
                      <el-form-item
                        :label="
                          $t('order.order.logisticsCertificate')
                        "
                        style="margin-top: 22px"
                        label-width="82px"
                      />
                    </div>
                    <div class="buyers-info">
                      <div class="detail02">
                        <el-image
                          v-for="(img,index) in orderRefundAddrPhotos"
                          :key="index"
                          class="rotating-img"
                          style="width: 100px; height: 100px"
                          :src="img"
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
                    </div>
                  </template>
                </div>
              </div>
              <div class="item-list">
                <el-table
                  :data="dataForm.orderItems"
                  border
                >
                  <el-table-column
                    :label="$t('order.order.refundGoods')"
                  >
                    <template #default="scope">
                      <div class="info">
                        <div class="info-img">
                          <ImgShow
                            :src="scope.row.pic"
                            :style="{width:'100px',height:'100px'}"
                          />
                        </div>
                        <div class="info-text">
                          <div class="text-overflow-hide">
                            <span
                              v-if="scope.row.giveawayOrderItemId"
                              class="gift-icon"
                            >赠品</span>{{ scope.row.spuName }}
                          </div>
                          <div class="">
                            {{ scope.row.skuName ? scope.row.skuName : '' }}
                          </div>
                        </div>
                      </div>
                      <!-- 赠品 -->
                      <div
                        v-if="scope.row.giveawayList && !prodLength"
                        class="gift-prod"
                      >
                        <div
                          v-for="(item,index) in scope.row.giveawayList"
                          :key="index"
                          class="gift"
                        >
                          <span class="name">【赠品】{{ item.spuName }}</span>
                          <span
                            v-if="item.skuName"
                            class="name"
                          >{{ item.skuName }}</span>
                          <span>×{{ item.count }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    :label="$t('order.order.unitPrice')"
                    align="center"
                    width="160"
                  >
                    <template #default="scope">
                      <span>{{ formatPrice(scope.row.price, 1).toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="count"
                    :label="$t('order.order.quantity')"
                    align="center"
                    width="160"
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
                    align="center"
                    width="160"
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
                    align="center"
                    width="160"
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
                    :key="dataForm.refundAmount"
                    prop="spuTotalAmount"
                    :label="$t('order.order.returnAmount')"
                    align="center"
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

              <div
                v-if="dataForm.applyType === 2 && dataForm.orderRefundAddr != null"
                class="sellerRemark"
              >
                <el-row>
                  <el-col :span="2">
                    <div>{{ $t("constant.deliveryAddr") }}：</div>
                  </el-col>
                  <el-col :span="22">
                    <div
                      v-if="dataForm.orderRefundAddr"
                      class="refund-addr-txt"
                    >
                      {{ dataForm.orderRefundAddr.consigneeAddr }}
                    </div>
                  </el-col>
                </el-row>
              </div>

              <div
                v-if="
                  dataForm.deliveryTime &&
                    !dataForm.cancelTime &&
                    !dataForm.rejectTime
                "
                class="sellerRemark"
              />

              <div
                v-if="isAgreeRefund === 3"
                class="sellerRemark"
              >
                <el-row>
                  <el-col :span="2">
                    <div>{{ $t("order.order.denialReason") }}：</div>
                  </el-col>
                  <el-col :span="22">
                    <div>
                      <el-input
                        v-model="dataForm.rejectMessage"
                        type="textarea"
                        :rows="4"
                        maxlength="250"
                        show-word-limit
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div
                v-if="dataForm.sellerMsg"
                class="sellerRemark"
              >
                <el-row>
                  <el-col :span="2">
                    <div>{{ $t("order.order.merchantNotes") }}:</div>
                  </el-col>
                  <el-col :span="22">
                    <div>
                      <el-input
                        v-model="dataForm.sellerMsg"
                        type="textarea"
                        :disabled="true"
                        :rows="4"
                        maxlength="250"
                        show-word-limit
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>

              <div style="float: right">
                <el-form-item>
                  <el-row>
                    <!-- 仅退款的时候进行的处理操作 -->
                    <!-- 退货退款的时候进行的处理操作 -->
                  </el-row>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="order-log">
            <div class="log-title">
              <span>{{ $t("order.order.refundLog") }}</span>
            </div>
            <div class="log-cont">
              <el-form-item
                v-if="dataForm.createTime"
                label-width="10px"
              >
                <span>{{ dataForm.createTime }}
                  {{ $t("order.order.submitARefundRequestWa") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.applyType === 2 && dataForm.handelTime && !dataForm.closeType"
                label-width="10px"
              >
                <span>{{ dataForm.handelTime }}
                  {{ $t("order.order.merchantHasProcessedWaBuy") }}</span>
              </el-form-item>

              <el-form-item
                v-if="dataForm.applyType === 1 && dataForm.handelTime && !dataForm.closeType && dataForm.buyerReason !== 7"
                label-width="10px"
              >
                <span>{{ dataForm.handelTime }}
                  {{ $t("order.order.merchantHasProcessedWaSh") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.deliveryTime"
                label-width="10px"
              >
                <span>{{ dataForm.deliveryTime }}
                  {{ $t("order.order.buyerShipmentWaPro") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.receiveTime"
                label-width="10px"
              >
                <span>{{ dataForm.receiveTime }}
                  {{ $t("order.order.merchantHasReceivedWaShGr") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.applyType === 2 && !dataForm.receiveTime && dataForm.isReceived === 0"
                label-width="10px"
              >
                <span>{{ dataForm.updateTime }}
                  {{ $t("order.order.merchantHasProcessedWaSh") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.decisionTime"
                label-width="10px"
              >
                <span>{{ dataForm.decisionTime }}
                  {{ $t("order.order.agreeToRefund") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.refundTime"
                label-width="10px"
              >
                <span>{{ dataForm.refundTime }}
                  {{ $t("order.order.refundsuccessfully") }}</span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.returnMoneySts === -1 && dataForm.closeType === 1"
                label-width="10px"
              >
                <span>{{ dataForm.closeTime }} {{ $t("order.order.refundClosed") }} {{ $t("order.order.buyerHasWithdrawn") }}
                </span>
              </el-form-item>
              <el-form-item
                v-if="dataForm.handelTime && dataForm.returnMoneySts === -1"
                label-width="10px"
              >
                <span>{{ dataForm.updateTime }}
                  {{ dataForm.closeType === 1 ? $t("order.order.buyerHasWithdrawn"):
                    dataForm.closeType === 2 ? $t("order.order.merchantRejected") : $t("order.order.requestTimeOut")
                  }}{{ '，'+ $t("order.order.refundClosed") }}
                </span>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import Big from 'big.js'
import * as api from '@/api/order/order-refund'
import { formatPrice } from '@/utils/index.js'

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const dataForm = ref({})
const isReceived = ref(0)
const visible = ref(false)
const orderRefundAddrPhotos = reactive([])

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

const dataFormRef = ref()
const isAgreeRefund = ref(2)
const prodLength = ref(false) // 是否为单个赠品
const init = (id) => {
  dataForm.value.refundId = id || 0
  isReceived.value = 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  orderRefundAddrPhotos.length = 0
  isAgreeRefund.value = 2
  prodLength.value = false
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
        handleArr(orderRefundAddrPhotos, onHandleImgUrl(imgUrls))
      }
      // 申请类型:1,仅退款,2退款退货
      if (data.applyType === 2 && !data.handelTime) {
        onGetRefundAddrList()
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

// 表单提交
const onSubmit = () => {}

// 加载收货地址模板
const onGetRefundAddrList = () => {}

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

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use './refund-order-info.scss';
</style>
