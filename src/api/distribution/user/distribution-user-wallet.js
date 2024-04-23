import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_wallet_bill/wallet_bill_page',
    method: 'get',
    params: pageParam
  })
}

// 获取分销钱包
export function achievementPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user/achievement_page',
    method: 'get',
    params: pageParam
  })
}

export function get (walletId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_wallet',
    method: 'get',
    params: {
      walletId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_wallet',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_wallet',
    method: 'put',
    data
  })
}

export function deleteById (walletId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_user_wallet',
    method: 'delete',
    params: {
      walletId
    }
  })
}
