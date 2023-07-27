<template>
  <div class="elx-videobox">
    <el-dialog
      v-model="visible"
      title="视频管理器"
      class="elx-videobox-dialog"
      top="9vh"
      :append-to-body="visible"
    >
      <div class="file-group">
        <div class="upload-btn">
          <div class="up-btn">
            <el-button
              v-permission="['resource:video:uploadVideo']"
              type="primary"
              plain
              class="el-icon-top"
              @click="uploadFileBtn"
            >
              上传视频
            </el-button>
          </div>
          <!-- 搜索 -->
          <el-form
            :inline="true"
            :model="dataForm"
            class="demo-form-inline form"
            size="small"
            @submit.prevent
          >
            <el-form-item>
              <el-input
                v-model="fileName"
                :placeholder="$t('biz.videobox.videoName')"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchImg"
              >
                {{ $t("biz.videobox.query") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="file-group-box">
          <!-- 左侧栏 -->
          <div class="left-sidebar">
            <div class="group-list">
              <div :class="['group-item', dataForm.attachFileGroupId===0?'active':'']">
                <span
                  class="group-name"
                  @click="clickOneGroup(0)"
                >全部视频</span>
              </div>
              <div
                v-for="(gItem, gIdx) in groupList"
                :key="gIdx"
                :class="['group-item', dataForm.attachFileGroupId===gItem.attachFileGroupId?'active':'']"
              >
                <span
                  class="group-name"
                  @click="clickOneGroup(gItem.attachFileGroupId)"
                >{{ gItem.name }}</span>
              </div>
            </div>
          </div>

          <!-- 视频列表 -->
          <div
            v-if="options.activeTab==='pick'"
            class="pick-block"
          >
            <div class="elx-main elx-img-list">
              <div
                v-if="isLoading"
                class="elx-img-list-loading"
              >
                <div class="el-icon-loading" />
              </div>
              <div
                v-for="(img, itemIndex) in imgRes"
                :key="itemIndex"
                class="img-item"
              >
                <div
                  class="thumb-wp"
                  @click.prevent.stop="onClickListImage(img)"
                >
                  <video
                    :src="resourcesUrl + img.filePath"
                    class="showVideo"
                    controls="controls"
                  />
                </div>
                <div
                  class="title"
                  @click="onClickListImage(img)"
                >
                  {{ img.fileName }}
                </div>
                <span
                  v-if="img.selected"
                  class="selected"
                  @click="onClickListImage(img)"
                >
                  <el-icon class="icon"><Select /></el-icon>
                </span>
              </div>
              <div
                v-if="!imgRes.length"
                class="empty"
              >
                暂无视频
              </div>
            </div>

            <el-pagination
              layout="total, prev, pager, next"
              :current-page="page.current"
              :page-size="page.size"
              :total="page.total"
              @current-change="onPageNumChange"
            />

            <div class="elx-foot">
              <el-badge
                v-if="!type"
                :value="files.length"
                class="item"
              >
                <el-button
                  type="primary"
                  :disabled="files.length === 0"
                  @click="onConfirm"
                >
                  {{ $t("table.confirm") }}
                </el-button>
              </el-badge>
              <el-button
                v-else
                type="primary"
                :disabled="disabled"
                @click="onConfirm"
              >
                {{ $t("table.confirm") }}
              </el-button>
              <el-button
                v-permission="['resource:video:uploadVideo']"
                type="primary"
                plain
                @click="uploadFileBtn"
              >
                上传视频
              </el-button>
            </div>
          </div>

          <!-- 上传视频 -->
          <div
            v-if="options.activeTab==='upload'"
            class="upload-block"
          >
            <div class="elx-main">
              <div class="upload-title">
                选择视频分组：
              </div>
              <div class="file-gropu-btn">
                <span><el-tag
                  v-if="selectGroupName"
                  closable
                  :disable-transitions="true"
                  class="sel-group-name"
                  @close="handleClose()"
                >{{ selectGroupName }}</el-tag></span>
                <el-button
                  v-if="!selectGroupName"
                  link
                  @click="selectOrCreateGroup(0)"
                >
                  <el-select
                    v-model="groupForm.attachFileGroupId"
                    size="small"
                    clearable
                    placeholder="选择视频分组"
                  >
                    <el-option
                      v-for="item in groupList"
                      :key="item.attachFileGroupId"
                      :label="item.name"
                      :value="item.attachFileGroupId"
                    />
                  </el-select>
                </el-button>
                <el-button
                  v-if="!selectGroupName"
                  v-permission="['resource:video:saveVideoGroup']"
                  style="margin-left: 10px"
                  link
                  @click="selectOrCreateGroup(1)"
                >
                  新建分组
                </el-button>
              </div>

              <div class="upload-title">
                {{ $t("biz.videobox.selectLocalVideo") }}
              </div>

              <div class="preview-list">
                <!-- 视频预览 -->
                <div
                  v-for="(item, index) in videoList"
                  :key="index"
                  class="video-preview video-preview-left"
                >
                  <video
                    v-if="item.url"
                    class="upShowVideo"
                    :src="item.url"
                    controls="controls"
                    style="width:175px;height:87.5px;"
                  />
                  <!-- 显示查看和删除的按钮弹窗 -->
                  <div
                    class="avatar-uploader-popup"
                  >
                    <i
                      class="el-icon-delete"
                      @click="preDeleteVideo(index)"
                    />
                  </div>
                </div>

                <el-upload
                  v-show="!uploadFileFlag"
                  ref="uploadRef"
                  class="upload-img-preview"
                  list-type="picture-card"
                  accept="video/*"
                  action=""
                  :multiple="true"
                  :http-request="httpRequest"
                  :limit="uploadNumberLimit()"
                  :on-change="handleAvatarChange"
                  :before-upload="beforeUpload"
                  :on-exceed="onUploadError"
                  :show-file-list="false"
                  :on-progress="onUploadExceedTip"
                  :auto-upload="false"
                >
                  <el-icon><Plus /></el-icon>
                </el-upload>
              </div>

              <div class="upload-tip">
                {{ uploadTips() }}
              </div>

              <div class="elx-foot">
                <el-button
                  type="primary"
                  @click="onUploadConfirm"
                >
                  {{ $t("biz.videobox.confirmUpload") }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 选择/创建/修改分组 -->
          <el-dialog
            v-model="showGroupVisible"
            :title="showGroupType===0?'选择分组'
              :showGroupType===1?'新建分组':'修改分组名称'"
            :append-to-body="showGroupVisible"
            :close-on-click-modal="false"
            width="600px"
          >
            <el-form
              ref="groupFormRef"
              :model="groupForm"
              :rules="rules"
              label-width="90px"
              style="width:500px"
              @submit.prevent
            >
              <el-form-item
                v-if="showGroupType !== 0"
                label="分组名称"
                prop="name"
              >
                <el-input
                  v-model="groupForm.name"
                  placeholder="请输入分组名称"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item
                v-if="showGroupType===0"
                label="选择分组"
              >
                <el-select
                  v-model="groupForm.attachFileGroupId"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.attachFileGroupId"
                    :label="item.name"
                    :value="item.attachFileGroupId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="showGroupVisible = false">
                  {{ $t('table.cancel') }}
                </el-button>
                <el-button
                  type="primary"
                  @click="groupFormSubmit()"
                >
                  {{ $t('table.confirm') }}
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ossInfo, pageFileGroup, saveFileGroup, updateFileGroup, aliImgUpdate, minIoImgUpdate } from '@/api/biz/oss'
import { save, page as pageApi } from '@/api/biz/attach-file'
import { checkPermission } from '@/directive/permission/index.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshPic'])

