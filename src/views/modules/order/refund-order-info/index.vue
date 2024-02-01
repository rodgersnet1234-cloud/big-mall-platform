<template>
  <div class="page-refund-order-info">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        {{ $t('order.order.refundDetails') }}
      </div>
    </div>
    <div
      v-if="platInterveneSts===1"
      class="plat-intervene"
    >
      <el-icon :size="14">
        <WarningFilled />
      </el-icon>
      <span v-if="stillAveTime">用户申请平台介入售后，请在{{ dataForm.platformProcessingEndTime }}前处理</span>
      <span v-else>当前商家、用户正在举证，请在{{ dataForm.interventionEndTime }}后进行结果介入判定</span>
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
              <refund-steps :refund-detail="dataForm" />
            </div>
          </div>
        </div>
        <div class="order-state">
          <div class="state-cont">
            <div class="order-info">
              <div class="order-details refund-record-left">
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
                      <div class="text-width-item">
                        <span class="title">{{ $t('order.order.refundCertificate') }}：</span>
                        <div v-if="dataForm.imgUrls?.length">
                          <el-image
                            v-for="(picItem,picInx) in dataForm.imgUrls"
                            :key="picInx"
                            :src="checkFileUrl(picItem)"
                            class="img-box"
                            :initial-index="picInx"
                            :preview-src-list="checkFileUrl(dataForm.imgUrls)"
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
                  </div>
                </div>
              </div>
              <div class="buyers">
                <div class="refund-record-title detail-title">
                  <span>退款记录</span>
                </div>
                <div class="refund-record">
                  <refundRecord :refund-detail="dataForm" />
                </div>
              </div>
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
                      :src="checkFileUrl(picItem)"
                      class="img-box"
                      :initial-index="picInx"
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
                  width="500"
                >
                  <template #default="scope">
                    <div class="prod-info">
                      <div class="prod-image">
                        <img-show
                          :src="scope.row.pic"
                        />
                      </div>
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

                    <!-- 组合 -->
                    <div
                      v-if="scope.row.comboList"
                      class="gift-prod"
                    >
                      <combo-list
                        :combo-list="scope.row.comboList"
                        tag-name="【组合】"
                      />
                    </div>
                    <!-- / 组合 -->

                    <!-- 赠品 -->
                    <div
                      v-if="scope.row.giveawayList && !prodLength"
                      class="gift-prod"
                    >
                      <combo-list
                        :combo-list="scope.row.giveawayList"
                        tag-name="【赠品】"
                      />
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
            <template v-if="platInterveneSts===1">
              <div class="sellerRemark">
                <div class="remark-title star">
                  申请审批：
                </div>
                <div class="remark-content">
                  <el-radio-group
                    v-model="auditForm.isAgreeRefund"
                    @change="refundAuditChange"
                  >
                    <el-radio
                      :label="1"
                    >
                      商家承担退款
                    </el-radio>
                    <el-radio
                      v-if="dataForm.supplierId && dataForm.waitPurchase!==1 && dataForm.supplierHandleStatus!==-1"
                      :label="2"
                    >
                      商家、供应商共同承担退款
                    </el-radio>
                    <el-radio
                      :label="3"
                    >
                      不同意
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="sellerRemark">
                <div class="remark-title">
                  <span class="refundAmount-title">退款金额</span>
                  <el-tooltip
                    effect="dark"
                    content="享受平台优惠的订单不能修改退款金额"
                    placement="top"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  ：
                </div>
                <div
                  v-if="!dataForm.platformRefundAmount"
                  class="remark-content"
                >
                  <div class="refund-price">
                    <el-input
                      v-model="auditForm.refundPrice"
                      type="number"
                      placeholder="请输入"
                      :disabled="auditForm.isAgreeRefund===3"
                      style="width: 250px;outline-style: none;"
                      @blur="onRefundPriceBlur"
                      @keydown="channelInputLimit"
                    />
                    <span class="unit">元</span>
                  </div>
                  <span class="pri-tips">平台售后可按需修改退款金额</span>
                </div>
                <!-- 使用了平台优惠（会员折扣、平台优惠券、积分抵扣）的订单，平台介入时，不能修改退款金额 -->
                <div
                  v-else
                  class="refund-amount-score"
                >
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
              </div>
              <div class="sellerRemark">
                <div class="remark-title star">
                  平台留言：
                </div>
                <div class="remark-content">
                  <el-input
                    v-model="auditForm.platMsg"
                    type="textarea"
                    style="width: 100%;outline-style: none;"
                    :rows="5"
                    maxlength="250"
                    show-word-limit
                  />
                </div>
              </div>
              <div class="btn-bar">
                <el-button
                  type="primary"
                  @click="onHandleAudit()"
                >
                  {{ $t("order.order.confirmTreatment") }}
                </el-button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'

import Big from 'big.js'
import * as api from '@/api/order/order-refund'
import { ElMessage, ElMessageBox } from 'element-plus'
import refundRecord from './conponents/refund-record/index.vue'
import refundSteps from './conponents/refund-steps/index.vue'

const route = useRoute()
onMounted(() => {
  if (route.query.refundId) {
    dataForm.value.refundId = route.query.refundId
    getRefundOrderInfo()
  }
})

onBeforeUnmount(() => {
  intervenEndTimer && clearTimeout(intervenEndTimer)
  intervenFinishTimer && clearTimeout(intervenFinishTimer)
})

