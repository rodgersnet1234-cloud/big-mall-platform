import request from '@/utils/request'

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

export function getLiveRoomInfo (roomId = '') {
  return request({
    url: '/mall4cloud_marketing/p/live_room',
    method: 'GET',
    params: {
      roomId
    }
  })
}

export function getLiveRoomProdPage (roomId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room/list_live_room_prod',
    method: 'GET',
    params: { roomId }
  })
}

/**
 * 删除直播间
 * @param {*} roomId 直播间id
 * @returns
 */
export function delLiveRoom (roomId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room',
    method: 'DELETE',
    params: {
      roomId
    }
  })
}

/**
 * 通过id置顶直播间
 * @param {*} roomId 直播间id
 * @returns
 */
export function putLiveRoomToTop (roomId = null) {
  return request({
    url: '/mall4cloud_marketing/p/live_room/to_top',
    method: 'PUT',
    params: {
      roomId
    }
  })
}

/**
 * 下线直播间
 */
export function offlineLiveRoom (params) {
  return request({
    url: '/mall4cloud_marketing/p/live_room/offline',
    method: 'POST',
    data: params
  })
}
