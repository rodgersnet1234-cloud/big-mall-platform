import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_auditing/page',
    method: 'get',
    params: pageParam
  })
}

export function get (auditingId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_auditing',
    method: 'get',
    params: {
      auditingId
    }
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_auditing',
    method: 'put',
    data
  })
}
