<!--
 Copyright (c) 2018-2999 广州市蓝海创新科技有限公司 All rights reserved.

 https://www.mall4j.com/

 未经允许，不可做商业用途！

 版权所有，侵权必究！
-->
<template>
  <div class="Mall4j pricture-store">
    <div class="file-group">
      <div class="upload-btn">
        <div class="up-btn">
          <el-button
            v-permission="['resource:img:uploadImg']"
            type="primary"
            plain
            class="el-icon-top"
            @click="uploadFileBtn"
          >
            上传图片
          </el-button>
          <el-button
            v-permission="['resource:img:saveImgGroup']"
            plain
            class="el-icon-plus"
            @click="selectOrCreateGroup(1)"
          >
            新建分组
          </el-button>
        </div>
        <!-- 搜索 -->
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
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
              style="width:100%"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="searchImg(true)"
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
              <span class="sidebar-operate">
                <i
                  v-permission="['resource:img:editImgGroup']"
                  class="el-icon-edit"
                  @click="selectOrCreateGroup(1,gItem.attachFileGroupId,gIdx)"
                />
                <i
                  v-permission="['resource:img:deleteImgGroup']"
                  class="el-icon-delete"
                  @click="onDeleteFileGroup(gItem.attachFileGroupId)"
                />
              </span>
            </div>
          </div>
        </div>

        <!-- 图片列表 -->
        <div
          v-if="options.activeTab==='pick'"
          class="pick-block"
          name="pick"
        >
          <div class="elx-main elx-img-list">
            <div
              v-if="isLoading"
              class="elx-img-list-loading"
            >
              <div class="el-icon-loading" />
            </div>
            <div class="batch">
              <span class="text"><el-checkbox
                v-model="checkedAll"
                :indeterminate="isIndeterminate"
                @change="AllImgs"
              >全选</el-checkbox></span>
              <span
                v-permission="['resource:img:deleteImgs']"
                class="text"
                @click="delectImgs"
              >删除</span>
              <span
                v-permission="['resource:img:moveImgs']"
                class="text"
                @click="showMoveImgs"
              >移动</span>
            </div>
            <div
              v-for="(img, itemIndex) in imgRes"
              :key="itemIndex"
              class="img-item"
            >
              <div
                class="thumb-wp"
                @click="onClickListImage(img)"
              >
                <ImgShow :src="img.filePath" />
              </div>
              <div
                class="title"
                @click="onClickListImage(img)"
              >
                {{ img.fileName }}
              </div>
              <div class="operate">
                <el-link
                  v-permission="['resource:img:editImg']"
                  type="info"
                  class="edit"
                  @click="changeName(img)"
                >
                  {{ $t("table.edit") }}
                </el-link>
                <el-link
                  v-permission="['resource:img:deleteImg']"
                  type="danger"
                  class="del"
                  @click="delectImg(img.fileName, img.fileId)"
                >
                  {{ $t("table.delete") }}
                </el-link>
              </div>
              <!-- <div class="label" v-if="img.label">{{img.label}}</div> -->
              <span
                v-if="img.selected"
                class="selected"
                @click="onClickListImage(img)"
              >
                <span class="icon el-icon-check" />
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
            layout="total, prev, pager, next"
            :current-page="pageQuery.current"
            :page-size="pageQuery.size"
            :total="page.total"
            @current-change="onPageNumChange"
          />
        </div>

        <!-- 上传图片 -->
        <div
          v-if="options.activeTab==='upload'"
          class="upload-block"
          name="upload"
        >
          <div class="elx-main">
            <div class="upload-title">
              选择图片分组：
            </div>
            <div class="file-gropu-btn">
              <span>分组：</span>
              <el-select
                v-model="groupForm.attachFileGroupId"
                class="select-array"
                :placeholder="选择图片分组"
                style="marginTop: 35px"
                clearable
              >
                <el-option
                  v-for="item in groupList"
                  :key="item.attachFileGroupId"
                  :label="item.name"
                  :value="item.attachFileGroupId"
                />
              </el-select>
              <el-button
                v-if="!selectGroupName"
                v-permission="['resource:img:saveImgGroup']"
                style="margin-left: 10px"
                type="text"
                @click="selectOrCreateGroup(1)"
              >
                新建分组
              </el-button>
            </div>
            <div class="upload-title">
              {{ $t("biz.imgbox.selectLocalPic") }}
            </div>
            <el-upload
              ref="uploadRef"
              class="upload-img-preview"
              list-type="picture-card"
              accept=".jpg,.png,.gif"
              action=""
              :http-request="httpRequest"
              :multiple="true"
              :auto-upload="false"
              :limit="uploadNumberLimit()"
              :before-upload="beforeUpload"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-exceed="onUploadExceedTip"
              :on-change="onUploadChange"
              :before-remove="beforeRemove"
              :on-remove="onRemove"
              :class="{hide: hideUploadEdit}"
            >
              <i class="el-icon-plus" />
            </el-upload>

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

      <!-- 选择/创建/修改分组 -->
      <el-dialog
        v-model="showGroupVisible"
        :title="showGroupType.value===0 ? '选择分组'
          :showGroupType.value===1?'新建分组':'修改分组名称'"
        :append-to-body="showGroupVisible"
        :close-on-click-modal="false"
        width="600px"
        class="group-box"
      >
        <!-- native modifier has been removed, please confirm whether the function has been affected  -->
        <el-form
          ref="groupFormRef"
          :model="groupForm"
          :rules="rules"
          label-width="90px"
          style="width:500px"
          @submit.prevent
        >
          <el-form-item
            v-if="showGroupType!= 0"
            :label="`分组名称`"
            prop="name"
          >
            <!-- native modifier has been removed, please confirm whether the function has been affected  -->
            <el-input
              v-model="groupForm.name"
              :placeholder="`请输入分组名称`"
              maxlength="20"
              show-word-limit
              @keyup.enter="groupFormSubmit()"
            />
          </el-form-item>
          <el-form-item
            v-if="showGroupType.value ===0"
            :label="`选择分组`"
          >
            <el-select
              v-model="groupForm.attachFileGroupId"
              :placeholder="`请选择`"
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
            <el-button
              plain
              @click="showGroupVisible = false"
            >
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

    <!-- 修改图片名称 -->
    <el-dialog
      v-model="changeNameVisible"
      :title="$t('biz.imgbox.revisePicName')"
      :close-on-click-modal="false"
      top="160px"
      :append-to-body="visible"
      width="500px"
      class="changebox"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-if="changeNameVisible"
        ref="imgDataFormRef"
        :model="imageObject"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="`图片`">
          <ImgShow
            :src="imageObject.filePath"
            :class-list="['changebox-img']"
          />
        </el-form-item>
        <el-form-item :label="$t('biz.imgbox.oldName')">
          <span class="old-name">{{ imageObject.fileName }}</span>
        </el-form-item>
        <el-form-item :label="$t('biz.imgbox.revName')">
          <el-input
            v-model="newImgName"
            maxlength="20"
            :placeholder="$t('biz.imgbox.inputNewName')"
            clearable
            style="width:350px"
          />
        </el-form-item>
        <el-form-item :label="`分组`">
          <el-select
            v-model="groupForm.attachFileGroupId"
            :placeholder="`请选择`"
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
        <span class="dialog-footer">
          <el-button
            plain
            @click="changeNameVisible = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="submitImgName()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- /修改图片名称 -->

    <!-- 移动分组 -->
    <el-dialog
      v-model="changeNameVisible1"
      :title="'移动分组'"
      :close-on-click-modal="false"
      top="160px"
      :append-to-body="visible"
      width="500px"
      class="changebox"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        v-if="changeNameVisible1"
        ref="imgDataFormRef"
        :model="groupForm"
        label-width="90px"
        @submit.prevent
      >
        <el-form-item :label="`分组`">
          <el-select
            v-model="groupForm.attachFileGroupId"
            clearable
            :placeholder="`请选择`"
          >
            <el-option
              v-for="item in groupList"
              :key="item.attachFileGroupId"
              :label="item.name"
              :value="item.attachFileGroupId"
            />
          </el-select>
          <el-button
            style="margin-left:10px"
            type="text"
            @click="selectOrCreateGroup(1)"
          >
            新建分组
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            plain
            @click="changeNameVisible1 = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            type="primary"
            @click="MoveImgs()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- /移动分组 -->
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ossInfo, pageFileGroup, saveFileGroup, updateFileGroup, deleteFileGroup, aliImgUpdate, minIoImgUpdate } from '@/api/biz/oss'
import { save, page, updateFileName, deleteFile } from '@/api/biz/attach-file'
import { batchDeleteImgs, batchMoveImgs } from '@/api/resource/picture-store'
// import permission from '@/directive/permission/index.js'
import imageCompression from 'browser-image-compression'
import { Debounce } from '@/utils/debounce'

