import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/page_all_shop',
    method: 'get',
    params: pageParam
  })
}
export function soldExcel (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/get_shop_wallet_log_form',
    method: 'get',
    params: pageParam,
    responseType: 'blob'
  })
}
// get_shop_wallet
export function shopWallet (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/get_all_shop_wallet',
    params: param,
    method: 'get'
  })
}
export function pageShopWallet (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/page_shop_wallet_by_time',
    params: param,
    method: 'get'
  })
}
// get_order_detail 订单详情列表
export function orderDetaiList (orderId, refundId) {
  return request({
    url: '/mall4cloud_order/mp/order_item/get_order_detail',
    method: 'get',
    params: {
      orderId,
      refundId
    }
  })
}
