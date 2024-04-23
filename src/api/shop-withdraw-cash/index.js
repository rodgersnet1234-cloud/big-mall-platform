import request from '@/utils/request'

// 获取商家提现列表
export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_withdraw_cash/page',
    method: 'get',
    params: pageParam
  })
}

// 获取商家提现列表
export function shopBillingpage (pageParam) {
  return request({
    url: '/mall4cloud_admin/mp/shop_withdraw_cash/page',
    method: 'get',
    params: pageParam
  })
}

// 根据id 查看详情
export function detail (id) {
  return request({
    url: '/mall4cloud_admin/p/shop_withdraw_cash/info',
    method: 'get',
    params: { cashId: id }
  })
}

// 提交审核
export function submit (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_withdraw_cash/audit',
    method: 'put',
    data
  })
}

// 保存配置
export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_withdraw_cash/save',
    method: 'post',
    data
  })
}

export function getConfig () {
  return request({
    url: '/mall4cloud_admin/p/shop_withdraw_cash/getWithdrawCash',
    method: 'get'
  })
}
