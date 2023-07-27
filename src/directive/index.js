import { checkPermission } from './permission'

// 全局注册 directive
export function setupDirective (app) {
  // v-permission 挂载到全局
  app.directive('permission', checkPermission)
}
