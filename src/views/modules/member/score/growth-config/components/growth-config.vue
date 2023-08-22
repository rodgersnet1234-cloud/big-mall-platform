<template>
  <div class="distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('user.score.growthSetting') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
    >
      <el-form-item
        :label="$t('user.score.growthSwitch')"
        style="width:440px"
        prop="shopGrowthSwitch"
      >
        <el-switch v-model="dataForm.shopGrowthSwitch" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.shopGrowthSwitch"
        :label="$t('user.score.perPurchase')"
        style="width:440px"
        prop="buyPrice"
      >
        <el-input
          v-model="dataForm.buyPrice"
          @change="buyPriceChange()"
        >
          <template #append>
            {{ $t('unit.dollar') }}{{ $t('user.score.getOneGrowth') }}
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.shopGrowthSwitch"
        :label="$t('user.score.completedOrderGet')"
        style="width:440px"
        prop="buyOrder"
      >
        <el-input
          v-model="dataForm.buyOrder"
          @change="buyOrderChange()"
        >
          <template #append>
            {{ $t('user.score.growth') }}
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{ $t('table.save') }}
    </el-button>
  </div>
</template>

<script setup>
import * as api from '@/api/user/growth-config.js'
import { ElMessage } from 'element-plus'

const dataRule = {
  buyPrice: [
    { required: true, message: $t('user.score.consumptionGetGrowthCannotEmpty'), trigger: 'blur' }
  ],
  buyOrder: [
    { required: true, message: $t('user.score.orderAcquisitionCannotEmpty'), trigger: 'blur' }
  ]
}
onMounted(() => {
  getData()
})

const dataForm = ref({
  id: 0,
  buyPrice: 0.0,
  shopGrowthSwitch: false,
  buyOrder: 0.0
})
const dataFormRef = ref(null)
// 获取数据
const getData = () => {
  nextTick(() => {
    api.get('GROWTH_CONFIG').then(data => {
      if (data.shopGrowthSwitch) {
        dataForm.value = data
      }
    })
    dataFormRef.value?.resetFields()
  })
}

const buyPriceChange = () => {
  const buyPrice = parseInt(dataForm.value.buyPrice)
  if (buyPrice > 100000000) {
    dataForm.value.buyPrice = 100000000
  } else if (buyPrice < 0) {
    dataForm.value.buyPrice = 0
  }
}

const buyOrderChange = () => {
  const buyOrder = parseInt(dataForm.value.buyOrder)
  if (buyOrder > 100000000) {
    dataForm.value.buyOrder = 100000000
  } else if (buyOrder < 0) {
    dataForm.value.buyOrder = 0
  }
}

// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save(dataForm.value).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}

</script>