const vPermission = checkPermission

const dataForm = reactive({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  attachFileGroupId: 0
})
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const groupForm = reactive({
  attachFileGroupId: '', // 选择分组的值
  name: '' // 分组名称
})
const rules = reactive({
  name: [
    { required: true, message: '分组名称不能为空', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在1-20个字符', trigger: 'blur' }
  ]
})
const options = reactive({
  multiple: true, // 是否支持选取多个视频
  limit: 10, // 最多可选择视频数量
  maxSize: 2, // 最大尺寸（M）
  activeTab: 'pick',
  enableUpload: false, // 是否启用视频上传
  callback: null
})
const disabled = ref(false)
const page = reactive({
  current: 1,
  size: 9,
  total: 0
})

const isLoading = ref(true)
const visible = ref(false)
const files = ref([]) // 已选视频
const fileIds = ref([]) // 已选视频的fileId
const type = ref(2)
let limit = null
const uploadRef = ref(null)
/**
 * 初始化
 * type 1：单图  2：多图
 */
const init = (typePar, limitPar) => {
  visible.value = true
  isLoading.value = false
  files.value = []
  fileIds.value = []
  if (typePar === 1) {
    type.value = true
    disabled.value = true
  } else {
    type.value = false
    limit = limitPar
  }
  if (uploadRef.value) {
    uploadRef.value.uploadFiles = []
  }
  // 获取产品数据 - 第一页的数据
  page.current = 1
  loadImageGroup() // 分组
  loadListImage() // 视频列表
}

const groupList = ref([]) // 分组列表
const fileType = 2 // 文件类型
/**
 * 加载视频分组列表
 */
const loadImageGroup = () => {
  pageFileGroup({ type: fileType }).then((data) => {
    groupList.value = data
  })
}

/**
 * 点击视频分组item
 */
const clickOneGroup = (id) => {
  page.current = 1
  dataForm.attachFileGroupId = id
  options.activeTab = 'pick'
  loadListImage()
}

const showGroupType = ref(0) // 0选择分组 1创建分组 2修改分组
const showGroupVisible = ref(false) // 选择/创建分组弹窗
/**
 * 打开选择/新建分组
 * st 0选择分组 1创建/修改分组
 * showGroupType 0选择分组 1创建分组 2修改分组
 */
const selectOrCreateGroup = (st, groupId, gIdx) => {
  showGroupType.value = st
  if (!groupId) {
    groupForm.attachFileGroupId = ''
    groupForm.name = ''
  }
  // 修改分组
  if (st && groupId) {
    if (st === 1) {
      groupForm.name = groupList.value[gIdx].name
      groupForm.attachFileGroupId = groupId
      showGroupType.value = fileType
    }
  }
  if (st === 0) { // 选择分组
    if (!groupList.value.length) {
      ElMessage({
        message: '当前暂无分组可选择，请先创建分组',
        duration: 1500
      })
      showGroupVisible.value = false
      return
    }
  }
  showGroupVisible.value = true
}

const groupFormRef = ref(null)
const selectGroupName = ref('') // 选中的分组名称
/**
 * 提交选择/创建/修改分组
 */
const groupFormSubmit = () => {
  groupFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (showGroupType.value === 0) {
      if (!groupForm.attachFileGroupId) {
        ElMessage({
          message: '请选择分组',
          type: 'warning',
          duration: 1000
        })
        return
      }
      groupList.forEach(el => {
        if (groupForm.attachFileGroupId === el.attachFileGroupId) {
          groupForm.name = el.name
          selectGroupName.value = el.name
        }
      })
      showGroupVisible.value = false
      return
    }
    if (showGroupType.value !== 0) {
      if (!groupForm.name) {
        ElMessage({
          message: '分组名称不能为空',
          type: 'warning',
          duration: 1000
        })
        return
      }
      const param = {
        attachFileGroupId: groupForm.attachFileGroupId,
        name: groupForm.name,
        type: fileType
      }
      const request = groupForm.attachFileGroupId ? updateFileGroup(param) : saveFileGroup(param)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 800,
          onClose: () => {
            groupForm.attachFileGroupId = ''
            showGroupVisible.value = false
            loadImageGroup()
          }
        })
      })
    }
  })
}

