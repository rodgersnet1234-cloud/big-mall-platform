<template>
  <div class="body page-im-box">
    <div class="chat-box">
      <!-- 消息盒子头部 -->
      <div class="chat-box-top">
        {{ $t('chat.messageBox') }}
      </div>

      <div class="chat-box-main">
        <!-- 消息盒子左侧栏 -->
        <div class="chat-box-left">
          <!-- 左侧用户信息栏 -->
          <ul
            v-if="friends.length"
            v-infinite-scroll="scrollUserList"
            infinite-scroll-immediate="false"
            class="shop-list"
          >
            <li
              v-for="(item, index) in friends"
              :key="index"
              :class="['shop-item',item.userId === Number(selectedF) ? 'changeUser' : '',item.message?'newMessage':'']"
              @click="changeImContent(item.userId,index)"
            >
              <img
                v-if="!item.pic"
                src="@/assets/im_box/userImg.jpg"
                class="shop-icon"
                alt
              >
              <img
                v-else
                :src="item.pic"
                class="shop-icon"
                alt
                @error="item.pic=''"
              >
              <div class="shop-info">
                <span class="shop-info-name">
                  <span class="name">{{ item.friendName }}</span>
                  <span
                    v-if="item.unread > 0"
                    class="tips"
                  >{{ item.unread }}</span>
                </span>
                <span class="shop-info-icon">{{ item.latestMsg }}</span>
              </div>
            </li>
          </ul>
          <div
            v-else
            class="empty-contacts"
          >
            <img
              src="@/assets/empty/empty_contacts.png"
              alt="暂无联系人"
              class="empty-img"
            >
            <span class="empty-txt">暂无联系人</span>
          </div>
        </div>

        <!-- 消息盒子右侧信息回复栏 -->
        <div class="chat-box-right">
          <div class="im-box">
            <div class="im-main">
              <div class="chat-main-form">
                <div class="display-infor">
                  <div
                    v-if="moreMess && pages>1"
                    class="more"
                    @click="moreInfo()"
                  >
                    {{ $t('chat.clickToLoadMore') }}
                  </div>
                  <div
                    v-if="!moreMess && pages>1"
                    class="more"
                  >
                    {{ $t('chat.noMore') }}
                  </div>
                  <div
                    v-for="(row, index) in msgList"
                    :key="index"
                    class="row"
                  >
                    <!-- <div
                      v-if="index>0&&msgList[index].employeeId!==msgList[index-1].employeeId"
                      class="divider-box"
                    >
                      <el-divider>
                        以上是{{ msgList[index-1].nickName || msgList[index-1].shopName }}客服聊天记录
                      </el-divider>
                    </div> -->
                    <!-- 用户消息 -->
                    <div
                      v-if="row.timeStr"
                      class="topTime"
                    >
                      {{ row.timeStr }}
                    </div>
                    <!-- 用户发出的消息 -->
                    <div
                      v-if="row.source === 2"
                      class="my"
                    >
                      <!-- 右-消息 -->
                      <div class="left">
                        <img
                          v-if="!row.userHeadUrl"
                          src="@/assets/im_box/userImg.jpg"
                          class="avatar"
                          alt
                        >
                        <img
                          v-else
                          :src="row.userHeadUrl"
                          class="avatar"
                          alt
                          @error="row.userHeadUrl = ''"
                        >
                      </div>
                      <!-- 左-头像 -->
                      <div class="right">
                        <div class="username">
                          <div class="name">
                            {{ row.userName }}
                          </div>
                        </div>
                        <div
                          v-if="row.type === 1 && !row.prodInfo"
                          class="bubble"
                        >
                          <el-image
                            :src="row.content"
                            class="longimage"
                            :preview-src-list="[row.content]"
                          >
                            <template #error>
                              <img
                                class="img-slot"
                                src="@/assets/images/def.png"
                                alt
                              >
                            </template>
                          </el-image>
                        </div>
                        <!-- 文字消息 -->
                        <div
                          v-if="row.type === 0 && !row.prodInfo"
                          class="bubble"
                        >
                          <span>{{ row.content }}</span>
                        </div>
                        <!-- 商品链接 -->
                        <div
                          v-if="row.prodInfo"
                          class="prod-link"
                        >
                          <div class="link-prod">
                            <div
                              v-if="row.prodInfo.orderFlag"
                              class="prod-number"
                              @click="toProdDetail(row.prodInfo,1,row.prodInfo.orderType)"
                            >
                              {{ $t('chat.orderNumber') }}:{{ row.prodInfo.orderId }}
                            </div>
                            <div
                              class="prod-box"
                              @click="toProdDetail(row.prodInfo,0,row.prodInfo.orderType)"
                            >
                              <img-show :src="row.prodInfo.imgs" />
                              <div class="link-detail">
                                <div class="prod-name">
                                  {{ row.prodInfo.spuName }}
                                </div>
                                <div class="prod-price">
                                  <span>{{ row.prodInfo.actualTotal?'￥':'' }}{{ row.prodInfo.actualTotal?parsePrice(row.prodInfo.actualTotal)[0]+'.'+parsePrice(row.prodInfo.actualTotal)[1]:'' }}{{ (row.prodInfo.actualTotal && (row.prodInfo.platformShareReduce || row.prodInfo.scoreFee))?'+':'' }}<span v-if="row.prodInfo.platformShareReduce">{{ parsePrice(row.prodInfo.platformShareReduce)[0] }} {{ $t('order.order.integral') }}</span><span v-if="row.prodInfo.scoreFee">{{ row.prodInfo.scoreFee }} {{ $t('order.order.integral') }}</span></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 平台或者商家发出的消息 -->
                    <div
                      v-if="(row.source === 0 || row.source === 1)"
                      class="other"
                    >
                      <!-- 右-商家名称-时间-消息 -->
                      <div class="left">
                        <div class="username">
                          <div class="name">
                            {{ row.nickName||row.shopName }}
                          </div>
                        </div>
                        <div class="message-box">
                          <div
                            v-if="row.userUnread"
                            class="unread"
                          >
                            {{ $t('chat.read') }}
                          </div>
                          <div
                            v-else
                            class="unread"
                          >
                            {{ $t('chat.unRead') }}
                          </div>
                          <!-- 文字消息 -->
                          <div
                            v-if="row.type === 0"
                            class="bubble"
                          >
                            <span>{{ row.content }}</span>
                          </div>
                          <!-- 图片消息 -->
                          <div
                            v-if="row.type === 1"
                            class="bubble"
                          >
                            <el-image
                              :src="row.content"
                              class="longimage"
                              :preview-src-list="[row.content]"
                            >
                              <template #error>
                                <img
                                  class="img-slot"
                                  src="@/assets/images/def.png"
                                  alt
                                >
                              </template>
                            </el-image>
                          </div>
                        </div>
                      </div>
                      <!-- 头像 -->
                      <div class="right">
                        <img
                          :src="chatImg"
                          class="avatar"
                          alt
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 下方发送信息栏 -->
                <div class="reply">
                  <div class="small-box">
                    <div class="upload" />
                    <div
                      class="customerService"
                      @click="customerService()"
                    >
                      转接客服
                      <el-tooltip
                        effect="dark"
                        :content="$t('chat.transferTips')"
                        placement="right"
                      >
                        <el-icon><QuestionFilled /></el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                  <label
                    for="iii"
                    class="imgUp"
                  ><a
                    class="upload"
                    style="cursor: pointer"
                  /></label>
                  <input
                    id="iii"
                    ref="fileRef"
                    accept="image/png, image/jpeg"
                    type="file"
                    class="search-btnn"
                    @change="onUploadConfirm"
                  >
                  <div class="reply-area">
                    <textarea
                      id=""
                      v-model="textMsg"
                      name=""
                      cols="20"
                      rows="4"
                      @keydown="messageSendlisten($event)"
                    />
                  </div>
                  <div
                    class="send"
                    @click="sendText()"
                  >
                    {{ $t('chat.send') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 转接客服弹窗 -->
    <el-dialog
      v-model="visible"
      :title="$t('chat.selectOnlineCustomerService')"
      :modal="false"
      top="61px"
      width="980px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="prods-select-body">
        <el-table
          ref="prodTableRef"
          :data="serviceList"
          border
          style="width: 100%"
        >
          <el-table-column
            v-if="isSingle"
            width="50"
            header-align="center"
            align="center"
          >
            <template #default="scope">
              <div>
                <!-- native modifier has been removed, please confirm whether the function has been affected  -->
                <el-radio
                  v-model="platformUserId"
                  :label="scope.row.sysUserId"
                  @change="getSelectProdRow(scope.row)"
                >
&nbsp;
                </el-radio>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isSingle"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="nickName"
            header-align="center"
            align="center"
            :label="$t('chat.userName')"
          />
        </el-table>
      </div>
      <template #footer>
        <span>
          <el-button @click="visible = false">{{
            $t("chat.cancel")
          }}</el-button>
          <el-button
            type="primary"
            @click="transferDetermination()"
          >{{
            $t("chat.confirm")
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/im-box/index.js'
import { aliImgUpdate, minIoImgUpdate, ossInfo } from '@/api/biz/oss.js'
import { getToken } from '@/utils/auth.js'
import { Base64 } from 'js-base64'
import imageCompression from 'browser-image-compression'
import { ElMessage, ElMessageBox } from 'element-plus'
import customerPng from '@/assets/im_box/customer-service.png'

const router = useRouter()
const route = useRoute()

const employeeIdShop = null // 当前商家id
const chatImg = ref(customerPng) // 官方头像
const resourcesActionType = import.meta.env.VITE_APP_RESOURCES_TYPE
const WebSocketUrl = import.meta.env.VITE_APP_WEBSOCKET_URL

const defaultTitle = document.title // 存储默认标题

const dataForm = {}
const isSingle = ref(true)

onMounted(() => {
  getShopInfo()
  getConversations()
  // 监听storage的变化，用于退出登录时关闭ws
  window.addEventListener('storage', (e) => {
    if (e.key === 'cloudPlatChatWs') {
      imSocketTask?.close()
    }
  })
})

let imSocketTask = null
onBeforeMount(() => {
  if (imSocketTask != null) {
    imSocketTask.close()
  }
})

let userId = ''
let nickName = ''
const getShopInfo = () => {
  api.shopUserInfo().then(data => {
    userId = data.platformUserId
    nickName = data.nickName
  })
}

/**
 * 价格过滤
 */
const parsePrice = (value) => {
  let val = formatPrice(Number(value), 1)
  if (!val) {
    val = 0
  }
  // 截取小数点后两位，并以小数点为切割点将val转化为数组
  return val.toFixed(2).split('.')
}

let messageReminding = null
// 清除消息提醒时器
const clearMeagess = () => {
  clearInterval(messageReminding)
  document.title = defaultTitle
}

// 消息提醒标题闪烁
const messageRemindingFn = () => {
  window.onfocus = () => {
    clearMeagess()
  }
  clearMeagess()
  messageReminding = setInterval(() => {
    const title = document.title
    // 如果没有获取焦点就判断名称是否包含未读消息
    if (/您有新消息/.test(title) === false) {
      // 如果包含就显示为空
      document.title = '【您有新消息】'
    } else {
      // 否则显示未读消息，间隔0.5秒实现闪烁
      document.title = defaultTitle
    }
  }, 500)
}

let userCurrent = 1 // 左侧用户栏当前页
const friends = ref([])
let currentUserId = ''
let userPages = null
/**
 * 获取左侧历史联系人信息
 */
const getConversations = async () => {
  const data = await api.getConversations(userCurrent, 20)
  if (data.list && data.pages) {
    data.list.forEach(item => {
      const a = isJSON(item.latestMsg)
      if (item.type === 1) {
        item.latestMsg = '[' + $t('chat.image') + ']'
      } else if (a && JSON.parse(item.latestMsg) instanceof Object) {
        item.latestMsg = '[' + $t('chat.productLinks') + ']'
      }
    })
    // sort按时间正序排序 最新的消息在前面
    data.list.sort(function (a, b) {
      return b.timestamp - a.timestamp
    })
    if (userCurrent > 1) {
      friends.value.forEach(item => {
        data.list = data.list.filter(itemInde => {
          return item.userId !== itemInde.userId
        })
      }) // 过滤左侧已存在的用户
      friends.value = friends.value.concat(data.list)
    } else {
      if (route.query.userId) {
        // 用户要是已存在就记录下标
        const newUserFlag = data.list.some((item) => {
          if (item.userId === Number(route.query.userId)) {
            return item.userId === Number(route.query.userId)
          } else {
            return false
          }
        }) // 过滤已存在的用户
        if (newUserFlag) {
          friends.value = data.list
          currentUserId = route.query.userId
        } else {
          const res = await api.getUserinfo(route.query.userId)
          friends.value.push(res[0])
          currentUserId = res[0].userId
          friends.value = friends.value.concat(data.list)
        }
      } else {
        friends.value = data.list
        currentUserId = data.list[0].userId
      }
      openWs() // 开启webstocket
    }
    userPages = data.pages
  } else {
    // 平台联系买家
    if (route.query.orderNumber && route.query.userId && !friends.value.length) {
      getNewUser()
    } else {
      openWs() // 开启webstocket
    }
  }
}

// 添加新的用户栏到左侧
const getNewUser = async () => {
  const res = await api.getUserinfo(route.query.userId)
  friends.value.push(res[0])
  currentUserId = res[0].userId
  selectedF.value = res[0].userId
  openWs() // 开启webstocket
}

let ortherUser = false // 别的账号登录判断
let noAccountable = true // 转接判断
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
let current = 1 // 聊天内容当前页
const msgList = ref([])
const pages = ref(null)
const moreMess = ref(null) // true 有更多 false 没有更多
const selectedF = ref(null) // 选中的用户
const serviceList = ref([])
let userRead = true // 用户的已读未读判断
let userSend = false // 是否是用户发送的消息判断
let lockReconnect = false // 判断有无客服连接上
let plooTime = 0
let messageInfo = {} // 商家发送的文本消息
/**
 * 开启webstocket
 */
// eslint-disable-next-line max-lines-per-function
const openWs = () => {
  imSocketTask = new WebSocket(
    WebSocketUrl + '/mall4cloud_im/p/ua/im/websocket/' + Base64.encode(getToken()) + '/' + userId
  )
  imSocketTask.onopen = () => {
    heartCheck.reset().start() // 成功建立连接后，重置心跳检测
    ortherUser = false
    if (friends.value.length) {
      getMsgItems()
    }
  }
  // eslint-disable-next-line max-statements,max-lines-per-function
  imSocketTask.onmessage = (res) => {
    heartCheck.reset().start() // 成功建立连接后，重置心跳检测
    const result = JSON.parse(res.data)
    if (result.code !== '00000') {
      result.code = Number(result.code)
    }
    if (result.code === 10) {
      router.push({ path: '/login' })
      return
    }
    if (result.code === 11) {
      ortherUser = true
      ElMessageBox.confirm($t('chat.idIsLoginInElse'), {
        showClose: false,
        showCancelButton: false,
        confirmButtonText: $t('chat.confirm')
      }).then(() => {
        window.close()
      })
      return
    }
    if (result.code === 12) {
      return
    }
    if (result.code === 15) {
      ElMessage.error($t('chat.notYourResponsibility'))
      noAccountable = false
      return false
    }
    if (result.code === 18) {
      clearTimeout(pushMsgTimer)
      ElMessage.error(result.data || '该用户已注销')
      return
    }
    if (!result.data) {
      return
    }
    let switchingHistory = null
    /**
     * 新的聊天信息
     */
    if (result.code === '00000' || result.code === 4) {
      if (result.data === 'ok') {
        return
      }
      let index = null

      // 消息提醒标题闪烁
      if (result.data && !messageReminding) {
        messageRemindingFn()
      }

      // 进行未读消息的加减
      if (friends.value.length && result.code !== 4) {
        friends.value.forEach((item, indexx) => {
          if (item.userId === result.data.userId) {
            index = indexx
          }
        })
        if (index != null && selectedF.value !== result.data.userId && result.data.userUnread) {
          friends.value[index].unread = Number(friends.value[index].unread) + 1
        }
      }

      if (result.data.shopLogo) {
        result.data.shopLogo = resourcesUrl + result.data.shopLogo
      }
      if (result.data.userHeadUrl) {
        result.data.userHeadUrl = resourcesUrl + result.data.userHeadUrl
      }

      if (result.code === 4) {
        currentUserId = result.data.userId
        switchingHistory = 1
        clearMeagess()
        if (!friends.value.length) {
          friends.value.unshift({
            pic: result.data.userHeadUrl,
            friendName: result.data.userName,
            latestMsg: result.data.content,
            shopId: result.data.shopId,
            userId: result.data.userId,
            unread: 0,
            message: result.data.userId === currentUserId ? 0 : 1
          })
        }
        getMsgItems(1)
      }

      if (result.data.userId === currentUserId) {
        const readed = {
          read: 1,
          msgIds: [result.data.itemId],
          toId: currentUserId,
          sendType: 0
        }
        imSocketTask.send(JSON.stringify(readed))
      }

      changeFriendsWhenMsg(result.data)
      if (result.data.userId === currentUserId) {
        pushMsgItem(1, result.data)
      }
    }

    /**
     * 聊天记录
     */
    if (result.code === 2) {
      const msgIds = []
      let index = null
      if (result && result.data.pages) {
        result.data.list = result.data.list.reverse()
        if (friends.value.length) {
          friends.value.forEach((item, indexx) => {
            if (item.userId === result.data.list[0].userId) {
              index = indexx
            }
          })
        }

        // 进行是否是商品链接的判断
        result.data.list.forEach(item => {
          const a = isJSON(item.content)
          if (item.userHeadUrl) {
            item.userHeadUrl = resourcesUrl + item.userHeadUrl
          }
          if (a && JSON.parse(item.content) instanceof Object) {
            item.prodInfo = JSON.parse(item.content)
          }

          item.timeStr = tsToDate(item.timestamp, 'M月D日 h:m')

          if (item.type === 1 && !a) {
            item.content = item.content.indexOf(resourcesUrl) === 0 ? item.content : resourcesUrl + item.content
          }

          msgIds.push(item.itemId)
          // 进行未读消息的加减
          if (!item.employeeUnread) {
            friends.value[index].unread = 0
          }
          item.employeeUnread = 1
        })

        const readed = {
          read: 1,
          msgIds,
          toId: currentUserId,
          sendType: 0
        }
        imSocketTask.send(JSON.stringify(readed))

        result.data.list.reduce((prev, cur) => {
          // 将时间更换为某某月某某日 要是是当天即去掉月日
          const now = tsToDate(prev.timestamp, 'M月D日 h:m')
          const next = tsToDate(cur.timestamp, 'M月D日 h:m')
          if (now.slice(0, now.indexOf(' ')) === next.slice(0, next.indexOf(' '))) {
            cur.timeStr = tsToDate(cur.timestamp, 'h:m')
          }

          // 历史记录进行时间段显示判断
          if (result.data.list.length > 2) {
            const timeFlag = timeBeApart(prev.timestamp, cur.timestamp)
            if (timeFlag) {
              delete cur.timeStr
            }
          }
          return cur
        })
      }

      if (current === 1) {
        msgList.value = result.data.list || []
        pages.value = result.data.pages
        scrollToBottom()
      }

      if (current !== 1) {
        result.data.list = result.data.list.reverse()
        // 数组反转拼接
        if (!switchingHistory) {
          // 转接客服的历史消息合并
          result.data.list.forEach(item => {
            msgList.value.unshift(item)
          })
        } else {
          result.data.list = result.data.list.reverse()
          msgList.value = result.data.list || []
          pages.value = result.data.pages
          switchingHistory = null // 重置转接客服聊天消息
          current = 1
        }
      }
      moreMess.value = result.data.pages > 1
      if (result.data.pages !== 0) {
        selectedF.value = result.data.list[0].userId
      } else {
        selectedF.value = route.query.userId ? route.query.userId : ''
      }
    }

    /**
     * 转接客服
     */
    if (result.code === 3) {
      serviceList.value = result.data
    }

    /**
     * 未读信息转成已读
     */
    if (result.code === 5) {
      if (userSend) {
        userRead = false
        userSend = false
        pushMsgItem(msgList.value, messageInfo)
      }
      msgList.value.forEach(item => {
        item.userUnread = 1
      })
    }
  }
  const heartCheck = {
    timeout: 19000, // 19s发一次心跳，比server端设置的连接时间稍微小一点，在接近断开的情况下以通信的方式去重置连接时间。 尽量一个小时发送三次
    serverTimeoutObj: null,
    reset: function () {
      clearTimeout(heartCheck.serverTimeoutObj)
      return this
    },
    start: function () {
      heartCheck.serverTimeoutObj = setTimeout(() => {
        if (!imSocketTask) {
          return
        }
        if (imSocketTask.readyState === 1) {
          imSocketTask.send(
            JSON.stringify({
              sendType: null,
              content: 'HEART_BEAT',
              msgType: 0,
              toId: currentUserId
            })
          )
          heartCheck.reset().start() // 如果获取到消息，说明连接是正常的，重置心跳检测
        } else {
          imSocketTask.close()
          imSocketTask = null
          lockReconnect = false
        }
      }, heartCheck.timeout)
    }
  }
  imSocketTask.onclose = () => {
    if (!ortherUser) {
      ortherUser = false
      if (plooTime < 3) {
        plooTime++
        if (lockReconnect) return
        lockReconnect = true
        setTimeout(() => { // 没连接上会一直重连，设置延迟避免请求过多
          openWs()
          lockReconnect = false
        }, 2000)
      } else {
        ElMessageBox.confirm($t('chat.connetBroken'), $t('chat.tips'), {
          confirmButtonText: $t('chat.confirm'),
          cancelButtonText: $t('chat.cancel'),
          type: 'warning'
        }).then(() => {
          location.reload()
        }).catch(() => {})
      }
    }
  }
}

const visible = ref(false) // 客服转接弹窗显隐
/**
 * 转接客服
 */
const customerService = () => {
  const messageInfoPar = {
    toId: currentUserId,
    platformUserList: 1,
    msgType: 0
  }

  imSocketTask.send(JSON.stringify(messageInfoPar))
  const time = setTimeout(() => {
    if (noAccountable) {
      visible.value = true
    }
    clearTimeout(time)
  }, 100)
}

/**
 * 有消息过来的时候，改变左边历史联系人列表（先删除消息对应联系人的信息，再将联系人放到第一个）
 */
const changeFriendsWhenMsg = (msgItem) => {
  // 消息内容
  let msgContent
  const isJson = isJSON(msgItem.content)
  // 图片消息
  if (msgItem.type === 1) {
    msgContent = '[' + $t('chat.image') + ']'
  } else if (isJson && JSON.parse(msgItem.content) instanceof Object) {
    msgContent = '[' + $t('chat.productLinks') + ']'
  } else {
    msgContent = msgItem.content
  }
  for (let i = 0; i < friends.value.length; i++) {
    const item = friends.value[i]
    // 更新最新消息
    if (msgItem.userId === item.userId) {
      item.latestMsg = msgContent
      item.timeStr = msgItem.timeStr
      msgItem.unread = item.unread
      friends.value.splice(i, 1)
      break
    }
  }

  // 新消息
  friends.value.unshift({
    pic: msgItem.userHeadUrl,
    friendName: msgItem.userName,
    latestMsg: msgContent,
    shopId: msgItem.shopId,
    userId: msgItem.userId,
    unread: msgItem.unread || (currentUserId === msgItem.userId ? msgItem.unread : 1),
    message: msgItem.userId === currentUserId ? 0 : 1
  })
}

const isJSON = (str) => {
  if (typeof str === 'string') {
    try {
      JSON.parse(str)
      return true
    } catch (e) {
      return false
    }
  }
}

/**
 * 换个联系人聊条
 */
const changeImContent = (itemUserId, index) => {
  if (currentUserId === itemUserId) {
    return
  }
  currentUserId = itemUserId
  current = 1
  noAccountable = 1
  friends.value[index].message = 0
  const time = setTimeout(() => {
    getMsgItems()
    clearTimeout(time)
  }, 100)
}

/**
 * 获取聊天记录
 */
const getMsgItems = () => {
  const messageInfoPar = {
    history: true,
    current,
    size: 10,
    sendType: 0,
    toId: currentUserId
  }
  imSocketTask.send(JSON.stringify(messageInfoPar))
}

/**
 * 添加联系人发送过来的消息内容
 */
const pushMsgItem = (msgListPar, msgItemPar) => {
  if (msgItemPar.type === 1) {
    msgItemPar.content = resourcesUrl + msgItemPar.content
  }

  const a = isJSON(msgItemPar.content)
  if (a && JSON.parse(msgItemPar.content) instanceof Object) {
    msgItemPar.prodInfo = JSON.parse(msgItemPar.content)
  }

  // 首次进入
  if (msgListPar.length) {
    const prevTime = tsToDate(msgListPar[msgListPar.length - 1].timestamp, 'M月D日 h:m')
    const nowTime = tsToDate(msgItemPar.timestamp, 'M月D日 h:m')
    if (prevTime.slice(0, prevTime.indexOf(' ')) === nowTime.slice(0, nowTime.indexOf(' '))) {
      msgItemPar.timeStr = tsToDate(new Date().getTime(), 'h:m')
    } else {
      msgItemPar.timeStr = tsToDate(new Date().getTime(), 'M月D日 h:m')
    }
    const timeFlag = timeBeApart(msgListPar[msgListPar.length - 1].timestamp, new Date().getTime())
    if (timeFlag) {
      delete msgItemPar.timeStr
    }
  } else {
    msgItemPar.timeStr = tsToDate(new Date().getTime(), 'M月D日 h:m')
  }
  msgItemPar.timestamp = new Date().getTime()
  msgList.value.push(msgItemPar)
  noAccountable = true
  scrollToBottom()
}

/**
 * textarea回车事件
 */
const messageSendlisten = (event) => {
  if (event.keyCode === 13) {
    sendText() // 发送文本
    event.preventDefault() // 阻止浏览器默认换行操作
    return false
  }
}

const textMsg = ref('')
/**
 * 发送文本消息
 */
const sendText = () => {
  if (imSocketTask?.readyState !== 1) {
    ElMessageBox.confirm($t('chat.connetBroken'), $t('chat.tips'), {
      confirmButtonText: $t('chat.confirm'),
      cancelButtonText: $t('chat.cancel'),
      type: 'warning'
    }).then(() => {
      location.reload()
    }).catch(() => {})
    return
  }

  if (textMsg.value === '' || !currentUserId) {
    return
  }
  const messageInfoPar = {
    toId: currentUserId,
    content: textMsg.value,
    msgType: 0
  }
  addMessage(messageInfoPar)
  textMsg.value = ''
}

let pushMsgTimer = null
const addMessage = (messageInfoPar, type) => {
  userRead = true // 重置,防止用户不在线时可以继续发消息
  userSend = true
  imSocketTask.send(JSON.stringify(messageInfoPar))
  const shopInfo = {}
  const msgItem = {
    shopName: shopInfo.shopName,
    shopLogo: resourcesUrl + shopInfo.shopLogo,
    type: messageInfoPar.msgType,
    userUnread: 0,
    employeeId: employeeIdShop,
    timestamp: new Date(),
    source: 1,
    content: messageInfoPar.content,
    nickName
  }
  messageInfo = msgItem

  // 转接客服异步返回结果所以设下定时器
  pushMsgTimer = setTimeout(() => {
    if (noAccountable && userRead) {
      friends.value.forEach(item => {
        if (item.userId === currentUserId) {
          item.latestMsg = type ? '[' + $t('chat.image') + ']' : msgItem.content
        }
      })
      pushMsgItem(msgList.value, msgItem)
      userSend = false
    }
    clearTimeout(pushMsgTimer)
  }, 100)
}

/**
 * 进行相隔时间判断
 * true 删除显示时间
 * false 保留显示时间
 */
const timeBeApart = (uppTime, preTime) => {
  if (!uppTime) {
    return false
  }
  const dateDiff = preTime - uppTime// 时间差的毫秒数
  const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000))// 计算出相差天数
  const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))// 计算出小时数
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))// 计算相差分钟数

  return !(dayDiff >= 1 || hours >= 1 || minutes > 4)
}

