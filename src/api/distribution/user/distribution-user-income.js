import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_income/page',
    method: 'get',
    params: pageParam
  })
}

// 获取分销推广效果列表
export function effectPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_income/effect_page',
    method: 'get',
    params: pageParam
  })
}

export function get (incomeId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_income',
    method: 'get',
    params: {
      incomeId
    }
  })
}
