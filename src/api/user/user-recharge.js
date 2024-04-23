import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_user/p/user_recharge/page',
    method: 'get',
    params: pageParam
  })
}

export function info (rechargeId) {
  return request({
    url: '/mall4cloud_user/p/user_recharge/info',
    method: 'get',
    params: {
      rechargeId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_user/p/user_recharge',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_user/p/user_recharge',
    method: 'put',
    data
  })
}

export function remove (rechargeId) {
  return request({
    url: '/mall4cloud_user/p/user_recharge',
    method: 'delete',
    params: {
      rechargeId
    }
  })
}

export function list () {
  return request({
    url: '/mall4cloud_user/p/user_recharge/list',
    method: 'get'
  })
}

export function updateBalance (data) {
  return request({
    url: '/mall4cloud_user/p/user_recharge/update_user_balance',
    method: 'put',
    data
  })
}

export function pageRechargeUserLog (pageParam) {
  return request({
    url: '/mall4cloud_user/p/user_recharge/page_user_log',
    method: 'get',
    params: pageParam
  })
}