let ossList = null
const fileRef = ref(null)
/**
 * 获取上传图片数据
 */
const onUploadConfirm = () => {
  const fileNum = fileRef.value.files.length
  ossInfo(fileNum).then(data => {
    if (resourcesActionType === '0') {
      dataForm.policy = data.policy
      dataForm.signature = data.signature
      dataForm.ossaccessKeyId = data.accessid
      dataForm.dir = data.dir
    }
    ossList = data.ossList
    nextTick(() => {
      httpRequest(fileRef.value?.files[0])
    })
  }).catch(({ data }) => {
    ElMessage.warning(data)
  })
}

/**
 * 上传图片
 */
const httpRequest = async (event) => {
  let file = event
  const typeArray = file.type.split('/')
  if (typeArray[0] !== 'image') {
    fileRef.value.value = null
    ElMessage.error($t('biz.imgbox.onlyPictures'), true)
    return
  }
  const isSize = file.size / (1024 * 1024) < 2
  if (!isSize) {
    try {
      const resultBlob = await imageCompression(file, {
        maxSizeMB: 2 // 压缩大小
      })
      file = new File([resultBlob], file.name, {
        type: file.type
      })
    } catch (error) {}
  }
  const attachFile = Object.assign({
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })
  if (ossList.length <= 0) {
    ElMessage.error('数据异常，请刷新后重试')
  }
  // aliOss 上传
  if (resourcesActionType === '0') {
    attachFile.filePath = '/' + dataForm.dir + ossList[0].fileName
    const formdata = new FormData()
    formdata.append('policy', dataForm.policy)
    formdata.append('signature', dataForm.signature)
    formdata.append('ossaccessKeyId', dataForm.ossaccessKeyId)
    formdata.append('dir', dataForm.dir)
    formdata.append('host', resourcesUrl)
    formdata.append('key', ossList[0].dir + ossList[0].fileName)
    formdata.append('file', file)
    aliImgUpdate(resourcesUrl, formdata).then(() => {
      uploadSuccess()
      if (ossList <= 0) {
        event.onSuccess()
      }
    }).catch((error) => {
      if (!error) {
        event.onError()
      }
    })
  } else {
    // mioIo 上传
    attachFile.filePath = '/' + ossList[0].dir + ossList[0].fileName
    minIoImgUpdate(ossList[0].actionUrl, file).then(() => {
      uploadSuccess()
      if (ossList <= 0) {
        event.onSuccess()
      }
    }).catch((error) => {
      if (!error) {
        event.onError()
      }
    })
  }
}

