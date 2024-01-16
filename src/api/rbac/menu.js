import request from '@/utils/request'

export function menuList (searchParam) {
  return request({
    url: '/mall4cloud_auth/mp/menu/route',
    method: 'get',
    params: searchParam
  })
}

export function listWithPermissions (params) {
  return request({
    url: '/mall4cloud_auth/mp/menu/list_with_permissions',
    method: 'get',
    params
  })
}

export function listMenuIds () {
  return request({
    url: '/mall4cloud_auth/mp/menu/list_menu_ids',
    method: 'get'
  })
}
