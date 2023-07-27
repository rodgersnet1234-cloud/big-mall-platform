import request from '@/utils/request'

// 获取门店列表
export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/p/station/page',
    method: 'get',
    params: pageParam
  })
}

// 根据门店id获取门店信息
export function getStationInfo (params) {
  return request({
    url: '/mall4cloud_order/p/station',
    method: 'get',
    params
  })
}

// 下线自提点
export function offlineStation (data) {
  return request({
    url: '/mall4cloud_order/p/station/offline',
    method: 'post',
    data
  })
}

// 根据门店id获取门店下线信息
export function getStationOfflineInfo (stationId) {
  return request({
    url: '/mall4cloud_order/p/station/get_offline_handle_event/' + stationId,
    method: 'get'
  })
}

// 门店上线申请审核
export function auditStation (data) {
  return request({
    url: '/mall4cloud_order/p/station/audit_station',
    method: 'post',
    data
  })
}
