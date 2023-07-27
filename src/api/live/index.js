import request from '@/utils/request'

/**
 * 查询商家今日剩余可用添加直播商品、可删除商品库商品次数
 * @returns
 */
export function getAddProdNum () {
  return request({
    url: '/mall4cloud_marketing/p/live_prod_store/getAddProdNum',
    method: 'GET'
  })
}

/**
 * 分页查找直播间商品库信息
 * @param {*} params
 * @returns
 */
export function getProdStorePage (params = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_prod_store/page',
    method: 'GET',
    params
  })
}

/**
 * 通过id删除直播间商品库
 * @param {*} liveProdStoreId 直播间商品库id
 * @returns
 */
export function delLiveProdStoreId (liveProdStoreId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_prod_store/' + liveProdStoreId,
    method: 'DELETE'
  })
}

/**
 * 获取直播间列表
 * @param {*} params
 * @returns
 */
export function getLiveRoomPage (params = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room/page',
    method: 'get',
    params
  })
}

export function getRemoveRoomNum () {
  return request({
    url: '/mall4cloud_marketing/p/live_room/getRemoveRoomNum',
    method: 'GET'
  })
}

/**
 * 删除直播间
 * @param {*} id 直播间id
 * @returns
 */
export function delLiveRoom (id = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/**
 * 通过id置顶直播间
 * @param {*} id 直播间id
 * @returns
 */
export function putLiveRoomToTop (id = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room/toTop/' + id,
    method: 'PUT'
  })
}

/**
 * 获取直播成员列表
 * @param {*} params
 * @returns
 */
export function getLiveUserPage (params = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_user/page',
    method: 'GET',
    params
  })
}

// 查询商家今日剩余可用添加直播商品、可删除商品库商品次数
export function getLiveUserAddProdNum () {
  return request({
    url: '/mall4cloud_marketing/p/live_user/getAddProdNum',
    method: 'GET'
  })
}

/**
 * 删除直播成员
 * @param {*} liveUserId 直播成员id
 * @returns
 */
export function delLiveUser (liveUserId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_user',
    method: 'DELETE',
    params: {
      liveUserId
    }
  })
}

/**
 * 获取直播成员
 * @param {Number} liveUserId
 * @returns
 */
export function getliveUserInfo (liveUserId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_user/info/' + liveUserId,
    method: 'get'
  })
}

/**
 * 更新或保存直播成员
 * @param {*} params
 * @returns
 */
export function postOrPutLiveUser (params) {
  return request({
    url: '/mall4cloud_marketing/p/live_user',
    ...params
  })
}

/*
export function(){
  return request({
    url:'',
    method:'',
    params
  })
}
*/
