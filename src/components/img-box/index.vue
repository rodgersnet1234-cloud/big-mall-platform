<template>
  <div class="component-img-box">
    <el-dialog
      v-model="visible"
      :title="$t('biz.imgbox.picManager')"
      class="elx-imgbox-dialog append-to-body-dialog"
      top="9vh"
      width="860px"
      :append-to-body="visible"
    >
      <div class="file-group">
        <div class="upload-btn">
          <div class="up-btn">
            <el-button
              type="primary"
              plain
              @click="uploadFileBtn"
            >
              <el-icon><Top /></el-icon>
              上传图片
            </el-button>
          </div>
          <!-- 搜索 -->
          <el-form
            :inline="true"
            :model="dataForm"
            class="demo-form-inline form"
            @submit.prevent
          >
            <el-form-item>
              <el-input
                v-model="fileName"
                :placeholder="$t('biz.imgbox.picName')"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="searchImg"
              >
                {{ $t("biz.imgbox.query") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="img-group-box">
          <!-- 左侧栏 -->
          <div class="left-sidebar">
            <div class="group-list">
              <div :class="['group-item', dataForm.attachFileGroupId===0?'active':'']">
                <span
                  class="group-name"
                  @click="clickOneGroup(0)"
                >全部图片</span>
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
                <span class="sidebar-operate" />
              </div>
            </div>
          </div>

          <!-- 图片列表 -->
          <div
            v-if="options.activeTab==='pick'"
            class="pick-block"
          >
            <div
              class="elx-main elx-img-list"
              style="width: 100%;"
            >
              <div
                v-if="isLoading"
                class="elx-img-list-loading"
              >
                <el-icon class="el-icon-loading">
                  <Loading />
                </el-icon>
              </div>
              <div
                v-for="(img) in imgRes"
                :key="img.fileId"
                class="img-item"
              >
                <div
                  class="thumb-wp"
                  @click="onClickListImage(img)"
                >
                  <img-show
                    :key="img.fileId"
                    :src="img.filePath"
                    :img-alt="img.name"
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
                  <span class="icon" />
                  <el-icon
                    color="#FFF"
                    size="20"
                  ><Check /></el-icon>
                </span>
              </div>
              <div
                v-if="!imgRes.length"
                class="empty"
              >
                暂无图片
              </div>
            </div>

            <el-pagination
              layout="->, total, prev, pager, next"
              :current-page="page.current"
              :page-size="page.size"
              :total="page.total"
              style="float: right"
              @current-change="onPageNumChange"
            />

            <div class="elx-foot">
              <el-badge
                v-if="!type"
                :value="images.length"
                class="item"
              >
                <el-button
                  type="primary"
                  :class="[images.length === 0 ? 'gray-btn' : '']"
                  :disabled="images.length === 0"
                  @click="onConfirm"
                >
                  {{ $t("table.confirm") }}
                </el-button>
              </el-badge>
              <el-button
                v-else
                type="primary"
                :class="[disabled ? 'gray-btn' : '']"
                :disabled="disabled"
                @click="onConfirm"
              >
                {{ $t("table.confirm") }}
              </el-button>
              <el-button
                type="primary"
                plain
                @click="uploadFileBtn"
              >
                {{ $t("biz.imgbox.uploadPic") }}
              </el-button>
            </div>
          </div>

          <!-- 上传图片 -->
          <div
            v-if="options.activeTab==='upload'"
            class="upload-block"
          >
            <div class="elx-main">
              <div class="upload-title">
                {{ $t("biz.imgbox.selectLocalPic") }}
              </div>
              <el-upload
                ref="uploadRef"
                :file-list="uploadFiles"
                :class="['upload-img-preview',hideUpload?'hide':'']"
                list-type="picture-card"
                accept=".jpg,.png,.gif,.jpeg"
                action=""
                :http-request="httpRequest"
                :multiple="true"
                :auto-upload="false"
                :limit="uploadNumberLimit()"
                :before-upload="beforeUpload"
                :on-change="handleAvatarChange"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                :on-exceed="onUploadExceedTip"
                :on-remove="onRemove"
                :before-remove="beforeRemove"
              >
                <el-icon><Plus /></el-icon>
              </el-upload>

              <div class="file-gropu-btn">
                <span>分组：</span>
                <el-select
                  v-model="groupForm.attachFileGroupId"
                  clearable
                  placeholder="选择图片分组"
                >
                  <el-option
                    v-for="item in groupList"
                    :key="item.attachFileGroupId"
                    :label="item.name"
                    :value="item.attachFileGroupId"
                  />
                </el-select>
                <el-button
                  v-permission="['resource:fileGroup:save']"
                  style="margin-left: 10px"
                  type="primary"
                  link
                  @click="selectOrCreateGroup()"
                >
                  新建分组
                </el-button>
              </div>
              <div class="upload-tip">
                {{ uploadTips() }}
              </div>

              <div class="elx-foot">
                <el-button
                  type="primary"
                  @click="onUploadConfirm"
                >
                  {{ $t("biz.imgbox.confirmUpload") }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 选择/创建/修改分组 -->
      <el-dialog
        v-model="showGroupVisible"
        title="新建分组"
        :append-to-body="showGroupVisible"
        :close-on-click-modal="false"
        width="600px"
        class="group-box"
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
              show-word-limit
              maxlength="20"
            />
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
    </el-dialog>
  </div>
</template>

<script setup>
import { awsImgUpdate, getBatchPreSignUrl, pageFileGroup, saveFileGroup, updateFileGroup } from '@/api/biz/oss'
import { save, page as apiPage } from '@/api/biz/attach-file'
import { checkPermission } from '@/directive/permission/index.js'
import imageCompression from 'browser-image-compression'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'
import { Top, Check, Plus } from '@element-plus/icons-vue'

const emit = defineEmits(['refreshPic', 'refreshPic'])

const vPermission = checkPermission

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
  multiple: true, // 是否支持选取多个图片
  limit: 20, // 最多可选择图片数量
  maxSize: 512, // 最大尺寸（kb）
  activeTab: 'pick',
  enableUpload: false, // 是否启用图片上传
  callback: null
})
const visible = ref(false)
const isLoading = ref(true)
const images = ref([]) // 已选图片
let fileIds = [] // 已选图片的fileId
const type = ref(2)
const disabled = ref(false)
const uploadRef = ref({})
const page = reactive({
  current: 1,
  size: 15,
  total: 0
})
const hideUpload = ref(false) // 控制上传图片上传按钮显隐
const uploadFiles = ref([])
/**
 * 初始化
 * type 1：单图  2：多图
 */
// eslint-disable-next-line no-unused-vars
const init = (typePar, limitPar) => {
  visible.value = true
  isLoading.value = false
  images.value = []
  fileIds = []
  hideUpload.value = false
  if (typePar === 1) {
    type.value = true
    disabled.value = true
  } else {
    type.value = false
    options.limit = limitPar
  }
  uploadFiles.value = []
  // 获取产品数据 - 第一页的数据
  page.current = 1
  loadImageGroup() // 分组
  loadListImage() // 图片列表
}

const groupList = ref([]) // 分组列表
const fileType = 1
/**
 * 加载图片分组列表
 */
const loadImageGroup = () => {
  pageFileGroup({ type: fileType }).then((data) => {
    groupList.value = data
  })
}

const dataForm = reactive({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  attachFileGroupId: 0
})
/**
 * 点击图片分组item
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
      showGroupType.value = 2 // 修改分组名称
    }
  }
  // 选择分组
  if (st === 0) {
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

const fileName = ref('')
const imgRes = ref([])
/**
 * 加载图片列表数据
 */
const loadListImage = () => {
  isLoading.value = true
  const param = {
    pageNum: page.current ? page.current : 1,
    pageSize: page.size,
    fileName: fileName.value ? fileName.value : null,
    attachFileGroupId: dataForm.attachFileGroupId || 0,
    type: fileType
  }
  apiPage(param).then(response => {
    setTimeout(() => {
      imgRes.value = response.list
      imgRes.value.forEach(img => {
        if (fileIds.indexOf(img.fileId) !== -1) {
          img.selected = true
        }
        img.key = Math.random * 10000000
      })
      page.pages = response.pages
      page.total = response.total
      isLoading.value = false
    }, 100)
  })
}

const onConfirm = Debounce(() => {
  if (type.value) {
    emit('refreshPic', images.value[0].filePath)
  } else {
    const imgPaths = images.value.map(file => {
      return file.filePath
    }).join(',')
    emit('refreshPic', imgPaths)
  }
  visible.value = false
}, 1000)

const groupFormRef = ref(null)
let creatingGroup = false // 正在新建分组
/**
 * 提交选择/创建/修改分组
 */
const groupFormSubmit = () => {
  groupFormRef.value?.validate(valid => {
    if (!valid) {
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
      if (!groupForm.name.trim()) {
        ElMessage({
          message: '分组名称不能为空格',
          type: 'warning',
          duration: 1000
        })
        return
      }

      const flag = groupList.value.some(item => {
        return item.name === groupForm.name
      })
      if (flag && !groupForm.attachFileGroupId) {
        ElMessage({
          message: '分组已存在',
          type: 'warning',
          duration: 1000
        })
        return
      }

      if (creatingGroup) {
        return
      }
      creatingGroup = true
      const param = {
        attachFileGroupId: groupForm.attachFileGroupId,
        name: groupForm.name,
        type: fileType
      }
      const request = groupForm.attachFileGroupId ? updateFileGroup(param) : saveFileGroup(param)
      request.then(() => {
        loadImageGroup()
        groupForm.attachFileGroupId = ''
        showGroupVisible.value = false
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 800,
          onClose: () => {
            creatingGroup = false
          }
        })
      })
    }
  })
}

