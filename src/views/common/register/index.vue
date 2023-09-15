<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="page-register">
    <div class="login-frame">
      <div class="login-img">
        <img
          v-if="webConfig.loginBgImg"
          :src="webConfig.loginBgImg"
          @error="webConfig.loginBgImg=''"
        >
        <img
          v-else
          src="~@/assets/images/login-img.jpg"
        >
      </div>

      <div class="register-info">
        <div class="title-box">
          <div class="reg">
            平台注册
          </div>
          <div class="has-account">
            已有账号?
            <span
              class="brightness"
              @click="toLogin"
            >
              前去登录
            </span>
          </div>
        </div>
        <div class="input-box">
          <div :class="['inp-item', mallNameEmptyTips ? 'error':'']">
            <input
              v-model="mallName"
              maxlength="16"
              placeholder="请输入商城名称"
            >
            <div
              v-if="mallNameEmptyTips"
              class="err-tips"
            >
              请设置商城名称
            </div>
          </div>
          <div :class="['inp-item', usernameErrTips || usernameEmptyTips ? 'error':'']">
            <input
              v-model="username"
              maxlength="16"
              placeholder="请输入用户名"
            >
            <div
              v-if="usernameEmptyTips"
              class="err-tips"
            >
              请设置用户名
            </div>
            <div
              v-if="usernameErrTips"
              class="err-tips"
            >
              用户名由字母、数字或下划线 4-16位组成，且不能为纯数字
            </div>
          </div>
          <div :class="['inp-item', mobileErrTips ? 'error':'']">
            <div :class="['mobile',mobileBorder ? 'borderColor' : '']">
              <input
                v-model="mobile"
                class="mobile-input"
                type="text"
                oninput="value=value.replace(/[^\d]/g,'')"
                maxlength="11"
                placeholder="请输入手机号"
                @focus="mobileCus"
                @blur="mobileCus"
              >
            </div>
            <div
              v-if="mobileErrTips"
              class="err-tips"
            >
              请输入正确的手机号
            </div>
          </div>
          <div :class="['inp-item', validCodeErrTips ? 'error':'']">
            <div :class="['yzm',isFocus ? 'focus' : '']">
              <input
                v-model="validCode"
                maxlength="6"
                type="text"
                placeholder="请输入验证码"
                @focus="onCodeIntFocus"
                @blur="onCodeIntBlur"
              >
              <div
                v-if="countdown=== 0"
                class="get-code"
                @click="getCode"
              >
                获取验证码
              </div>
              <div
                v-else
                class="get-code"
              >
                {{ countdown }} s
              </div>
            </div>
            <div
              v-if="validCodeErrTips"
              class="err-tips"
            >
              请输入验证码
            </div>
          </div>
          <div :class="['inp-item', passwordEmptyTips || passwordErrorTips || passwordErrorTips2 ? 'error':'']">
            <!-- 占位文本框 -->
            <input
              type="text"
              value=""
              style="position: absolute; top:0; opacity:0; width:0px; height:0px; border:0"
            >
            <input
              ref="passwordRef"
              v-model="password"
              :type="passwordType"
              maxlength="16"
              autocomplete="new-password"
              placeholder="请设置6-16位登录密码"
              @blur="validateTrim()"
            >
            <div class="conceal-icon">
              <div
                v-show="passwordType === 'text'"
                class="icon"
                @click="changePass('password')"
              >
                <img
                  src="~@/assets/images/Frame-view.png"
                  width="16"
                >
              </div>
              <div
                v-show="passwordType === 'password'"
                class="icon"
                @click="changePass('text')"
              >
                <img
                  src="~@/assets/images/Frame.png"
                  width="16"
                >
              </div>
            </div>

            <div
              v-if="passwordEmptyTips"
              class="err-tips"
            >
              登录密码不能为空
            </div>
            <div
              v-if="passwordErrorTips"
              class="err-tips"
            >
              登录密码长度为6-16位
            </div>
            <div
              v-if="passwordErrorTips2"
              class="err-tips"
            >
              不允许使用空格作为密码的开头或结尾
            </div>
          </div>
        </div>
        <div class="agreement">
          <el-checkbox
            v-model="checked"
            @change="changeCheckbox"
          />
          <div class="ag-txt">
            我已阅读同意
            <a
              class="strong"
              @click="queryRegisterProtocol"
            >《商家注册协议》
            </a>
          </div>
        </div>
        <div
          class="register-btn"
          @click="handleRegister"
        >
          立即注册
        </div>
      </div>
    </div>
    <div class="bottom">
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>

    <!-- 商家注册协议弹窗 -->
    <el-dialog
      v-model="protocolDialogVisible"
      title="平台注册协议"
      width="80%"
      top="6vh"
      :close-on-click-modal="false"
      class="merchant-register-protocol"
    >
      <div class="registration-agreement">
        <div v-rich="registerProtocol" />
      </div>

      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="protocolDialogVisible = false">关闭</el-button> -->
          <el-button
            type="primary"
            @click="readAndAgree"
          >
            已阅读并同意本协议
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 注册成功提示弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="$t('table.tips')"
      width="350px"
      center
      class="success-dialog"
      :close-on-click-modal="false"
      :show-close="false"
      top="25vh"
    >
      <div class="success-tip">
        <img
          src="@/assets/images/success.png"
          class="success-icon"
        >
        <div class="txt">
          注册成功！即将跳转到登录页...
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { isMobile, isUserName, validPassword, noSpacesBothSides, validNoEmptySpace } from '@/utils/validate'
import { getRegisterCode, register, getMerchantRegisterProtocol } from '@/api/auth/auth'
import { encrypt } from '@/utils/crypto'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'
const router = useRouter()
const passwordType = ref('password')
const mallNameEmptyTips = ref(false)
const usernameErrTips = ref(false)
const usernameEmptyTips = ref(false)
const mobileErrTips = ref(false)
const passwordEmptyTips = ref(false)
const passwordErrorTips = ref(false)
const passwordErrorTips2 = ref(false)
const validCodeErrTips = ref(false)
const mallName = ref('')
const username = ref('')
const mobile = ref('')
const password = ref('')
const validCode = ref('')
const isFocus = ref(false) // 是否获取焦点
const countdown = ref(0)
const checked = ref(false) // 是否选中
let timer = null

