import request from '@/utils/request'

// 网站配置
export function getWebConfig (key) {
  return request({
    url: '/mall4cloud_admin/p/web_config/info/' + key,
    method: 'get',
    params: ''
  })
}
export function saveWebConfig (data) {
  return request({
    url: '/mall4cloud_admin/p/web_config/save',
    method: 'post',
    data
  })
}
// 网站配置

export function get (key) {
  return request({
    url: '/mall4cloud_admin/p/sys_config/info/' + key,
    method: 'get',
    params: ''
  })
}
export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/sys_config/save',
    method: 'post',
    data
  })
}
export function saveDeliveryConfig (data) {
  return request({
    url: '/mall4cloud_admin/p/sys_config/saveDeliveryConfig',
    method: 'post',
    data
  })
}

// 查询是否开启通联支付
export function getPaySettlementType () {
  return request({
    url: '/mall4cloud_admin/p/ua/sys_config/pay_settlement_type',
    method: 'get'
  })
}
