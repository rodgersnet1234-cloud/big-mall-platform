import request from '@/utils/request'

// 获取平台信息
export function shopUserInfo () {
  return request({
    url: '/mall4cloud_admin/p/platform_user/info',
    method: 'get'
  })
}

// 获取联系人
export function getConversations (pageNum, pageSize) {
  return request({
    url: '/mall4cloud_im/p/im/conversations?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'POST'
  })
}

// 获取用户信息
export function getUserinfo (id) {
  return request({
    url: '/mall4cloud_im/p/im/userInfo?userId=' + id,
    method: 'GET'
  })
}

// websocket 连接
export function get (groupActivityId) {
  return request({
    url: '/luck_group/mp/group_activity',
    method: 'get',
    params: {
      groupActivityId
    }
  })
}

// 上传图片

export function uploadFile (params) {
  return request({
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization': Vue.cookie.get('Authorization_vp') // 请求头带上token
    // },
    url: '/mall4cloud_biz/ua/oss/info',
    method: 'get',
    params
  })
}

export function update (data) {
  return request({
    url: '/luck_group/mp/group_activity',
    method: 'put',
    data
  })
}

export function deleteById (groupActivityId) {
  return request({
    url: '/luck_group/mp/group_activity',
    method: 'delete',
    params: {
      groupActivityId
    }
  })
}
// 获取频道信息
export function getShopChannelInfo (userId) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/get_shop_channel_info?userId=' + userId,
    method: 'POST'
  })
}
// 创建频道
export function createChannel (userId) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/create_channel?userId=' + userId,
    method: 'POST'
  })
}
// 标记频道为已读
export function setUnread (data) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/conversations/set_unread',
    method: 'POST',
    data
  })
}
// 获取用户频道订阅者信息
export function listChannelSubcribers (channelId) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/list_channel_Subcribers?channelId=' + channelId,
    method: 'GET'
  })
}
// 分页获取最近会话
export function conversationSyncPage (pageParam) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/conversation/sync/page',
    method: 'GET',
    params: pageParam

  })
}
// 注册或登录
export function registerOrLogin () {
  return request({
    url: '/mall4cloud_biz/p/wukongim/register_or_login',
    method: 'POST'
  })
}
// 更新自动回复
export function updateAuto (channelId) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/update_auto?channelId=' + channelId,
    method: 'POST'
  })
}
// 获取用户频道消息列表
export function messageSync (data) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/channel/message_sync',
    method: 'POST',
    data
  })
}
// 获取可转接客服列表
export function getListTransfer () {
  return request({
    url: '/mall4cloud_biz/p/wukongim/list_transfer',
    method: 'GET'
  })
}
// 转接客服
export function transfer (channelId, employeeId) {
  return request({
    url: '/mall4cloud_biz/p/wukongim/transfer?channelId=' + channelId + '&uid=' + employeeId,
    method: 'POST'
  })
}
