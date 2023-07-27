import request from '@/utils/request'
import excelRequest from '@/utils/excelRequest'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/p/order/page',
    method: 'get',
    params: pageParam
  })
}
export function scorePage (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/order/page',
    method: 'get',
    params: pageParam
  })
}

export function orderInfo (orderId) {
  return request({
    url: '/mall4cloud_order/p/order/order_info/' + orderId,
    method: 'get'
  })
}

// 原/order/delivery/getOrderItemUnDelivery
export function getOrderItemAndAddress (orderId) {
  return request({
    url: '/mall4cloud_order/mp/order/order_item_and_address/' + orderId,
    method: 'get'
  })
}

//
export function delivery (data) {
  return request({
    url: '/mall4cloud_order/mp/order/delivery',
    method: 'post',
    data
  })
}
// 获取订单物流信息
export function getOrderDeliveries (pageParam) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/info',
    method: 'get',
    params: pageParam
  })
}

// 提交订单物流包裹修改信息
export function updateOrderDeliveries (data) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/update',
    method: 'put',
    data
  })
}

// 导出订单excel
export function soldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_order/p/order/sold_excel',
    method: 'GET',
    params: param
  })
}

// 导出积分订单excel
export function scoreSoldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_order/p/order/score_sold_excel',
    method: 'GET',
    params: param
  })
}

export function exportUndeliveryOrder (param) {
  return excelRequest({
    url: '/mall4cloud_order/mp/order/un_delivery_sold_excel',
    method: 'GET',
    params: param
  })
}

/**
 * 查询订单物流包裹信息
 * @param {*} param 当前筛选条件
 */
export function deliveryExpresseInfo (param) {
  return request({
    url: '/mall4cloud_order/mp/order_delivery/info',
    method: 'GET',
    params: param
  })
}
