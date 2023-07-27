<template>
  <div class="alipay-config gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ $t('platform.config.alipayPaymentConfiguration') }}
      <el-tooltip
        class="item"
        effect="dark"
        content="开启通联支付后将无需设置此处支付配置信息"
        placement="right"
      >
        <i class="el-icon-question" />
      </el-tooltip>
    </div>
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      label-width="180px"
      class="set-form"
      label-position="left"
      :rules="dataRule"
      :model="dataForm"
      :disabled="paySettlementType===1"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <el-form-item
        :label="$t('platform.config.alipayAppId') + '：'"
        style="width:640px"
        prop="appId"
      >
        <el-input
          v-model="dataForm.appId"
          :placeholder="$t('platform.config.alipayAppId')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.appCertPublicKey') + '：'"
        style="width:640px"
        prop="appCertPath"
      >
        <el-input
          v-model="dataForm.appCertPath"
          :placeholder="$t('platform.config.appCertPublicKey')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.alipayCertPublicKey') + '：'"
        style="width:640px"
        prop="alipayCertPath"
      >
        <el-input
          v-model="dataForm.alipayCertPath"
          :placeholder="$t('platform.config.alipayCertPublicKey')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.alipayRootCertPath') + '：'"
        style="width:640px"
        prop="alipayRootCertPath"
      >
        <el-input
          v-model="dataForm.alipayRootCertPath"
          type="text"
          :placeholder="$t('platform.config.alipayRootCertPath')"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('platform.config.appPrivateKey') + '：'"
        style="width:640px"
        prop="appPrivateKey"
      >
        <el-input
          v-model="dataForm.appPrivateKey"
          type="textarea"
          rows="28"
          :placeholder="$t('platform.config.appPrivateKey')"
          controls-position="right"
        />
      </el-form-item>

      <el-button
        @click="onSubmit()"
      >
        {{ $t('platform.config.save') }}
      </el-button>
    </el-form>
    <template>
      <span class="dialog-footer">
      <!-- <el-button @click="visible = false">取消</el-button> -->
      </span>
    </template>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import useStore from 'element-plus/es/components/table/src/store/index'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

let dataForm = reactive({
  appId: null,
  appCertPath: null,
  alipayCertPath: null,
  alipayRootCertPath: null,
  appPrivateKey: null
})
const dataRule = {
  appId: [
    { required: true, message: $t('platform.config.appNullTips'), trigger: 'blur' }
  ],
  appCertPath: [
    { required: true, message: $t('platform.config.appCertPublicKeyNullTips'), trigger: 'blur' }
  ],
  alipayCertPath: [
    { required: true, message: $t('platform.config.alipayCertPublicKeyNullTips'), trigger: 'blur' }
  ],
  alipayRootCertPath: [
    { required: true, message: $t('platform.config.alipayRootCertPathNullTips'), trigger: 'blur' }
  ],
  appPrivateKey: [
    { required: true, message: $t('platform.config.appPrivateKeyNullTips'), trigger: 'blur' }
  ]
}

const paySettlementType = computed(() => {
  return useStore.state.allinpay.paySettlementType
})

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get('ALIPAY_CONFIG').then(data => {
      if (data) {
        dataForm = JSON.parse(data)
      }
    })
    dataFormRef.value?.resetFields()
  })
}
const dataFormRef = ref()
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.save({
        paramKey: 'ALIPAY_CONFIG',
        paramValue: JSON.stringify(dataForm),
        remark: $t('platform.config.alipayPaymentConfiguration')
      }).then(data => {
        init()
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            emit('refreshDataList')
          }
        })
      })
    }
  })
}

</script>
