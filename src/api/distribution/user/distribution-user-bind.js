import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_bind/page',
    method: 'get',
    params: pageParam
  })
}

export function get (bindId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_bind',
    method: 'get',
    params: {
      bindId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_bind',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_bind',
    method: 'put',
    data
  })
}

export function deleteById (bindId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user_bind',
    method: 'delete',
    params: {
      bindId
    }
  })
}
