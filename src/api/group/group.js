import request from '@/utils/request'

export function page (pageParam) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/platform_page',
    method: 'get',
    params: pageParam
  })
}

export function get (groupActivityId) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'get',
    params: {
      groupActivityId
    }
  })
}

export function save (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'put',
    data
  })
}

export function deleteById (groupActivityId) {
  return request({
    url: '/mall4cloud_group/mp/group_activity',
    method: 'delete',
    params: {
      groupActivityId
    }
  })
}

export function offline (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/offline',
    method: 'post',
    data
  })
}

export function getOfflineHandleEvent (id) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/get_offline_handle_event/' + id,
    method: 'get'
  })
}

export function apply (data) {
  return request({
    url: '/mall4cloud_group/mp/group_activity/audit',
    method: 'post',
    data
  })
}
