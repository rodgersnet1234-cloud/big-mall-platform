import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_bind/page',
    method: 'get',
    params: pageParam
  })
}
