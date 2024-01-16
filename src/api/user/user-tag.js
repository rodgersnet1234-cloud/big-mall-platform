import request from '@/utils/request'

// 分页获取标签
export function getTagPage (pageParam) {
  return request({
    url: '/mall4cloud_user/p/user_tag/tag_page',
    method: 'get',
    params: pageParam
  })
}
// 获取标签列表
export function getTagList () {
  return request({
    url: '/mall4cloud_user/p/user_tag/tag_list',
    method: 'get'
  })
}

// 删除
export function deleteById (userTagId) {
  return request({
    url: '/mall4cloud_user/p/user_tag',
    method: 'delete',
    params: {
      userTagId
    }
  })
}

// 刷新标签
export function refreshTag (userTagId) {
  return request({
    url: '/mall4cloud_user/p/user_tag/refresh',
    method: 'get',
    params: {
      userTagId
    }
  })
}

// 批量刷新标签
export function batchRefreshTag (tagIds) {
  return request({
    url: '/mall4cloud_user/p/user_tag/batch_refresh',
    method: 'get',
    params: {
      tagIds
    }
  })
}

// 保存
export function save (data) {
  return request({
    url: '/mall4cloud_user/p/user_tag',
    method: 'post',
    data
  })
}

// 修改
export function update (data) {
  return request({
    url: '/mall4cloud_user/p/user_tag',
    method: 'put',
    data
  })
}

// 详情
export function get (userTagId) {
  return request({
    url: '/mall4cloud_user/p/user_tag',
    method: 'get',
    params: {
      userTagId
    }
  })
}
