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

/**
 * 是否为最后一个退款项
 */
export function checkIsLastOrderItem (refundId) {
  return request({
    url: '/mall4cloud_order/p/order_refund/is_last_refund',
    method: 'get',
    params: {
      refundId
    }
  })
}

export function audit (data) {
  return request({
    url: '/mall4cloud_order/p/order_refund/handle_platform_intervention',
    method: 'put',
    data
  })
}
