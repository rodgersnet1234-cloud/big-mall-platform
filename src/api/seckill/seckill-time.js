import request from '@/utils/request'

export function get (key) {
  return request({
    url: '/mall4cloud_seckill/p/seckill_time/info/' + key,
    method: 'get'
  })
}

export function saveOrUpdate (data) {
  return request({
    url: '/mall4cloud_seckill/p/seckill_time',
    method: 'post',
    data
  })
}
