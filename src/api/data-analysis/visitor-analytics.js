import request from '@/utils/request'

// 访客分析页面
export function getUserAnalysisData (params) {
  return request({
    url: '/mall4cloud_flow/p/user_visit_analysis/get_user_analysis_data',
    method: 'get',
    params
  })
}

// 导出访问地域
export function soldExcelSystem (params) {
  return request({
    url: '/mall4cloud_flow/p/user_visit_analysis/user_analysis_data_export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
