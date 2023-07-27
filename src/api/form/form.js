import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_flow/p/form/page',
    method: 'get',
    params: pageParam
  })
}

export function get (formId) {
  return request({
    url: '/mall4cloud_flow/p/form',
    method: 'get',
    params: {
      formId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_flow/p/form',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_flow/p/form',
    method: 'put',
    data
  })
}

export function deleteById (formId) {
  return request({
    url: '/mall4cloud_flow/p/form',
    method: 'delete',
    params: {
      formId
    }
  })
}

export function getFormItem (type) {
  return request({
    url: '/mall4cloud_flow/p/form/get_form_item',
    method: 'get',
    params: {
      type
    }
  })
}

export function formExcel (formId) {
  return request({
    url: '/mall4cloud_flow/p/form/form_excel',
    method: 'get',
    responseType: 'blob',
    params: {
      formId
    }
  })
}

export function pageRecommendForm (pageParam) {
  return request({
    url: '/mall4cloud_flow/p/form/get_recommend_form_page',
    method: 'get',
    params: pageParam
  })
}

export function listRecommendForm () {
  return request({
    url: '/mall4cloud_flow/p/form/get_recommend_form_list',
    method: 'get'
  })
}
