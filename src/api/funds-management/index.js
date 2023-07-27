import request from '@/utils/request'
import excelRequest from '@/utils/excelRequest'

// 收入详情
export function revenueDetail (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_income_account_detail',
    method: 'get',
    params: pageParam
  })
}

export function revenueDetailInfo (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_income_account_detail_info',
    method: 'get',
    params: pageParam
  })
}

// /mall4cloud_payment/p/account_detail/get_refund_account_detail

export function refundsDetail (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_refund_account_detail',
    method: 'get',
    params: pageParam
  })
}

export function refundDetailInfo (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_refund_account_detail_info',
    method: 'get',
    params: pageParam
  })
}

/**
 * 财务对账
 */

// 获取支付详情
export function getPayInfo (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_pay_info',
    method: 'get',
    params: pageParam
  })
}

// 获取退款详情
export function getRefundInfo (pageParam) {
  return request({
    url: '/mall4cloud_payment/p/account_detail/get_refund_info',
    method: 'get',
    params: pageParam
  })
}

// 导出收入对账excel
export function soldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_payment/p/account_detail/sold_excel',
    method: 'GET',
    params: param
  })
}

// 导出退款对账excel
export function refundSoldExcel (param) {
  return excelRequest({
    url: '/mall4cloud_payment/p/account_detail/refund_sold_excel',
    method: 'GET',
    params: param
  })
}