let images = ref([]) // 已选图片
let fileIds = ref([]) // 已选图片的fileId
let sizeFlag = ref(0) // 避免错误提示重复弹出
const uploadRef = ref(null)
const groupFormRef = ref(null)
const dataForm = reactive({
  policy: '',
  signature: '',
  key: '',
  ossaccessKeyId: '',
  dir: '',
  host: '',
  attachFileGroupId: 0
})
const groupList = ref([]) // 分组列表
const hideUploadEdit = ref(false) // 上传按钮显示
let attachFiles = ref([])
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const resourcesActionType = import.meta.env.VITE_APP_RESOURCES_TYPE
const showGroupVisible = ref(false) // 选择/创建分组弹窗
const showGroupType = ref(0) // 0选择分组 1创建分组 2修改分组
let groupForm = reactive({
  attachFileGroupId: '', // 选择分组的值
  name: '' // 分组名称
})
const fileType = ref(1) // 文件类型
const selectGroupName = ref('') // 选中的分组名称
let oriImgName = null // 图片原名称
const options = reactive({
  multiple: true, // 是否支持选取多个图片
  limit: 20, // 最多可选择图片数量
  maxSize: 2, // 最大尺寸（M）
  activeTab: 'pick',
  enableUpload: false, // 是否启用图片上传
  callback: null
})
const newImgName = ref('')
let ossList = ref([])
const isTrue = ref(true)
const changeNameVisible = ref(false)
const changeNameVisible1 = ref(false)
const type = ref(2)
const fileName = ref('')
const isLoading = ref(true)
const visible = ref(false)
const disabled = ref(false)
const notImg = ref(false)
const imgRes = ref([])
const checkedAll = ref(false)
const pageQuery = reactive({
  current: 1,
  size: 18,
  total: 0
})
const fileNum = ref(0)
const limit = ref(0)
const creatingGroup = ref(false) // 正在新建分组
const fileIndex = ref(0) // 图片位置索引，用于获取文件数组中当前上传文件的位置
const completeCount = ref(0) // 传输完成数量，用于控制文件全部上传成功才进入onSuccess方法
const uploadDisabled = ref(false)
const uploadSubmitFlag = ref(false)
const showPicUploadSuccessMessage = ref(true)// 是否提示上传成功