/**
 * 点击上传图片按钮
 */
const uploadFileBtn = () => {
  uploadFiles.value = []
  options.activeTab = 'upload'
  // 设置所选分组为上传图片默认分组
  groupForm.attachFileGroupId = dataForm.attachFileGroupId || ''
  images.value = []
  fileIds = []
  disabled.value = false
  dataForm.attachFileGroupId = null
}

/**
 * 点击图片时选中或取消选中图片
 * @param img object
 */
const onClickListImage = (img) => {
  // 单选图片
  if (type.value) {
    clearListSelected()
    images.value = []
    fileIds = []
    disabled.value = false
  } else {
    // 多选图片-如果已选中则取消选中
    const imgIndex = selectedImageIndex(img)
    if (imgIndex >= 0) {
      // 取消图片已选状态
      img.selected = false
      images.value.splice(imgIndex, 1)
      fileIds.splice(imgIndex, 1)
      return
    }
  }
  if (!type.value && images.value.length >= options.limit) {
    message($t('biz.imgbox.superiorLimit'))
    return false
  }
  images.value.push(JSON.parse(JSON.stringify(img)))
  fileIds.push(img.fileId)
  img.selected = true
}

/**
 * 清除所有已点击图片样式
 */
const clearListSelected = () => {
  if (type) {
    imgRes.value.forEach(element => {
      element.selected = false
    })
  }
}

