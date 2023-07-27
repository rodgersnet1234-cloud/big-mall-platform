import request from '@/utils/request'

export function list (userLevelType) {
  return request({
    url: '/mall4cloud_user/p/user_level/list',
    method: 'get',
    params: {
      levelType: userLevelType
    }
  })
}

export function get (userLevelId) {
  return request({
    url: '/mall4cloud_user/p/user_level',
    method: 'get',
    params: {
      userLevelId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_user/p/user_level/',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_user/p/user_level/',
    method: 'put',
    data
  })
}

export function updateUserLevel () {
  return request({
    url: '/mall4cloud_user/p/user_level/update_user_level',
    method: 'put'
  })
}

export function updateRecruitStatus (data) {
  return request({
    url: '/mall4cloud_user/p/user_level/recruit_status',
    method: 'put',
    data
  })
}

export function remove (userLevelId) {
  return request({
    url: '/mall4cloud_user/p/user_level/',
    method: 'delete',
    params: {
      userLevelId
    }
  })
}
