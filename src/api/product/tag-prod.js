import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/p/search/tag_page',
    method: 'get',
    params: pageParam
  })
}
export function pageSpuByTagId (pageParam) {
  return request({
    url: '/mall4cloud_product/p/spu_tag_reference/page_spu_by_tag',
    method: 'get',
    params: pageParam
  })
}

export function getNotTagProdPage (pageParam) {
  return request({
    url: '/mall4cloud_product/p/spu_tag/get_not_tag_prod_page',
    method: 'get',
    params: pageParam
  })
}

export function get (id) {
  return request({
    url: '/mall4cloud_product/p/spu_tag_reference/info/' + id,
    method: 'get',
    params: {
    }
  })
}

// 删除
export function deleteByIds (data) {
  return request({
    url: '/mall4cloud_product/p/spu_tag_reference/delete_prod',
    method: 'delete',
    data
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/p/spu_tag_reference/add_prod_for_tag',
    method: 'post',
    data
  })
}

export function updateProdSeq (data) {
  return request({
    url: '/mall4cloud_product/p/spu_tag_reference/update_prod_seq',
    method: 'put',
    data
  })
}
