import request from '@/utils/request'

export function getDetailByHour () {
  return request({
    url: '/mall4cloud_order/p/order_statistics/get_detail_by_hour',
    method: 'get'
  })
}

export function getCurrentMonthByDay () {
  return request({
    url: '/mall4cloud_order/p/order_statistics/get_order_info_by_day_count',
    method: 'get'
  })
}

export function listSpuRankingByPayActual (dayCount, limit) {
  return request({
    url: '/mall4cloud_order/p/order_statistics/list_spu_ranking_by_order_count',
    method: 'get',
    params: {
      dayCount,
      limit
    }
  })
}

export function listShopRankingByPayActual (dayCount, limit) {
  return request({
    url: '/mall4cloud_order/p/order_statistics/list_shop_ranking_by_pay_actual',
    method: 'get',
    params: {
      dayCount,
      limit
    }
  })
}

export function listShopRankingByRefundCount (dayCount, limit) {
  return request({
    url: '/mall4cloud_order/p/order_statistics/list_shop_ranking_by_refund_count',
    method: 'get',
    params: {
      dayCount,
      limit
    }
  })
}
