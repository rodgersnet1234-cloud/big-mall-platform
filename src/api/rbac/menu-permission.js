import request from '@/utils/request'
export function menuPermissionsList () {
  return request({
    url: '/mall4cloud_auth/mp/menu_permission/list',
    method: 'get'
  })
}
