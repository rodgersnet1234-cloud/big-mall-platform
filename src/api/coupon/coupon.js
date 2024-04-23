import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/admin_page',
    method: 'get',
    params: pageParam
  })
}

export function couponPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/page',
    method: 'get',
    params: pageParam
  })
}

export function get (couponId) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'get',
    params: {
      couponId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'put',
    data
  })
}

export function deleteById (couponId) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon',
    method: 'delete',
    params: {
      couponId
    }
  })
}

// 获取平台券
export function pagePlatformCoupons (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/page_platform_coupons',
    method: 'get',
    params: pageParam
  })
}

// 平台批量给用户赠送平台券
export function sendUserCoupon (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/send_user_coupon',
    method: 'put',
    data
  })
}

// 下线活动
export function offline (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/offline',
    method: 'POST',
    data
  })
}

// 获取下线活动最新详情
export function getOfflineHandleEvent (couponId) {
  return request({
    url: `/mall4cloud_marketing/mp/coupon/get_offline_handle_event/${couponId}`,
    method: 'GET'
  })
}

// 审核申请
export function audit (data) {
  return request({
    url: '/mall4cloud_marketing/mp/coupon/audit',
    method: 'POST',
    data
  })
}

// 获取用户的优惠券明细
export function platformCouponUserPage (pageParam) {
  return request({
    url: '/mall4cloud_marketing/p/coupon/page_coupon_user',
    method: 'get',
    params: pageParam
  })
}
