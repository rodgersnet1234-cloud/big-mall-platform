import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_biz/p/notify_log/page',
    method: 'get',
    params: pageParam
  })
}
