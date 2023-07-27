import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash/page',
    method: 'get',
    params: pageParam
  })
}

export function get (withdrawCashId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash',
    method: 'get',
    params: {
      withdrawCashId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash',
    method: 'put',
    data
  })
}

export function deleteById (withdrawCashId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash',
    method: 'delete',
    params: {
      withdrawCashId
    }
  })
}

// 设为已提现
export function updateToSuccess (withdrawCashId) {
  return request({
    url: '/mall4cloud_marketing/p/distribution_withdraw_cash/to_success',
    method: 'put',
    params: {
      withdrawCashId
    }
  })
}
