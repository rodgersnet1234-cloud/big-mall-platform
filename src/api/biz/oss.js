import request from '@/utils/request'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export function getBatchPreSignUrl (fileNames) {
  // 当前选择的图片名称太长时无法上传，提示修改名称或分批上传
  if (encodeURIComponent(fileNames).length > 4096) {
    const msg = '已选的文件名称太长，请修改名称或分批上传'
    ElMessage.error(msg)
    return Promise.reject(new Error(msg))
  } else {
    return request({
      url: '/mall4cloud_biz/ua/oss/get_batch_pre_sign_url',
      method: 'get',
      params: { fileNames }
    })
  }
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
 * @param {String}url 请求的url
 * @param {File} data 图片文件
 * @param {UploadRequestOptions} options
 * @returns {*}
 */
export function awsImgUpdate (url, data, options) {
  return axios.put(url, data, {
    onUploadProgress: (progressEvent) => {
      // <el-upload/> 配置上传文件进度
      if (options) {
        const complete = (((progressEvent.loaded / progressEvent.total) * 100) | 0)
        options.onProgress({ percent: complete })
      }
    }
  })
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
