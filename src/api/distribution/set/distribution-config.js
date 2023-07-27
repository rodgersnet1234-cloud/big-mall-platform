import request from '@/utils/request'

// 获取分销设置
export function get () {
  return request({
    url: '/mall4cloud_admin/p/distribution_config/info',
    method: 'get'
  })
}

// 获取分销招募推广设置
export function recruitInfo () {
  return request({
    url: '/mall4cloud_admin/p/distribution_config/recruit_info',
    method: 'get'
  })
}

// 保存分销设置
export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/distribution_config',
    method: 'post',
    data
  })
}

// 保存分销招募推广设置R
export function saveRecruit (data) {
  return request({
    url: '/mall4cloud_admin/p/distribution_config/recruit',
    method: 'post',
    data
  })
}