const isIndeterminate = computed(() => {
  const someRes = imgRes.value.some(imgItem => imgItem.selected)
  const everyRes = imgRes.value.every(imgItem => imgItem.selected)
  return someRes && !everyRes
})
const rules = computed(() => {
  return {
    name: [
      { required: true, message: $t('biz.imgbox.groupEmpty'), trigger: 'blur' },
      { min: 1, max: 20, message: $t('biz.imgbox.groupBetween'), trigger: 'blur' }
    ]
  }
})

onMounted(() => {
  loadImageGroup()
  loadListImage()
})

// mounted() {
//   loadListImage()
// },

/**
 * 加载图片分组列表
 */
const loadImageGroup = () => {
  pageFileGroup({ type: fileType.value }).then((responeseData) => {
    groupList.value = responeseData
    groupForm.attachFileGroupId = null
    if (changeNameVisible1.value || options.activeTab === 'upload') {
      responeseData.forEach(item => {
        if (groupForm.name === item.name) {
          groupForm.attachFileGroupId = item.attachFileGroupId
        }
      })
    }
  })
}
/**
 * 点击图片分组item
 */
const clickOneGroup = (id) => {
  pageQuery.current = 1
  dataForm.attachFileGroupId = id
  options.activeTab = 'pick'
  loadListImage()
}
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
    if (st == 0 || st == 1) {
      nextTick(() => {
        groupFormRef.value?.validate(valid => {
          if (!valid) { /* empty */ }
        }
        )
      })
    }
    if (st === 1) {
      groupForm.name = groupList[gIdx].name
      groupForm.attachFileGroupId = groupId
      showGroupType.value = 2 // 修改分组名称
    }
  }
  if (st === 0) { // 选择分组
    if (!groupList.length) {
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
/**
 * 提交选择/创建/修改分组
 */
const groupFormSubmit = () => {
  groupFormRef.value?.validate(valid => {
    if (!valid) {
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
    if (showGroupType.value === 0) {
      if (!groupForm.attachFileGroupId) {
        ElMessage({
          message: '请选择分组',
          type: 'warning',
          duration: 1000
        })
        return
      }
      groupList.value.forEach(el => {
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
      if (creatingGroup.value) {
        return
      }
      creatingGroup.value = true
      const param = {
        attachFileGroupId: groupForm.attachFileGroupId,
        name: groupForm.name,
        type: fileType.value
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
            creatingGroup.value = false
          }
        })
      }).catch(() => {
        creatingGroup.value = false
      })
    }
  })
}
/**
 * 删除分组
 */
const onDeleteFileGroup = (groupId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const data = {
      attachFileGroupId: groupId
    }
    deleteFileGroup(data).then(() => {
      dataForm.attachFileGroupId = 0
      console.log(groupList)
      loadImageGroup()
      searchImg()
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 800,
        onClose: () => {
        }
      })
    })
  })
}
// 保存上次点击查询的请求条件
let tempSearchForm = null
/**
 * 加载图片列表数据
 * @param page
 */
