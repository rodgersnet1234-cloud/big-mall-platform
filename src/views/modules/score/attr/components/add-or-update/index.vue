<template>
  <div class="attr-manage">
    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="dataForm.attrId? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="15vh"
      width="725px"
      @close="closeDialog"
    >
      <!-- native modifier has been removed, please confirm whether the function has been affected  -->
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="110px"
        style="min-width: 600px; width: 600px; margin-left:35px;"
        @submit.prevent
      >
        <!-- 中文规格名称 -->
        <el-form-item
          label="规格名称"
          prop="nameZh"
        >
          <el-input
            v-model="dataForm.nameZh"
            maxlength="10"
            show-word-limit
            placeholder="请输入规格名称"
            class="attr-name"
          />
        </el-form-item>
        <!-- 规格值 -->
        <el-form-item
          label="规格值"
          prop="attrValues"
        >
          <div class="attr-int">
            <el-input
              v-model="attrValue"
              clearable
              maxlength="20"
              show-word-limit
              placeholder="请输入要添加的规格值，20字以内"
            />
            <el-button
              icon="el-icon-plus"
              class="add-btn"
              @click="addAttrValue(attrValue)"
            >
              添加
            </el-button>
          </div>
          <div
            v-if="attrValError"
            class="attrVal-error"
          >
            规格值不能为空或空格！
          </div>
          <div
            v-if="attrValRepeatError"
            class="attrVal-error"
          >
            规格值不能重复！
          </div>
          <div
            v-if="dataForm.attrValues.length"
            class="attr-val"
          >
            <div class="attr-scr">
              <div class="lang-head">
                <div class="lang-int">
                  中文
                </div>
              </div>
              <div
                v-for="(attr,idx) in dataForm.attrValues"
                :key="attr.attrValueId"
                :class="['attr-val-item',attr.error?'error':'']"
              >
                <el-input
                  v-model="attr.valueZh"
                  class="attr-val-int"
                  maxlength="20"
                  show-word-limit
                  placeholder="请输入中文规格值"
                  @blur="checkIntValue(idx, 1)"
                />
                <el-button
                  link
                  class="txt-del-btn"
                  @click="deleteAttrCalue(idx)"
                >
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button
            type="primary"
            @click="onSubmit()"
          >
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as api from '@/api/product/attr.js'
import { Debounce } from '@/utils/debounce.js'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

// eslint-disable-next-line no-unused-vars
const validNoEmpty = (rule, value, callback) => {
  if (!value || !value.trim()) {
    callback(new Error('规格名称不能为空'))
  } else {
    callback()
  }
}
const rules = reactive({
  nameZh: [
    { required: true, message: '规格名称不能为空', trigger: 'blur' },
    { validator: validNoEmpty, trigger: 'blur' }
  ]
})

const attrValue = ref(null)
const attrValRepeatError = ref(false)
const attrValError = ref(false)
watch(() => attrValue.value, () => {
  if (attrValue.value) {
    attrValError.value = false
    attrValRepeatError.value = false
  }
})

const dataForm = ref({
  attrId: '',
  attrType: 0, // 规格类型 0:销售规格，1:基本规格
  attrValues: [], // 规格值列表
  categoryIds: [], // 分类id列表
  desc: '', // 规格描述
  attrLangList: [], // 规格多语言列表
  nameZh: '', // 中文规格名称
  nameEn: '', // 英文规格名称
  searchType: 1 // 作为搜索参数 0:不需要，1:需要
})
const visible = ref(false)
const dataFormRef = ref(null)
const init = (attrId) => {
  dataForm.value.attrId = attrId || 0
  visible.value = true
  attrValue.value = null
  attrValError.value = false
  attrValRepeatError.value = false
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.attrId) {
      dataForm.value.attrLangList = [{ name: null, desc: null, lang: 1 }, { name: null, desc: null, lang: 2 }]
      dataForm.value.attrValues = []
      return
    }
    api.get(attrId).then(data => {
      loadData(data)
    })
  })
}

/**
 * 处理回显的数据
 */
const loadData = (data) => {
  dataForm.value = data
  data.attrLangList.forEach(attrLang => {
    if (attrLang.lang === 1) {
      dataForm.value.nameZh = attrLang.name
    }
    if (attrLang.lang === 2) {
      dataForm.value.nameEn = attrLang.name
    }
  })
  const attrValues = []
  data.attrValues.forEach(attrValuePar => {
    const newAttrValue = { attrValueId: attrValuePar.attrValueId, valueZh: null, valueEn: null }
    attrValuePar.values.forEach(value => {
      if (value.lang === 1) {
        newAttrValue.valueZh = value.value
      } else {
        newAttrValue.valueEn = value.value
      }
    })
    attrValues.push(newAttrValue)
  })
  dataForm.value.attrValues = attrValues
}

