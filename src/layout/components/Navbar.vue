<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div :class="['Mall4j',isDecorate?'navbar':'']">
    <div class="navbar-content">
      <!-- 1.左边部分 -->
      <div class="left-menu">
        <img
          v-if="route.path!=='/supplier/shop-process' && webConfig.bsTopBarIcon && webConfig.bsTopBarIcon !== resourcesUrl"
          style="height: 18px;width:59px;margin-right: 10px"
          :src="webConfig.bsTopBarIcon"
          alt=""
          @error="webConfig.bsTopBarIcon=''"
        >
        <img
          v-else
          style="height: 18px;width:59px;margin-right: 10px"
          :src="webConfig.bsTopBarIcon"
          alt=""
        >
        <a
          v-if="(webConfig.bsMenuTitleOpenCn || webConfig.bsMenuTitleCloseCn) || (webConfig.bsMenuTitleOpenEn || webConfig.bsMenuTitleCloseEn)"
          class="site-navbar__brand-lg"
          style="text-transform:none;"
          href="javascript:;"
        >{{ sidebar.opened ? webConfig.bsMenuTitleOpenCn : webConfig.bsMenuTitleCloseCn }}</a>
        <a
          v-else
          class="site-navbar__brand-lg"
          style="text-transform:none;"
          href="javascript:;"
        >{{ $t('version') + '  ' + $t('side') }}</a>
        <div
          v-if="route.path!=='/supplier/shop-process'"
          class="shrink"
        >
          <svg-icon
            icon-class="icon-zhedie"
            @click="toggleSideBar"
          />
        </div>
      </div>

      <!-- 2.右边部分 -->
      <div class="right-menu">
        <div
          v-permission="['message:message:view']"
          class="news-box"
          style="width:87px;height:100%"
          @click="openUrl"
        >
          <svg-icon
            :class="showHidden ? 'show' : 'hidden'"
            class="message"
            icon-class="message"
          />
          <i
            v-if="message"
            :class="showHidden ? 'show' : 'hidden'"
            class="message-radio"
          />
          客服
        </div>
        <el-dropdown
          class="avatar-container"
          trigger="hover"
        >
          <div class="avatar-wrapper">
            <div class="user-name">
              {{ name || userName }}
            </div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                @click="changePassword"
              >
                <span style="display: block">{{ $t("navbar.changePassword") }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="logout">
                <span style="display: block">{{ $t("navbar.logOut") }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePasswordVisible"
      ref="updatePasswordRef"
    />
  </div>
</template>

<script setup>
import UpdatePassword from '@/components/update-password/index.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Base64 } from 'js-base64'

const updatePasswordVisible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const webConfigStore = useWebConfigStore()
const webConfig = computed(() => webConfigStore.webConfig)

const appStore = useAppStore()
const sidebar = computed(() => appStore.sidebar)

const userStore = useUserStore()
const name = computed(() => userStore.name)
const userName = computed(() => userStore.userName)

const toggleSideBar = () => {
  if (sessionStorage.getItem('cloudIsExpand') === '0' && !sidebar.value.opened) {
    return
  }
  appStore.toggleSideBar()
}

const route = useRoute()
const router = useRouter()
const logout = async () => {
  ElMessageBox.confirm('确认退出登录？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(async () => {
    await userStore.logout()
    lockReconnect = true // 退出登录不在重连
    imSocketTask?.close() // 关闭ws
    imSocketTask = null
    localStorage.setItem('cloudPlatChatWs', Date.now()) // 通知新窗口关闭ws
    await router.push(`/login?redirect=${route.fullPath}`)
  })
}

const updatePasswordRef = ref(null)
const changePassword = () => {
  updatePasswordVisible.value = true
  nextTick(() => {
    updatePasswordRef.value?.init()
  })
}

/**
 * 开启webstocket
 */
let imSocketTask = null
const noAccountable = ref(false)
const newMessage = ref(false)
const notificationDebounce = ref(1)
const messageReminding = ref(null)
const message = ref(0)
const tenantId = computed(() => userStore.tenantId)
const userId = computed(() => userStore.userId)
const notification = ref(false)
// 图标提醒标题闪烁
const showHidden = ref(true)
const openWs = () => {
  imSocketTask = new WebSocket(
    import.meta.env.VITE_APP_WEBSOCKET_URL + '/mall4cloud_im/p/ua/im/websocket/online/' + Base64.encode(getToken()) + '/' + tenantId.value + '/' + userId.value
  )
  const heartCheck = {
    timeout: 19000, // 19s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。 尽量一个小时发送三次
    serverTimeoutObj: null,
    reset () {
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    start () {
      this.serverTimeoutObj = setTimeout(() => {
        if (!imSocketTask) {
          return
        }
        if (imSocketTask.readyState === 1) {
          imSocketTask.send(
            JSON.stringify({
              content: 'HEART_BEAT',
              msgType: 0
            })
          )
          heartCheck.reset().start() // 如果获取到消息，说明连接是正常的，重置心跳检测
        } else {
          imSocketTask.close()
          imSocketTask = null
          lockReconnect = false
          onReconnect()
        }
      }, this.timeout)
    }
  }
  imSocketTask.onopen = () => {
    heartCheck.reset().start() // 成功建立连接后，重置心跳检测
    imSocketTask.send(
      JSON.stringify({
        content: 'HEART_BEAT',
        msgType: 0
      })
    )
  }

  imSocketTask.onmessage = res => {
    heartCheck.reset().start() // 成功建立连接后，重置心跳检测
    const result = JSON.parse(res.data)
    if (result.code === 10) {
      return
    }
    if (result.code === 11) {
      return
    }
    if (result.code === 12) {
      return
    }
    if (result.code === 15) {
      ElMessage.error($t('chat.notYourResponsibility'))
      noAccountable.value = false
      return false
    }
    if (result.code === '00000' && result.data) {
      message.value = 1
      if (
        result.data.newMessage &&
        notificationDebounce.value &&
        !localStorage.getItem('cloudShop')
      ) {
        notificationDebounce.value = null // 防止连续发送的消息导致右下方弹窗不断
        popNotice($t('chat.notification'), $t('chat.haveANewUnreadMessage')) // 启用通知
      }
      newMessage.value = true
      clearInterval(messageReminding.value)
      if (notification.value) {
        showMessage()
      }
      messageRemindingFn()
    }
  }
  imSocketTask.onerror = () => {
    onReconnect()
  }
}

let lockReconnect = false
const onReconnect = () => {
  if (lockReconnect) return
  lockReconnect = true
  setTimeout(() => {
    // 没连接上会一直重连，设置延迟避免请求过多
    openWs()
    lockReconnect = false
  }, 2000)
}

const openUrl = () => {
  const win = window.open(location.origin + '/im-box', 'view_window', 'noopener,noreferrer')
  localStorage.removeItem('cloudVsNotificationMessage')
  if (win) win.opener = null
  message.value = null
  showHidden.value = true
  clearInterval(messageReminding.value)
}

// 右下角消息通知
const popNotice = (user, content) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(user, {
      body: content
    })
    notification.onclick = function () {
      nextTick(() => {
        setTimeout(() => {
          notificationDebounce.value = 1
          localStorage.removeItem('cloudVsNotificationMessage')
          message.value = null
          const win = window.open(location.href.split('#')[0] + '#/im-box', 'view_window', 'noopener,noreferrer')
          if (win) win.opener = null
          // 具体操作
        }, 500)
      })
      // 可直接打开通知notification相关联的tab窗
      window.focus()
      notification.close()
    }
    notification.onshow = function () {
      setTimeout(() => {
        notificationDebounce.value = 1
        notification.close.bind(notification)
      }, 3000)
    }
  }
}