// 注册成功提示弹窗
const dialogVisible = ref(false)

// 注册协议弹窗显隐
const protocolDialogVisible = ref(false)
// 注册协议内容
const registerProtocol = ref('')

const mobileBorder = ref(false)
const webConfig = computed(() => useWebConfigStore().webConfig)
// 当前语言
const language = computed(() => useAppStore().language)
watch(mallName, () => {
  if (mallName.value && mallNameEmptyTips.value) {
    mallNameEmptyTips.value = false
  }
})
watch(username, () => {
  if (username.value && usernameEmptyTips.value) {
    usernameEmptyTips.value = false
    return
  }
  if (isUserName(username.value) && usernameErrTips.value) {
    usernameErrTips.value = false
  }
})

watch(mobile, () => {
  if (!mobile.value || isMobile(mobile.value)) {
    mobileErrTips.value = false
  }
})

watch(validCode, () => {
  if (validCode.value) {
    validCodeErrTips.value = false
  }
})

watch(password, () => {
  if (password.value.trim() && passwordEmptyTips.value) {
    passwordEmptyTips.value = false
    return
  }
  if (validPassword(password.value) && passwordErrorTips.value) {
    passwordErrorTips.value = false
  }
})

const getCountdown = () => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 验证码输入框聚焦监听
const onCodeIntFocus = () => {
  isFocus.value = true
}
// 验证码输入框失焦监听
const onCodeIntBlur = () => {
  isFocus.value = false
}

/**
 * 获取验证码
 */

const getCode = Debounce(function () {
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  mobileErrTips.value = false
  const data = {
    mobile: mobile.value,
    shopAccount: 1
  }
  getRegisterCode(data).then(() => {
    countdown.value = 60
    getCountdown()
  })
}, 1500)

/**
 * 校验密码
 */
const validateTrim = () => {
  passwordEmptyTips.value = false
  passwordErrorTips.value = false
  passwordErrorTips2.value = false
  // 密码为空
  if (!password.value.trim()) {
    password.value = password.value.trim()
    passwordEmptyTips.value = true
    return
  }
  // 如果校验到两侧有空格，提示用户
  if (noSpacesBothSides(password.value)) {
    passwordErrorTips2.value = true
    return
  }
  // 密码长度
  if (!validPassword(password.value)) {
    passwordErrorTips.value = true
  }
}

// 多选框变化
const changeCheckbox = (val) => {
  checked.value = val
}

// 校验是否通过
const handleRegister = () => {
  username.value = username.value.trim()
  mallName.value = mallName.value.trim()
  if (!mallName.value) {
    mallNameEmptyTips.value = true
    return
  }
  if (!username.value) {
    usernameEmptyTips.value = true
    return
  }
  if (!isUserName(username.value)) {
    usernameErrTips.value = true
    return
  }
  if (!isMobile(mobile.value)) {
    mobileErrTips.value = true
    return
  }
  if (!validCode.value || validNoEmptySpace(validCode.value)) {
    validCode.value = ''
    validCodeErrTips.value = true
    return
  }
  if (!password.value || !password.value.trim()) {
    passwordEmptyTips.value = true
    return
  }
  if (passwordEmptyTips.value || passwordErrorTips.value || passwordErrorTips2.value) {
    return
  }
  mallNameEmptyTips.value = false
  usernameEmptyTips.value = false
  usernameErrTips.value = false
  mobileErrTips.value = false
  validCodeErrTips.value = false
  passwordEmptyTips.value = false
  passwordErrorTips.value = false

  if (!checked.value) {
    ElMessage({
      message: '请先阅读按钮下方《供应商注册协议》',
      type: 'error',
      duration: 1500
    })
    return
  }
  onRegister()
}
// 注册
const onRegister = Debounce(function () {
  const registerInfo = {
    mallName: mallName.value,
    username: username.value,
    mobile: mobile.value,
    validCode: validCode.value,
    password: encrypt(password.value)
  }

  register(registerInfo).then(() => {
    dialogVisible.value = true
    setTimeout(() => {
      dialogVisible.value = false
      router.push('/login?redirect=%2Fdashboard')
    }, 1500)
  })
})

/**
 * 商家注册协议
 */
const queryRegisterProtocol = () => {
  protocolDialogVisible.value = true
  getMerchantRegisterProtocol().then((data) => {
    registerProtocol.value = data
  })
}

// 已阅读并同意注册协议
const readAndAgree = () => {
  protocolDialogVisible.value = false
  checked.value = true
}

// 去登录
const toLogin = () => {
  router.push('/login?redirect=%2Fdashboard')
}
const mobileCus = () => {
  mobileBorder.value = !mobileBorder
}
const passwordRef = ref()
const changePass = (value) => {
  passwordType.value = value
  nextTick(() => { // 对焦密码框
    passwordRef.value?.focus()
  })
}

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
