import request from '@/utils/request'
import excelRequest from '@/utils/excelRequest'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_search/p/search/page',
    method: 'get',
    params: pageParam
  })
}

export function scorePage (pageParam) {
  return request({
    url: '/mall4cloud_search/p/search/score_page',
    method: 'get',
    params: pageParam
  })
}

export function get (spuId) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'get',
    params: {
      spuId
    }
  })
}

// 删除
export function deleteById (spuId) {
  return request({
    url: '/mall4cloud_product/mp/spu',
    method: 'delete',
    params: {
      spuId
    }
  })
}

// 商品上下架
export function updateProdStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/prod_status',
    method: 'put',
    data
  })
}
// 修改spu（名称、价格、库存、序号）信息
export function updatePartProdStatus (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/update_spu_data',
    method: 'put',
    data
  })
}

// 下线活动
export function offline (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/offline',
    method: 'POST',
    data
  })
}
// 下线活动
export function batchOffline (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/batch_offline',
    method: 'POST',
    data
  })
}

// 获取下线活动最新详情
export function getOfflineHandleEvent (spuId) {
  return request({
    url: `/mall4cloud_product/mp/spu/get_offline_handle_event/${spuId}`,
    method: 'GET'
  })
}

// 审核
export function apply (data) {
  return request({
    url: '/mall4cloud_product/mp/spu/audit',
    method: 'POST',
    data
  })
}

// 更新es中的商品数据
export function updateEsSpu () {
  return request({
    url: '/mall4cloud_product/mp/spu/update_es_spu',
    method: 'PUT'
  })
}

// 注水销量
export function updateWaterSoldNum (pageParam) {
  return request({
    url: '/mall4cloud_product/p/spuExtension/water_sold_num',
    method: 'PUT',
    params: pageParam
  })
}

// 商品置顶

export function clickIsTop (spuId) {
  return request({
    url: `/mall4cloud_product/p/spu/to_top?spuId=${spuId}`,
    method: 'PUT'
  })
}

// 下载商品excel
export function soldExcel (pageParam) {
  return excelRequest({
    url: '/mall4cloud_product/mp/spu/sold_excel',
    method: 'GET',
    params: pageParam
  })
}

export function soldPlatformExcel (pageParam) {
  return excelRequest({
    url: '/mall4cloud_product/p/spu/sold_excel',
    method: 'POST',
    data: pageParam
  })
}

// 下载商品excel模板
export function downModel () {
  return excelRequest({
    url: '/mall4cloud_product/mp/spu/down_model',
    method: 'GET'
  })
}

// 商品审核
export function auditSpu (data) {
  return request({
    url: '/mall4cloud_product/p/spu/auditSpu',
    method: 'put',
    data
  })
}