const videoList = ref([]) // 预览视频 队列
const fileName = ref('')
const imgRes = ref([])
/**
 * 加载视频列表数据
 */
const loadListImage = () => {
  isLoading.value = true
  videoList.value = []
  const param = {
    pageNum: page.current ? page.current : 1,
    pageSize: page.size,
    type: fileType,
    fileName: fileName.value ? fileName.value : null,
    attachFileGroupId: dataForm.attachFileGroupId || 0
  }
  pageApi(param).then(response => {
    imgRes.value = response.list
    imgRes.value.forEach(img => {
      if (fileIds.value.indexOf(img.fileId) !== -1) {
        img.selected = true
      }
    })
    page.pages = response.pages
    page.total = response.total
    isLoading.value = false
  })
}

const onConfirm = () => {
  if (type.value) {
    emit('refreshPic', files.value[0].filePath)
  } else {
    const imgPaths = files.value.map(file => {
      return file.filePath
    }).join(',')
    emit('refreshPic', imgPaths)
  }
  visible.value = false
}

let isSubmit = false
// 视频预上传
const handleAvatarChange = (file) => {
  if (!isSubmit) {
    const showVideoList = document.getElementsByClassName('upShowVideo')
    const videoSrc = URL.createObjectURL(file.raw)
    videoList.value.push({ url: videoSrc, uid: file.uid })
    showVideoList.forEach((item) => {
      if (!item.paused) {
        item.pause()
      }
    })
  }
}

