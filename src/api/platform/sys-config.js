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
// 下载代码包
export function onDownloadZip () {
  return request({
    url: '/mall4cloud_biz/p/attach_file/get_mini_code_file_info',
    method: 'get'
  })
}
// 获取小程序信息
export function getAppletInformation () {
  return request({
    url: '/mall4cloud_biz/p/wx/miniapp/info',
    method: 'get'
  })
}
// 小程序二维码
export function getAppletQRcode () {
  return request({
    url: '/mall4cloud_biz/p/wx/miniapp/mini_qrcode',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
// 获取公众号信息
export function getOfficialAccountInformation () {
  return request({
    url: '/mall4cloud_biz/p/wx/mp_info',
    method: 'get'
  })
}
// 公众号二维码
export function getOfficialAccountQRcode () {
  return request({
    url: '/mall4cloud_biz/p/wx/mp_qrcode',
    method: 'get',
    responseType: 'arraybuffer'
  })
}
