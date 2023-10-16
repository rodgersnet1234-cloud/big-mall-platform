import request from '@/utils/request'

// 获取平台所有的分类信息
export function categoryPage () {
  return request({
    url: '/mall4cloud_product/p/category_platform/info',
    method: 'get',
    params: {}
  })
}

// 导出SaaS分类
export function soldExcel (pageParam) {
  return request({
    url: '/mall4cloud_product/p/category/sold_excel',
    method: 'get',
    params: { ...pageParam },
    responseType: 'blob'
  })
}

// 获取店铺所有的分类信息
export function shopCategoryPage () {
  return request({
    url: '/mall4cloud_product/mp/category/shop_categories',
    method: 'get',
    params: {}
  })
}

// 获取平台/店铺启用的分类信息
export function enableCategories () {
  return request({
    url: '/mall4cloud_product/mp/category/enable_categories',
    method: 'get',
    params: {}
  })
}

// 获取店铺中的销售属性
export function getShopAttrs () {
  return request({
    url: '/mall4cloud_product/mp/attr/get_shop_attrs',
    method: 'get',
    params: {}
  })
}

export function get (categoryPlatformId) {
  return request({
    url: '/mall4cloud_product/p/category_platform',
    method: 'get',
    params: {
      categoryPlatformId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_product/p/category_platform',
    method: 'put',
    data
  })
}

export function deleteById (categoryId) {
  return request({
    url: '/mall4cloud_product/mp/category',
    method: 'delete',
    params: {
      categoryId
    }
  })
}

export function enableOrDisable (data) {
  return request({
    url: '/mall4cloud_product/mp/category/category_enable_or_disable',
    method: 'put',
    data
  })
}
