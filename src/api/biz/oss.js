import request from '@/utils/request'
import axios from 'axios'

export function getBatchPreSignUrl (fileNames) {
  return request({
    url: '/mall4cloud_biz/ua/oss/get_batch_pre_sign_url',
    method: 'get',
    params: { fileNames }
  })
}

export function pageFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group/list',
    method: 'get',
    params: param
  })
}

export function getFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'get',
    params: param
  })
}

export function saveFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'post',
    data
  })
}

export function updateFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'put',
    data
  })
}

export function deleteFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/mp/attach_file_group',
    method: 'delete',
    params: param
  })
}

/**
 * minIo上传文件
 * @param url 请求的url
 * @param data 图片文件
 */
export function awsImgUpdate (url, data) {
  return axios.put(url, data)
}

// aliOss上传文件
/**
 * aliOss上传文件
 * @param url 请求的url
 * @param data 图片文件+请求的参数
 */
export function aliImgUpdate (url, data) {
  return request({
    headers: {
      'Content-Type': data.type
    },
    url,
    method: 'post',
    data
  })
}

// /**
//  * 腾讯云上传文件
//  * @param url 请求的url
//  * @param data 图片文件
//  */
// export function qcloudImgUpdate(url, data) {
//   console.log('腾讯云上传文件请求接口url：', url)
//   console.log('腾讯云上传文件请求接口data：', data)
//   return request({
//     headers: {
//       'Content-Type': data.type
//     },
//     url: url,
//     method: 'put',
//     data
//   })
// }
