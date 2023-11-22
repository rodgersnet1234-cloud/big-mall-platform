<template>
  <div class="pay-wx-set gray-box top-redius border-bottom-gray">
    <div class="title">
      微信小程序发货
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit(dataFormRef)"
    >
      <el-form-item
        label="是否启用"
        prop="wechatShippingAudit"
      >
        <el-switch
          v-model="dataForm.wechatShippingAudit"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
    </el-form>
    <el-button
      v-permission="['platform:config:save']"
      @click="onSubmit()"
    >
      保存
    </el-button>
  </div>
</template>

<script setup>import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  wechatShippingAudit: false
})

onMounted(() => {
  init()
})

const dataFormRef = ref()
const init = () => {
  nextTick(() => {
    api.get('WECHAT_SHIPPING_CONFIG').then(data => {
      if (data) {
        dataForm.value = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'WECHAT_SHIPPING_CONFIG',
        paramValue: JSON.stringify(dataForm.value),
        remark: '微信小程序发货'
      }).then(data => {
        if (data) {
          init()
        }
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
          }
        })
      })
    }
  })
}
defineExpose({ init })
</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
