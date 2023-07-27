import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/page',
    method: 'get',
    params: pageParam
  })
}
export function listSeckillSpuByTime (pageParam) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/list_seckill_spu_by_time',
    method: 'get',
    params: pageParam
  })
}
export function listSeckill (pageParam) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/list_seckill',
    method: 'get',
    params: pageParam
  })
}
export function listEndSeckill (pageParam) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/list_end_seckill',
    method: 'get',
    params: pageParam
  })
}
export function get (seckillId) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill',
    method: 'get',
    params: {
      seckillId
    }
  })
}

export function apply (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/audit',
    method: 'post',
    data
  })
}

export function getOfflineHandleEvent (id) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/get_offline_handle_event/' + id,
    method: 'get'
  })
}

export function auditApply (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/audit_apply',
    method: 'post',
    data
  })
}

export function offline (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/offline',
    method: 'post',
    data
  })
}
export function getJoinSeckillMerchantNum () {
  return request({
    url: '/mall4cloud_seckill/mp/seckill/get_join_seckill_merchant_num',
    method: 'get'
  })
}
