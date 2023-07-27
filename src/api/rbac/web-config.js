import request from '@/utils/request'

export function page (pageParam, configType) {
  return request({
    url: '/mall4cloud_admin/p/web_config/page',
    method: 'get',
    params: Object.assign(pageParam, { configType })
  })
}

export function getByConfigType (configType) {
  return request({
    url: '/mall4cloud_admin/p/web_config/getByConfigType',
    method: 'get',
    params: Object.assign({ configType })
  })
}

export function get (id) {
  return request({
    url: '/mall4cloud_admin/p/web_config',
    method: 'get',
    params: {
      id
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'POST',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'PUT',
    data
  })
}

export function deleteById (id) {
  return request({
    url: '/mall4cloud_admin/p/web_config/operate',
    method: 'DELETE',
    params: { id }
  })
}

// 当前激活的配置
export function getActivity (webConfigType) {
  return request({
    url: '/mall4cloud_admin/ua/web_config/get_activity',
    method: 'GET',
    params: {
      webConfigType
    }
  })
}
