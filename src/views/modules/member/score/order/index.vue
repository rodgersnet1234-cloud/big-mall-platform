<template>
  <div class="mod-order-order page-order">
    <div class="screening-conditions">
      <el-form
        :inline="true"
        :model="dataForm"
        @submit.prevent
        @keyup.enter="getDataList()"
      >
        <div class="search">
          <el-form-item
            :label="$t('order.order.number') + '：'"
          >
            <el-input
              v-model.number="dataForm.orderId"
              :placeholder="$t('order.order.number')"
              style="width: 200px"
              autocomplete="off"
              :controls="false"
              oninput="value=value.replace(/[^0-9]/g,'')"
              :precision="0"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('order.order.status') + '：'">
            <el-select
              v-model="status"
              clearable
              :placeholder="$t('order.order.statusMsg')"
              @change="orderStatus"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('order.order.paymentMethod') + '：'"
          >
            <el-select
              v-model="dataForm.payType"
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
        </div>
        <div class="search">
          <el-form-item
            :label="$t('order.order.theRecipientSName') + '：'"
          >
            <el-input
              v-model="dataForm.consignee"
              :placeholder="$t('order.order.pleaseEnRecipName')"
              maxlength="100"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('constant.contactTel') + '：'">
            <el-input
              v-model="dataForm.mobile"
              :placeholder="$t('order.order.pleaseEnterNumber')"
              maxlength="11"
              style="width: 200px"
              clearable
            />
          </el-form-item>

          <el-form-item
            :label="$t('order.order.logisticsType') + '：'"
          >
            <el-select
              v-model="dataForm.deliveryType"
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
        </div>
        <div class="search">
          <el-form-item :label="$t('order.order.createTime') + '：'">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              :range-separator="$t('date.tip')"
              value-format="YYYY-MM-DD HH:mm:ss"
              :start-placeholder="$t('date.start')"
              :end-placeholder="$t('date.end')"
            />
            <el-button
              class="ml10"
              @click="setDateRange(1)"
            >
              {{
                $t("date.t")
              }}
            </el-button>
            <el-button
              @click="setDateRange(2)"
            >
              {{
                $t("date.y")
              }}
            </el-button>
            <el-button
              @click="setDateRange(3)"
            >
              {{
                $t("date.n")
              }}
            </el-button>
            <el-button
              @click="setDateRange(4)"
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
              @click="onSearch()"
            >
              {{ $t("order.order.query") }}
            </el-button>

            <el-button
              class="operation-btn"
              @click="getSoldExcel()"
            >
              {{ $t("table.export") }}
            </el-button>

            <el-button
              class="operation-btn"
              @click="clear()"
            >
              {{ $t('table.reset') }}
            </el-button>

            <el-button
              class="operation-btn"
              @click="uploadSpu"
            >
              {{ $t("order.order.BulkShipping") }}
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
              @click="selectNav(0)"
            >
              {{ $t("date.a") }}
            </li>
            <li
              :class="['nav-item', sts === 1 ? 'selected' : '']"
              @click="selectNav(1)"
            >
              {{ $t("pay.obligation") }}
            </li>
            <li
              :class="['nav-item', sts === 2 ? 'selected' : '']"
              @click="selectNav(2)"
            >
              {{ $t("order.order.toBeShipped") }}
            </li>
            <li
              :class="['nav-item', sts === 3 ? 'selected' : '']"
              @click="selectNav(3)"
            >
              {{ $t("order.order.pendingReceipt") }}
            </li>
            <li
              :class="['nav-item', sts === 5 ? 'selected' : '']"
              @click="selectNav(5)"
            >
              {{ $t("order.order.successfulTransaction") }}
            </li>
            <li
              :class="['nav-item', sts === 6 ? 'selected' : '']"
              @click="selectNav(6)"
            >
              {{ $t("order.order.transactionFailed") }}
            </li>
          </ul>
        </div>

        <!-- 列标题 -->
        <div :class="['tit', showHeadScroll ? 'fixed-top' : '']">
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
              <span class="item">
                {{ $t("order.order.actualPaymentAmount") }}
              </span>
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
              <span class="item">{{ $t("order.order.afterSale") }}</span>
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
          v-for="order in pageVO.list"
          :key="order.orderId"
          class="prod"
          style="margin-bottom: 15px"
        >
          <div class="prod-tit">
            <span>{{ $t("order.order.number") }}:{{ order.orderId }}</span>
            <span>{{ $t("order.order.createTime") }}:{{ order.createTime }}</span>
          </div>
          <div class="prod-cont">
            <el-row style="width: 100%">
              <el-col :span="10">
                <div class="prod-item">
                  <div
                    v-for="orderItem in order.orderItems"
                    :key="orderItem.orderItemId"
                    class="items name"
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
                          v-if="order.orderType === 1 || order.orderType === 2"
                          class="order-status"
                        >
                          {{
                            order.orderType === 1
                              ? $t("order.order.groupPurchaseOrder")
                              : order.orderType === 2
                                ? $t("order.order.spikeOrder")
                                : ""
                          }}
                        </div>
                        <div
                          v-if="
                            !orderItem.returnMoneySts ||
                              orderItem.returnMoneySts < 0 ||
                              orderItem.returnMoneySts > 5
                          "
                          class="order-status"
                        >
                          {{
                            orderItem.status === 0 && order.status === 2
                              ? $t("order.order.pendingReceipt")
                              : [
                                "",
                                $t("pay.obligation"),
                                orderItem.beDeliveredNum === 0 ? $t("order.order.shipmentCompleted"):$t("order.order.toBeShipped"),
                                $t("order.order.pendingReceipt"),
                                "",
                                $t("order.order.successfulTransaction"),
                                $t("order.order.transactionFailed"),
                                $t("group.waitGroup"),
                              ][order.status]
                          }}
                        </div>
                        <div
                          v-else
                          class="order-status"
                        >
                          {{
                            [
                              "",
                              $t("order.order.buyerApplication"),
                              $t("order.order.sellerAccepts"),
                              $t("order.order.selShipment"),
                              $t("order.order.sellerReceiving"),
                              $t("order.order.refundSuccessfully"),
                            ][orderItem.returnMoneySts]
                          }}
                        </div>
                        <div
                          v-if="
                            order.deliveryType === 2 || order.deliveryType === 4
                          "
                          class="order-status"
                        >
                          {{
                            order.deliveryType === 2
                              ? $t("order.order.selfMention")
                              : order.deliveryType === 4
                                ? $t("order.order.sameCityDelivery")
                                : ""
                          }}
                        </div>
                        <div
                          v-if="order.preSaleTime"
                          class="order-status"
                        >
                          {{ $t("order.order.estimatedShippingTime") }}：{{
                            order.preSaleTime
                          }}
                        </div>
                      </div>
                    </div>
                    <div class="prod-price">
                      <span>{{ formatPrice(orderItem.price, 1).toFixed(2) }}</span>
                      <span>{{ orderItem.count }}{{ $t("constant.piece") }}</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="3"
                style="height: 100%"
              >
                <div class="item">
                  <div>
                    <span
                      v-if="order.actualTotal"
                      class="totalprice"
                    >{{ formatPrice(order.actualTotal, 1).toFixed(2)
                    }}{{ $t("constant.dollar") }}</span>
                    <span
                      v-if="order.actualTotal && order.orderScore"
                      class="totalprice"
                    >&nbsp;+&nbsp;
                    </span>
                    <span
                      v-if="order.orderScore"
                      class="totalprice"
                    >{{ order.orderScore
                    }}{{ $t("order.order.integral") }}</span>
                    <div
                      v-if="order.freightAmount"
                      class="totalprice"
                    >
                      {{ $t("order.order.freightAmount") + '：￥' + formatPrice(order.freightAmount, 1).toFixed(2) }}
                    </div>
                    <div
                      v-if="order.platformFreeFreightAmount"
                      class="totalprice"
                    >
                      {{ $t("order.order.platformFreeFreightAmount") + '：￥' + formatPrice(order.platformFreeFreightAmount, 1).toFixed(2) }}
                    </div>
                    <div>
                      {{ $t("order.order.total") }}{{ order.allCount
                      }}{{ $t("constant.piece") }}
                    </div>
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
                      {{ order.consignee }}
                    </div>
                    <div class="buyer-phone">
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
                      v-if="order.status === 1"
                    >{{ $t("pay.obligation") }}</span>
                    <span
                      v-else-if="order.status === 2"
                    >{{ $t("order.order.toBeShipped") }}</span>
                    <span
                      v-else-if="order.status === 3"
                    >{{ $t("order.order.pendingReceipt") }}</span>
                    <span
                      v-else-if="order.status === 7"
                    >{{ $t("group.waitGroup") }}</span>
                    <span
                      v-else-if="order.status === 5"
                    >{{ $t("order.order.successfulTransaction") }}</span>
                    <span
                      v-else-if="order.status === 6"
                    >{{
                      $t("order.order.transactionFailed")
                    }}</span>
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
                  >{{ $t("order.order.refundApplication") }}</span>
                  <span
                    v-else-if="order.refundStatus === 2"
                  >{{ $t("order.order.refundsuccessfully") }}</span>
                  <span
                    v-else-if="order.refundStatus === 3"
                  >{{ $t("order.order.partialRefundSucc") }}</span>
                  <span
                    v-else-if="order.refundStatus === 4"
                  >{{ $t("order.order.refundFailed") }}</span>
                  <span
                    v-else
                  >
                    {{ $t("order.order.noAfterSales") }}
                  </span>
                </div>
              </el-col>
              <el-col
                :span="2"
                style="height: 100%"
              >
                <div class="item">
                  <div class="operate">
                    <el-button
                      v-permission="['score:order:info']"
                      link
                      type="primary"
                      @click="onAddOrUpdate(order.orderId)"
                    >
                      {{ $t("order.order.seeDetails") }}
                    </el-button>
                    <el-button
                      v-if="
                        order.status === 3 && order.deliveryType === 1 && order.updateOrViewDeliveryInfo === 1
                      "
                      v-permission="['score:order:logistics']"
                      link
                      type="primary"
                      @click="reviseLogistics(order.orderId)"
                    >
                      {{ $t("order.order.modifyLogistics") }}
                    </el-button>
                    <el-button
                      v-if="order.status === 2 && order.deliveryType !== 2"
                      v-permission="['score:order:delivery']"
                      link
                      type="primary"
                      @click="changeOrder(order)"
                    >
                      {{ $t("order.order.delivery") }}
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div
          v-if="!pageVO.list.length"
          class="empty"
        >
          {{ $t("order.order.noData") }}
        </div>
      </div>
    </div>
    <!-- 修改物流弹窗 -->
    <el-dialog
      v-model="logVisible"
      :title="$t('order.order.modifyLogistics')"
      :close-on-click-modal="false"
      width="50%"
    >
      <!-- 修改 -->
      <div
        v-if="isReviseLog"
        v-loading="isLogLoading"
        class="revise-log"
      >
        <div class="change-logistics">
          <div class="warning">
            {{ $t("order.order.ifModifyTheLog") }}
          </div>
          <div class="log-list">
            <div
              v-for="(logItem, index) in logisticsInfo"
              :key="index"
              class="item"
            >
              <div class="i-tit">
                <div class="big">
                  {{ $t("order.order.package") }}{{ index + 1 }}
                </div>
                <div class="text">
                  {{ $t("order.order.total") }} {{ logItem.allCount }}
                  {{ $t("constant.piece") }}{{ $t("constant.product") }}
                </div>
              </div>
              <div class="goods-box">
                <div
                  v-for="(
                    orderItem, curIndex
                  ) in logItem.orderItems"
                  :key="curIndex"
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
                <el-form
                  ref="logDataFormRef"
                  :model="logDataForm"
                  label-width="95px"
                  @submit.prevent
                  @keyup.enter="logDataFormSubmit()"
                >
                  <el-form-item
                    :label="$t('order.order.deliveryMethod') + '：'"
                    style="text-align: left;"
                  >
                    <el-radio-group v-model="logItem.tempDeliveryType">
                      <el-radio
                        :label="1"
                        disabled
                      >
                        {{
                          $t("order.order.ordinaryExpress")
                        }}
                      </el-radio>
                      <el-radio
                        :label="3"
                        disabled
                      >
                        {{
                          $t("order.order.noNeedRequired")
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!--配送方式 线上 线下-->
                  <el-form-item
                    v-if="logItem.tempDeliveryType === 1"
                    :label="$t('order.order.delType') + '：'"
                    style="text-align: left;"
                  >
                    <el-radio-group v-model="logItem.deliveryType">
                      <el-radio
                        :label="0"
                        disabled
                      >
                        {{
                          $t("order.order.onlineDelivery")
                        }}
                      </el-radio>
                      <el-radio
                        :label="1"
                        disabled
                      >
                        {{
                          $t("order.order.selfDelivery")
                        }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <div
                    v-if="logItem.deliveryType === 1"
                    class="info-int"
                  >
                    <el-form-item
                      :label="$t('order.order.courierCompany') + '：'"
                      class="form-item"
                      style="text-align: left;"
                    >
                      <div
                        v-if="logVisible"
                        class="con"
                      >
                        <SelectLazy v-model="logItem.deliveryCompanyId" />
                      </div>
                    </el-form-item>
                    <el-form-item
                      :label="$t('order.order.trackingNumber') + '：'"
                      class="form-item"
                    >
                      <el-input
                        v-model="logItem.deliveryNo"
                        controls-position="right"
                        :min="0"
                        :class="['int-frame', errorNum === 1 ? 'errortip' : '']"
                        :placeholder="$t('order.order.trackingNumber')"
                      />
                    </el-form-item>
                  </div>
                  <div
                    v-if="logItem.deliveryType === 0"
                    class="info-int"
                  >
                    <el-form-item
                      :label="$t('order.order.courierCompany') + '：'"
                      class="form-item"
                      style="text-align: left;"
                    >
                      <div
                        v-if="logVisible"
                        class="con"
                      >
                        {{ deliveryCompanyType[logItem.deliveryCompanyId - 1].label }}
                      </div>
                    </el-form-item>
                    <el-form-item
                      :label="$t('order.order.trackingNumber') + '：'"
                      class="form-item"
                    >
                      {{ logItem.deliveryNo }}
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>

        <!-- 确认 -->
        <div
          v-if="!isReviseLog"
          class="change-logistics"
        >
          <div class="warning">
            {{ $t("order.order.ifModifyTheLog") }}
          </div>
          <el-table
            class="log-info-table"
            :data="confirmList"
          >
            <el-table-column
              property="deliveryCompanyIdName"
              :label="$t('order.order.packageName')"
              width="220"
              style="text-align: left"
            />
            <el-table-column
              property="allCount"
              :label="$t('order.order.amountOfGoods')"
              width="140"
            />
            <el-table-column
              property="delMethod"
              :label="$t('order.order.deliveryMethod')"
              width="140"
            />
            <el-table-column
              property="name"
              :label="$t('order.order.logisticsCompany')"
              width="170"
            />
            <el-table-column
              property="deliveryNo"
              :label="$t('order.order.trackingNumber')"
            />
          </el-table>
        </div>
      </div>

      <template #footer>
        <div
          v-if="isReviseLog"
          class="dialog-footer"
        >
          <el-button @click="logVisible = false">
            {{
              $t("table.cancel")
            }}
          </el-button>
          <el-button
            type="primary"
            @click="logDataFormSubmit()"
          >
            {{
              $t("order.order.save")
            }}
          </el-button>
        </div>

        <div
          v-else
          class="dialog-footer"
        >
          <el-button @click="backToRevise()">
            {{
              $t("order.order.backToModify")
            }}
          </el-button>
          <el-button
            type="primary"
            @click="confirmRevise()"
          >
            {{
              $t("order.order.confirmTheChanges")
            }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- /修改物流弹窗 -->
    <order-upload
      v-if="uploadVisible"
      ref="spuUploadRef"
      :param="dataForm"
      @refresh-data-list="spuUploadRefreshDataList"
    />
    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total > 0"
      :current-page="pageQuery.pageNum"
      :page-size="pageQuery.pageSize"
      :total="pageVO.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
    <order-delivery-update
      v-if="devyVisible"
      ref="orderDeliveryUpdateRef"
      @refresh-order-delivery-update="getDataList"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './components/order-info/index.vue'
import { checkPermission } from '@/directive/permission/index.js'
import moment from 'moment'
import Pagination from '@/components/Pagination/index.vue'
import OrderDeliveryUpdate from './components/order-delivery-update/index.vue'
import OrderUpload from './components/order-upload/index.vue'
import * as api from '@/api/order/order.js'
import * as deliveryCompanyApi from '@/api/delivery/delivery-company.js'
import SelectLazy from '@/components/select-lazy/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Big from 'big.js'

const vPermission = checkPermission

const options = [
  {
    value: 1,
    label: $t('pay.obligation')
  },
  {
    value: 2,
    label: $t('order.order.toBeShipped')
  },
  {
    value: 3,
    label: $t('order.order.pendingReceipt')
  },
  {
    value: 5,
    label: $t('order.order.successfulTransaction')
  },
  {
    value: 6,
    label: $t('order.order.transactionFailed')
  }
]

const deliveryType = [
  {
    value: 1,
    label: $t('order.order.ordinaryExpress')
  },
  {
    value: 3,
    label: $t('order.order.noNeedRequired')
  }
]

const deliveryCompanyType = [{
  value: 1,
  label: '顺丰速运'
}, {
  value: 2,
  label: '京东快递'
}, {
  value: 3,
  label: '圆通速递'
}, {
  value: 4,
  label: '韵达快递'
}, {
  value: 5,
  label: '中通快递'
}, {
  value: 6,
  label: '申通快递'
}, {
  value: 7,
  label: '百世快递'
}, {
  value: 8,
  label: 'EMS'
}]

const payType = [
  {
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
  }
]

const dataForm = ref({})
const route = useRoute()
onMounted(() => {
  if (route.query.orderNumber) dataForm.value.orderId = route.query.orderNumber

  // 获取首页跳转传递的参数
  if (Object.keys(route.params).length > 0) {
    selectNav(route.params.orderStatus)
  } else {
    getDataList()
  }
  getLogisticsList()

  // 监听页面滚动
  window.addEventListener('scroll', scrollToTop)
})

const handleSizeChange = (val) => {
  pageQuery.pageSize = val
  getDataList(1)
}

const handleCurrentChange = (val) => {
  pageQuery.pageNum = val
  getDataList(1)
}

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

const showHeadScroll = ref(false) // 修改物流相关
/**
 * 页面滚动事件
 */
const scrollToTop = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
  showHeadScroll.value = scrollTop > 390
}

const logDataForm = reactive({
  deliveryCompanyId: '', // 当前物流公司id
  deliveryNo: '', // 物流单号
  names: [] // 物流公司列表
})
/**
 * 请求物流公司列表
 */
const getLogisticsList = () => {
  deliveryCompanyApi.list().then((data) => {
    logDataForm.names = data
  })
}

// 确认修改弹窗
const isReviseLog = ref(true) // 是否正在修改物流信息
const confirmList = ref([]) // 确认修改信息
/**
 * 返回修改（物流信息）
 */
const backToRevise = () => {
  isReviseLog.value = true // 修改弹窗
  confirmList.value = [] // 清空确认列表
}

const dateRange = ref([])
const status = ref(null)
let oldPar = {}
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const sts = ref(0)
/**
 * 获取数据列表
 */
const getDataList = (type = 0) => {
  let par = {
    orderId: dataForm.value.orderId,
    orderType: 3,
    payType: dataForm.value.payType,
    consignee: dataForm.value.consignee,
    mobile: dataForm.value.mobile,
    status: status.value,
    deliveryType: dataForm.value.deliveryType,
    refundStatus: dataForm.value.refundStatus,
    startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
    endTime: dateRange.value === null ? null : dateRange.value[1] // 结束时间
  }
  if (type === 0) {
    oldPar = par
  } else {
    par = oldPar
  }
  api.scorePage(Object.assign({
    ...pageQuery,
    ...par
  })).then(res => {
    pageVO.value = res
    sts.value = !status.value ? 0 : status.value
  })
}

/**
 * 导航选择状态
 */
const selectNav = (sts) => {
  sts = parseInt(sts)
  status.value = sts === 0 ? null : parseInt(sts)
  pageQuery.pageNum = 1
  getDataList()
}

const orderStatus = (val) => {
  status.value = val
}

/**
 * 根据选项设置时间
 * 1:今天 2:昨天 3: 近七天 4:近30天 5:近60天
 */
const setDateRange = (val) => {
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
  const startTime = moment().add(startDay, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss')
  // 结束时间
  const endTime = moment().add(endDay, 'days').endOf('days').format('YYYY-MM-DD HH:mm:ss')
  dateRange.value = [startTime, endTime]
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
// 新增 / 修改
const onAddOrUpdate = (val) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value.init(val)
  })
}

// 清空按钮
const clear = () => {
  dataForm.value = {}
  dateRange.value = []
  status.value = null
}
// 搜索查询
const onSearch = () => {
  pageQuery.pageNum = 1
  getDataList()
}

const logVisible = ref(false)
const isLogLoading = ref(false)
const logisticsInfo = ref([]) // 包裹列表
const errorNum = ref(0)
/**
 * 获取包裹物流信息
 */
const reviseLogistics = (orderId) => {
  logVisible.value = !logVisible.value
  isLogLoading.value = true

  logDataForm.deliveryCompanyId = ''
  logDataForm.deliveryNo = ''
  logDataForm.names = []

  logisticsInfo.value = []
  getLogisticsList()
  api.getOrderDeliveries({
    orderId
  }).then(data => {
    logisticsInfo.value = data
    logisticsInfo.value.forEach((el, index) => {
      el.tempDeliveryType = el.deliveryType === 1 || el.deliveryType === 0 ? 1 : el.deliveryType
      el.newDeliveryNo = el.deliveryNo
      el.newDeliveryCompanyId = el.deliveryCompanyId
      el.deliveryCompanyIdName = $t('order.order.package') + Number(index + 1)
      // 修改弹窗
      confirmList.value = [] // 清空确认列表
    })
    isLogLoading.value = false
  })
  errorNum.value = 0
}

/**
 * 点击保存
 */
const logDataFormSubmit = () => {
  let flag = true
  const logisticsInfoPar = logisticsInfo.value
  logisticsInfoPar.forEach((el) => {
    if (el.deliveryType === 3 || el.deliveryType === 0) {
      return
    }
    if (!flag) {
      return false
    }
    const reg = /^[a-zA-Z0-9]{4,30}$/
    if (el.deliveryNo.length === 0) {
      ElMessage({
        message: $t('order.order.logEmpty'),
        type: 'warning'
      })
      flag = false
      errorNum.value = 1
    } else if (!reg.test(el.deliveryNo)) {
      ElMessage({
        message: $t('order.order.checkDeliveryNo'),
        type: 'warning'
      })
      flag = false
      errorNum.value = 1
    } else {
      errorNum.value = 0
      const confirmListPar = confirmList.value
      if ((el.newDeliveryNo.length !== 0 && el.newDeliveryNo !== el.deliveryNo) || (el.newDeliveryCompanyId !== el.deliveryCompanyId)) {
        confirmListPar.push(el)
        confirmListPar.forEach((el) => {
          el.delMethod = $t('order.order.logistics')
          logDataForm.names.forEach((name) => {
            if (el.deliveryCompanyId === name.deliveryCompanyId) {
              el.name = name.name
            }
          })
        })
        confirmList.value = confirmListPar
      }
    }
  })
  if (errorNum.value === 1) {
    return
  } else if (confirmList.value.length === 0) {
    ElMessage({
      message: $t('order.order.noLogIsChanged'),
      type: 'warning'
    })
    flag = false
  }
  if (flag) {
    confirmRevise()
  }
}

/**
 * 确认修改物流信息
 */
const confirmRevise = () => {
  api.updateOrderDeliveries(confirmList.value).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success'
    })

    logDataForm.deliveryCompanyId = ''
    logDataForm.deliveryNo = ''
    logDataForm.names = []

    logisticsInfo.value = []
    isReviseLog.value = true
    logVisible.value = false
  })
}

