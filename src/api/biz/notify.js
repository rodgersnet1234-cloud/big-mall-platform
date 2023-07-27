import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_biz/p/notify_template/page',
    method: 'get',
    params: pageParam
  })
}

export function get (templateId) {
  return request({
    url: '/mall4cloud_biz/p/notify_template',
    method: 'get',
    params: {
      templateId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_biz/p/notify_template',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_biz/p/notify_template',
    method: 'put',
    data
  })
}

export function deleteById (templateId) {
  return request({
    url: '/mall4cloud_biz/p/notify_template',
    method: 'delete',
    params: {
      templateId
    }
  })
}
