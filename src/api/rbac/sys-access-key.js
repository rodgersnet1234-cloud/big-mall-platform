import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key/page',
    method: 'get',
    params: pageParam
  })
}

export function get (sysAccessKeyId) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key',
    method: 'get',
    params: {
      sysAccessKeyId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key',
    method: 'put',
    data
  })
}

export function deleteById (sysAccessKeyId) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key',
    method: 'delete',
    params: {
      sysAccessKeyId
    }
  })
}

export function reset (sysAccessKeyId) {
  return request({
    url: '/mall4cloud_admin/p/sys_access_key/reset_access_key',
    method: 'put',
    params: {
      sysAccessKeyId
    }
  })
}
