import request from '@/utils/request'

export function get () { // 获取客服自动回复表
  return request({
    url: '/mall4cloud_biz/mp/im_auto_reply',
    method: 'GET'
  })
}

export function update (data) { // 更新客服自动回复表
  return request({
    url: '/mall4cloud_biz/mp/im_auto_reply',
    method: 'PUT',
    data
  })
}

export function save (data) { // 保存客服自动回复表
  return request({
    url: '/mall4cloud_biz/mp/im_auto_reply',
    method: 'POST',
    data
  })
}
