import request from '@/utils/request'

export function pageBuyLevelLog (userLevelLogDTO) {
  return request({
    url: '/mall4cloud_user/p/user_level_log/page_buy_level_log',
    method: 'get',
    params: userLevelLogDTO
  })
}
