<template>
  <el-dialog
    v-model="visible"
    :title="$t('user.userManager.userImport')"
    :close-on-click-modal="false"
    width="38%"
  >
    <p
      v-for="note in (isEn() ? notesEn : notes)"
      :key="note"
    >
      {{ note }}
    </p>
    <el-button
      style="margin-left: 10px;"
      type="primary"
      link
      @click="onDownloadModel"
    >
      {{ $t('user.userManager.downloadTemplate') }}
    </el-button>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      :action="baseURL + '/mall4cloud_user/p/user/import_excel'"
      :headers="{Authorization: Token}"
      :limit="1"
      name="excelFile"
      :on-preview="onHandlePreview"
      :on-error="onUploadFalse"
      :on-success="onUploadSuccess"
      :file-list="files"
      :auto-upload="false"
      :before-upload="onUploadBeforeAvatar"
    >
      <template #trigger>
        <el-button
          type="success"
        >
          {{ $t('user.userManager.selectFile') }}
        </el-button>
      </template>
      <el-button
        style="margin-left: 10px;"
        type="primary"
        @click="onSubmitUpload"
      >
        {{ $t('user.userManager.confirmUpload') }}
      </el-button>
    </el-upload>
  </el-dialog>
</template>
<script setup>
import { getLanguage } from '@/lang/index.js'
import { getToken } from '@/utils/auth.js'
import * as api from '@/api/user/user-manager.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const baseURL = import.meta.env.VITE_APP_BASE_API
const files = ref([])
const Token = ref(null)
const notes = [
  '注意：',
  '   1、请勿修改表格中的字段顺序，或随意增加、删除表格字段,上传模板大小不能超过 10MB,超过应该分批导入',
  '   2、会员等级根据配置成长值等级自动设置',
  '   3、导入用户期间，请勿修改会员等级设置',
  '   4、如果导入的用户存在付费会员，必须先设置好付费会员的等级设置',
  '   5、根据手机号(必须是11位)作为唯一标识，如果导入的手机号已存在，不会更新用户的任何数据.',
  '   6、国家/地区不同，手机号的验证规则也不同，导入时不会验证手机号码的真实性，请谨慎填写，导入错误数据请自行负责.',
  '   7、如果是付费会员必须填写vip结束时间和会员等级.'
]
const notesEn = [
  ' Note: ',
  ' 1, Please do not modify the order of the fields in the form, or arbitrarily add or delete form fields, upload the template size can not exceed 10MB, more than should be imported in batches ',
  ' 2、The Member level is set automatically according to the configured growth value level ',
  ` 3、Do not modify the membership level settings during user ${'import'}`,
  ' 4、If the imported users have paid membership, you must first set the level of paid membership settings',
  ' 5、According to the cell phone number/Username as a unique identification, if the imported cell phone number/Username already exists, will not update any data of the user.',
  ' 6、The verification rules for cell phone numbers are different for different countries/regions, and the authenticity of cell phone numbers will not be verified when importing, so please fill in the form carefully and be responsible for importing wrong data.',
  ' 7、If it is a paid member must fill in the vip end time and membership level'
]

const onUploadSuccess = (response) => {
  const code = response.code
  const msg = response.msg
  if (code === '00000') {
    alert(response.data)
  } else {
    alert(isEn() ? 'File import failed.' + msg : '文件导入失败' + msg)
  }
  emit('refreshDataList')
  files.value = []
  visible.value = false
}
const onUploadFalse = () => {
  alert(isEn() ? 'File upload failed!' : '文件上传失败！')
}

const onInit = () => {
  visible.value = true
  Token.value = getToken()
}
let upload = false
// 上传前对文件的大小的判断
const onUploadBeforeAvatar = (file) => {
  upload = true
  const extension = file.name.split('.')[1] === 'xls'
  const extension2 = file.name.split('.')[1] === 'xlsx'
  const isLt2M = file.size / 1024 / 1024 < 10
  if (!extension && !extension2) {
    alert(isEn() ? 'Upload template can only be in xls, xlsx format!' : '上传模板只能是 xls、xlsx格式!')
  }
  if (!isLt2M) {
    alert(isEn() ? 'Upload template size cannot exceed 10MB' : '上传模板大小不能超过 10MB!')
  }
  return extension || (extension2 && isLt2M)
}
const uploadRef = ref(null)
const onSubmitUpload = () => {
  // 触发组件的action
  uploadRef.value?.submit()
  if (!upload) {
    ElMessage.error('请选择文件上传')
  }
}
const onHandlePreview = (file) => {
  if (file.response.data) {
    alert(isEn() ? 'This file import success' : '此文件导入成功')
  } else {
    alert(isEn() ? 'This file import failed' : '此文件导入失败')
  }
}
// 下载模板
const onDownloadModel = () => {
  api.downModel().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
    const fileName = isEn() ? 'UserInfoImportTemplate.xlsx' : '导入用户信息模板.xlsx'
    const elink = document.createElement('a')
    if ('download' in elink) { // 非IE下载
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }).catch((e) => {
    ElMessage.error(e)
  })
}
const isEn = () => {
  return getLanguage === 'en'
}
defineExpose({ onInit })
</script>