/**
 * 按图片名称搜索图片
 */
const searchImg = () => {
  page.current = 1
  loadListImage()
}

/**
 * 图片已选则返回下标，未选则返回-1
 */
const selectedImageIndex = (img) => {
  for (let i = 0; i < images.value.length; i++) {
    const selectedImg = images.value[i]
    if (selectedImg.fileId === img.fileId) {
      return i
    }
  }
  return -1
}

/**
 * 分页页面变化时刷新数据
 * @param pagePar
 */
const onPageNumChange = (pagePar) => {
  page.current = pagePar
  loadListImage()
}

let attachFiles = []
let notImg = false
let ossList = null
/**
 * 获取上传图片数据
 */
const onUploadConfirm = () => {
  const fileNum = uploadFiles.value.length

  if (fileNum === 0) {
    return ElMessage({
      message: '请选择图片上传',
      type: 'warning'
    })
  }
  const fileNames = uploadFiles.value?.map((item) => {
    return item.name
  }).join(',')
  attachFiles = []
  getBatchPreSignUrl(fileNames).then(response => {
    ossList = response
    notImg = true
    nextTick(() => {
      uploadRef.value?.submit()
    })
  })
}

/**
 * 上传图片
 */
const httpRequest = (event) => {
  const file = event.file
  const typeArray = file.type.split('/')
  typeArray[1] === 'jpeg' ? typeArray[1] = 'jpg' : typeArray[1] = ''
  const attachFile = Object.assign({
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })

  if (ossList.length <= 0) {
    message('数据异常，请刷新后重试')
  }
  attachFile.filePath = '/' + ossList[0].dir + ossList[0].fileName
  awsImgUpdate(ossList[0].preSignUrl, file)
  attachFiles.push(attachFile)
  ossList.splice(0, 1)
  if (ossList <= 0) {
    event.onSuccess()
  }
}

