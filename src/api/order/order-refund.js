import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/order_refund/page',
    method: 'get',
    params: pageParam
  })
}

export function info (refundId) {
  return request({
    url: '/mall4cloud_order/p/order_refund/info/' + refundId,
    method: 'get'
  })
}
