import request from '@/utils/request'

export function flowAll (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_all',
    method: 'get',
    params
  })
}

export function flowTrend (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_trend',
    method: 'get',
    params
  })
}

export function flowSour (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_sour',
    method: 'get',
    params
  })
}

export function flowSystem (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_system',
    method: 'get',
    params
  })
}

export function soldExcelSystem (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/analysis_data_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function soldExcelTrend (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_trend_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function soldExcelSour (params) {
  return request({
    url: '/mall4cloud_flow/p/flow_analysis/flow_sour_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
