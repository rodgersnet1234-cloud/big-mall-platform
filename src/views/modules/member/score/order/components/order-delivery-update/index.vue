<template>
  <el-dialog
    v-model="visible"
    :title="$t('order.order.orderShipping')"
    :close-on-click-modal="false"
    width="50%"
  >
    <div class="mod-order-orderInfo">
      <el-table
        ref="multipleTableRef"
        :data="dataList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="onSelectSome"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        />
        <el-table-column
          :label="$t('constant.product')"
          fit
        >
          <template #default="scope">
            {{ scope.row.spuName + ' ' + (scope.row.skuName === null?' ':scope.row.skuName) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="beDeliveredNum"
          :label="$t('order.order.beDeliveredNum')"
          width="150"
        />
        <el-table-column
          prop="status"
          :label="$t('product.spu.status')"
          show-overflow-tooltip
          width="100"
        >
          <template #default="scope">
            <el-tag
              v-if="
                scope.row.refundStatus && scope.row.refundStatus !== 4
              "
              type="danger"
            >
              {{
                [
                  "",
                  $t("order.order.requestARefund"),
                  $t("order.order.refundsuccessfully"),
                  $t("order.order.partialRefundSucc"),
                  $t("order.order.refundFailed")
                ][scope.row.refundStatus]
              }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.beDeliveredNum !== 0 && scope.row.beDeliveredNum !== scope.row.count"
              type="warning"
            >
              {{ $t("order.order.partialDelivery") }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.beDeliveredNum === 0"
            >
              {{
                $t("order.order.shipmentCompleted")
              }}
            </el-tag>
            <el-tag
              v-else-if="scope.row.beDeliveredNum !== 0"
              type="warning"
            >
              {{ $t("order.order.toBeShipped") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="changeNum"
          :label="$t('order.order.numberOfShipments')"
          fit
          class="numberOfShipments"
          align="center"
          class-name="numberOfShipmentsClass"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.changeNum"
              :disabled="scope.row.beDeliveredNum <= 0"
              :precision="0"
              :min="0"
              :max="scope.row.beDeliveredNum"
              style="width:100%"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-width="100px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <div class="detail-cont">
        <div class="detail01">
          <div class="text-width">
            <el-form-item :label="$t('order.order.waitForDelivery')">
              <span>{{ $t("order.order.delType") }}：{{
                $t("order.order.expressDelivery")
              }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ $t("constant.consignee") }}：{{
                dataForm.orderAddr.consignee
              }}</span>
            </el-form-item>
            <el-form-item>
              <span>{{ $t("constant.mobilePhone") }}：{{
                dataForm.orderAddr.mobile
              }}</span>
            </el-form-item>
            <el-form-item>
              <span style="word-break:break-word;">{{ $t("constant.deliveryAddr") }}：{{
                dataForm.orderAddr.province
              }}{{ dataForm.orderAddr.city
              }}{{ dataForm.orderAddr.area
              }}{{ dataForm.orderAddr.addr }}</span>
            </el-form-item>
          </div>
        </div>
      </div>
      <el-form-item :label="$t('order.order.deliveryMethod') + ':'">
        <el-radio-group
          v-model="dataForm.deliveryType"
          @change="clear()"
        >
          <el-radio
            :label="1"
            :disabled="dataForm.deliveryType === 4"
          >
            {{
              $t("order.order.shouldExpressDelivery")
            }}
          </el-radio>
          <el-radio
            :label="3"
            :disabled="dataForm.deliveryType === 4"
          >
            {{
              $t("order.order.noNeedRequired")
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="dataForm.deliveryType === 1">
        <el-form-item :label="$t('order.order.courierCompany') + '：'">
          <SelectLazy v-model="dataForm.deliveryCompanyId" />
        </el-form-item>
        <el-form-item
          :label="$t('order.order.trackingNumber') + '：'"
          prop="deliveryNo"
        >
          <el-input
            v-model="dataForm.deliveryNo"
            width="80"
            maxlength="90"
            show-word-limit
            :placeholder="$t('order.order.trackingNumber')"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span>
        <el-button
          type="primary"
          @click="visible = false"
        >{{
          $t("table.cancel")
        }}</el-button>
        <el-button
          type="primary"
          @click="submitProds()"
        >{{
          $t("table.confirm")
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as deliveryCompanyApi from '@/api/delivery/delivery-company.js'
import * as orderApi from '@/api/order/order.js'
import SelectLazy from '@/components/select-lazy/index.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshOrderDeliveryUpdate'])
const dataForm = reactive({
  deliveryCompanyId: '',
  orderAddr: {},
  deliveryNo: null,
  names: [],
  orderId: 0,
  deliveryType: 1
})

let isSubmit = false
const visible = ref(false)
let orderId = 0
const dataList = ref([])
/**
 * 获取数据列表
 */
// eslint-disable-next-line no-unused-vars
const init = (order) => {
  isSubmit = false
  dataForm.orderAddr = {}
  visible.value = true
  orderId = order.orderId
  dataForm.orderAddrId = order.orderAddrId
  clear()
  // 修改
  orderApi.getOrderItemAndAddress(order.orderId).then(data => {
    dataForm.orderAddr = data.orderAddr
    dataList.value = data.orderItems
    dataForm.deliveryType = parseInt(data.deliveryType)
    dataList.value.forEach(element => {
      element.changeNum = element.count
    })
  })
}

// eslint-disable-next-line no-unused-vars
const getDeliveryList = () => {
  deliveryCompanyApi.list().then((data) => {
    dataForm.names = data
  })
}

let selectOrderItems = []
/**
 * 修改状态
 */
const onSelectSome = (val) => {
  selectOrderItems = val
}

/**
 * 禁用多选按钮
 */
const checkSelectable = (row) => {
  return row.beDeliveredNum !== 0 && !(row.refundStatus && row.refundStatus !== 4)
}

const clear = () => {
  dataForm.deliveryNo = null
  dataForm.deliveryCompanyId = ''
}

let isTrue = false
let errorInfo = ''
/**
 * 校验数量
 */
const check = () => {
  isTrue = false
  if (selectOrderItems.length <= 0) {
    isTrue = true
    errorInfo = $t('order.order.seleOrd')
    return true
  }
  selectOrderItems.forEach(element => {
    if (element.count <= 0 || element.count < element.changeNum || element.changeNum <= 0) {
      isTrue = true
      errorInfo = element.spuName + $t('order.order.numNotZero') + '！'
      return true
    }
    if (element.changeNum <= 0) {
      isTrue = true
      errorInfo = element.spuName + $t('order.order.numNotZero') + '！'
      return true
    }
    if (element.changeNum == null) {
      isTrue = true
      errorInfo = element.spuName + $t('order.order.fhNumNotZero') + '！'
      return true
    }
  })
  if (dataForm.deliveryCompanyId === '' && dataForm.deliveryType === 1) {
    isTrue = true
    errorInfo = $t('order.order.seleCouCom')
    return true
  }
  if ((dataForm.deliveryNo === 0 || !dataForm.deliveryNo) && dataForm.deliveryType === 1) {
    isTrue = true
    errorInfo = $t('order.order.entCouNum')
    return true
  }
  const reg = /^[a-zA-Z0-9]{4,30}$/
  if (!reg.test(dataForm.deliveryNo) && dataForm.deliveryType === 1) {
    isTrue = true
    errorInfo = $t('order.order.checkDeliveryNo')
    return true
  }
}

const freightAmount = 0
/**
 * 确定事件
 */
const submitProds = () => {
  if (!dataForm.deliveryType) {
    ElMessage.error($t('order.order.pledSeleMet'))
    return
  }
  check()
  if (isTrue) {
    errorMsg(errorInfo)
    return
  }
  if (isSubmit) {
    return
  }
  isSubmit = true

  orderApi.delivery({
    orderId,
    deliveryCompanyId: dataForm.deliveryCompanyId,
    deliveryNo: dataForm.deliveryNo,
    freightAmount,
    selectOrderItems,
    deliveryType: dataForm.deliveryType,
    orderAddrId: dataForm.orderAddrId
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshOrderDeliveryUpdate')
      }
    })
  }).catch(() => {
    isSubmit = false
  })
}

const errorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
@use "index";
</style>
