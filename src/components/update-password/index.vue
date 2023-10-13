<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :title="$t('navbar.changePassword')"
    :append-to-body="true"
    class="Mall4j"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit(dataFormRef)"
    >
      <el-form-item :label="$t('login.username')">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item
        :label="$t('login.oriPassword')"
        prop="password"
      >
        <el-input
          v-model="dataForm.password"
          show-password
          type="password"
          maxlength="16"
        />
      </el-form-item>
      <el-form-item
        :label="$t('login.newPassword')"
        prop="newPassword"
      >
        <el-input
          v-model="dataForm.newPassword"
          type="password"
          show-password
          maxlength="16"
        />
      </el-form-item>
      <el-form-item
        :label="$t('login.conPassword')"
        prop="confirmPassword"
      >
        <el-input
          v-model="dataForm.confirmPassword"
          type="password"
          show-password
          maxlength="16"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        plain
        @click="visible = false"
      >
        {{ $t("table.cancel") }}
      </el-button>
      <el-button
        type="primary"
        @click="onSubmit(dataFormRef)"
      >
        {{ $t("table.confirm") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { encrypt } from '@/utils/crypto'
import * as api from '@/api/auth/auth'
import { noSpacesBothSides } from '@/utils/validate'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const userName = computed(() => userStore.userName)

const visible = ref(false)
const dataForm = reactive({
  password: '',
  newPassword: '',
  confirmPassword: ''
})
// eslint-disable-next-line no-unused-vars
const validatePassword = (rule, value, callback) => {
  const password = dataForm.password.trim()
  if (!password) {
    dataForm.password = password
    callback(new Error($t('login.passwordTips')))
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(dataForm.password)) {
    callback(new Error($t('register.passwordErrorTips2')))
  }
  callback()
}
// eslint-disable-next-line no-unused-vars
const validatePassword2 = (rule, value, callback) => {
  const password = dataForm.newPassword.trim()
  if (!password) {
    dataForm.newPassword = password
    callback(new Error($t('login.passwordTips')))
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(dataForm.newPassword)) {
    callback(new Error($t('register.passwordErrorTips2')))
  }
  callback()
}
// eslint-disable-next-line no-unused-vars
const validateConfirmPassword = (rule, value, callback) => {
  const password = dataForm.confirmPassword.trim()
  if (!password) {
    dataForm.confirmPassword = password
    callback(new Error($t('login.passwordTips')))
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(dataForm.confirmPassword)) {
    callback(new Error($t('register.passwordErrorTips2')))
  }
  if (dataForm.newPassword !== value) {
    callback(new Error($t('resetPassword.passwordError')))
  }
  callback()
}

const dataRule = reactive({
  password: [
    { required: true, message: $t('login.pawNoNull'), trigger: 'blur' },
    { min: 6, max: 16, message: $t('resetPassword.passwordTips3'), trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: $t('login.pawNoNull'), trigger: 'blur' },
    { min: 6, max: 16, message: $t('resetPassword.passwordTips3'), trigger: 'blur' },
    { validator: validatePassword2, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: $t('login.passwordEmpty'), trigger: 'blur' },
    { min: 6, max: 16, message: $t('resetPassword.passwordTips3'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

const dataFormRef = ref()
const init = () => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
}

const route = useRoute()
const router = useRouter()
const onSubmit = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      const data = {
        oldPassword: encrypt(dataForm.password),
        newPassword: encrypt(dataForm.newPassword)
      }
      api.updatePassword(data).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            nextTick(async () => {
              await userStore.logout()
              await router.push(`/login?redirect=${route.fullPath}`)
            })
          }
        })
      })
    }
  })
}

defineExpose({ init })
</script>
