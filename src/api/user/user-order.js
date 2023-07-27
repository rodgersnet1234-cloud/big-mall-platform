import request from '@/utils/request'

export function pageBuyLevelLog (userLevelLogDTO) {
  return request({
    url: '/mall4cloud_user/p/user_level_log/pageBuyLevelLog',
    method: 'get',
    params: userLevelLogDTO
  })
}
