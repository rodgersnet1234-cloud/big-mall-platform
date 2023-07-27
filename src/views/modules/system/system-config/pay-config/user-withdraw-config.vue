<template>
  <div class="withdraw-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ '用户提现设置' }}
    </div>
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :model="dataForm"
      @submit.prevent
    >
      <template>
        <!-- 单笔提现 -->
        <el-form-item
          label="单笔提现"
          style="width:640px"
        >
          <el-input
            v-model.number="dataForm.amountMin"
            style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
          >
            <template #append>
              {{ '元' }}
            </template>
          </el-input>
          <span class="input-tips"> {{ '不高于' }} </span>
          <el-input
            v-model.number="dataForm.amountMax"
            style="width: 180px"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
          >
            <template #append>
              {{ '元' }}
            </template>
          </el-input>
          <div class="tips">
            {{ '微信企业付款单笔最低1元,单笔单日最高2W元' }}
          </div>
        </el-form-item>
        <!-- 提现频次 -->
        <el-form-item label="提现频次">
          <el-select
            v-model="dataForm.frequency"
            placeholder="请选择"
          >
            <el-option
              label="每天"
              :value="1"
            />
            <el-option
              label="每周"
              :value="7"
            />
            <el-option
              label="每月"
              :value="30"
            />
            <el-option
              label="无限制"
              :value="-1"
            />
          </el-select>

          <el-input
            v-if="dataForm.frequency !== -1"
            v-model.number="dataForm.number"
            style="width: 180px;"
            oninput="value=value.replace(/[^\d]/g,'')"
            maxlength="10"
            @change="dataForm.number < 1 ? dataForm.number = 1 : ''"
          >
            <template #append>
              {{ '次' }}
            </template>
          </el-input>
        </el-form-item>
        <!-- 提现说明 -->
        <el-form-item label="提现说明">
          <el-input
            v-model="dataForm.paymentExplain"
            type="textarea"
            style="width: 300px"
            witdt="230"
            maxlength="50"
            show-word-limit
          />
          <br>
          <span class="tips">{{ '提现说明填写后将于提现申请页面显示' }}</span>
        </el-form-item>
        <!-- 提现设置end -->
        <el-button
          @click="onSubmit()"
        >
          {{ $t('platform.config.save') }}
        </el-button>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import * as api from '@/api/distribution/set/distribution-config.js'
import useStore from 'element-plus/es/components/table/src/store/index'
import { ElMessage } from 'element-plus'

let dataForm = {
  distributionSwitch: 0,
  attribution: 1,
  autoCheck: 0,
  expenseNumber: null,
  spuIdList: [],
  spuVOList: [],
  expenseAmount: null,
  realName: false,
  identityCardPic: false,
  identityCardNumber: false,
  frequency: null, // 提现频次
  amountMax: null, // 单笔最高提现金额
  amountMin: null, // 单笔最低提现金额
  paymentExplain: null, // 提现说明
  number: null // 提现次数
}
// 结算方式 1:通联 0：非通联
const paySettlementType = computed(() => {
  return useStore.state.allinpay.paySettlementType
})
onMounted(() => {
  getData()
})

// 获取数据
const getData = () => {
  api.get().then(data => {
    if (data !== null) {
      if (paySettlementType === 1) {
        data = {
          ...data,
          realName: false,
          identityCardPic: false,
          identityCardNumber: false,
          withdrawal: null
        }
      }
      dataForm = data
    }
  })
}

// 提交表单
const onSubmit = () => {
  if (dataForm.amountMin <= 0) {
    ElMessage.error('单笔提现最小金额不能为空且必须大于0')
    return
  }
  if (dataForm.amountMin >= dataForm.amountMax) {
    ElMessage.error('单笔提现最大金额不能为空且必须大于最小金额')
    return
  }
  if (dataForm.amountMax > 20000) {
    ElMessage.error('单笔提现金额最大不能超过2W')
    return
  }
  const param = dataForm
  api.save(param).then(data => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
      }
    })
  }).catch((e) => {
  })
}

</script>
<style lang="scss" scoped>
</style>
