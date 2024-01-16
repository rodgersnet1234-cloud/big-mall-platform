import request from '@/utils/request'

export function list (params) {
  return request({
    url: '/mall4cloud_flow/p/product_analyse/get_product_effect',
    method: 'get',
    params
  })
}

export function soldExcel (params) {
  return request({
    url: '/mall4cloud_flow/p/product_analyse/prod_effect_export',
    method: 'get',
    responseType: 'blob',
    params
  })
}

export function getSingleProdTrend (params) {
  return request({
    url: '/mall4cloud_flow/mp/product_analyse/get_single_prod_trend',
    method: 'get',
    params
  })
}