const uploadVisible = ref(false)
const spuUploadRef = ref(null)
const uploadSpu = () => {
  dataForm.value.startTime = dateRange.value === null ? null : dateRange.value[0]
  dataForm.value.endTime = dateRange.value === null ? null : dateRange.value[1]
  uploadVisible.value = true
  setTimeout(() => {
    nextTick(() => {
      spuUploadRef.value.init()
    })
  }, 500)
}

const devyVisible = ref(false)
const orderDeliveryUpdateRef = ref(null)
/**
 * 发货
 */
const changeOrder = (order) => {
  devyVisible.value = true
  nextTick(() => {
    orderDeliveryUpdateRef.value.init(order)
  })
}

const getSoldExcel = () => {
  if (!dateRange.value || dateRange.value.length < 2) {
    ElMessage.error($t('order.order.pleExpOrderFirst'))
    return
  }
  ElMessageBox.confirm($t('table.sureToExport'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.scoreSoldExcel({
      orderId: dataForm.value.orderId,
      orderType: 3,
      payType: dataForm.value.payType,
      consignee: dataForm.value.consignee,
      mobile: dataForm.value.mobile,
      status: status.value,
      deliveryType: dataForm.value.deliveryType,
      refundStatus: dataForm.value.refundStatus,
      startTime: dateRange.value === null ? null : dateRange.value[0], // 开始时间
      endTime: dateRange.value === null ? null : dateRange.value[1] // 结束时间
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

const spuUploadRefreshDataList = () => {
  getDataList()
}

</script>

<style lang="scss" scoped>
@use "index";
</style>
