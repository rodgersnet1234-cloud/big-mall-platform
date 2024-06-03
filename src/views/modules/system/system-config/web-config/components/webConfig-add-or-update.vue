<template>
  <el-form
    ref="dataFormRef"
    class="page-webConfig-add-or-update"
    :model="dataForm"
    label-position="right"
    :rules="dataRule"
    label-width="142px"
    @submit.prevent
    @keyup.enter="onSubmit()"
  >
    <!--后台相关配置-->
    <span v-if="dataForm.configType === 1 || dataForm.configType === 2 || dataForm.configType === 6">
      <!-- 登录背景 -->
      <!-- 平台 -->
      <el-form-item
        v-if="dataForm.configType === 1"
        :label="$t('rbac.webConfig.loginBg')"
        prop="loginBgImg"
      >
        <img-upload
          v-model="dataForm.loginBgImg"
          :size="'380*560'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}380*560</span>
      </el-form-item>
      <!-- 商家 -->
      <el-form-item
        v-if="(dataForm.configType === 2)"
        :label="$t('rbac.webConfig.loginBg')"
        prop="loginBgImg"
      >
        <img-upload
          v-model="dataForm.loginBgImg"
          :size="'560*560'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}560*560</span>
      </el-form-item>
      <!-- 供应商 -->
      <el-form-item
        v-if="(dataForm.configType === 6)"
        :label="$t('rbac.webConfig.loginBg')"
        prop="loginBgImg"
      >
        <img-upload
          v-model="dataForm.loginBgImg"
          :size="'626*594'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}626*594</span>
      </el-form-item>
      <!-- /登录背景 -->

      <el-form-item
        :label="$t('rbac.webConfig.bsCopyright')+'-'+$t('rbac.webConfig.chinese')"
        prop="copyrightCn"
      >
        <el-input
          v-model="dataForm.copyrightCn"
          maxlength="150"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="$t('rbac.webConfig.bsTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
          maxlength="20"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcTitleImg')"
        prop="titleImg"
      >
        <img-upload
          v-model="dataForm.titleImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.TopIcon')"
        prop="bsTopBarIcon"
      >
        <img-upload
          v-model="dataForm.bsTopBarIcon"
          :size="'160*48'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}160*48</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.bsMenuTitleOpen')+'-'+$t('rbac.webConfig.chinese')"
        prop="bsMenuTitleOpenCn"
      >
        <el-input
          v-model="dataForm.bsMenuTitleOpenCn"
          maxlength="16"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.bsMenuTitleClose')+'-'+$t('rbac.webConfig.chinese')"
        prop="bsMenuTitleCloseCn"
      >
        <el-input
          v-model="dataForm.bsMenuTitleCloseCn"
          maxlength="16"
          show-word-limit
        />
      </el-form-item>

    </span>

    <!--PC端相关配置-->
    <span v-if="dataForm.configType === 3">

      <el-form-item
        label="Logo"
        prop="loginLogoImg"
      >
        <img-upload
          v-model="dataForm.loginLogoImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.loginBg')"
        prop="loginBgImg"
      >
        <img-upload
          v-model="dataForm.loginBgImg"
          :size="'1920*600'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}1920*600</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.bsCopyright')+'-'+$t('rbac.webConfig.chinese')"
        prop="copyrightCn"
      >
        <el-input
          v-model="dataForm.copyrightCn"
          maxlength="150"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcQrcodeImg')"
        prop="pcQrcodeImg"
      >
        <img-upload
          v-model="dataForm.pcQrcodeImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcCompanyName')+'-'+$t('rbac.webConfig.chinese')"
        prop="pcCompanyNameCn"
      >
        <el-input
          v-model="dataForm.pcCompanyNameCn"
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcCompanyInfo')+'-'+$t('rbac.webConfig.chinese')"
        prop="pcCompanyInfoCn"
      >
        <el-input
          v-model="dataForm.pcCompanyInfoCn"
          type="textarea"
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
        />
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcTitleImg')"
        prop="titleImg"
      >
        <img-upload
          v-model="dataForm.titleImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>
      <el-form-item
        :label="$t('rbac.webConfig.pcLogoImgText')"
        prop="pcLogoImgText"
      >
        <img-upload
          v-model="dataForm.pcLogoImgText"
          :size="'380*96'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}380*96</span>
      </el-form-item>

      <el-form-item
        :label="$t('rbac.webConfig.pcWelcome')+'-'+$t('rbac.webConfig.chinese')"
        prop="pcWelcomeCn"
      >
        <el-input
          v-model="dataForm.pcWelcomeCn"
        />
      </el-form-item>

    </span>

    <!--H5端相关配置-->
    <span v-if="dataForm.configType === 4">
      <el-form-item
        :label="$t('rbac.webConfig.loginLogo')"
        prop="loginLogoImg"
      >
        <img-upload
          v-model="dataForm.loginLogoImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>
      <el-form-item
        :label="$t('rbac.webConfig.uniTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
        />
      </el-form-item>
      <el-form-item
        :label="$t('rbac.webConfig.h5Welcome')+'-'+$t('rbac.webConfig.chinese')"
        prop="h5WelcomeCn"
      >
        <el-input
          v-model="dataForm.h5WelcomeCn"
        />
      </el-form-item>
    </span>

    <!--自提点端相关配置-->
    <span v-if="dataForm.configType === 5">
      <el-form-item
        :label="$t('rbac.webConfig.loginLogo')"
        prop="stationLoginLogoImg"
      >
        <img-upload
          v-model="dataForm.stationLoginLogoImg"
          :size="'100*100'"
        />
        <span class="img-tip">{{ $t('admin.recommImgSize') }}100*100</span>
      </el-form-item>
      <el-form-item
        :label="$t('rbac.webConfig.uniTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
        />
      </el-form-item>
    </span>
    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit()"
      >
        {{ $t('rbac.webConfig.save') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import * as apis from '@/api/platform/sys-config'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  id: null,
  configType: null, // 配置类型（1:平台端 2:商家端 3:PC端 4:h5端 5:自提点端 6:供应商端）
  isActivity: 0,
  loginLogoImg: null,
  loginBgImg: null,
  copyrightCn: null,
  copyrightEn: null,
  titleContentCn: null,
  titleContentEn: null,
  titleImg: null,
  bsTopBarIcon: null,
  bsMenuTitleOpenCn: null,
  bsMenuTitleOpenEn: null,
  bsMenuTitleCloseCn: null,
  bsMenuTitleCloseEn: null,
  pcQrcodeImg: null,
  pcCompanyNameCn: null,
  pcCompanyNameEn: null,
  pcCompanyInfoCn: null,
  pcCompanyInfoEn: null,
  pcCompanyNameShortCn: null,
  pcCompanyNameShortEn: null,
  pcLogoImgText: null,
  pcWelcomeCn: null,
  pcWelcomeEn: null,
  stationLoginLogoImg: null
})
const dataRule = reactive({})
const props = defineProps({
  configType: {
    type: Number,
    default: 1
  }
})