const loadListImage = (newData = false) => {
  if (newData || !tempSearchForm) {
    // tempSearchForm.pageNum = page.current ? page.current : 1
    // tempSearchForm.pageSize = page.size
    // tempSearchForm.fileName = fileName || null
    // tempSearchForm.attachFileGroupId = dataForm.attachFileGroupId || ''
    // tempSearchForm.fileType = fileType
    // tempSearchForm.sysType = 3
    tempSearchForm = {
      pageNum: pageQuery.current ? pageQuery.current : 1,
      pageSize: pageQuery.size,
      fileName: fileName.value || null,
      attachFileGroupId: dataForm.attachFileGroupId || '',
      type: fileType.value,
      sysType: 3
    }
  } else {
    tempSearchForm.pageNum = pageQuery.current ? pageQuery.current : 1
    tempSearchForm.pageSize = pageQuery.size
    tempSearchForm.attachFileGroupId = dataForm.attachFileGroupId || ''
    tempSearchForm.type = fileType.value
  }
  isLoading.value = true
  page(tempSearchForm).then(response => {
    imgRes.value = response.list
    checkedAll.value = true
    if (imgRes.length === 0) {
      checkedAll.value = false
    }
    imgRes.value.forEach(img => {
      // img.selected = false
      if (!isExist(img)) {
        img.selected = false
        checkedAll.value = false
      } else {
        img.selected = true
      }
      // $set(img, 'selected', false)
    })
    pageQuery.pages = response.pages
    pageQuery.total = response.total
    isLoading.value = false
    // AllImgs()
  })
}

let imageObject = null
/**
 * 修改图片名称
 */
const changeName = (img) => {
  isTrue.value = true
  changeNameVisible.value = true
  imageObject = img
  oriImgName = img.fileName
  if (img.attachFileGroupId) {
    groupForm.attachFileGroupId = img.attachFileGroupId
  } else {
    groupForm.attachFileGroupId = ''
  }
  newImgName.value = ''
}
/**
 * 提交修改后的图片名称
 */
const submitImgName = () => {
  if (!newImgName.value || !newImgName.value.trim()) {
    return ElMessage.error('图片名称不能为空！')
  }
  if (!isTrue.value) {
    return false
  }
  isTrue.value = false
  const data = {
    fileId: imageObject.fileId,
    fileName: newImgName.value || oriImgName,
    attachFileGroupId: groupForm.attachFileGroupId,
    sysType: 3
  }
  updateFileName(data).then(({ data }) => {
    newImgName.value = ''
    isTrue.value = true
    changeNameVisible.value = false
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration: 1500
    })
    loadListImage()
  }).catch(({ e }) => {
    isTrue.value = true
  })
}
/**
 * 全选
 */
const AllImgs = () => {
  if (!checkedAll.value) {
    imgRes.value.forEach(img => {
      img.selected = false
    })
    images = []
    fileIds = []
  } else {
    imgRes.value.forEach(img => {
      images.value.push(JSON.parse(JSON.stringify(img)))
      fileIds.value.push(img.fileId)
      img.selected = true
    })
  }
}
// 保存图片全选状态
const isExist = (img) => {
  for (let i = 0; i < images.length; i++) {
    if (img.fileId === images[i].fileId) {
      return true
    }
  }
  return false
}
/**
 * 批量移动分组
 */
