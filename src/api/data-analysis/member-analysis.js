import request from '@/utils/request'

export function getMemberSurvey (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/get_member_survey',
    method: 'get',
    params
  })
}

export function soldExcel (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/member_trend_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function getMemberTrend (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/get_member_trend',
    method: 'get',
    params
  })
}

export function getMemberContributeValue (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/get_member_vontribute_value',
    method: 'get',
    params
  })
}

export function getMemberDeal (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/get_member_deal',
    method: 'get',
    params
  })
}
export function getCustomerRetained (params) {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/get_customer_retained',
    method: 'get',
    params
  })
}
export function refreshRetainedData () {
  return request({
    url: '/mall4cloud_flow/mp/customer_analysis/refresh_retained_data',
    method: 'get'
  })
}
