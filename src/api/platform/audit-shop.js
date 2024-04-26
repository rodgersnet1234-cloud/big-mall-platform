import request from '@/utils/request'

// 重新上线审核
export function onlineAudit (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/online_audit',
    method: 'POST',
    data
  })
}

// 审核列表
export function page (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/shop_auditing/page',
    method: 'GET',
    params: pageParam
  })
}

// 管理列表
export function managePage (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/page',
    method: 'GET',
    params: pageParam
  })
}

// 审核信息(审核商家)
export function auditData (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_auditing/audit',
    method: 'PUT',
    data
  })
}

// 校验店铺名
export function examineShopName (param) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/check_shop_name',
    method: 'GET',
    params: param
  })
}

// 创建店铺
export function create (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/create_shop',
    method: 'POST',
    data
  })
}

// 管理-店铺详情
export function getManageDetail (param) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/info',
    method: 'GET',
    params: param
  })
}

// 保存账号密码
export function savaAccountAndPassword (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/save_username_and_password',
    method: 'POST',
    data
  })
}

// 设为优选店铺/取消优选店铺
export function updateShopPreferred (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/update_shop_preferred',
    method: 'PUT',
    params: pageParam
  })
}

// 店铺工商信息
export function queryBusinessInfo (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/shop_company',
    method: 'GET',
    params: pageParam
  })
}

// 店铺财务信息
export function queryFinancialInfo (pageParam) {
  return request({
    url: '/mall4cloud_admin/p/shop_bank_card/list_by_shop_id',
    method: 'GET',
    params: pageParam
  })
}

// 根据店铺id获取分类签约信息
export function queryCategoryContract (pageParam) {
  return request({
    url: '/mall4cloud_product/p/category/signing_info_by_shopId',
    method: 'GET',
    params: pageParam
  })
}

// 根据店铺id获取品牌签约信息
export function queryBrandSigning (pageParam) {
  return request({
    url: '/mall4cloud_product/p/brand/signing_info_by_shop_id',
    method: 'GET',
    params: pageParam
  })
}
// 更新签约分类
export function signCategory (data) {
  return request({
    url: '/mall4cloud_product/p/category/signing',
    method: 'PUT',
    data
  })
}

// 更新签约品牌
export function signBrand (data, shopId) {
  return request({
    url: '/mall4cloud_product/p/brand/signing',
    method: 'PUT',
    data,
    params: {
      shopId,
      sysType: 1
    }
  })
}

// 获取平台全部品牌
export function getPlatformBrand (params) {
  return request({
    url: '/mall4cloud_product/mp/brand/list_by_params',
    method: 'get',
    params
  })
}

// 请求地址
export function getAreaListInfo () {
  return request({
    url: '/mall4cloud_order/mp/area/area_list_info',
    method: 'get'
  })
}

// 店铺审核状态
export function getShopAuditStatus (shopId) {
  return request({
    url: `/mall4cloud_admin/p/shop_auditing/${shopId}`,
    method: 'GET'
  })
}

// 分页获取待审核的工商信息
export function getShopCompanyAuditingPage (param) {
  return request({
    url: '/mall4cloud_admin/p/shop_company_auditing/page',
    method: 'GET',
    params: param
  })
}

// 查看申请审核信息
export function getShopCompanyAuditingAuditInfo (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company_auditing/auditInfo',
    method: 'GET',
    params: param
  })
}

// 审核签约信息
export function updateShopCompanyAuditingAudit (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_company_auditing/audit',
    method: 'PUT',
    data
  })
}

// 分页获取待审核的工商信息（供应商）
export function getSupplierCompanyAuditingPage (param) {
  return request({
    url: '/mall4cloud_admin/p/supplier_company_auditing/page',
    method: 'GET',
    params: param
  })
}

// 查看申请审核信息（供应商）
export function getSupplierCompanyAuditingAuditInfo (param) {
  return request({
    url: '/mall4cloud_admin/p/supplier_company_auditing/auditInfo',
    method: 'GET',
    params: param
  })
}

// 审核签约信息（供应商）
export function updateSupplierCompanyAuditingAudit (data) {
  return request({
    url: '/mall4cloud_admin/p/supplier_company_auditing/audit',
    method: 'PUT',
    data
  })
}

// 编辑店铺基本信息
export function updateBasicInfo (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail',
    method: 'PUT',
    data
  })
}

// 更新工商信息
export function updateCompanyInfo (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_company',
    method: 'PUT',
    data
  })
}

// 更新店铺签约信息
export function updateSigningInfo (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/update_signing_info',
    method: 'PUT',
    data
  })
}

// 更新店铺登录密码
export function updateLoginPassword (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/update_password',
    method: 'PUT',
    data
  })
}

// 下线店铺
export function closeStore (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/offline',
    method: 'PUT',
    data
  })
}

// 获取最新下线店铺的事件
export function getEventsOfOfflineStores (shopId) {
  return request({
    url: `/mall4cloud_admin/p/offline_handle_event/getOfflineHandleEventByShopId/${shopId}/1`,
    method: 'GET'
  })
}

// 商家注册（获取验证码）
export function getRegisterCode (data) {
  return request({
    url: '/mall4cloud_biz/ua/sms/verification_code/apply_shop',
    method: 'PUT',
    data
  })
}

// 检查店铺名称是否已存在
export function checkForDuplicateShopName (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_detail/check_shop_name',
    method: 'GET',
    params: param
  })
}

// 检查统一信用码是否已存在
export function checkForDuplicateCreditCode (param) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/check_credit_code',
    method: 'GET',
    params: param
  })
}

// 获取银行列表
export function getBankList () {
  return request({
    url: '/mall4cloud_admin/ua/public_bank/list',
    method: 'GET'
  })
}

// 直接上线店铺 通联支付
export function onlineStore (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_detail/online_open_shop',
    method: 'POST',
    data
  })
}

// 审核失败的店铺重新提交审核 通联支付
export function reSubmitAudit (data) {
  return request({
    url: '/mall4cloud_admin/p/shop_bank_card/allinpay_save_and_apply_shop',
    method: 'POST',
    data
  })
}

// 更新影印件（通联支付）
export function updateIdCardStatus (params) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/update_id_card_status',
    method: 'PUT',
    params
  })
}

// 重新上传影印件 (通联支付)
export function reUploadIdCard (data) {
  return request({
    url: '/mall4cloud_admin/mp/shop_company/upload_id_card',
    method: 'PUT',
    data
  })
}
// 获取平台邀请的入驻url
export function getLink () {
  return request({
    url: '/mall4cloud_admin/p/platform_detail/get_url',
    method: 'GET'
  })
}
// 获取平台邀请的入驻url
export function updateDomain (data) {
  return request({
    url: 'mall4cloud_admin/p/platform_detail/update_platform_url',
    method: 'PUT',
    data
  })
}
