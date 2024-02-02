import request from '@/utils/request'

export function shopUserInfo () {
  return request({
    url: '/mall4cloud_admin/p/platform_user/info',
    method: 'get'
  })
}

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/platform_user/page',
    method: 'get',
    params: pageParam
  })
}

export function get (platformUserId) {
  return request({
    url: '/mall4cloud_admin/p/platform_user',
    method: 'get',
    params: {
      platformUserId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/platform_user',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/p/platform_user',
    method: 'put',
    data
  })
}

export function deleteById (platformUserId) {
  return request({
    url: '/mall4cloud_admin/p/platform_user',
    method: 'delete',
    params: {
      platformUserId
    }
  })
}
