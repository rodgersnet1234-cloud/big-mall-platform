<template>
  <!-- native modifier has been removed, please confirm whether the function has been affected  -->
  <!-- native modifier has been removed, please confirm whether the function has been affected  -->
  <el-form
    ref="dataFormRef"
    :model="dataForm"
    label-position="right"
    :rules="dataRule"
    class="page-webConfig-add-or-update"
    label-width="142px"
    @submit.prevent
    @keyup.enter="onSubmit()"
  >
    <!--后台相关配置-->
    <span v-if=" dataForm.configType === 2">

      <!-- <el-form-item :label="$t('rbac.webConfig.loginLogo')" prop="loginLogoImg">
    <img-upload v-model="dataForm.loginLogoImg" :size="'380*96'" />
  </el-form-item> -->
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
        <div>
          <img-upload
            v-model="dataForm.loginBgImg"
            :size="'560*560'"
          />
          <span class="img-tip">{{ $t('admin.recommImgSize') }}560*560</span>

        </div>
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

      <!-- <el-form-item :label="$t('rbac.webConfig.bsCopyright')+'-'+$t('rbac.webConfig.english')" prop="copyrightEn">
  <el-input v-model="dataForm.copyrightEn" />
</el-form-item> -->

      <el-form-item
        :label="$t('rbac.webConfig.bsTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
          maxlength="15"
          show-word-limit
        />
      </el-form-item>

      <!-- <el-form-item :label="$t('rbac.webConfig.bsTitleContent')+'-'+$t('rbac.webConfig.english')" prop="titleContentEn">
  <el-input v-model="dataForm.titleContentEn" maxlength="20" show-word-limit />
</el-form-item> -->

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
          maxlength="15"
          show-word-limit
        />
      </el-form-item>

      <!-- <el-form-item :label="$t('rbac.webConfig.bsMenuTitleOpen')+'-'+$t('rbac.webConfig.english')" prop="bsMenuTitleOpenEn">
  <el-input v-model="dataForm.bsMenuTitleOpenEn" maxlength="20" show-word-limit />
</el-form-item> -->

      <el-form-item
        :label="$t('rbac.webConfig.bsMenuTitleClose')+'-'+$t('rbac.webConfig.chinese')"
        prop="bsMenuTitleCloseCn"
      >
        <el-input
          v-model="dataForm.bsMenuTitleCloseCn"
          maxlength="6"
          show-word-limit
        />
      </el-form-item>

      <!-- <el-form-item :label="$t('rbac.webConfig.bsMenuTitleClose')+'-'+$t('rbac.webConfig.english')" prop="bsMenuTitleCloseEn">
  <el-input v-model="dataForm.bsMenuTitleCloseEn" maxlength="6" show-word-limit />
</el-form-item> -->
    </span>
    <!--PC端相关配置-->
    <span v-if="dataForm.configType === 3">

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

      <!-- <el-form-item :label="$t('rbac.webConfig.bsCopyright')+'-'+$t('rbac.webConfig.english')" prop="copyrightEn">
        <el-input v-model="dataForm.copyrightEn" />
      </el-form-item> -->

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

      <!-- <el-form-item :label="$t('rbac.webConfig.pcCompanyName')+'-'+$t('rbac.webConfig.english')" prop="pcCompanyNameEn">
        <el-input v-model="dataForm.pcCompanyNameEn" />
      </el-form-item> -->

      <el-form-item
        :label="$t('rbac.webConfig.pcCompanyInfo')+'-'+$t('rbac.webConfig.chinese')"
        prop="pcCompanyInfoCn"
      >
        <el-input
          v-model="dataForm.pcCompanyInfoCn"
          type="textarea"
        />
      </el-form-item>

      <!-- <el-form-item :label="$t('rbac.webConfig.pcCompanyInfo')+'-'+$t('rbac.webConfig.english')" prop="pcCompanyInfoEn">
        <el-input v-model="dataForm.pcCompanyInfoEn" type="textarea" />
      </el-form-item> -->

      <el-form-item
        :label="$t('rbac.webConfig.pcTitleContent')+'-'+$t('rbac.webConfig.chinese')"
        prop="titleContentCn"
      >
        <el-input
          v-model="dataForm.titleContentCn"
        />
      </el-form-item>

      <!-- <el-form-item :label="$t('rbac.webConfig.pcTitleContent')+'-'+$t('rbac.webConfig.english')" prop="titleContentEn">
        <el-input v-model="dataForm.titleContentEn" />
      </el-form-item> -->

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

      <!-- <el-form-item :label="$t('rbac.webConfig.pcWelcome')+'-'+$t('rbac.webConfig.english')" prop="pcWelcomeEn">
        <el-input v-model="dataForm.pcWelcomeEn" />
      </el-form-item> -->
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
      <!-- <el-form-item :label="$t('rbac.webConfig.uniTitleContent')+'-'+$t('rbac.webConfig.english')" prop="titleContentEn">
        <el-input v-model="dataForm.titleContentEn" />
      </el-form-item> -->
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
    </span>

    <!-- <el-form-item :label="$t('rbac.webConfig.activationStatus')" prop="isActivity">
        <el-radio-group v-model="dataForm.isActivity">
          <el-radio :label="0">{{ $t('rbac.webConfig.close') }}</el-radio>
          <el-radio :label="1">{{ $t('rbac.webConfig.open') }}</el-radio>
        </el-radio-group>
      </el-form-item> -->

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit()"
      >
        {{ $t('rbac.webConfig.save') }}
      </el-button>
    </el-form-item>
  </el-form>

  <!-- </el-dialog> -->
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import * as api from '@/api/rbac/web-config'
import * as apis from '@/api/platform/sys-config'
import { formatConfigInfo } from '@/utils/website-config'
import { ElMessage } from 'element-plus'
import useStore from 'element-plus/es/components/table/src/store/index'

