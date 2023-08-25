import request from '@/utils/request'

// 获取店铺状态信息
export function getMallUserInfo () {
  return request({
    url: '/mall4cloud_admin/p/platform_detail',
    method: 'GET'
  })
}

// 获取验证码
export function sendCode () {
  return request({
    url: 'mall4cloud_biz/p/sms/update_mall_name_code',
    method: 'get'
  })
}
export function updateMallName (data) {
  return request({
    url: '/mall4cloud_admin/p/platform_detail/update_mall_name',
    method: 'PUT',
    data
  })
}
// 获取下线信息
export function getEventInfo () {
  return request({
    url: '/mall4cloud_admin/p/offline_handle_event/get_event_info',
    method: 'GET'
  })
}
// 申请上线
export function auditApply (data) {
  return request({
    url: '/mall4cloud_admin/p/platform_detail/audit_apply',
    method: 'POST',
    data
  })
}
