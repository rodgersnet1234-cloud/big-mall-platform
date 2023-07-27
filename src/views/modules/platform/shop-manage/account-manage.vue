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
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="90px"
        @submit.prevent
      >
        <!-- 店铺名称 -->
        <el-form-item
          label="店铺名称"
          label-width="110px"
        >
          <el-input
            v-model="shopName"
            placeholder="请输入店铺名称"
            disabled
          />
        </el-form-item>
        <!-- 店铺账号 -->
        <el-form-item
          label="店铺账号"
          label-width="110px"
        >
          <el-input
            v-model="merchantAccount"
            placeholder="请输入店铺账号"
            disabled
          />
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item
          label="登录密码"
          label-width="110px"
          prop="password"
        >
          <el-input
            v-model="dataForm.password"
            maxlength="16"
            type="password"
            autocomplete="new-password"
            placeholder="请输入6-16位登录密码"
          />
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item
          label="确认密码"
          label-width="110px"
          prop="confirmPsw"
        >
          <el-input
            v-model="dataForm.confirmPsw"
            maxlength="16"
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
import * as api from '@/api/platform/audit-shop.js'
// import { validNoEmptySpace, noSpacesBothSides } from '@/utils/validate'
import { encrypt } from '@/utils/crypto.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['closeAccountManagePopup'])

const dataFormRef = ref(null)
const visible = ref(false)
// 查询的参数
const pageQuery = reactive({
  shopId: null
})
const shopName = ref('')
const merchantAccount = ref('')
const dataForm = ref({
  shopId: null,
  password: '',
  confirmPsw: ''
})

// eslint-disable-next-line no-unused-vars
const validPassword = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('密码不能全为空格'))
  } else if (noSpacesBothSides(value)) {
    callback(new Error('不允许使用空格作为密码的开头或结尾'))
  } else if (dataForm.value.confirmPsw &&
        value === this.dataForm.value.confirmPsw) {
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
    { min: 6, max: 16, message: '登录密码长度为6-16位', trigger: 'blur' },
    { validator: validPassword, trigger: 'blur' }
  ],
  confirmPsw: [
    { required: true, message: '请再次输入登录密码', trigger: 'blur' },
    { validator: validConfirmPsw, trigger: 'blur' }
  ]
}

const init = (shopId) => {
  visible.value = true
  pageQuery.shopId = shopId || null
  dataForm.value.shopId = shopId || null
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!pageQuery.shopId) {
      return
    }
    api.getManageDetail(pageQuery).then(data => {
      shopName.value = data.shopName
      merchantAccount.value = data.merchantAccount
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
      shopId: dataForm.value.shopId
    }
    api.updateLoginPassword(param).then((data) => {
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
    shopId: null,
    password: '',
    confirmPsw: ''
  }
}

</script>

<style lang="scss">
.account-manage {
  .el-dialog__wrapper {
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
