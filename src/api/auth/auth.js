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
