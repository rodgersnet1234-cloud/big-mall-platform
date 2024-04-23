import request from '@/utils/request'

export function batchUpdateUserTag (data) {
  return request({
    url: '/mall4cloud_user/p/user_tag_user/update_user_Tag',
    method: 'put',
    data
  })
}

export function deleteUserTag (data) {
  return request({
    url: '/mall4cloud_user/p/user_tag_user/delete_user_tag',
    method: 'delete',
    data
  })
}
