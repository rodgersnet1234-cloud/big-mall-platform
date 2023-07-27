<template>
  <div class="withdraw-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ '供应商提现设置' }}
      <el-tooltip
        class="item"
        effect="dark"
        content="建议单笔提现最低设置1元，避免平台亏损"
        placement="right"
      >
        <span><i class="el-icon-question" /></span>
      </el-tooltip>
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
            v-model.trim="dataForm.withdrawCashLeast"
            style="width: 180px"
            maxlength="10"
          >
            <template #append>
              {{ '元' }}
            </template>
          </el-input>
          <span class="input-tips"> {{ '不高于' }} </span>
          <el-input
            v-model.trim="dataForm.withdrawCashMax"
            style="width: 180px"
            maxlength="10"
            @blur="
              handleMaxValue(
                dataForm.withdrawCashMax,
                999999
              )"
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
              label="每周"
              :value="1"
            />
            <el-option
              label="每月"
              :value="2"
            />
            <el-option
              label="每年"
              :value="3"
            />
          </el-select>
          <el-input
            v-model.trim="dataForm.number"
            style="width: 140px;margin-left: 10px"
            @blur="handleEdit(dataForm.number)"
          >
            <template #append>
              {{ '次' }}
            </template>
          </el-input>
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
import { save, getConfig } from '@/api/supplier-withdraw-cash/index.js'
import useStore from 'element-plus/es/components/table/src/store/index'
import { ElMessage } from 'element-plus'

let dataForm = {
  withdrawCashLeast: '',
  withdrawCashMax: '',
  frequency: '',
  number: ''
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
  getConfig().then(data => {
    dataForm = data
    dataForm.withdrawCashLeast = formatPrice(data.withdrawCashLeast, 1)
    dataForm.withdrawCashMax = (data.withdrawCashMax == null ? null : formatPrice(data.withdrawCashMax, 1))
  })
}
const dataFormRef = ref()
// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      const params = {
        withdrawCashLeast: formatPrice(dataForm.withdrawCashLeast),
        withdrawCashMax: dataForm.withdrawCashMax == null ? null : formatPrice(dataForm.withdrawCashMax),
        frequency: dataForm.frequency,
        number: dataForm.number
      }
      save(params).then(data => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
          }
        })
      })
    }
  })
}
const handleMaxValue = (data, max) => {
  const patrn = /^(-)?\d+(\.\d+)?$/
  if (!data.match(patrn)) {
    dataForm.withdrawCashMax = ''
    return
  }
  // 表格
  if (data > max) {
    dataForm.withdrawCashMax = max
  }
}
const handleEdit = (e) => {
  let val = parseInt(e || 1)
  if (e > 1000000) val = 999999
  if (e < 1) val = 1
  dataForm.number = val
}

</script>
<style lang="scss" scoped>
</style>
