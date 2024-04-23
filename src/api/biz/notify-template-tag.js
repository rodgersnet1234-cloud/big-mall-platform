import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag/page',
    method: 'get',
    params: pageParam
  })
}

export function get (templateId) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag/info',
    method: 'get',
    params: {
      templateId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag',
    method: 'put',
    data
  })
}

export function deleteById (templateId) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag',
    method: 'delete',
    params: {
      templateId
    }
  })
}

export function sendMsg (templateId) {
  return request({
    url: '/mall4cloud_biz/p/notify_template_tag/send_msg',
    method: 'put',
    params: {
      templateId
    }
  })
}