const emit = defineEmits(['refreshDataList'])

let dataForm = reactive({
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
    default: 2
  }
})
const dataFormRef = ref(null)
onMounted(() => {
  // dataForm.id = configId || 0
  dataForm.configType = props.configType

  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (props.configType === 2) {
      // 商家端配置
      getFormData('MULTISHOP_WEBSITE_CONFIG', 2)
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
      dataForm = JSON.parse(data)
      dataForm.configType = configType
    }
  })
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }

    // 后台配置判断
    if (dataForm.configType === 2) {
      if (!dataForm.loginBgImg) {
        errorMsg($t('rbac.webConfig.loginBg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.copyrightCn) {
        errorMsg($t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.titleContentCn) {
        errorMsg($t('rbac.webConfig.bsTitleContent') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.titleImg) {
        errorMsg($t('rbac.webConfig.pcTitleImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      // TopIcon
      if (!dataForm.bsTopBarIcon) {
        errorMsg($t('rbac.webConfig.TopIcon') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.bsMenuTitleOpenCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleOpen') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.bsMenuTitleCloseCn) {
        errorMsg($t('rbac.webConfig.bsMenuTitleClose') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }

    // pc端配置判断
    if (dataForm.configType === 3) {
      if (!dataForm.loginLogoImg) {
        errorMsg($t('rbac.webConfig.logo') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.loginBgImg) {
        errorMsg($t('rbac.webConfig.loginBg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.copyrightCn) {
        errorMsg($t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.pcQrcodeImg) {
        errorMsg($t('rbac.webConfig.pcQrcodeImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.pcCompanyNameCn) {
        errorMsg($t('rbac.webConfig.pcCompanyName') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.pcCompanyInfoCn) {
        errorMsg($t('rbac.webConfig.pcCompanyInfo') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.titleContentCn) {
        errorMsg($t('rbac.webConfig.pcTitleContent') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.titleImg) {
        errorMsg($t('rbac.webConfig.pcTitleImg') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.pcLogoImgText) {
        errorMsg($t('rbac.webConfig.pcLogoImgText') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
      if (!dataForm.pcWelcomeCn) {
        errorMsg($t('rbac.webConfig.pcWelcome') + '-' + $t('rbac.webConfig.chinese') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }
    // h5端配置判断
    if (dataForm.configType === 4) {
      if (!dataForm.loginLogoImg) {
        errorMsg($t('rbac.webConfig.loginLogo') + $t('rbac.webConfig.canNotBeEmpty'))
        return
      }
    }

    // 自提点端配置判断
    if (dataForm.configType === 5) {
      if (!dataForm.stationLoginLogoImg) {
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
    // h5端配置
      modifyFormData('STATION_WEBSITE_CONFIG')
    }
  })
}
// 修改更新接口
const modifyFormData = (apiKey) => {
  const newObj = Object.assign({}, dataForm)
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
  if (dataForm.configType !== 1) {
    return
  }
  api.getActivity('PLATFROM_WEBSITE_CONFIG').then(data => {
    data = formatConfigInfo(data)
    useStore.commit('webConfig/addData', data)
  })()
}

</script>

<style lang="scss" scoped>
.page-webConfig-add-or-update{
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