/**
 * 上传图片前检查合法性
 * @param file
 * @returns {boolean}
 */
const beforeUpload = async (file) => {
  const typeArray = file.type.split('/')
  if (typeArray[0] !== 'image') {
    if (notImg) {
      message($t('biz.imgbox.onlyPictures'), true)
      notImg = false
    }
    return Promise().reject()
  }
  const isSize = file.size / 1024 < options.maxSize
  if (!isSize) {
    try {
      const resultBlob = await imageCompression(file, {
        maxSizeMB: 0.5 // 压缩大小
      })
      return new File([resultBlob], file.name, {
        type: file.type
      })
    } catch (error) {
      return Promise().reject()
    }
  }
  return true
}

const uploadNumberLimit = () => {
  if (!options.multiple) {
    return 1
  }

  return options.limit - images.value.length
}

const uploadTypeTip = () => {
  return $t('biz.imgbox.onlySupported') + ' jpg/png/gif ' + $t('biz.imgbox.pic')
}

const uploadTips = () => {
  const tips = [uploadTypeTip()]

  if (!options.multiple) {
    return tips.join('，')
  }

  if (images.value.length > 0) {
    tips.push($t('biz.imgbox.alreadyExist') + images.value.length + $t('biz.imgbox.unit'))
  }
  const uploadFileNum = uploadFiles.value ? uploadFiles.value.length : 0
  if (uploadFileNum > 0) {
    tips.push($t('biz.imgbox.soonUpload') + uploadFileNum + $t('biz.imgbox.unit'))
  }

  tips.push($t('biz.imgbox.remainder') + (options.limit - images.value.length - uploadFileNum) + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))

  return tips.join('，')
}

// eslint-disable-next-line no-unused-vars
const handleAvatarChange = (file, files) => {
  uploadFiles.value = files
  if (uploadFiles.value.length >= 9) {
    hideUpload.value = true
  }
}

let uploadDisabled
/**
 * 移除图片
 */
const onRemove = () => {
  uploadDisabled = true
  setTimeout(() => {
    hideUpload.value = false
    uploadDisabled = false
  }, 1000)
}
const beforeRemove = () => {
  // 防止用户频繁点击导致删除过多
  return !uploadDisabled
}

/**
 * 上传错误处理
 * @param err
 */
const onUploadError = (err) => {
  message($t('biz.imgbox.requestError'), true)
  throw err
}

/**
 * 上传成功处理，并提交图片数据
 * @param response
 * @param file
 * @param fileList
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
const onUploadSuccess = (response, file, fileList) => {
  const filesNames = []
  fileList.forEach(file => {
    filesNames.push(file.name)
  })
  const uploadFile = []
  attachFiles.forEach(file => {
    if (filesNames.indexOf(file.fileName) !== -1) {
      file.attachFileGroupId = groupForm.attachFileGroupId
      uploadFile.push(file)
    }
  })
  save(uploadFile).then(() => {
    attachFiles = []
    options.activeTab = 'pick'
    hideUpload.value = false
    dataForm.attachFileGroupId = 0
    loadListImage()
  })
  disabled.value = true
  uploadFiles.value = []
  page.current = 1
  groupForm.name = ''
  groupForm.attachFileGroupId = ''
}

/**
 * 选择上传文件超过限制文件个数提示
 */
const onUploadExceedTip = () => {
  message($t('biz.imgbox.maxSelect') + uploadNumberLimit() + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
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
defineExpose({ init })
</script>

<style lang="scss" scoped>
@use "index";
</style>
