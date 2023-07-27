import request from '@/utils/request'

/**
 *
 * @param { Object} params 获取客服自动回复表列表
 * @returns
 */
export function getList (params) {
  return request({
    url: '/mall4cloud_im/p/im_msg_biz_skills/page',
    method: 'GET',
    params
  })
}
/**
 *
 * @param {*} id 删除客服自动回复表
 * @returns
 */
export function delSkills (id = null) {
  return request({
    url: '/mall4cloud_im/p/im_msg_biz_skills',
    method: 'DELETE',
    params: {
      id
    }
  })
}

export function getSkills (id = null) { // 获取客服自动回复表
  return request({
    url: '/mall4cloud_im/p/im_msg_biz_skills',
    method: 'GET',
    params: {
      id
    }
  })
}

export function putSkills (data) { // 更新客服自动回复表
  return request({
    url: '/mall4cloud_im/p/im_msg_biz_skills',
    method: 'PUT',
    data
  })
}

export function postSkills (data) { // 保存客服自动回复表
  return request({
    url: '/mall4cloud_im/p/im_msg_biz_skills',
    method: 'POST',
    data
  })
}
