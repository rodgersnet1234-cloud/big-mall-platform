import request from '@/utils/request'

// 获取平台信息
export function shopUserInfo () {
  return request({
    url: '/mall4cloud_admin/p/sys_user/info',
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
