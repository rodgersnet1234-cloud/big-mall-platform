import request from '@/utils/request'

export function get (key) {
  return request({
    url: '/mall4cloud_admin/p/growth_config/info/' + key,
    method: 'get'
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/growth_config/',
    method: 'post',
    data
  })
}
