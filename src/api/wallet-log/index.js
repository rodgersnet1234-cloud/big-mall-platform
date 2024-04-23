import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/page',
    method: 'get',
    params: pageParam
  })
}
// get_shop_wallet
export function shopWallet () {
  return request({
    url: '/mall4cloud_admin/mp/shop_wallet/get_shop_wallet',
    method: 'get'
  })
}
// 获取银行卡列表
export function getBankCardList () {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/list_by_shopId',
    method: 'get'
  })
}

// 添加银行卡
export function addBankCard (data) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card',
    method: 'post',
    data
  })
}

// 设置默认银行卡 set_primary
export function setPrimary (shopBankCardId) {
  return request({
    url: '/mall4cloud_admin/m/apply_shop/shop_bank_card/set_primary',
    method: 'put',
    params: {
      shopBankCardId
    }
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