const dataFormRef = ref(null)
onMounted(async () => {
  dataForm.value.configType = props.configType

  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (props.configType === 1) {
      // 平台端配置
      getFormData('PLATFROM_WEBSITE_CONFIG', 1)
    } else if (props.configType === 2) {
      // 商家端配置
      getFormData('MULTISHOP_WEBSITE_CONFIG', 2)
    } else if (props.configType === 6) {
      // 供应商端配置
      getFormData('SUPPLIER_WEBSITE_CONFIG', 6)
    } else if (props.configType === 3) {
      // pc端配置
      getFormData('PC_WEBSITE_CONFIG', 3)
    } else if (props.configType === 4) {
      // h5端配置
      getFormData('H5_WEBSITE_CONFIG', 4)
    } else if (props.configType === 5) {
      // h5端配置
      getFormData('STATION_WEBSITE_CONFIG', 5)
    }
  })
})

// 获取表单数据接口
const getFormData = (apiKey, configType) => {
  apis.getWebConfig(apiKey).then(data => {
    if (data) {
      dataForm.value = JSON.parse(data)
      dataForm.value.configType = configType
    }
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }

    // 平台端配置判断
    if (dataForm.value.configType === 1) {
      if (!dataForm.value.loginBgImg) {
        errorMsg($t('rbac.webConfig.loginBg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.copyrightCn) {
        errorMsg($t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleContentCn) {
        errorMsg($t('rbac.webConfig.bsTitleContent') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleImg) {
        errorMsg($t('rbac.webConfig.pcTitleImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      // TopIcon
      if (!dataForm.value.bsTopBarIcon) {
        errorMsg($t('rbac.webConfig.TopIcon') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.bsMenuTitleOpenCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleOpen') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.bsMenuTitleCloseCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleClose') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }
    // 后台配置判断
    if (dataForm.value.configType === 2) {
      if (!dataForm.value.loginBgImg) {
        errorMsg($t('rbac.webConfig.loginBg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.copyrightCn) {
        errorMsg($t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleContentCn) {
        errorMsg($t('rbac.webConfig.bsTitleContent') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleImg) {
        errorMsg($t('rbac.webConfig.pcTitleImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      // TopIcon
      if (!dataForm.value.bsTopBarIcon) {
        errorMsg($t('rbac.webConfig.TopIcon') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.bsMenuTitleOpenCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleOpen') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.bsMenuTitleCloseCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleClose') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }
    // pc端配置判断
    if (dataForm.value.configType === 3) {
      if (!dataForm.value.loginLogoImg) {
        errorMsg($t('rbac.webConfig.logo') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.loginBgImg) {
        errorMsg($t('rbac.webConfig.loginBg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.copyrightCn) {
        errorMsg($t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.pcQrcodeImg) {
        errorMsg($t('rbac.webConfig.pcQrcodeImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.pcCompanyNameCn) {
        errorMsg($t('rbac.webConfig.pcCompanyName') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.pcCompanyInfoCn) {
        errorMsg($t('rbac.webConfig.pcCompanyInfo') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleContentCn) {
        errorMsg($t('rbac.webConfig.pcTitleContent') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.titleImg) {
        errorMsg($t('rbac.webConfig.pcTitleImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.pcLogoImgText) {
        errorMsg($t('rbac.webConfig.pcLogoImgText') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.value.pcWelcomeCn) {
        errorMsg($t('rbac.webConfig.pcWelcome') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }
    // h5端配置判断
    if (dataForm.value.configType === 4) {
      if (!dataForm.value.loginLogoImg) {
        errorMsg($t('rbac.webConfig.loginLogo') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }

    // 自提点端配置判断
    if (dataForm.configType === 5) {
      if (!dataForm.value.stationLoginLogoImg) {
        errorMsg($t('rbac.webConfig.loginLogo') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }

    if (props.configType === 2) {
      // 商家端配置
      modifyFormData('MULTISHOP_WEBSITE_CONFIG')
    } else if (props.configType === 3) {
      // pc端配置
      modifyFormData('PC_WEBSITE_CONFIG')
    } else if (props.configType === 4) {
      // h5端配置
      modifyFormData('H5_WEBSITE_CONFIG')
    } else if (props.configType === 5) {
      // 门店端配置
      modifyFormData('STATION_WEBSITE_CONFIG')
    } else if (props.configType === 1) {
      modifyFormData('PLATFROM_WEBSITE_CONFIG')
    }
  })
}

// 修改更新接口
const modifyFormData = (apiKey) => {
  const newObj = Object.assign({}, dataForm.value)
  if (newObj.configType) delete newObj.configType
  if (newObj.id || newObj.id === null) delete newObj.id
  if (newObj.isactive || newObj.isactive === null) delete newObj.isactive

  apis.saveWebConfig({
    paramKey: apiKey,
    paramValue: JSON.stringify(newObj)
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      customClass: 'zZindex',
      onClose: () => {
        visible.value = false
        emit('refreshDataList')
      }
    })
    updateWebConfigData()
  })
}
const errorMsg = (message) => {
  ElMessage({
    message,
    type: 'error',
    duration: 1500,
    customClass: 'zZindex'
  })
}

// 更新网站配置信息
const updateWebConfigData = () => {
  if (dataForm.value.configType !== 1) {
    return
  }
  useWebConfigStore().getWebConfig()
}

</script>

<style lang="scss" scoped>
.page-webConfig-add-or-update{
  :deep(.el-form-item) {
    img {
      // 单独设置：网站配置图标按原比例缩放显示
      object-fit: scale-down !important;
    }
  }

  :deep(.el-form-item__content){
    display: block;

    .img-tip{
      position: static;
    }
  }
  .img-tip {
    font-weight: 400;
    position: absolute;
    font-size: 12px;
    line-height: 12px;
    bottom: 0;
    padding: 0;
    color: #3d3d3d;
  }

  ::v-deep(.single-image-upload) {
    height: 132px !important;
    margin-bottom: 20px;
  }

  ::v-deep(.el-form-item) {
    margin-bottom: 22px;
  }

  ::v-deep(.el-form-item__label) {
    text-align: right !important;
  }

  ::v-deep(.el-input) {
    width: 60%;
  }

  ::v-deep(.el-textarea) {
    width: 60%;
  }

  ::v-deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
}
</style>
