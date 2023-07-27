<template>
  <div class="Mall4j page-login login-container">
    <div class="login-frame">
      <div class="login-img">
        <img :src="webConfig.loginBgImg">
      </div>
      <div class="login-info">
        <div class="title">
          {{ webConfig.titleContentCn || 'Mall4j白洞版-平台端登录' }}
        </div>
        <el-tag
          v-if="errorLogin"
          type="danger"
        >
          <el-icon>
            <Warning />
          </el-icon>&nbsp;{{ errorMsg }}
        </el-tag>
        <div class="input-box">
          <el-form
            ref="dataFormRef"
            :model="loginInfo"
            :rules="dataRule"
            @keyup.enter="onSubmit(dataFormRef)"
          >
            <el-form-item prop="userName">
              <el-input
                v-model="loginInfo.userName"
                :placeholder="$t('login.username')"
              />
            </el-form-item>
            <el-form-item prop="passWord">
              <el-input
                ref="passwordRef"
                v-model="loginInfo.passWord"
                :type="passwordType"
                :placeholder="$t('login.password')"
                maxlength="16"
                show-password
                @keyup.enter="onSubmit(dataFormRef)"
              />
            </el-form-item>
          </el-form>
          <div
            class="login-btn"
            :loading="loading"
            @click="onSubmit(dataFormRef)"
          >
            登录
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      {{ language === 'zh' ? webConfig.copyrightCn : webConfig.copyrightEn }}
    </div>
    <Verify
      ref="verify"
      :captcha-type="'blockPuzzle'"
      :img-size="{width:'400px',height:'200px'}"
      @success="onLogin"
    />
  </div>
</template>
<script setup>
import { useWebConfigStore } from '@/stores/modules/web-config.js'

const webConfig = computed(() => useWebConfigStore().webConfig)

// 当前语言
const language = computed(() => useAppStore().language)
// 登录表单
const loginInfo = reactive({
  userName: '', // 用户名
  passWord: '', // 密码
  captchaVerification: '', // 验证码
  sysType: 2
})

const passwordType = ref('password')
const passwordRef = ref(null)
// eslint-disable-next-line no-unused-vars
const userNameVerification = (rule, value, callback) => {
  if (!value || !value.trim()) {
    callback(new Error('用户名不能为空'))
  }
  callback()
}
// eslint-disable-next-line no-unused-vars
const passwordVerification = (rule, value, callback) => {
  const passWord = loginInfo.passWord.trim()
  if (!passWord) {
    loginInfo.passWord = passWord
    callback(new Error('密码不能为空'))
  }
  callback()
}

const dataRule = reactive({
  userName: [
    { required: true, validator: userNameVerification, trigger: 'blur' }
  ],
  passWord: [
    { required: true, validator: passwordVerification, trigger: 'blur' }
  ]
})
const dataFormRef = ref(null)
const verify = ref(null)
const onSubmit = async formEl => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      verify.value.show()
    }
  })
}
const router = useRouter()
const errorMsg = ref('')
const errorLogin = ref(false)
const redirect = ref('')
let otherQuery = reactive({})

const getOtherQuery = (query) => {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

watch(
  () => useRoute(),
  (route) => {
    const query = route.query
    if (query && query.redirect) {
      redirect.value = query.redirect
      otherQuery = getOtherQuery(query)
    }
  },
  { immediate: true }
)

const loading = ref(false)
const userStore = useUserStore()
// 登录
const onLogin = verifyResult => {
  loading.value = true
  errorMsg.value = ''
  errorLogin.value = false
  loginInfo.captchaVerification = verifyResult.captchaVerification
  const loginData = JSON.parse(JSON.stringify(loginInfo))
  loginData.passWord = encrypt(loginInfo.passWord)
  userStore.login(loginData).then(() => {
    // 获取用户信息
    userStore.getUserInfo().then(data => {
      // 获取并更新通联支付配置信息（平台开启通联支付会清除所有用户token，所以重新登录时更新通联支付配置信息）
      useAllinpayStore().getPaySettlementType()
      if (!data.isAdmin) {
        router.push({ path: '/dashboard' })
      } else {
        router.push({ path: redirect.value || '/', query: otherQuery }, () => {})
      }
    })
  }).catch((e) => {
    loading.value = false
    errorMsg.value = e.msg
    errorLogin.value = true
  })
}

</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 680px;
  min-width: 1200px;
  background: url('@/assets/images/login-bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;

  .login-frame {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    width: 1050px;
    height: 594px;
    background: #fff;
    box-shadow: 0 0 80px 0 rgba(0, 0, 0, 0.1);
    margin: auto;
    border-radius: 10px;
    overflow: hidden;

    .login-img {
      width: 626px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 626px;
        height: 594px;
      }
    }

    .login-info {
      margin-left: 32px;
      width: 360px;

      .title {
        font-size: 24px;
        font-weight: 400;
        color: #000000;
        margin-bottom: 70px;
        text-align: center;
      }

      .input-box {
        margin-top: 10px;

        :deep(.el-form) {
          .el-form-item {
            margin-bottom: 22px;

            .el-input__wrapper {
              padding: 1px;
              background-color: #e8f0fe;

              .el-input__inner {
                text-indent: 15px;
                height: 38px;
                border-radius: 4px;
              }

              .el-input__suffix {
                padding-right: 10px;
              }
            }
          }
        }
      }

      .login-btn {
        width: 363px;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        font-weight: 400;
        color: #FFFFFF;
        background: #155BD4;
        border-radius: 2px;
        text-align: center;
        margin-top: 60px;
        cursor: pointer;
        letter-spacing: 2px;
      }
    }
  }

  .bottom {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    bottom: 42px;
    font-size: 12px;
    color: #AAA;
  }
}
</style>