/**
 * 点击上传视频按钮
 */
const uploadFileBtn = () => {
  options.activeTab = 'upload'
  files.value = []
  fileIds.value = []
  disabled.value = false
  dataForm.attachFileGroupId = null
}

/**
 * 点击视频时选中或取消选中视频
 * @param img object
 */
const onClickListImage = (img) => {
  // 单选视频
  if (type.value) {
    clearListSelected()
    files.value = []
    fileIds.value = []
    disabled.value = false
  } else {
    // 多选视频-如果已选中则取消选中
    const imgIndex = selectedImageIndex(img)
    if (imgIndex >= 0) {
      // 取消视频已选状态
      img.selected = false
      files.value.splice(imgIndex, 1)
      fileIds.value.splice(imgIndex, 1)
      return
    }
  }
  if (!type.value && files.value.length >= limit) {
    message($t('biz.videobox.superiorLimit'))
    return false
  }
  files.value.push(JSON.parse(JSON.stringify(img)))
  fileIds.value.push(img.fileId)
  const showVideoList = document.getElementsByClassName('showVideo')
  if (showVideoList.length > 0) {
    for (const item of showVideoList) {
      if (!item.paused) {
        item.pause()
      }
    }
    img.selected = true
  }
}

/**
 * 清除所有已点击视频样式
 */
const clearListSelected = () => {
  if (type.value) {
    imgRes.value.forEach(element => {
      element.selected = false
    })
  }
}

/**
 * 按视频名称搜索视频
 */
const searchImg = () => {
  page.current = 1
  loadListImage()
}

/**
 * 视频已选则返回下标，未选则返回-1
 */
const selectedImageIndex = (img) => {
  for (let i = 0; i < files.value.length; i++) {
    const selectedImg = files.value[i]
    if (selectedImg.fileId === img.fileId) {
      return i
    }
  }
  return -1
}

/**
 * 分页页面变化时刷新数据
 * @param page
 */
const onPageNumChange = (page) => {
  page.current = page
  loadListImage()
}

let sizeFlag = 0
const attachFiles = ref([])
const resourcesActionType = ref(import.meta.env.VUE_APP_RESOURCES_TYPE)
let ossList = null
/**
 * 获取上传视频数据
 */
const onUploadConfirm = () => {
  const fileNum = uploadRef.value?.uploadFiles.length
  sizeFlag = 0
  attachFiles.value = []
  isSubmit = true
  ossInfo(fileNum).then(response => {
    if (resourcesActionType.value === '0') {
      dataForm.policy = response.policy
      dataForm.signature = response.signature
      dataForm.ossaccessKeyId = response.accessid
      dataForm.dir = response.dir
    }
    ossList = response.ossList
    nextTick(() => {
      uploadRef.value?.submit()
      isSubmit = false
    })
  })
}

/**
 * 上传视频
 */
