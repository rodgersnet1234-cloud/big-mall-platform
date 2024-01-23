<template>
  <div class="components-distribution-recruit-set gray-box top-redius border-bottom-gray">
    <div class="title">
      {{ '招募推广' }}
    </div>
    <el-form
      ref="dataFormRef"
      :label-width="language === 'en' ? '160px' : '100px'"
      class="set-form"
      label-position="right"
      :rules="dataRule"
      :model="dataForm"
      @submit.prevent
    >
      <el-form-item
        label="推广开关 :"
        prop="state"
      >
        <el-radio-group v-model="dataForm.state">
          <el-radio :label="0">
            {{ '关' }}
          </el-radio>
          <el-radio :label="1">
            {{ '开' }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="封面图片 :">
        <div class="cover-photo">
          <img-upload v-model="dataForm.pic" />
          <div
            v-if="dataForm.pic"
            class="del-btn"
            @click="deletePic"
          >
            删除
          </div>
        </div>
      </el-form-item>

      <el-form-item
        label="推广标题 :"
        prop="title"
      >
        <el-input
          v-model="dataForm.title"
          style="width: 180px"
          maxlength="60"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="推广内容 :"
        prop="content"
      >
        <tiny-mce
          ref="tinyMceRef"
          :key="tinymceFlag"
          v-model="dataForm.content"
          style="max-width: 900px"
        />
      </el-form-item>
    </el-form>
    <el-button
      @click="onSubmit()"
    >
      {{
        $t("table.save")
      }}
    </el-button>
  </div>
</template>

<script setup>
import ImgUpload from '@/components/img-upload/index.vue'
import TinyMce from '@/components/tiny-mce/index.vue'
import { isHtmlNull } from '@/utils/validate.js'
import { ElMessage } from 'element-plus'
import * as api from '@/api/distribution/set/distribution-config.js'

// eslint-disable-next-line no-unused-vars
const validateTittle = (rule, value, callback) => {
  if (!value.trim()) {
    callback(new Error('标题不能为空'))
  } else {
    callback()
  }
}

// eslint-disable-next-line no-unused-vars
const validateContent = (rule, value, callback) => {
  if (isHtmlNull(value)) {
    callback(new Error('内容不能全为空格'))
  } else {
    callback()
  }
}

const dataRule = {
  title: [
    { required: true, message: '请输入标题', trigger: 'brue' },
    { validator: validateTittle, trigger: 'blur' },
    { max: 255, message: '长度在 255 个字符内', trigger: 'brue' }
  ],
  content: [
    { required: true, message: '推广内容不能为空', trigger: 'brue' },
    { validator: validateContent, trigger: 'change' }
  ]
}

const language = localStorage.getItem('cloudLanguage') || 'zh'
const tinymceFlag = ref(new Date() + 1)
const dataFormRef = ref(null)
const dataForm = reactive({
  state: 0,
  pic: '',
  title: '',
  content: ''
})

const tinyMceRef = ref(null)
onMounted(() => {
  getData()
})

// keep-alive缓存的缘故 需调用钩子函数 设置key值不然编辑器无法使用
onActivated(() => {
  tinymceFlag.value = new Date() + 1
})

// 获取数据
const getData = () => {
  api.recruitInfo().then(data => {
    if (data) {
      setDate(data)
    }
  })
}

// 设置数据
const setDate = (data) => {
  dataForm.pic = data.pic
  dataForm.state = data.state
  dataForm.title = data.title
  dataForm.content = data.content
}

// 删除封面图片
const deletePic = () => {
  dataForm.pic = ''
}

// 提交表单
const onSubmit = () => {
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      api.saveRecruit(dataForm).then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
      })
    }
  })
}
</script>
<style lang="scss" scoped>
.components-distribution-recruit-set {
  .cover-photo {
    display: flex;
    align-items: flex-end;
    :deep(.single-image-upload) {
      height: 120px;
    }
    .del-btn {
      margin-left: 5px;
      color: #155bd4;
      cursor: pointer;
    }
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    display: inline-block;
    vertical-align: middle;
    padding-right: 20px;
  }

  .set-form {
    margin: 20px;
  }

  // element
  :deep(el-checkbox__label,
  .el-radio__label){
    padding-left: 5px;
    font-size: 13px;
  }
  :deep(.el-checkbox__inner,
  .el-radio__inner) {
    border: 2px solid #b2aebc;
  }
  :deep(.el-checkbox__inner::after) {
    left: 3px;
    top: 0;
  }
  :deep(.el-input__inner) {
    border-radius: 0;
  }
}
.gray-box {
  background: #f2f2f6;
  padding: 20px 35px;
  height: 100%;
}
.border-bottom-gray {
  border-bottom: 1px solid #dddce2;
}
.top-redius {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
</style>
