<template>
  <div class="domain-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.domainConfiguration') }}
    </div>
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('platform.config.paymentServiceDomain')"
        style="width:640px"
        prop="paymentServiceDomainName"
      >
        <el-input
          v-model="dataForm.paymentServiceDomainName"
          :placeholder="$t('platform.config.paymentServiceDomainPH')"
          controls-position="right"
        />
      </el-form-item>
    </el-form>

    <template>
      <span class="dialog-footer">
        <!-- <el-button @click="visible = false">取消</el-button> -->
        <el-button
          @click="onSubmit()"
        >{{ $t('platform.config.save') }}</el-button>
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
let dataForm = reactive({
  paymentServiceDomainName: null
})
const searchForm = reactive({})
const dataRule = {
  paymentServiceDomainName: [
    { required: true, message: $t('platform.config.paymentServiceDomainNullTips'), trigger: 'blur' }
  ]
}

onMounted(() => {
  init()
})
const dataFormRef = ref()
const init = () => {
  // $refs['dataForm'].resetFields()
  nextTick(() => {
    api.get('DOMAIN_CONFIG').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
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
        paramKey: 'DOMAIN_CONFIG',
        paramValue: JSON.stringify(dataForm),
        remark: $t('platform.config.domainConfig')
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

</script>
