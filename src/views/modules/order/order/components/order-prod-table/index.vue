<template>
  <div class="component-combine-table">
    <table>
      <thead>
        <tr>
          <th style="width: 500px;">
            商品
          </th>
          <th>单价</th>
          <th>数量</th>

          <!-- 预售 -->
          <template v-if="orderInfo.preSaleType===1">
            <th>定金</th>
            <th>定金膨胀</th>
            <th>尾款</th>
          </template>

          <th>优惠金额</th>
          <th>总价</th>
        </tr>
      </thead>
      <tbody
        class="body-list"
      >
        <tr
          v-for="(item, index) in orderInfo.orderItems"
          :key="index"
        >
          <td>
            <div class="df">
              <img-show
                :src="item.pic"
                :img-style="{width:'60px',height:'60px'}"
              />
              <div class="name-box">
                <span class="name">
                  <span
                    v-if="item.activityType === 5"
                    class="gift-icon"
                  >赠品</span>
                  {{ item.spuName + ' ' + (item.skuName === null?' ':item.skuName) }}
                </span>
                <div
                  v-if="item.returnMoneySts &&
                    item.returnMoneySts < 6 &&
                    item.returnMoneySts > 0
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
                    ][1]
                  }}
                </div>
              </div>
            </div>

            <!-- 组合 -->
            <div
              v-if="item.comboItemList"
              class="order-prod-item-give-con"
            >
              <div
                v-for="(combo, comboIndex) in item.comboItemList"
                :key="comboIndex"
                class="giveaway-item"
              >
                <span class="giveaway-item-name">【组合】{{ combo.spuName }}</span>
                <span
                  class="giveaway-item-name sku"
                >{{ combo.skuName || combo.supplierSkuName }}</span>
                <span class="giveaway-item-sku-count">×{{ combo.count }}</span>
              </div>
            </div>

            <!-- 赠品 -->
            <div
              v-if="item.giveawayList"
              class="order-prod-item-give-con"
            >
              <div
                v-for="(giveaway, giveawayIndex) in item.giveawayList"
                :key="giveawayIndex"
                class="giveaway-item"
              >
                <span class="giveaway-item-name">【赠品】{{ giveaway.spuName }}</span>
                <span
                  v-if="giveaway.skuName"
                  class="giveaway-item-name"
                >{{ giveaway.skuName }}</span>
                <span class="giveaway-item-sku-count">×{{ giveaway.count }}</span>
              </div>
            </div>
          </td>
          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.spuTotalAmount, item.count).toFixed(2) }}</span>
          </td>
          <td>
            <span>{{ item.count }}</span>
          </td>

          <!-- 预售 -->
          <template v-if="orderInfo.preSaleType===1">
            <td />
            <td />
            <td />
          </template>

          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.shareReduce, 1).toFixed(2) }}</span>
          </td>
          <td>
            <span>{{ item.activityType === 5 ? '-' : formatPrice(item.spuTotalAmount, item.count).toFixed(2) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/index.js'

const props = defineProps({
  dataForm: {
    type: Object,
    default: () => {
      return {}
    }
  }
})

const orderInfo = computed(() => {
  const { dataForm } = props
  return dataForm
})
</script>

<style scoped lang="scss">
@use "../order-info";

.component-combine-table {
  table {
    border-collapse: collapse;
    letter-spacing: 1px;
    border: 1px solid #eaecef;
    width: 100%;
    border-spacing: inherit;

    th {
      border: 1px solid #eaecef;
      padding: 8px 12px;
      color: rgb(144, 147, 153);
      font-size: 14px;
      user-select: none;
    }

    .body-list {
      tr {
        td {
          text-align: center;
          border: 1px solid #eaecef;
          padding: 8px 12px;
        }

        &:hover {
          background-color: rgb(245, 247, 250);
        }
      }
    }
  }

  .order-status {
    display: inline-block;
    margin-top: 15px;
    margin-right: 4px;
    padding: 2px 4px;
    border: 1px solid #e43130;
    border-radius: 2px;
    color: #e43130;
    font-size: 12px;
  }

  // 赠品盒子
  .order-prod-item-give-con {
    text-align: left;
    width: 100%;
    padding: 10px 50px 0 63px;
    box-sizing: border-box;

    .giveaway-item {
      display: flex;
      align-items: center;

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