// 关闭dialog时
const closeDialog = () => {
  dataFormRef.value?.resetFields()
  visible.value = false
  dataForm.value = {
    attrId: '',
    attrType: 0, // 规格类型 0:销售规格，1:基本规格
    attrValues: [], // 规格值列表
    categoryIds: [], // 分类id列表
    desc: '', // 规格描述
    attrLangList: [], // 规格多语言列表
    nameZh: '', // 中文规格名称
    nameEn: '', // 英文规格名称
    searchType: 1 // 作为搜索参数 0:不需要，1:需要
  }
}
/**
 * 添加规格值
 */
const addAttrValue = (attrVal) => {
  if (!attrVal || !attrVal.trim()) {
    attrValError.value = true
    attrValue.value = ''
    return
  }
  // 去重
  dataForm.value.attrValues.forEach((el, idx) => {
    if (el.valueZh === attrVal || el.valueEn === attrVal) {
      dataForm.value.attrValues.splice(idx, 1)
      attrValRepeatError.value = true
    }
  })

  if (dataForm.value.nameZh && dataForm.value.nameEn) {
    dataForm.value.attrValues.push({ attrValueId: null, attrId: null, valueZh: attrVal, valueEn: attrVal })
  } else if (dataForm.value.nameZh) {
    dataForm.value.attrValues.push({ attrValueId: null, attrId: null, valueZh: attrVal })
  } else if (dataForm.value.nameEn) {
    dataForm.value.attrValues.push({ attrValueId: null, attrId: null, valueEn: attrVal })
  } else {
    dataForm.value.attrValues.push({ attrValueId: null, attrId: null, valueZh: attrVal })
  }

  attrValue.value = ''
}

/**
 * 删除规格值
 */
const deleteAttrCalue = (idx) => {
  dataForm.value.attrValues.splice(idx, 1)
}

/**
 * 规格值输入框失焦时判断
 * idx：值发生变化的列索引
 * type: 1:中文 2：英文
 */
const checkIntValue = (idx, type) => {
  const attrValuePar = dataForm.value.attrValues[idx]
  const value = type === 1 ? attrValuePar.valueZh : attrValuePar.valueEn
  dataForm.value.attrValues.forEach((el, index) => {
    // 输入值已存在
    if (idx !== index) {
      if (type === 1 && (value && el.valueZh) && value === el.valueZh) {
        ElMessage({
          message: '规格值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValuePar.valueZh = ''
      }
      if (type === 2 && (value && el.valueEn) && value === el.valueEn) {
        ElMessage({
          message: '规格值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValuePar.valueEn = ''
      }
    }
  })
  dataForm.value.attrValues[idx] = attrValuePar
}

/**
 * 处理上传数据
 */
const loadAttrAndValueName = () => {
  dataForm.value.attrLangList.splice(0, dataForm.value.attrLangList.length)
  if (dataForm.value.nameZh) {
    dataForm.value.attrLangList.push({ name: dataForm.value.nameZh, lang: 1 })
  }
  if (dataForm.value.nameEn) {
    dataForm.value.attrLangList.push({ name: dataForm.value.nameEn, lang: 2 })
  }
  dataForm.value.attrValues.forEach(attrValue => {
    attrValue.values = []
    if (attrValue.valueZh) {
      attrValue.values.push({ value: attrValue.valueZh, lang: 1 })
    }
    if (attrValue.valueEn) {
      attrValue.values.push({ value: attrValue.valueEn, lang: 2 })
    }
  })
}

/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (!dataForm.value.attrValues.length) {
      ElMessage({
        message: '请至少创建一个规格值',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.value.attrValues.find(el => !el.valueZh)) {
      ElMessage({
        message: '规格值不能为空！',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.value.nameZh && dataForm.value.nameZh.indexOf(';') !== -1) {
      dataForm.value.nameZh = ''
      ElMessage({
        message: '请勿输入特殊字符',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.value.nameEn && dataForm.value.nameEn.indexOf(';') !== -1) {
      dataForm.value.nameEn = ''
      ElMessage({
        message: '请勿输入特殊字符',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.value.attrValues.some(item => (item.valueEn && item.valueEn.indexOf(';') !== -1) || (item.valueZh && item.valueZh.indexOf(';') !== -1))) {
      ElMessage({
        message: '请勿输入特殊字符',
        type: 'error',
        duration: 1500
      })
      return
    }
    loadAttrAndValueName()
    const request = dataForm.value.attrId ? api.update(dataForm.value) : api.save(dataForm.value)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    })
  })
}, 1500)

defineExpose({ init })

</script>

<style lang="scss" scoped>
@use "index";
</style>