const imgDataFormRef = ref(null)
const showMoveImgs = () => {
  if (images.length === 0 || fileIds.length === 0) {
    return message('请选择图片')
  }
  changeNameVisible1.value = true
  groupForm = {
    attachFileGroupId: '', // 选择分组的值
    name: '' // 分组名称
  }
}
const MoveImgs = () => {
  batchMoveImgs(groupForm.attachFileGroupId, fileIds.value).then(() => {
    images.value = []
    fileIds.value = []
    changeNameVisible1.value = false
    ElMessage.success($t('table.actionSuccess'))
    searchImg()
  })
}
/**
 * 批量删除图片
 */
const delectImgs = () => {
  if (images.length === 0 || fileIds.length === 0) {
    return message('请选择图片')
  }
  ElMessageBox.confirm('确定要删除图片吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    batchDeleteImgs(fileIds.value).then(() => {
      images.value = []
      fileIds.value = []
      ElMessage({
        message: '批量删除成功',
        type: 'success',
        duration: 1500
      })
      searchImg()
    })
  })
}

/**
 * 删除图片
 */
const delectImg = (fileName, fileId) => {
  ElMessageBox.confirm('确定要删除图片“' + fileName + '”吗？', $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    const data = {
      fileId
    }
    deleteFile(data).then(() => {
      images = []
      ElMessage({
        message: '删除成功',
        type: 'success',
        duration: 1500
      })
      searchImg()
    })
  })
}

/**
 * 点击上传图片按钮
 */
const uploadFileBtn = () => {
  options.activeTab = 'upload'
  images = []
  fileIds = []
  disabled.value = false
  groupForm.attachFileGroupId = dataForm.attachFileGroupId || null
}

const instance = getCurrentInstance()
/**
 * 点击图片时选中或取消选中图片
 * @param img object
 */
const onClickListImage = (img) => {
  // 多选图片-如果已选中则取消选中
  const imgIndex = selectedImageIndex(img)
  if (img.selected) {
    // 取消图片已选状态
    img.selected = false
    images.splice(imgIndex, 1)
    fileIds.splice(imgIndex, 1)
    if (images.length !== imgRes.value.length) {
      checkedAll.value = false
    } else {
      checkedAll.value = true
    }
    instance.proxy.$forceUpdate()
    return
  }
  if (!type && images.length >= limit.value) {
    message($t('biz.imgbox.superiorLimit'))
    return false
  }

  images.value.push(JSON.parse(JSON.stringify(img)))
  fileIds.value.push(img.fileId)

  img.selected = true
  if (images.length !== imgRes.length) {
    checkedAll.value = false
  } else {
    checkedAll.value = true
  }
  instance.proxy.$forceUpdate()
}

/**
 * 按图片名称搜索图片
 */
const searchImg = (newData = false) => {
  pageQuery.current = 1
  loadListImage(newData)
}

/**
 * 图片已选则返回下标，未选则返回-1
 */
