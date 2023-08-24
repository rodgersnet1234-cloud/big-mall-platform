import request from '@/utils/request'

export function get (key) {
  return request({
    url: '/mall4cloud_admin/p/score/other_related/info/' + key,
    method: 'get'
  })
}

export function saveOrUpdate (data) {
  return request({
    url: '/mall4cloud_admin/p/score/other_related',
    method: 'post',
    data
  })
}
