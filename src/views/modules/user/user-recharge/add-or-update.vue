<template>
  <div class="user-recharge-info">
    <el-dialog
      v-model="visible"
      :title="!dataForm.rechargeId ? $t('table.add') : $t('table.edit')"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        @submit.prevent
      >
        <el-form-item
          :label="$t('user.recharge.title')"
          :placeholder="$t('user.recharge.titleNoEnter')"
          prop="rechargeTitle"
          class="input-width"
        >
          <el-input
            v-model="dataForm.rechargeTitle"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('user.recharge.rechargeAmount')"
          :placeholder="$t('user.recharge.enterRechargeAmount')"
          prop="rechargeAmount"
          style="width: 400px"
          class="input-width"
        >
          <el-input
            v-model="dataForm.rechargeAmount"
            :min="0.01"
            @change="inputChange(1)"
          />
        </el-form-item>
        <el-form-item
          v-if="paySettlementType !== 1"
          :label="$t('user.recharge.rewardAmount')"
          prop="presAmount"
        >
          <el-input
            v-model="dataForm.presAmount"
            :placeholder="$t('user.recharge.enterRewardAmount')"
            min="0"
            max="100000000"
            class="input-width"
            @change="inputChange(2)"
          >
            <template #prepend>
              {{ $t("user.recharge.reward") }}
            </template>
            <template #append>
              {{ $t("user.recharge.amount") }}
            </template>
          </el-input>
        <!-- <el-input v-model="dataForm.presAmount"></el-input> -->
        </el-form-item>
        <el-form-item
          :label="$t('user.recharge.rewardScore')"
          :placeholder="$t('user.recharge.enterRewardScore')"
          prop="presScore"
        >
          <el-input
            v-model="dataForm.presScore"
            min="0"
            max="100000000"
            class="input-width"
            @change="inputChange(3)"
          >
            <template #prepend>
              {{ $t("user.recharge.reward") }}
            </template>
            <template #append>
              {{ $t("user.recharge.score") }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('user.recharge.rewardGrowthValue')"
          :placeholder="$t('user.recharge.enterRewardGrowthValue')"
          prop="presGrowth"
        >
          <el-input
            v-model="dataForm.presGrowth"
            min="0"
            max="100000000"
            class="input-width"
            @change="inputChange(4)"
          >
            <template #prepend>
              {{ $t("user.recharge.reward") }}
            </template>
            <template #append>
              {{ $t("user.recharge.growth") }}
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('user.recharge.rewardCoupon')"
          prop="couponList"
        >
          <span>
            <el-button
              type="primary"
              link
              @click.prevent="conponSelectHandle()"
            >{{ $t("user.recharge.selectCoupons") }}</el-button>
            <el-tooltip
              v-if="dataForm.couponList.length > 0"
              class="item"
              effect="dark"
              content="注意：已选择的优惠券过期或取消投放时，列表中该优惠券会被移除"
              placement="top"
            >
              <i class="el-icon-warning" />
            </el-tooltip>
          </span>
          <el-table
            v-if="dataForm.couponList.length > 0"
            :data="dataForm.couponList"
            style="width: 100%"
          >
            <el-table-column
              :label="$t('user.recharge.couponName')"
              width="180"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{
                  scope.row.couponName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('user.recharge.couponUpperLimit')"
              width="140"
            >
              <template #default="scope">
                <span style="margin-left: 10px">{{ scope.row.limitNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('user.recharge.quantity')">
              <template #default="scope">
                <el-input-number
                  v-model="scope.row.couponNum"
                  :min="1"
                  :max="scope.row.limitNum"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.actions')"
              width="180"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="deleteCoupon(scope.$index)"
                >
                  {{ $t("table.delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          :label="$t('user.recharge.sequence')"
          prop="seq"
        >
          <el-input-number
            v-model="dataForm.seq"
            controls-position="right"
            :min="1"
            :max="1000"
            @change="inputChange(5)"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="visible = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
      <coupon-select
        v-if="couponSelectVisible"
        ref="couponSelectRef"
        :get-way="1"
        @refresh-select-coupon-list="selectDistributionCoupon"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import CouponSelect from '@/components/coupon-select/index.vue'
import * as api from '@/api/user/user-recharge'
import Big from 'big.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType // 结算方式 1:通联 0：非通联
const visible = ref(false)
let isSubmit = false
const dataForm = ref({
  rechargeId: null,
  rechargeTitle: null,
  rechargeAmount: 0,
  presAmount: 0,
  presScore: 0,
  presGrowth: 0,
  seq: 1,
  couponList: []
})
const couponSelectVisible = ref(false)
const dataRule = {
  rechargeTitle: [
    { required: true, message: $t('user.recharge.titCanNoBlank'), trigger: 'blur' }
  ],
  rechargeAmount: [
    { request: true, message: $t('user.recharge.rechargeAmountLimited'), trigger: 'blur' }
  ],
  img: [
    { required: true, message: $t('user.recharge.bgImgCannotEmpty'), trigger: 'blur' }
  ]
}
const dataFormRef = ref(null)
const onInit = (rechargeId) => {
  dataForm.value.rechargeId = rechargeId || 0
  visible.value = true
  isSubmit = false
  couponSelectVisible.value = false
  dataForm.value.rechargeTitle = null
  dataForm.value.rechargeAmount = 0
  dataForm.value.img = null
  dataForm.value.presAmount = 0
  dataForm.value.presScore = 0
  dataForm.value.presGrowth = 0
  dataForm.value.seq = 1
  dataForm.value.couponList = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (dataForm.value.rechargeId) {
      api.info(dataForm.value.rechargeId).then(data => {
        // 金额转换
        if (data.rechargeAmount) {
          data.rechargeAmount = amountDivision(data.rechargeAmount, 100)
        }
        if (data.presAmount) {
          data.presAmount = amountDivision(data.presAmount, 100)
        }
        dataForm.value = data
      })
    }
  })
}
/**
 * 显示添加指定优惠券弹框
 */
const couponSelectRef = ref(null)
const conponSelectHandle = () => {
  couponSelectVisible.value = true
  nextTick(() => {
    couponSelectRef.value.onInit(dataFormRef.value?.couponList)
  })
}
/**
 * 优惠券选择回调
 */
const selectDistributionCoupon = (coupons) => {
  // 初始化优惠券数量
  coupons.forEach(coupon => {
    coupon.couponNum = 1
    dataForm.value.couponList.forEach(item => {
      if (coupon.couponId === item.couponId) {
        coupon.couponNum = item.couponNum
      }
    })
  })
  // 更新优惠券列表数据
  if (coupons.length > 0) {
    dataForm.value.couponList = coupons
  } else {
    dataForm.value.couponList = []
  }
}
const deleteCoupon = (index) => {
  dataForm.value.couponList.splice(index, 1)
}
const inputChange = (type) => {
  if (type === 1) {
    const amount = !dataForm.value.rechargeAmount ? 0.01 : checkNumber(dataForm.value.rechargeAmount, 1)
    dataForm.value.rechargeAmount = amount < 0.01 ? 0.01 : amount
  } else if (type === 2) {
    dataForm.value.presAmount = !dataForm.value.presAmount ? 0 : checkNumber(dataForm.value.presAmount, 1)
  } else if (type === 3) {
    dataForm.value.presScore = !dataForm.value.presScore ? 0 : checkNumber(dataForm.value.presScore, 2)
  } else if (type === 4) {
    dataForm.value.presGrowth = !dataForm.value.presGrowth ? 0 : checkNumber(dataForm.value.presGrowth, 2)
  } else if (type === 5) {
    dataForm.value.seq = !dataForm.value.seq ? 0 : checkNumber(dataForm.value.seq, 2)
  }
}
let reg = ''
const checkNumber = (num, type) => {
  if (type === 1) {
    reg = /^[1-9]\d*$|^[1-9]\d*\.\d\d?$|^0\.\d\d?$/
    if (!reg.test(num)) {
      return 0
    } else if (num > 1000000000) {
      return 1000000000
    }
  } else {
    reg = /^[0-9]*$/
    if (!reg.test(num)) {
      return 0
    } else if (num > 1000000000) {
      return 1000000000
    }
  }
  return num
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (isSubmit) {
        return false
      }
      if (dataForm.value.rechargeAmount < 0.01) {
        ElMessage.error($t('user.recharge.moreThan0'))
        return false
      }
      if (!dataForm.value.rechargeTitle.trim()) {
        return ElMessage.error('标题不能为空')
      }
      isSubmit = true

      // 金额转换
      // 深拷贝dataForm，使页面展示数据不受下面数据修改的影响
      const cloneDataForm = JSON.parse(JSON.stringify(dataForm.value))
      cloneDataForm.rechargeAmount = amountMultiply(cloneDataForm.rechargeAmount, 100)
      cloneDataForm.presAmount = amountMultiply(cloneDataForm.presAmount, 100)

      const request = cloneDataForm.rechargeId ? api.update(cloneDataForm) : api.save(cloneDataForm)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            isSubmit = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      }).catch(() => {
        isSubmit = false
      })
    }
  })
}
// 精度运算-乘法
const amountMultiply = (a, b) => {
  return new Big(a).times(b).valueOf()
}
// 精度运算-除法
const amountDivision = (a, b) => {
  if (a == null) {
    return ''
  }
  return new Big(a).div(b).valueOf()
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
.user-recharge-info {
  .input-width {
    width: 400px;
  }
  el-form-item {
    margin-bottom: 80px;
  }

}
</style>
