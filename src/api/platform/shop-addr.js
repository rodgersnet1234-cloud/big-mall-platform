import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr/page',
    method: 'get',
    params: pageParam
  })
}

export function get (shopRefundAddrId) {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr',
    method: 'get',
    params: {
      shopRefundAddrId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr',
    method: 'put',
    data
  })
}

export function deleteById (shopRefundAddrId) {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr',
    method: 'delete',
    params: {
      shopRefundAddrId
    }
  })
}

export function list () {
  return request({
    url: '/mall4cloud_admin/mp/shop_refund_addr/list',
    method: 'get'
  })
}
// 是否被网点引用
export function isConfigByOutlet (shopRefundAddrId) {
  return request({
    url: '/mall4cloud_order/mp/outlet_config/is_config_by_outlet',
    method: 'get',
    params: {
      shopRefundAddrId
    }
  })
}
