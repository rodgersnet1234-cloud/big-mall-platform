import request from '@/utils/request'

export function page () {
  return request({
    url: '/mall4cloud_order/mp/area/list',
    method: 'get'
  })
}

export function get (areaId) {
  return request({
    url: '/mall4cloud_order/mp/area',
    method: 'get',
    params: {
      areaId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_order/p/area',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_order/p/area',
    method: 'put',
    data
  })
}

export function deleteById (areaId) {
  return request({
    url: '/mall4cloud_order/p/area',
    method: 'delete',
    params: {
      areaId
    }
  })
}
