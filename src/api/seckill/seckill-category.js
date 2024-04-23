import request from '@/utils/request'

export function list () {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category/list',
    method: 'get',
    params: {}
  })
}

export function get (categoryId) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category',
    method: 'get',
    params: {
      categoryId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category',
    method: 'put',
    data
  })
}

export function deleteById (categoryId) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category',
    method: 'delete',
    params: {
      categoryId
    }
  })
}

export function updateSeq (data) {
  return request({
    url: '/mall4cloud_seckill/mp/seckill_category/update_batch_seq',
    method: 'put',
    data
  })
}