/**
 * 上传成功
 */
const uploadSuccess = () => {
  const messageInfoPar = {
    toId: currentUserId,
    content: '/' + ossList[0].dir + ossList[0].fileName,
    msgType: 1
  }
  fileRef.value.value = null // 解决上传同一图片不显示bug
  addMessage(messageInfoPar, 1)
  ossList = []
}

/**
 * 改变日期
 */
const tsToDate = (number, format) => {
  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
  const returnArr = []
  const date = new Date(number)
  returnArr.push(date.getFullYear())
  returnArr.push(
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  )
  returnArr.push(
    date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  )

  returnArr.push(
    date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  )
  returnArr.push(
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  )
  returnArr.push(
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  )

  for (const i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i])
  }
  return format
}

/**
 * 主体消息点击加载更多
 */
const moreInfo = () => {
  current += 1
  if (current > pages.value) {
    moreMess.value = false
  } else {
    getMsgItems(currentUserId)
  }
}

/**
 * 滚动加载用户列表
 */
const scrollUserList = () => {
  userCurrent += 1
  if (userCurrent <= userPages) {
    getConversations()
  }
}

// 滚动条自动到底部
const scrollToBottom = () => {
  nextTick(() => {
    const msg = document.getElementsByClassName('display-infor')[0] // 获取对象
    msg.scrollTop = msg.scrollHeight // 滚动高度
  })
}

