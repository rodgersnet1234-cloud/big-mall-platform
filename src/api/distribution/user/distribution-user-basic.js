import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/page',
    method: 'get',
    params: pageParam
  })
}

export function get (distributionUserId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user',
    method: 'get',
    params: {
      distributionUserId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user',
    method: 'put',
    data
  })
}

export function updateState (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/update_state',
    method: 'put',
    data
  })
}

export function deleteById (distributionUserId) {
  return request({
    url: '/mall4cloud_marketing/m/distribution_user',
    method: 'delete',
    params: {
      distributionUserId
    }
  })
}

export function getBanInfoByDistributionUserId (distributionUserId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/ban_info',
    method: 'get',
    params: {
      distributionUserId
    }
  })
}
