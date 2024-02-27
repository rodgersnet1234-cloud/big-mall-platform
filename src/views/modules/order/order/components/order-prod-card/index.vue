<template>
  <div class="prod-item component-combine-list">
    <div
      v-for="orderItem in orderInfo.orderItems"
      :key="orderItem.orderItemId"
      class="items name"
    >
      <div
        :class="['info']"
      >
        <div class="prod-image">
          <img-show :src="orderItem.pic" />
        </div>
        <div class="prod-name">
          <div class="prod-con">
            <div class="prod-name-txt">
              {{ orderItem.spuName + ' ' + (orderItem.skuName ? orderItem.skuName : '') }}
            </div>

            <div
              v-if="orderInfo.orderType === 1 || orderInfo.orderType === 2"
              class="order-status"
            >
              {{
                order.orderType === 1
                  ? $t("order.order.groupPurchaseOrder")
                  : orderInfo.orderType === 2
                    ? $t("order.order.spikeOrder")
                    : ""
              }}
            </div>

            <!-- 预售订单 -->
            <div
              v-if="orderInfo.preSaleType===0||orderInfo.preSaleType===1"
              class="order-status"
            >
              预售订单
            </div>

            <div
              v-if="!orderItem.refundStatus || (orderItem.refundStatus !== 2 && orderItem.refundStatus !== 3)"
              class="order-status"
            >
              {{
                orderItem.status === 0 && orderInfo.status === 2
                  ? $t("order.order.pendingReceipt")
                  : [
                    "",
                    $t("pay.obligation"),
                    orderInfo.waitPurchase === 1 ? '待采购':orderItem.beDeliveredNum === 0 ? $t("order.order.shipmentCompleted"):$t("order.order.toBeShipped"),
                    $t("order.order.pendingReceipt"),
                    "",
                    $t("order.order.successfulTransaction"),
                    $t("order.order.transactionFailed"),
                    $t("group.waitGroup"),
                    '',
                    '待付尾款'
                  ][orderInfo.status]
              }}
            </div>
            <div
              v-else
              class="order-status"
            >
              {{ $t("order.order.transactionFailed") }}
            </div>
            <div
              v-if="orderInfo.orderMold === 1"
              class="order-status"
            >
              虚拟商品订单
            </div>
            <div
              v-if="
                orderInfo.deliveryType === 2 || orderInfo.deliveryType === 4
              "
              class="order-status"
            >
              {{
                orderInfo.deliveryType === 2
                  ? $t("order.order.selfMention")
                  : orderInfo.deliveryType === 4
                    ? $t("order.order.sameCityDelivery")
                    : ""
              }}
            </div>
            <div
              v-if="orderInfo.preSaleTime"
              class="order-status"
            >
              {{ $t("order.order.estimatedShippingTime") }}：{{
                orderInfo.preSaleTime
              }}
            </div>
          </div>
        </div>
        <div class="prod-price">
          <span>{{ formatPrice(orderItem.price, 1).toFixed(2) }}</span>
          <span>{{ orderItem.count }}{{ $t("constant.piece") }}</span>
        </div>
      </div>

      <!-- 组合信息 -->
      <div
        v-if="orderItem.comboList"
        class="order-prod-item-give-con"
      >
        <combo-list
          :combo-list="orderItem.comboList"
          tag-name="【组合】"
        />
      </div>

      <!-- 赠品信息 -->
      <div
        v-if="orderItem.giveawayList"
        class="order-prod-item-give-con"
      >
        <combo-list
          :combo-list="orderItem.giveawayList"
          tag-name="【赠品】"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  order: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const orderInfo = computed(() => {
  const { order } = props
  return order
})

</script>

<style scoped lang="scss">
@use "../../index";

.component-combine-list {
  .info {
    &:last-child {
      border-bottom: none;
    }
  }

  // 赠品盒子
  .order-prod-item-give-con {
    padding: 0 50px 10px 103px;
  }
}

</style>
