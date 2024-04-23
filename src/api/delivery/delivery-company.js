import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/delivery_company/page',
    method: 'get',
    params: pageParam
  })
}

export function list () {
  return request({
    url: '/mall4cloud_order/mp/delivery_company/list',
    method: 'get'
  })
}

export function get (deliveryCompanyId) {
  return request({
    url: '/mall4cloud_order/mp/delivery_company',
    method: 'get',
    params: {
      deliveryCompanyId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/p/delivery_company',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/p/delivery_company',
    method: 'put',
    data
  })
}

export function deleteById (deliveryCompanyId) {
  return request({
    url: '/mall4cloud_order/p/delivery_company',
    method: 'delete',
    params: {
      deliveryCompanyId
    }
  })
}

export function deliveryOrder (id) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/' + id,
    method: 'get'
  })
}
