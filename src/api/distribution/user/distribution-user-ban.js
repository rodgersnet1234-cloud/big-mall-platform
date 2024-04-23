import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_ban/page',
    method: 'get',
    params: pageParam
  })
}

export function get (banId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_ban',
    method: 'get',
    params: {
      banId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_ban',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_ban',
    method: 'put',
    data
  })
}

export function deleteById (banId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_ban',
    method: 'delete',
    params: {
      banId
    }
  })
}
