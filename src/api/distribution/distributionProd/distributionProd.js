import request from '@/utils/request'
// 分销商品列表接口
export function distributionPage (pageParam) {
  return request({
    url: '/mall4cloud_search/mp/search/page_distribution_spu',
    method: 'get',
    params: pageParam
  })
}
// 分销记录列表接口
export function distributionRecordsPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/distribution_user_income/page_sales_record',
    method: 'get',
    params: pageParam
  })
}
// 获取分销商品
export function get (distributionSpuId) {
  return request({
    url: `/mall4cloud_marketing/p/distribution_spu/?distributionSpuId=${distributionSpuId}`,
    method: 'get'
  })
}
// 删除分销商品
export function deleteById (distributionSpuId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_spu',
    method: 'delete',
    params: {
      distributionSpuId
    }
  })
}
// 获取最新下线活动详情
export function getOfflineHandleEvent (distributionSpuId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_spu/get_offline_handle_event',
    method: 'GET',
    params: {
      distributionSpuId
    }
  })
}
// 下线
export function offline (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_spu/offline',
    method: 'POST',
    data
  })
}
// 上线审核
export function audit (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_spu/audit',
    method: 'POST',
    data
  })
}