const messageRemindingFn = () => {
  clearInterval(messageReminding.value)
  messageReminding.value = setInterval(() => {
    // 如果没有获取焦点就判断名称是否包含未读消息
    if (newMessage.value) {
      // 如果包含就显示为空
      showHidden.value = false
      newMessage.value = false
    } else {
      // 否则显示未读消息，间隔0.5秒实现闪烁
      showHidden.value = true
      newMessage.value = true
    }
  }, 500)
}

const showMessage = Debounce(function () {
  ElMessage({
    message: '您有新的未读消息',
    offset: 10,
    duration: 1500
  })
}, 1800)

onMounted(() => {
  message.value = localStorage.getItem('cloudVsNotificationMessage') || null
  openWs()
})
const isDecorate = computed(() => {
  return !(/^\/(platform-decorate\/decorate-select-decorate)/.test(router.currentRoute.value.path))
})
</script>

<style lang="scss" scoped>
.navbar {
  top: 0;
  z-index: 2000;
  position: fixed;
  display: flex;
  align-items: center;
  min-width: 1260px;
  width: 100%;
  height: 50px;
  background: #fff;
  overflow: hidden;
  border-bottom: 1px solid #EBEDF0;
  box-sizing: border-box;

  .navbar-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    margin: 0 auto;

    // 1.左边部分
    .left-menu {
      display: flex;
      align-items: center;
    }

    // 2.右边部分
    .right-menu {
      display: flex;
      align-items: center;
      margin-left: auto;
      .avatar-container {
        .avatar-wrapper {
          outline: none;
          cursor: pointer;
        }
      }
      .news-box {
        cursor: pointer;
        font-size: 14px;
        position: relative;
        color: #606266;
        .message {
          color: #155bd4;
          margin-right: 8px;
          font-size: 18px;
        }
        .message-radio {
          border-radius: 50%;
          width: 5px;
          height: 5px;
          background-color: red;
          display: inline-block;
          position: absolute;
          top: 0;
          left: 12px;
        }
        .show {
          visibility: inherit;
        }
        .hidden{
          visibility: hidden;
        }
      }
    }
  }

  .site-navbar__brand-lg {
    margin: 0 auto;
    word-break: break-all;
    /* 按字符截断换行 支持IE和chrome，FF不支持*/
    word-wrap: break-word;
    /* 按英文单词整体截断换行  以上三个浏览器均支持 */
    color: #333333;
    font-weight: bold;
    font-size: 16px;
  }

  .shrink {
    cursor: pointer;
    margin-left: 23px;
    font-size: 18px;
  }

  .navbar-notice img {
    vertical-align: middle;
    width: 20px;
    height: 20px;
    margin: 8px;
  }

}
</style>
