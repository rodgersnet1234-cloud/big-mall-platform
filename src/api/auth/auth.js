import request from '@/utils/request'

export function login (data) {
  return request({
    url: '/mall4cloud_auth/ua/admin_login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/mall4cloud_auth/ma/login_out',
    method: 'post'
  })
}

export function updatePassword (data) {
  return request({
    url: '/mall4cloud_auth/mp/password/update_password',
    method: 'PUT',
    data
  })
}

export function getRegisterCode (data) {
  return request({
    url: '/mall4cloud_biz/ua/sms/verification_code/apply_shop',
    method: 'PUT',
    data
  })
}
export function register (data) {
  return request({
    url: '/mall4cloud_admin/ua/platform_user_register',
    method: 'POST',
    data
  })
}

// 商家注册协议
export function getMerchantRegisterProtocol () {
  return request({
    url: '/mall4cloud_admin/ua/platform_user_register/get_platform_register_protocol',
    method: 'GET'
  })
}
// 获取忘记密码验证码
export function getForgetCode (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/ua/update_pwd',
    method: 'POST',
    data
  })
}
// 校验忘记密码验证码
export function checkUpdatePwd (data) {
  return request({
    url: '/mall4cloud_biz/m/sms/ua/check_update_pwd',
    method: 'put',
    data
  })
}
