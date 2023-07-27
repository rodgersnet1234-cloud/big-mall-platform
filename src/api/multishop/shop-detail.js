import request from '@/utils/request'

export function countByShopStatus (shopStatus) {
  return request({
    url: '/mall4cloud_admin/p/shop_statistics/count_by_shop_status',
    method: 'GET',
    params: {
      shopStatus
    }
  })
}

export function listShopRankIngByFlow (dayCount, limit) {
  return request({
    url: '/mall4cloud_flow/p/product_analyse/list_shop_ranking_by_flow',
    method: 'GET',
    params: {
      dayCount,
      limit
    }
  })
}
