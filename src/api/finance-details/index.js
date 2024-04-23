import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_order/p/finance/get_finance_detail',
    method: 'get',
    params: pageParam
  })
}
export function soldExcel (pageParam) {
  return request({
    url: '/mall4cloud_order/p/finance/finance_detail_export',
    method: 'get',
    params: pageParam,
    responseType: 'blob'
  })
}
