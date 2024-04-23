import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_user/p/user_rights/page',
    method: 'get',
    params: pageParam
  })
}

export function get (rightsId) {
  return request({
    url: '/mall4cloud_user/p/user_rights',
    method: 'get',
    params: {
      rightsId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_user/p/user_rights',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_user/p/user_rights',
    method: 'put',
    data
  })
}

export function remove (rightsId) {
  return request({
    url: '/mall4cloud_user/p/user_rights',
    method: 'delete',
    params: {
      rightsId
    }
  })
}

export function list () {
  return request({
    url: '/mall4cloud_user/p/user_rights/list',
    method: 'get'
  })
}