const selectedImageIndex = (img) => {
  for (let i = 0; i < images.length; i++) {
    const selectedImg = images[i]
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
  pageQuery.current = page
  fileIds = [] // 跳转分页时清空选中id
  loadListImage()
}

/**
 * 获取上传图片数据
 */
const onUploadConfirm = Debounce(() => {
  uploadSubmitFlag.value = true
  const time = setTimeout(() => {
    uploadSubmitFlag.value = false
    clearTimeout(time)
  }, 1000)
  // 重置文件索引位置和完成文件记录数
  fileIndex.value = 0
  completeCount.value = 0
  ossList.value = []
  attachFiles.value = []
  sizeFlag.value = 0
  if (fileNum.value === 0) {
    return ElMessage({
      message: $t('product.plePictureToUpload'),
      type: 'warning'
    })
  }
  ossInfo(fileNum.value).then(response => {
    if (resourcesActionType === '0') {
      dataForm.policy = response.policy
      dataForm.signature = response.signature
      dataForm.ossaccessKeyId = response.accessid
      dataForm.dir = response.dir
    }
    ossList = response.ossList
    notImg.value = true
    nextTick(() => {
      uploadRef.value?.submit()
    })
  })
}, 1500)

/**
 * 上传图片
 */
const httpRequest = (event) => {
  if (sizeFlag.value !== 0) {
    return
  }
  // 获取本次上传文件的位置
  const currentIndex = fileIndex.value++

  const file = event.file
  const typeArray = file.type.split('/')
  if (typeArray[1] === 'jpeg') {
    typeArray[1] = 'jpg'
  } else {
    typeArray[1] = ''
  }
  const attachFile = Object.assign({
    attachFileGroupId: file.attachFileGroupId,
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1
  })
  const uploadSuccess = () => {
    if (showPicUploadSuccessMessage.value) {
      showPicUploadSuccessMessage.value = false
      ElMessage({
        message: '上传成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          showPicUploadSuccessMessage.value = true
        }
      })
    }
  }

  if (ossList.length <= 0) {
    message('数据异常，请刷新后重试')
  }
  // aliOss 上传

  if (resourcesActionType === '0') {
    // 上传图片成功
    attachFile.filePath = '/' + dataForm.dir + ossList[currentIndex].fileName
    const formdata = new FormData()
    formdata.append('policy', dataForm.policy)
    formdata.append('signature', dataForm.signature)
    formdata.append('ossaccessKeyId', dataForm.ossaccessKeyId)
    formdata.append('dir', dataForm.dir)
    formdata.append('host', resourcesUrl)
    formdata.append('key', ossList[currentIndex].dir + ossList[currentIndex].fileName)
    formdata.append('file', file)
    aliImgUpdate(resourcesUrl, formdata).then(response => {
      console.log('上传文件成功data：', response)
      attachFiles.value.push(attachFile)
      completeCount.value++
      if (completeCount.value === ossList.length) {
        event.onSuccess()
      }
      uploadSuccess()
    }).catch(error => {
      console.log('上传文件失败error：', error)
      completeCount.value++
      message($t('biz.imgbox.uploadBefore') + (currentIndex + 1) + $t('biz.imgbox.uploadAfter'), true)
      if (completeCount.value === ossList.length) {
        event.onSuccess()
      }
    })
  } else if (resourcesActionType === '1') {
    attachFile.filePath = '/' + ossList[currentIndex].dir + ossList[currentIndex].fileName
    minIoImgUpdate(ossList[currentIndex].actionUrl, file).then(() => {
      attachFiles.value.push(attachFile)
      completeCount.value++
      if (completeCount.value === ossList.length) {
        event.onSuccess()
      }
      uploadSuccess()
    }).catch(error => {
      console.log(error)
      message($t('biz.imgbox.uploadBefore') + (currentIndex + 1) + $t('biz.imgbox.uploadAfter'), true)
      completeCount.value++
      if (completeCount.value === ossList.length) {
        event.onSuccess()
      }
    })
  }
}
// 图片预上传
const onUploadChange = (file, fileList) => {
  if (fileList.length >= 20) {
    hideUploadEdit.value = true
  }
  fileNum.value = fileList.length
}
const onRemove = (file, fileList) => {
  fileNum.value = fileList
  const time = setTimeout(() => {
    hideUploadEdit.value = false
    clearTimeout(time)
  }, 1000)
  if (uploadSubmitFlag.value) {
    uploadDisabled.value = false
  } else {
    uploadDisabled.value = true
    const time1 = setTimeout(() => {
      uploadDisabled.value = false
      clearTimeout(time1)
    }, 1000)
  }
}
const beforeRemove = (file, fileList) => {
  // 防止用户频繁点击导致删除过多
  return !uploadDisabled.value
}
/**
 * 上传图片前检查合法性
 * @param file
 * @returns {boolean}
 */