const httpRequest = (event) => {
  videoList.value.forEach(item => {
    if (item.uid === event.file.uid) {
      uploadFile(event)
    }
  })
}
const uploadFile = (event) => {
  const file = event.file
  const attachFile = Object.assign({
    fileName: file.name,
    fileSize: file.size,
    type: fileType
  })
  if (!ossList || ossList.length <= 0) {
    message('数据异常，请刷洗后重试')
  }
  if (resourcesActionType === '0') {
    // 上传视频成功
    attachFile.filePath = '/' + dataForm.dir + ossList[0].fileName
    const formdata = new FormData()
    formdata.append('policy', dataForm.policy)
    formdata.append('signature', dataForm.signature)
    formdata.append('ossaccessKeyId', dataForm.ossaccessKeyId)
    formdata.append('dir', dataForm.dir)
    formdata.append('host', resourcesUrl)
    formdata.append('key', ossList[0].dir + ossList[0].fileName)
    formdata.append('file', file)
    aliImgUpdate(resourcesUrl, formdata).then(() => {
      saveFileData(file, attachFile.filePath)
    }).catch(error => {
      // 上传视频失败
      if (!error) {
        event.onError()
      }
    })
  } else if (resourcesActionType === '1') {
    attachFile.filePath = '/' + ossList[0].dir + ossList[0].fileName
    minIoImgUpdate(ossList[0].actionUrl, file).then(() => {
      saveFileData(file, attachFile.filePath)
    }).catch(error => {
      // 上传视频失败
      if (!error) {
        event.onError()
      }
    })
  }
  attachFiles.value.push(attachFile)
  ossList.splice(0, 1)
  if (ossList <= 0) {
    event.onSuccess()
  }
}
/**
 * 保存视频文件数据
 */
const saveFileData = (file, filePath) => {
  const uploadFile = [
    {
      attachFileGroupId: groupForm.attachFileGroupId,
      fileName: file.name,
      fileSize: file.size,
      filePath,
      type: fileType
    }
  ]
  save(uploadFile).then(() => {
    attachFiles.value = []
    options.activeTab = 'pick'
    dataForm.attachFileGroupId = 0
    loadListImage()
    page.current = 1
    groupForm.name = ''
    groupForm.attachFileGroupId = ''
    selectGroupName.value = ''
  })
}
/**
 * 上传视频前检查合法性
 * @param file
 * @returns {boolean}
 */
const beforeUpload = (file) => {
  const typeArray = file.type.split('/')
  const isSize = file.size / (1024 * 1024) < 20
  if (typeArray[0] !== 'video' || !isSize) {
    if (sizeFlag === 0) {
      message($t('biz.videobox.onlyVideos'), true)
      sizeFlag += 1
    }
    videoList.value.forEach((item, index) => {
      if (item.uid === file.uid) {
        videoList.value.splice(index, 1)
      }
    })
    return false
  }
  return true
}

const uploadNumberLimit = () => {
  if (!options.multiple) {
    return 1
  }
  return options.limit - files.value.length
}

const uploadTypeTip = () => {
  return $t('biz.videobox.onlySupported') + ' mp4/mov/wmv ' + $t('biz.videobox.video')
}

const uploadSizeTip = () => {
  return $t('biz.videobox.notExceed') + '20M'
}

const uploadFileFlag = ref(false)
const uploadTips = () => {
  const tips = [uploadTypeTip(), uploadSizeTip()]

  if (!options.multiple) {
    return tips.join('，')
  }

  if (files.value.length > 0) {
    tips.push($t('biz.videobox.alreadyExist') + files.value.length + $t('biz.videobox.unit'))
  }

  const uploadFileNum = videoList.value.length ? videoList.value.length : 0
  if (uploadFileNum > 0) {
    tips.push($t('biz.videobox.soonUpload') + uploadFileNum + $t('biz.videobox.unit'))
  }
  uploadFileFlag.value = uploadFileNum >= options.limit
  tips.push($t('biz.videobox.remainder') + (options.limit - files.value.length - uploadFileNum) + $t('biz.videobox.unit') + $t('biz.videobox.upload'))

  return tips.join('，')
}

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  if (err.length > options.limit) {
    message(`当前最多只能选选择${options.limit}个视频上传`)
    return
  }
  throw err
}

/**
 * 选择上传文件超过限制文件个数提示
 */
const onUploadExceedTip = () => {
  message($t('biz.videobox.maxSelect') + uploadNumberLimit() + $t('biz.videobox.unit') + $t('biz.videobox.upload'))
}

const message = (msg, isInfo) => {
  let typePar = 'error'
  if (isInfo) {
    typePar = 'info'
  }
  ElMessage({
    message: msg,
    type: typePar,
    duration: 1500
  })
}

// 删除预览视频
const preDeleteVideo = (index) => {
  videoList.value.splice(index, 1)
}

defineExpose({
  init
})

</script>

<style lang="scss" scoped>
@use "index";
</style>
