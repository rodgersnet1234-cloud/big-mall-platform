<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.couponId? $t('table.view'): $t('table.create')"
    :close-on-click-modal="false"
    top="4vh"
    class="coupon-manage"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      @submit.prevent
    >
      <!-- 优惠券名称 -->
      <el-form-item
        :label="$t('coupon.coupon.couponName')"
        prop="couponName"
      >
        <el-input
          v-model="dataForm.couponName"
          maxlength="20"
          show-word-limit
          :placeholder="$t('coupon.coupon.couponName')"
          disabled
        />
      </el-form-item>
      <!-- 优惠券投放状态(-1:取消投放 0:等待投放 1:投放 2:违规下架 3:等待审核) -->
      <el-form-item
        :label="$t('coupon.coupon.putonStatus')"
        prop="putonStatus"
      >
        <el-radio-group
          v-model="dataForm.putonStatus"
          disabled
        >
          <el-radio :label="0">
            自动投放
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
            >
              <template #content>
                <div>系统会根据优惠券投放时间进行自动投放，投放后状态为投放</div>
              </template>
              <span>
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </el-tooltip>
          </el-radio>
          <el-radio :label="1">
            投放
          </el-radio>
          <el-radio :label="4">
            暂不投放
          </el-radio>
          <el-radio :label="-1">
            取消投放
            <el-tooltip
              class="item"
              effect="light"
              placement="top"
            >
              <template #content>
                <div>当优惠券过期，优惠券状态为取消投放</div>
              </template>
              <span>
                <el-icon><QuestionFilled /></el-icon>
              </span>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="dataForm.putonStatus === 0"
        label="投放时间"
        prop="launchTime"
      >
        <el-input
          v-model="dataForm.launchTime"
          maxlength="32"
          show-word-limit
          disabled
        />
      </el-form-item>
      <el-form-item
        :label="$t('coupon.coupon.couponType')"
        prop="couponType"
      >
        <el-radio-group
          v-model="dataForm.couponType"
          disabled
        >
          <el-radio :label="1">
            代金券
          </el-radio>
          <el-radio :label="2">
            折扣券
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 使用条件 -->
      <el-form-item
        :label="$t('coupon.coupon.cashCondition')"
        prop="cashCondition"
        class="amount"
      >
        <span class="strong-word">消费金额满</span>
        <el-input
          v-model="dataForm.cashCondition"
          :placeholder="$t('coupon.coupon.cashCondition')"
          type="number"
          style="width:300px; margin-left:8px"
          disabled
        >
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <!-- 减免金额 -->
      <el-form-item
        v-if="dataForm.couponType === 1"
        :label="$t('coupon.coupon.reduceAmount')"
        prop="reduceAmount"
      >
        <el-input
          v-model="dataForm.reduceAmount"
          :placeholder="$t('coupon.coupon.reduceAmount')"
          type="number"
          style="width:300px"
          disabled
        >
          <template #append>
            元
          </template>
        </el-input>
      </el-form-item>
      <!-- 折扣额度 -->
      <el-form-item
        v-if="dataForm.couponType === 2"
        :label="$t('coupon.coupon.couponDiscount')"
        prop="couponDiscount"
      >
        <el-input
          v-model="dataForm.couponDiscount"
          :placeholder="$t('coupon.coupon.couponDiscount')"
          type="number"
          style="width:300px"
          disabled
        >
          <template #append>
            折
          </template>
        </el-input>
      </el-form-item>
      <!-- 生效时间 1:固定时间 2:领取后生效 -->
      <el-form-item
        :label="$t('coupon.coupon.validTimeType')"
        prop="validTimeType"
      >
        <el-radio-group
          v-model="dataForm.validTimeType"
          disabled
        >
          <el-radio :label="1">
            固定时间
          </el-radio>
          <el-radio :label="2">
            领取后生效
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 固定时间数据 START -->
      <div v-if="dataForm.validTimeType === 1">
        <el-form-item
          v-if="dataForm.validTimeType === 1"
          :label="$t('coupon.coupon.startTime')"
          prop="startTime"
        >
          <el-date-picker
            v-model="dataForm.startTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="选择开始时间"
            disabled
          />
        </el-form-item>
        <el-form-item
          v-if="dataForm.validTimeType === 1"
          :label="$t('coupon.coupon.endTime')"
          prop="endTime"
          disabled
        >
          <el-date-picker
            v-model="dataForm.endTime"
            value-format="YYYY-MM-DD HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
            disabled
          />
        </el-form-item>
      </div>
      <!-- 固定时间数据 END -->
      <!-- 领取后生效数据 START -->
      <el-form-item
        v-if="dataForm.validTimeType === 2"
        label="领券后"
        prop="afterReceiveDays"
        disabled
      >
        <el-input
          v-model="dataForm.afterReceiveDays"
          type="number"
          style="width:300px"
          disabled
        >
          <template #append>
            天生效
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.validTimeType === 2"
        label="有效天数"
        prop="validDays"
        disabled
      >
        <el-input
          v-model="dataForm.validDays"
          type="number"
          :disabled="dataForm.couponId !== 0"
          style="width:300px"
        >
          <template #append>
            天
          </template>
        </el-input>
      </el-form-item>
      <!-- 领取后生效数据 END -->
      <!-- 每个用户领券上限，如不填则默认为1 -->
      <el-form-item
        :label="$t('coupon.coupon.limitNum')"
        prop="limitNum"
      >
        <el-input
          v-model="dataForm.limitNum"
          type="number"
          style="width:300px"
          disabled
        >
          <template #append>
            张
          </template>
        </el-input>
      </el-form-item>
      <!-- 库存 -->
      <el-form-item
        :label="$t('coupon.coupon.stocks')"
        prop="stocks"
      >
        <el-input
          v-model="dataForm.stocks"
          type="number"
          style="width:300px"
          disabled
        >
          <template #append>
            张
          </template>
        </el-input>
      </el-form-item>
      <!-- 适用商品类型 0全部商品参与 1指定商品参与 -->
      <el-form-item
        :label="$t('coupon.coupon.suitableProdType')"
        prop="suitableProdType"
      >
        <div>
          <el-radio-group
            v-model="dataForm.suitableProdType"
            disabled
          >
            <el-radio :label="0">
              全部商品参与
            </el-radio>
            <el-radio :label="1">
              指定商品参与
            </el-radio>
          </el-radio-group>
          <div
            v-if="dataForm.suitableProdType === 1 && dataForm.spuIds.length > 0"
            class="prod-box"
          >
            <el-card
              v-for="(item,index) in dataForm.spus"
              :key="index"
              :body-style="{ padding: '0px' }"
              class="prod-item"
              style="height: 160px;width: 120px"
            >
              <ImgShow
                :src="item.mainImgUrl"
                :img-style="{height: '104px', width: '100%'}"
              />
              <div class="card-prod-bottom">
                <span class="card-prod-name">{{ item.spuName }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/coupon/coupon'
import Big from 'big.js'

const visible = ref(false)
const dataFormRef = ref(null)
const dataForm = reactive({
  couponId: 0,
  shopId: null,
  couponName: '',
  couponType: 1,
  suitableProdType: 0,
  getWay: 0,
  validTimeType: 1,
  cashCondition: 0,
  reduceAmount: 0,
  couponDiscount: 0,
  startTime: null,
  endTime: null,
  afterReceiveDays: 0,
  validDays: 1,
  totalStock: 1,
  stocks: 1,
  limitNum: 1,
  status: null,
  putonStatus: 0,
  version: null,
  spus: [], // 商品列表
  spuIds: [] // 商品ids
})

const init = (couponId) => {
  dataForm.couponId = couponId || 0
  visible.value = true
  dataForm.afterReceiveDays = 1
  dataForm.validDays = 1
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.couponId) {
      return
    }
    api.get(couponId).then(data => {
      dataForm.couponId = data.couponId
      dataForm.shopId = data.shopId
      dataForm.couponName = data.couponName
      dataForm.couponType = data.couponType
      dataForm.suitableProdType = data.suitableProdType
      dataForm.getWay = data.getWay
      dataForm.validTimeType = data.validTimeType
      dataForm.cashCondition = data.cashCondition
      dataForm.reduceAmount = data.reduceAmount
      dataForm.couponDiscount = data.couponDiscount
      dataForm.startTime = data.startTime
      dataForm.endTime = data.endTime
      dataForm.launchTime = data.launchTime
      dataForm.afterReceiveDays = data.afterReceiveDays
      dataForm.validDays = data.validDays
      dataForm.totalStock = data.totalStock
      dataForm.stocks = data.stocks
      dataForm.limitNum = data.limitNum
      dataForm.status = data.status
      dataForm.putonStatus = data.putonStatus
      dataForm.spuIds = data.spuIds
      dataForm.cashCondition = new Big(dataForm.cashCondition).div(100).toFixed()
      dataForm.reduceAmount = new Big(dataForm.reduceAmount).div(100).toFixed()
      dataForm.spus = data.spus || []
    })
  })
}

const onSubmit = () => {
  visible.value = false
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
.coupon-manage {
  :deep(.el-dialog__body) {
    padding: 30px !important;
  }
  :deep(.el-form-item__label) {
    text-align: right;
  }
  .strong-word {
    font-weight: bold;
  }
  .el-input-group > :deep(.el-input__inner) {
    padding-right: 0;
  }
  // 错误提示
  .amount {
    :deep(.el-form-item__error) {
      margin-left: 80px;
    }
  }
  .prod-box {
    display: flex;
    flex-wrap: wrap;
  }
  .prod-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
  // 商品
  .card-prod-bottom {
    position: relative;
    text-align: left;
    top: -15px;
    .card-prod-name {
      margin: auto;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 118px;
      display: inline-block;
    }
  }
}
</style>