const beforeUpload = async (file) => {
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isSize = file.size / (1024 * 1024) < 2
  if (!isImage) {
    if (sizeFlag === 0) {
      message($t('biz.imgbox.onlyPictures'), true)
      sizeFlag += 1
    }
    notImg.value = false
    return Promise().reject()
  }
  if (!isSize) {
    try {
      const resultBlob = await imageCompression(file, {
        maxSizeMB: 2 // 压缩大小
      })
      const fs = new File([resultBlob], file.name, {
        type: file.type
      })
      return fs
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

  return options.limit - images.length
}

const uploadTypeTip = () => {
  return $t('biz.imgbox.onlySupported') + ' jpg/png/gif ' + $t('biz.imgbox.pic')
}

const uploadSizeTip = () => {
  return $t('biz.imgbox.notExceed') + '2M'
}

const uploadTips = () => {
  const tips = [uploadTypeTip(), uploadSizeTip()]
  if (!options.multiple) {
    return tips.join('，')
  }

  if (fileNum.value > 0) {
    tips.push($t('biz.imgbox.alreadyExist') + fileNum.value + $t('biz.imgbox.unit'))
  }
  if (fileNum.value > 0) {
    tips.push($t('biz.imgbox.soonUpload') + fileNum.value + $t('biz.imgbox.unit'))
  }

  tips.push($t('biz.imgbox.remainder') + (options.limit - fileNum.value) + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))

  return tips.join('，')
}

/**
 * 上传错误处理
 * @param err
 * @param file
 * @param fileList
 */
const onUploadError = (err, file, fileList) => {
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
const onUploadSuccess = (response, file, fileList) => {
  const filesNames = []
  fileList.forEach(file => {
    filesNames.push(file.name)
  })
  const uploadFile = []
  attachFiles.value.forEach(file => {
    if (filesNames.indexOf(file.fileName) !== -1) {
      file.sysType = 3
      file.attachFileGroupId = groupForm.attachFileGroupId
      uploadFile.push(file)
    }
  })
  if (uploadFile.length > 0) {
    save(uploadFile).then(response => {
      attachFiles = []
      options.activeTab = 'pick'
      dataForm.attachFileGroupId = 0
      loadListImage()
    })
  }
  disabled.value = true
  if (uploadRef) {
    uploadRef.value?.clearFiles()
  }
  pageQuery.current = 1
  groupForm.name = ''
  groupForm.attachFileGroupId = ''
  selectGroupName.value = ''
  setTimeout(() => {
    hideUploadEdit.value = false
  }, 1000)
}

/**
 * 选择上传文件超过限制文件个数提示
 */
const onUploadExceedTip = () => {
  message($t('biz.imgbox.maxSelect') + uploadNumberLimit() + $t('biz.imgbox.unit') + $t('biz.imgbox.upload'))
  hideUploadEdit.value = false
}
const message = (msg, isInfo) => {
  console.log('message')
  let type = 'error'
  if (isInfo) {
    type = 'info'
  }
  ElMessage({
    message: msg,
    type,
    duration: 1500
  })
}
</script>

<style lang="scss" scoped>
.upload-block {
  .el-upload-list__item {
    text-align: center;
    line-height: 85px!important;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    display: inline-block;
    width: auto;
    max-width: 88px;
    height: auto;
    max-height: 88px;
    vertical-align: middle;
  }
}

.el-badge {
  vertical-align: bottom;
}

.group-box {
  .el-dialog {
    width: 820px;

    .el-dialog__header {
      border-bottom: 1px solid #e8e8e8;
    }
  }
}

.pricture-store {
  .elx-images {
    .el-upload-list__item,
    .el-upload--picture-card {
      width: 78px;
      height: 78px;
      line-height: 82px;
      border-radius: 5px;
    }
  }
  .changebox {
    .el-form-item {
      margin-bottom: 15px;
    }
    .changebox-img {
      width: auto;
      max-width: 350px;
      height: 80px;
    }
    .old-name {
      display: inline-block;
      line-height: 1.5em;
      word-break: break-word;
    }
  }
}

.pricture-store {
  $bg: #f6f6f6;
  // top: 100px;

  .elx-foot {
    padding: 15px 0 0 10px;
    .el-button {
      margin: 0 0 0 10px;
    }
  }

  .file-group {
    padding: 20px 20px;
    .upload-btn {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      padding: 0 10px;
      margin-bottom: 15px;
    }
    .img-group-box {
      display: flex;
      // 左侧栏
      .left-sidebar {
        display: block;
        height: 620px;
        font-size: 13px;
        color: #666;
        .group-list {
          height: 100%;
          border-right: 1px solid #f2f3f5;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 10px;
          .group-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 190px;
            padding: 0 10px;
            height: 38px;
            line-height: 38px;
            text-align: left;
            box-sizing: border-box;
            .group-name {
              margin-right: 6px;
              min-width: 100px;
              max-width: 118px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
            }
            .sidebar-operate {
              // display: none;
              .el-icon-delete,
              .el-icon-edit {
                margin-left: 10px;
                cursor: pointer;
              }
            }
          }
          .group-item:hover,
          .group-item.active {
            background: #f2f3f5;
            // .sidebar-operate {
            //   display: block;
            // }
          }
        }
      }
      // 图片列表
      .pick-block {
        position: relative;
        width: 800px;
        height: 620px;
        .elx-img-list-loading {
          position: absolute;
          // top: 60px;
          left: 0;
          right: 0;
          z-index: 9;
          width: 100%;
          height: 520px;
          // 加载层高度
          background: #fff;
          text-align: center;

          .el-icon-loading {
            font-size: 50px;
            color: #409eff;
            line-height: 460px;
          }
        }

        .elx-img-list {
          padding: 10px;
          // 图片列表高度
          height: 570px;
          width: 800px;
          .img-item {
            $imgSize: 100px;
            $imgMiniSize: 98px;
            $size: 104px;
            float: left;
            margin: 10px;
            width: $imgSize;
            cursor: pointer;
            position: relative;
            font-size: 12px;
            .thumb-wp {
              width: $imgSize;
              height: $imgSize;
              line-height: 97px;
              display: block;
              border: 1px solid #f6f6f6;
              text-align: center;
              box-sizing: border-box;
            }
            img {
              display: inline-block;
              width: auto;
              max-width: $imgMiniSize;
              height: auto;
              max-height: $imgMiniSize;
              vertical-align: middle;
            }
            .title {
              line-height: 24px;
              height: 24px;
              display: block;
              background: $bg;
              padding: 0 5px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .operate {
              line-height: 24px;
              height: 24px;
              display: block;
              overflow: hidden;
              // background: $bg;
              margin-top: 2px;
              padding: 0 5px;
              .edit {
                float: left;
                padding-left: 5px;
              }
              .del {
                float: right;
                padding-right: 5px;
              }
            }

            .label {
              position: absolute;
              z-index: 9;
              left: 0;
              bottom: 24px;
              width: 100%;
              height: 21px;
              line-height: 21px;
              text-align: center;
              color: #fff;

              &:after {
                content: " ";
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 21px;
                background: #000;
                opacity: 0.3;
                z-index: -1;
              }
            }

            .selected {
              position: absolute;
              right: -3px;
              top: -3px;
              width: $size;
              height: 130px;
              border: 3px solid #409eff;
              border-radius: 3px;
              text-align: right;
              .icon {
                background: #409eff;
                text-align: center;
                height: 24px;
                width: 24px;
                line-height: 24px;
                display: inline-block;
                font-size: 16px;
                color: #fff;
                border-radius: 0 0 0 3px;
                position: absolute;
                right: 0;
                top: 0;
              }
            }
          }

          &::after {
            content: " ";
            display: table;
            height: 0;
            clear: both;
            visibility: hidden;
          }

          .empty {
            display: block;
            width: 100%;
            margin-top: 150px;
            color: #bbb;
            text-align: center;
          }
        }

        .el-pagination {
          background: #f9f9f9;
          position: relative;
          padding: 5px;
          margin: 10px 24px 0 20px;
          text-align: right;
          float: none;

          * {
            background: none;
          }
        }
      }
    }
  }
  .batch {
    margin-left: 10px;
    background: #F7F7F7;
    height: 40px;
    width: 100%;
    line-height: 40px;
    .text {
      color: #606266;
      font-size: 14px;
      margin-left: 7px;
      cursor:pointer;
    }
  }
  .upload-block {
    .upload-img-preview {
      padding: 20px;

      /* 上传图片预览改为使用背景图片按比例缩放方式 */
      .el-upload--picture-card,
      .el-upload-list--picture-card .el-upload-list__item,
      .el-upload-list--picture-card .el-upload-list__item .wp {
        width: 90px;
        height: 90px;
        line-height: 98px;
        background-size: cover;
        background-position: 50% 50%;
      }

      .el-upload-list--picture-card .el-upload-list__item-status-label i {
        margin-top: 12px;
        vertical-align: top;
      }
    }

    .upload-tip {
      padding: 0 20px;
      font-size: 13px;
      color: #999;
    }

    .upload-title {
      font-size: 16px;
      color: #666;
      padding: 20px 0 0 20px;
    }

    .file-gropu-btn {
      font-size: 14px;
      padding: 0 20px;
      margin-bottom: 10px;
      .sel-group-name {
        margin-right: 15px;
      }
    }
  }
}

.form {
  // padding: 15px 0px 0px 20px;
  margin-left: 50px;
  .el-form-item {
    margin-bottom: 0;
  }
}

.el-upload-list__item-actions {
  a {
    i {
      color: #fff;
    }
  }
}

.hide .el-upload--picture-card{
  display: none;
}

// .hide ::v-deep .upload-block .el-upload-list__item{
//   width: 200px;
// }
.el-message-box__message p {
  word-break: break-word;
}
</style>
