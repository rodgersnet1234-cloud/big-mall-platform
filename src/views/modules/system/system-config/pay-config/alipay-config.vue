<template>
  <el-dialog
    v-model="alipayConfigVisible"
    title="编辑"
  >
    <div class="alipay-config gray-box top-redius border-bottom-gray">
      <div class="title">
        {{ $t('platform.config.alipayPaymentConfiguration') }}
        <el-tooltip
          class="item"
          effect="dark"
          content="开启通联支付后将无需设置此处支付配置信息"
          placement="right"
        >
          <el-icon>
            <QuestionFilled />
          </el-icon>
        </el-tooltip>
      </div>
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
          prop="appCertContent"
        >
          <el-input
            v-model="dataForm.appCertContent"
            type="textarea"
            rows="10"
            :placeholder="$t('platform.config.appCertPublicKey')"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('platform.config.alipayCertPublicKey') + '：'"
          prop="alipayCertContent"
        >
          <el-input
            v-model="dataForm.alipayCertContent"
            type="textarea"
            rows="10"
            :placeholder="$t('platform.config.alipayCertPublicKey')"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('platform.config.alipayRootCertPath') + '：'"
          prop="alipayRootCertContent"
        >
          <el-input
            v-model="dataForm.alipayRootCertContent"
            type="textarea"
            rows="10"
            :placeholder="$t('platform.config.alipayRootCertPath')"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item
          :label="$t('platform.config.appPrivateKey') + '：'"
          prop="appPrivateKey"
        >
          <el-input
            v-model="dataForm.appPrivateKey"
            type="textarea"
            rows="10"
            :placeholder="$t('platform.config.appPrivateKey')"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="alipayConfigVisible = false">
          {{ $t('platform.config.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('platform.config.save') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
const emit = defineEmits(['refreshDataList', 'toggle', 'initMessage'])
const alipayConfigVisible = ref(false)

const dataForm = reactive({
  appId: null,
  appCertPath: null,
  appCertContent: null,
  alipayCertPath: null,
  alipayCertContent: null,
  alipayRootCertPath: null,
  alipayRootCertContent: null,
  appPrivateKey: null
})
// eslint-disable-next-line no-unused-vars
const validEmptyTab = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}
const dataRule = {
  appId: [
    { required: true, message: $t('platform.config.appNullTips'), trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appCertContent: [
    { required: true, message: $t('platform.config.appCertPublicKeyNullTips'), trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  alipayCertContent: [
    { required: true, message: $t('platform.config.alipayCertPublicKeyNullTips'), trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  alipayRootCertContent: [
    { required: true, message: $t('platform.config.alipayRootCertPathNullTips'), trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ],
  appPrivateKey: [
    { required: true, message: $t('platform.config.appPrivateKeyNullTips'), trigger: 'blur' },
    { validator: validEmptyTab, trigger: 'blur' }
  ]
}
const useAllinpay = useAllinpayStore()
const paySettlementType = computed(() => {
  return useAllinpay.paySettlementType
})

onMounted(() => {
  init()
})
let changeSwitch = ''
const exposeVisible = (isSwitch) => {
  changeSwitch = isSwitch
  alipayConfigVisible.value = true
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
      }).then(() => {
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
const init = () => {
  nextTick(() => {
    api.get('ALIPAY_CONFIG').then((data) => {
      if (data) {
        Object.assign(dataForm, JSON.parse(data))
        if (changeSwitch) {
          emit('toggle', true)
        }
        emit('initMessage', false)
      } else {
        emit('initMessage', true)
      }
    })
    alipayConfigVisible.value = false
    dataFormRef.value?.resetFields()
  })
}
defineExpose({ init, exposeVisible })
</script>
