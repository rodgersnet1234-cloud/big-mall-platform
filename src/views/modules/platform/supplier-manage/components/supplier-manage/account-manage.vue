<template>
  <div class="account-manage">
    <el-dialog
      v-model="visible"
      title="账号管理"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="300px"
      width="650px"
      @close="close"
    >
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="left"
        label-width="90px"
        @submit.prevent
      >
        <!-- 店铺名称 -->
        <el-form-item
          label="店铺名称："
          label-width="110px"
        >
          <el-input
            v-model="supplierName"
            placeholder="请输入店铺名称"
            disabled
          />
        </el-form-item>
        <!-- 店铺账号 -->
        <el-form-item
          label="店铺账号："
          label-width="110px"
        >
          <el-input
            v-model="supplierAccount"
            placeholder="请输入店铺账号"
            disabled
          />
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item
          label="登录密码："
          label-width="110px"
          prop="password"
        >
          <el-input
            v-model="dataForm.password"
            v-input-rule
            maxlength="20"
            type="password"
            placeholder="请输入6-20位登录密码"
          />
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item
          label="确认密码："
          label-width="110px"
          prop="confirmPsw"
        >
          <el-input
            v-model="dataForm.confirmPsw"
            v-input-rule
            maxlength="20"
            type="password"
            placeholder="请再次输入登录密码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
            @click="visible = false"
          >
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/platform/audit-supplier'
import { encrypt } from '@/utils/crypto.js'
import { ElMessage } from 'element-plus'
import { validPassword2 } from '@/utils/validate.js'

const emit = defineEmits(['closeAccountManagePopup'])
const dataFormRef = ref(null)

const visible = ref(false)
// 查询的参数
const pageQuery = reactive({
  supplierId: null
})
const supplierName = ref('')
const supplierAccount = ref('')
const dataForm = ref({
  supplierId: null,
  password: '',
  confirmPsw: ''
})
// eslint-disable-next-line no-unused-vars
const validPassword = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('密码不能全为空格'))
  } else if (noSpacesBothSides(value)) {
    callback(new Error('不允许使用空格作为密码的开头或结尾'))
  } else if (!validPassword2(value)) {
    callback(new Error($t('resetPassword.passwordVerification')))
  } else if (dataForm.value.confirmPsw &&
        value === dataForm.value.confirmPsw) {
    // 如两次输入密码相同,清除确认密码框校验
    callback(dataFormRef.value.clearValidate('confirmPsw'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validConfirmPsw = (rule, value, callback) => {
  if (value !== dataForm.value.password) {
    callback(new Error('确认密码与登陆密码不一致，请重新输入！'))
  } else {
    callback()
  }
}
const rules = {
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { validator: validPassword, trigger: 'blur' }
  ],
  confirmPsw: [
    { required: true, message: '请再次输入登录密码', trigger: 'blur' },
    { validator: validConfirmPsw, trigger: 'blur' }
  ]
}

const init = (supplierId) => {
  visible.value = true
  pageQuery.supplierId = supplierId || null
  dataForm.value.supplierId = supplierId || null
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!pageQuery.supplierId) {
      return
    }
    api.getManageDetail(pageQuery).then(data => {
      supplierName.value = data.supplierName
      supplierAccount.value = data.supplierAccount
    })
  })
}
defineExpose({ init })
/**
 * 提交账号管理
 */
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const param = {
      password: encrypt(dataForm.value.password),
      supplierId: dataForm.value.supplierId
    }
    api.updateLoginPassword(param).then(() => {
      ElMessage({
        message: '更新成功！',
        type: 'success',
        duration: 1500
      })
      close()
    })
  })
}

// 关闭
const close = () => {
  emit('closeAccountManagePopup')
  visible.value = false
  dataForm.value = {
    supplierId: null,
    password: '',
    confirmPsw: ''
  }
}

</script>

<style lang="scss" scoped>
.account-manage {
  ::v-deep(.el-dialog__wrapper) {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog__body {
      padding: 15px 20px;
      max-height: 800px;
      overflow: auto;
      .el-form-item:last-child {
        margin-bottom: 10px;
      }
    }
  }
}

</style>
