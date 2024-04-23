import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_product/p/spu_tag/page',
    method: 'get',
    params: pageParam
  })
}

export function get (id) {
  return request({
    url: '/mall4cloud_product/p/spu_tag/info/' + id,
    method: 'get',
    params: {
    }
  })
}

// 删除
export function deleteById (id) {
  return request({
    url: '/mall4cloud_product/p/spu_tag',
    method: 'delete',
    params: {
      id
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/p/spu_tag',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/p/spu_tag',
    method: 'put',
    data
  })
}
