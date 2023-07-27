import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/page',
    method: 'get',
    params: pageParam
  })
}

// 获取分销业绩统计列表
export function achievementPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/achievement_page',
    method: 'get',
    params: pageParam
  })
}