// 平台介入开始时间倒计时
let intervenEndTimer = null
const intervenEndTimeCountdown = () => {
  const nowTime = new Date().getTime() // 当前时间
  const endTime = new Date(dataForm.value.interventionEndTime).getTime() // 设置截止时间
  const leftTime = endTime - nowTime // 时间差

  if (leftTime >= 0) {
    // 递归每秒调用countTime方法，显示动态时间效果,
    intervenEndTimer = setTimeout(intervenEndTimeCountdown, 1000)
  } else {
    intervenEndTimer && clearTimeout(intervenEndTimer)
    getRefundOrderInfo() // 重新获取详情
  }
}
// 平台介入结束时间倒计时
let intervenFinishTimer = null
const stillAveTime = ref(false)
const intervenFinishTimeCountdown = () => {
  const nowTime = new Date().getTime() // 当前时间
  const endTime = new Date(dataForm.value.platformProcessingEndTime).getTime() // 设置截止时间
  const leftTime = endTime - nowTime // 时间差

  if (leftTime >= 0) {
    stillAveTime.value = true
    // 递归每秒调用countTime方法，显示动态时间效果,
    intervenFinishTimer = setTimeout(intervenFinishTimeCountdown, 1000)
  } else {
    stillAveTime.value = false
    intervenFinishTimer && clearTimeout(intervenFinishTimer)
  }
}

// 审批变化
const refundAuditChange = (sts) => {
  if (sts === 3) {
    auditForm.refundPrice = ''
  }
}

// 退款金额限制
const onRefundPriceBlur = () => {
  const limitPrice = new Big(dataForm.value.refundActualTotal || dataForm.value.refundAmount).div(100)
  if (auditForm.refundPrice < 0) {
    auditForm.refundPrice = 0
  } else if (auditForm.refundPrice > limitPrice) {
    auditForm.refundPrice = limitPrice
  }
}
const channelInputLimit = (e) => {
  const key = e.key
  // 不允许输入'-'
  if (key === 'e' || key === '+' || key === '-') {
    e.returnValue = false
    return false
  }
  return true
}

// 提交平台介入结果
const auditForm = reactive({
  isAgreeRefund: 1,
  refundPrice: '',
  platMsg: ''
})
let isSubmit = false
const onHandleAudit = () => {
  if (!auditForm.platMsg.trim()) {
    ElMessage({
      message: '请填写留言信息',
      type: 'error',
      duration: 1500
    })
    return
  }
  if (!stillAveTime.value) {
    ElMessageBox.confirm('当前举证时间还未结束，点击确定则举证结束直接进行结果判定，是否继续操作', $t('table.tips'), {
      confirmButtonText: $t('table.confirm'),
      cancelButtonText: $t('table.cancel'),
      type: 'warning'
    }).then(() => {
      if (isSubmit) return
      if (auditForm.isAgreeRefund === 3) {
        onSubmit()
        return
      }
      checkIsLastOrderItem(onSubmit)
    }).catch(() => { })
    return
  }

  if (isSubmit) return
  if (auditForm.isAgreeRefund === 3) {
    onSubmit()
    return
  }
  checkIsLastOrderItem(onSubmit)
}

const onSubmit = () => {
  const submitData = {
    refundId: dataForm.value.refundId,
    sysType: 2,
    platformInterventionRefundType: auditForm.isAgreeRefund, // 平台介入退款方式
    refundAmount: formatPrice(auditForm.refundPrice, 0) || dataForm.value.refundAmount, // 平台介入退款金额
    platformMessage: auditForm.platMsg
  }
  isSubmit = true
  api.audit(submitData).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => {
        isSubmit = false
        onGoBack()
      }
    })
  }).catch(() => {
    isSubmit = false
  })
}

const router = useRouter()
const onGoBack = () => {
  router.replace('/order/refund-order')
}

// 是否为最后一个退款项
const checkIsLastOrderItem = (fn) => {
  api.checkIsLastOrderItem(dataForm.value.refundId).then((data) => {
    if (data && dataForm.value.freightAmount) {
      const calcVal = new Big(dataForm.value.freightAmount).minus(dataForm.value.platformFreeFreightAmount).valueOf()
      if (formatPrice(calcVal, 1).toFixed(2) + '' !== '0.00') {
        ElMessageBox.confirm($t('order.order.lastProdRefundTip').replace('[d]', formatPrice(calcVal, 1).toFixed(2) + ' '), $t('table.tips'), {
          confirmButtonText: $t('table.confirm'),
          cancelButtonText: $t('table.cancel'),
          type: 'warning'
        }).then(() => {
          fn()
        }).catch(() => {
        })
      } else {
        fn()
      }
    } else {
      fn()
    }
  })
}

const prodLength = ref(false) // 是否为单个赠品
const orderRefundAddrPhotos = ref([])
const isReceived = ref(0)
// 平台介入状态 -1.没有介入 1.用户申请介入 2.平台同意介入 3.平台拒绝介入 5.平台同意退款成功
const platInterveneSts = ref(0)
const dataForm = ref({})
const getRefundOrderInfo = () => {
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
      platInterveneSts.value = data.platformInterventionStatus
      if (platInterveneSts.value === 1) {
        const nowTime = new Date().getTime() // 当前时间
        if (data.interventionEndTime) {
          const endTime = new Date(data.interventionEndTime).getTime() // 添加凭证结束时间
          endTime - nowTime > 0 && intervenEndTimeCountdown()
          if (endTime - nowTime < 0 && data.platformProcessingEndTime) {
            const finishTime = new Date(data.platformProcessingEndTime).getTime() // 平台处理介入结束时间
            finishTime - nowTime > 0 && intervenFinishTimeCountdown()
          }
        }
      }
    })
  }
}

const onHandleImgUrl = (imgUrls) => {
  const imgs = []
  imgUrls.forEach((img) => {
    imgs.push(checkFileUrl(img))
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