const platformUserId = ref(0)
// 选中客服
const getSelectProdRow = (row) => {
  platformUserId.value = row.sysUserId
}

/**
 * 转接客服确定
 */
const transferDetermination = () => {
  if (platformUserId.value) {
    const messageInfoPar = {
      toId: currentUserId,
      changeTo: 1,
      platformUserId: platformUserId.value,
      msgType: 0
    }
    imSocketTask.send(JSON.stringify(messageInfoPar))
    visible.value = false
  } else {
    ElMessage.error($t('chat.pleaseSelectAcustomerService'))
  }
  platformUserId.value = 0
}

/**
 * 链接点击去往商品详情或订单详情
 */
const toProdDetail = (prodInfo, type, orderType) => {
  let routeUrl
  if (type) {
    routeUrl = router.resolve({
      path: orderType === 3 || prodInfo.spuType === 3 ? '/member/score/order' : '/order/order',
      query: {
        orderNumber: prodInfo.orderId
      }
    })
  } else {
    const spuName = prodInfo.spuName
    const prodId = prodInfo.prodId
    let spuId = prodInfo.spuId
    if (!spuId && (orderType === 3 || prodInfo.spuType === 3)) {
      spuId = prodId
    }
    routeUrl = router.resolve({
      path: orderType === 3 || prodInfo.spuType === 3 ? '/member/score/list' : '/product/list',
      query: { spuName, prodId, spuId }
    })
  }
  const win = window.open(routeUrl.href, '_blank', 'noopener,noreferrer', 'noopener,noreferrer')
  if (win) win.opener = null
}

</script>
<style lang="scss" scoped>
@use "index";
</style>
