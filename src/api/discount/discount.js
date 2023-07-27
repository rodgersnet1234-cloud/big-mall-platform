import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/platform_page',
    method: 'get',
    params: pageParam
  })
}

export function get (discountId) {
  return request({
    url: `/mall4cloud_marketing/mp/discount/info/${discountId}`,
    method: 'get',
    params: {
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount',
    method: 'put',
    data
  })
}

export function deleteById (discountId) {
  return request({
    url: `/mall4cloud_marketing/mp/discount/${discountId}`,
    method: 'delete',
    params: {
    }
  })
}

export function offline (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/offline',
    method: 'post',
    data
  })
}

export function getOfflineHandleEvent (id) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/get_offline_handle_event/' + id,
    method: 'get'
  })
}

export function audit (data) {
  return request({
    url: '/mall4cloud_marketing/mp/discount/audit',
    method: 'post',
    data
  })
}
