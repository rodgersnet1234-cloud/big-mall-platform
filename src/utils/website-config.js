// 网站配置默认信息
const configDefInfo = {
  // 登录logo
  loginBgImg: new URL('@/assets/website-config/login-bg.jpg', import.meta.url).href,
  // 版权声明-中文
  copyrightCn: 'Copyright © 2018-2022 广州市蓝海创新科技有限公司 版权所有 | 粤ICP备18115813号-1',
  // 版权声明-英文
  copyrightEn: 'Copyright © 2018-2022 广州市蓝海创新科技有限公司 版权所有 | 粤ICP备18115813号-1',
  // 标题文本-中文
  titleContentCn: '白洞版-平台端',
  // 标题文本-英文
  titleContentEn: '白洞版-平台端',
  // 网站标题图标
  titleImg: new URL('@/assets/website-config/title-icon.png', import.meta.url).href,
  // 菜单栏顶部图标
  bsTopBarIcon: new URL('@/assets/website-config/menu-top-icon.png', import.meta.url).href,
  // 菜单展开文本-中文
  bsMenuTitleOpenCn: '白洞版-平台端',
  // 菜单展开文本-英文
  bsMenuTitleOpenEn: '白洞版-平台端',
  // 菜单收缩文本-中文
  bsMenuTitleCloseCn: '平台端',
  // 菜单收缩文本-英文
  bsMenuTitleCloseEn: '平台端'
}

// 格式化配置信息
const formatConfigInfo = function (config) {
  const data = {}
  config = JSON.parse(JSON.stringify(config))
  // 为空使用默认配置
  data.loginBgImg = config.loginBgImg || configDefInfo.loginBgImg
  data.copyrightCn = config.copyrightCn || configDefInfo.copyrightCn
  data.copyrightEn = config.copyrightEn || configDefInfo.copyrightEn
  data.titleContentCn = config.titleContentCn || configDefInfo.titleContentCn
  data.titleContentEn = config.titleContentEn || configDefInfo.titleContentEn
  data.titleImg = config.titleImg || configDefInfo.titleImg
  data.bsTopBarIcon = config.bsTopBarIcon || configDefInfo.bsTopBarIcon
  data.bsMenuTitleOpenCn = config.bsMenuTitleOpenCn || configDefInfo.bsMenuTitleOpenCn
  data.bsMenuTitleOpenEn = config.bsMenuTitleOpenEn || configDefInfo.bsMenuTitleOpenEn
  data.bsMenuTitleCloseCn = config.bsMenuTitleCloseCn || configDefInfo.bsMenuTitleCloseCn
  data.bsMenuTitleCloseEn = config.bsMenuTitleCloseEn || configDefInfo.bsMenuTitleCloseEn
  return Object.assign(config, data)
}

export { configDefInfo, formatConfigInfo }
