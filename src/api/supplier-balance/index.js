import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/supplier_wallet/page_all_supplier',
    method: 'get',
    params: pageParam
  })
}
export function soldExcel (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/supplier_wallet/get_supplier_wallet_log_form',
    method: 'get',
    params: pageParam,
    responseType: 'blob'
  })
}
export function pageShopWallet (param) {
  return request({
    url: '/mall4cloud_admin/mp/supplier_wallet/page_supplier_wallet_by_time',
    params: param,
    method: 'get'
  })
}
// get_shop_wallet
export function shopWallet (param) {
  return request({
    url: '/mall4cloud_admin/mp/supplier_wallet/get_all_supplier_wallet',
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
