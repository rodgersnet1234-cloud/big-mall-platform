<template>
  <div class="component-site-navbar">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      active-text-color="{ 'border': 'none' }"
    >
      <el-menu-item index="0">
        <img
          v-if="configuration.bsTopBarIcon"
          style="height: 18px;width:59px;margin-right: 10px;"
          :src="configuration.bsTopBarIcon"
          alt
        >
        <a
          class="site-navbar__brand-lg"
          style="text-transform:none;"
          href="javascript:"
        >{{ configuration.bsMenuTitleOpenCn }}</a>
        <a
          v-if="!configuration.bsTopBarIcon"
          class="site-navbar__brand-mini"
          style="text-transform:none;"
          href="javascript:"
          :style="fontCloseSize"
        >{{ configuration.bsMenuTitleCloseCn }}</a>
      </el-menu-item>
      <div class="flex-grow" />
      <el-menu-item>
        <div class="top-tip">
          提示：长按可拖拽组件
        </div>
      </el-menu-item>

      <el-menu-item
        class="site-navbar__avatar"
        index="1"
      >
        <div
          class="decorate-menu is-active"
          @click.stop="setMenu(1);handleClickComponent();visible=false"
        >
          {{ $t('pcdecorate.commonModal.component') }}
        </div>
      </el-menu-item>
      <el-divider direction="vertical" />
      <el-menu-item
        class="site-navbar__avatar"
        index="2"
      >
        <div
          class="decorate-menu is-active"
          @click.stop="setMenu(2);view();visible=false"
        >
          {{ $t('pcdecorate.decorateNavbar.preview') }}
        </div>
      </el-menu-item>
      <el-divider direction="vertical" />
      <el-menu-item
        v-show="isTemplate === '0'"
        class="site-navbar__avatar"
        index="3"
      >
        <div
          class="decorate-menu is-active"
          @click.stop="setMenu(3); viewDialog = true;visible=false"
        >
          {{ $t('pcdecorate.decorateNavbar.setTemplate') }}
        </div>
      </el-menu-item>
      <el-divider
        v-show="isTemplate === '0'"
        direction="vertical"
      />
      <el-menu-item
        class="site-navbar__avatar"
        index="4"
      >
        <div
          class="decorate-menu is-active"
          @click.stop="setMenu(4);handleSave();visible=false"
        >
          {{ $t('pcdecorate.decorateNavbar.saveBtn') }}
        </div>
      </el-menu-item>
    </el-menu>

    <!-- 模板设置 -->
    <el-dialog
      v-model="viewDialog"
      :title="$t('pcdecorate.decorateNavbar.templateInfo')"
      width="30%"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="100px"
        style="margin: 30px 30px 0 10px"
        @submit.prevent
      >
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateName') + ':'"
          prop="name"
          :label-width="labelWidth"
        >
          <el-input
            v-model="dataForm.name"
            maxlength="20"
            @keyup.enter="onSubmit()"
          />
        </el-form-item>
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateRemark') + ':'"
          prop="remark"
          :label-width="labelWidth"
        >
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            rows="5"
            :placeholder="$t('pcdecorate.decorateNavbar.templateTip')"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          :label="$t('pcdecorate.decorateNavbar.templateImg') + ':'"
          prop="imgUrl"
          :label-width="labelWidth"
        >
          <div class="img-upload">
            <img-upload v-model="dataForm.imgUrl" />
            <el-button
              v-if="dataForm.imgUrl"
              class="del-btn"
              link
              @click="delTagItemPic()"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            class="primary-btn default-btn"
            @click="viewDialog = false"
          >{{ $t("table.cancel") }}</el-button>
          <el-button
            class="primary-btn default-btn"
            type="primary"
            @click="onSubmit()"
          >{{ $t("table.confirm") }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import request from '@/utils/request'
import { formatConfigInfo } from '@/utils/website-config.js'

const props = defineProps({
  isTemplate: {
    type: String,
    default: '0'
  },
  dataFormL: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits([
  'view',
  'handleSaveTemplate',
  'handleClickComponent',
  'handleSave',
  'closeRight'
])

const fontCloseSize = reactive({
  fontSize: '18px'
})

const fontOpenSize = reactive({
  fontSize: '16px'
})
const visible = ref(false)

// eslint-disable-next-line no-unused-vars
const validateName = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error($t('pcdecorate.decorateNavbar.templateNameNotNull')))
  } else {
    callback()
  }
}
const dataRule = reactive({
  name: [
    { required: true, message: $t('pcdecorate.decorateNavbar.templateNameNotNull'), trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ]
})
const labelWidth = ref(localStorage.getItem('cloudLang') === 'en' ? '140px' : '100px')

const dataForm = ref({
  name: '',
  remark: '',
  imgUrl: ''
})
watch(() => props.dataFormL, (val) => {
  dataForm.value = val
})

onMounted(() => {
  updateWebConfigData()
})

const delTagItemPic = () => {
  dataForm.value.imgUrl = ''
}

// 预览
const view = () => {
  emit('view')
}

const dataFormRef = ref(null)
const viewDialog = ref(false)
// 模板保存
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    emit('handleSaveTemplate', dataForm.value)
    viewDialog.value = false
  })
}

let menuActive = 1
// 菜单选择
const setMenu = (index) => {
  if (index !== menuActive) {
    menuActive = index
  } else {
    menuActive = -1
  }
}

// 组件管理
const handleClickComponent = () => {
  emit('handleClickComponent')
}

// 保存
const handleSave = () => {
  if (props.isTemplate === '0') {
    emit('handleSave', 2)
  } else {
    viewDialog.value = true
  }
}

const configuration = ref({
  bsLoginLogoImg: null,
  bsLoginBgImg: null,
  bsCopyrightCn: null,
  bsCopyrightEn: null,
  bsTitleContentCn: null,
  bsTitleContentEn: null,
  bsTitleImg: null,
  bsMenuTitleOpenCn: null,
  bsMenuTitleOpenEn: null,
  bsMenuTitleCloseCn: null,
  bsMenuTitleCloseEn: null
})
// 更新网站配置信息
const updateWebConfigData = () => {
  request({
    url: '/mall4cloud_admin/ua/web_config/get_activity',
    params: {
      webConfigType: 'PLATFROM_WEBSITE_CONFIG'
    },
    method: 'get'
  }).then((data) => {
    data = formatConfigInfo(data)
    configuration.value = data
    if (data.bsMenuTitleOpenEn.length >= 17) {
      fontOpenSize.fontSize = '16px'
    } else if (data.bsMenuTitleOpenCn.length >= 10) {
      fontOpenSize.fontSize = '16px'
    }

    if (data.bsMenuTitleCloseEn.length >= 6) {
      fontCloseSize.fontSize = '18px'
    } else if (data.bsMenuTitleCloseCn.length >= 4) {
      fontCloseSize.fontSize = '18px'
    }
  })
}
</script>

<style lang="scss" scoped>
@use "index";
</style>
