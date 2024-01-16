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
        <div
          v-for="(comboItem, comboIndex) in orderItem.comboList"
          :key="comboIndex"
          class="giveaway-item"
        >
          <div class="giveaway-item-name">
            【组合】{{ comboItem.spuName }}
          </div>
          <div class="giveaway-item-name sku">
            {{ comboItem.skuName || comboItem.supplierSkuName }}
          </div>
          <div class="giveaway-item-sku-count">
            x{{ comboItem.count }}
          </div>
        </div>
      </div>

      <!-- 赠品信息 -->
      <div
        v-if="orderItem.giveawayList"
        class="order-prod-item-give-con"
      >
        <div
          v-for="(giveawayItem, giveIndex) in orderItem.giveawayList"
          :key="giveIndex"
          class="giveaway-item"
        >
          <div class="giveaway-item-name">
            【赠品】{{ giveawayItem.spuName }}
          </div>
          <div class="giveaway-item-sku-count">
            {{ giveawayItem.skuName || '' }} x{{ giveawayItem.count }}
          </div>
        </div>
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
    width: 100%;
    padding: 0 50px 10px 103px;
    box-sizing: border-box;
    .giveaway-item {
      display: flex;
      align-items: center;
      margin-bottom: 0 !important;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .giveaway-item-name {
      margin-right: 5px;
      box-sizing: border-box;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .giveaway-item-name.sku {
      color: #999;
    }

    .giveaway-item-sku-count {
      white-space: nowrap;
      margin-left: 10px;
      color: #999;
      width: auto;
    }
  }
}

</style>
