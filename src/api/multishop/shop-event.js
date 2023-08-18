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
