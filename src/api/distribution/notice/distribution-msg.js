import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_msg/page',
    method: 'get',
    params: pageParam
  })
}

export function get (msgId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_msg',
    method: 'get',
    params: {
      msgId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_msg',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_msg',
    method: 'put',
    data
  })
}

export function deleteById (msgIds) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_msg',
    method: 'delete',
    data: msgIds
  })
}
