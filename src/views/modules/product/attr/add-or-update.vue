<template>
  <div class="attr-manage">
    <el-dialog
      v-model="visible"
      :title="dataForm.attrId? $t('table.edit'): $t('table.create')"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="5vh"
      class="el-dialog-bodyt"
      @close="closeDialog"
    >
      <el-form
        ref="dataFormRef"
        :rules="rules"
        :model="dataForm"
        label-position="right"
        label-width="110px"
        style="min-width: 600px; margin-left:35px;"
        @submit.prevent
      >
        <!-- 中文属性名称 -->
        <el-form-item
          label="属性名称"
          prop="nameZh"
        >
          <div>
            <el-input
              v-model="dataForm.nameZh"
              maxlength="20"
              show-word-limit
              placeholder="请输入属性名称"
              class="attr-name"
            />
          </div>
        </el-form-item>
        <!-- 中文属性描述 -->
        <el-form-item
          label="属性描述"
          prop="descZh"
        >
          <el-input
            v-model="dataForm.descZh"
            type="textarea"
            :rows="2"
            maxlength="30"
            show-word-limit
            placeholder="请输入新增属性的相关描述，30字以内"
          />
        </el-form-item>
        <!-- 是否需要搜索 -->
        <el-form-item
          :label="$t('product.attr.searchType')"
          prop="searchType"
        >
          <el-radio
            v-model="dataForm.searchType"
            :label="0"
          >
            不需要
          </el-radio>
          <el-radio
            v-model="dataForm.searchType"
            :label="1"
          >
            <div style="display: flex;align-items: center;">
              需要
              <el-tooltip
                class="item"
                effect="light"
                placement="top"
              >
                <template #content>
                  <div>选择需要后，发布商品时该属性为必填</div>
                </template>
                <el-icon>
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </div>
          </el-radio>
        </el-form-item>
        <!-- 选择分类 -->
        <el-form-item>
          <template #label>
            <div><span class="required">*</span>{{ $t('product.category.categoryParent') }}</div>
          </template>
          <div class="overflow-scrolling">
            <category-group
              :selected-categories="selectedCategories"
              :multiple="true"
              @select-or-revise-category="selectOrReviseCategory()"
              @delete-category-item-of-selected="deleteCategoryItemOfSelected"
            />
          </div>
        </el-form-item>
        <!-- 属性值 -->
        <el-form-item prop="attrValues">
          <template #label>
            <div>
              <span
                v-if="dataForm.searchType"
                class="required"
              >*</span>{{ $t('product.attr.attrValue') }}
            </div>
          </template>
          <div class="attr-int">
            <el-input
              v-model="attrValue"
              class="int-con"
              clearable
              maxlength="20"
              show-word-limit
              placeholder="请输入要添加的属性值，20字以内"
            />
            <el-button
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
            属性值不能为空或空格！
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
                  placeholder="请输入中文属性值"
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
          <el-button
            @click="visible = false"
          >
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
    <category-selector
      v-if="categorySelectorVisible"
      ref="categorySelectorRef"
      @close-dialog="categorySelectorVisible=false"
      @get-category-selected="getCategorySelected"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/product/attr'
import { validNoEmptySpace } from '@/utils/validate'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  attrId: 0,
  attrType: 1, // 属性类型 0:销售属性，1:基本属性
  attrValues: [], // 属性值列表
  categoryIds: [], // 分类id列表
  attrLangList: [], // 属性多语言列表
  nameZh: '', // 中文属性名称
  nameEn: '', // 英文属性名称
  descZh: '', // 中文属性描述
  descEn: '', // 英文属性描述
  searchType: 1 // 作为搜索参数 0:不需要，1:需要
})
const validNameZh = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('请输入属性名称'))
  } else {
    callback()
  }
}

const rules = reactive({
  nameZh: [
    { required: true, message: '请输入属性名称', trigger: 'blur' },
    { validator: validNameZh, trigger: 'blur' }
  ]
})
const attrValue = ref(null)
const selectedCategories = ref([])
const categorySelectorVisible = ref(false) // 分类弹窗显隐

const attrValError = ref(false)

watch(() => attrValue.value, (data) => {
  if (data) {
    attrValError.value = false
  }
})

const dataFormRef = ref(null)
const init = (attrId) => {
  dataForm.value.attrId = attrId || 0
  visible.value = true
  attrValue.value = null
  attrValError.value = false
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.value.attrId) {
      dataForm.value.searchType = 1
      dataForm.value.attrType = 1
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
      dataForm.value.descZh = attrLang.desc
    }
    if (attrLang.lang === 2) {
      dataForm.value.nameEn = attrLang.name
      dataForm.value.descEn = attrLang.desc
    }
  })
  const attrValues = []
  data.attrValues.forEach((attrValue, index) => {
    const newAttrValue = { attrValueId: attrValue.attrValueId, valueZh: null, valueEn: null }
    attrValue.values.forEach(value => {
      if (value.lang === 1) {
        newAttrValue.valueZh = value.value
      } else {
        newAttrValue.valueEn = value.value
      }
    })
    attrValues.push(newAttrValue)
  })
  dataForm.value.attrValues = attrValues
  if (dataForm.value.attrType === 1) {
    categoryShow(dataForm.value.categories)
  }
  if (!dataForm.value.categoryIds) {
    dataForm.value.categoryIds = []
  }
}
/**
 * 分类回显
 */
const categoryShow = (categories) => {
  if (categories.length) {
    let categoryObj = {}
    const categoryIds = []
    categories.forEach(el => {
      categoryIds.push(el.categoryId)
      categoryObj.firstCategoryName = el.categories[0].name
      categoryObj.secondCategoryName = el.categories[1].name
      categoryObj.threeCategoryName = el.name
      selectedCategories.value.push(categoryObj)
      categoryObj = {}
    })
    dataForm.value.categoryIds = categoryIds
  }
}

// 关闭dialog时
const closeDialog = () => {
  dataForm.value = {
    attrId: 0,
    attrType: 0, // 属性类型 0:销售属性(无需绑定分类)，1:基本属性(必须绑定分类)
    attrValues: [], // 属性值列表
    categoryIds: [], // 分类id列表
    nameZh: '', // 中文属性名称
    nameEn: '', // 英文属性名称
    descZh: '', // 中文属性描述
    descEn: '', // 英文属性描述
    searchType: 1 // 作为搜索参数 0:不需要，1:需要
  }
  selectedCategories.value = []
}

const categorySelectorRef = ref(null)
/**
 * 选择分类弹窗
 */
const selectOrReviseCategory = () => {
  categorySelectorVisible.value = true
  nextTick(() => {
    categorySelectorRef.value?.init(0) // 1代表从创建分类进入
  })
}

/**
 * 获取子组件返回数据
 */
const getCategorySelected = (selectedCategoryList, categoryId) => {
  categorySelectorVisible.value = false
  const categoryObj = {
    firstCategoryName: selectedCategoryList[0].name,
    secondCategoryName: selectedCategoryList[1].name,
    threeCategoryName: selectedCategoryList[2].name
  }
  // 去重
  if (selectedCategories.value.length) {
    dataForm.value.categoryIds.forEach((item, index) => {
      if (item === categoryId) {
        selectedCategories.value.splice(index, 1)
        dataForm.value.categoryIds.splice(index, 1)
      }
    })
  }
  if (!dataForm.value.categoryIds) {
    dataForm.value.categoryIds = []
  }
  dataForm.value.categoryIds.push(categoryId)
  selectedCategories.value.push(categoryObj)
}

// 删除选中的某一项分类
const deleteCategoryItemOfSelected = (index) => {
  selectedCategories.value.splice(index, 1)
  dataForm.value.categoryIds.splice(index, 1)
}

/**
 * 添加属性值
 */
const addAttrValue = (attrVal) => {
  // if (!dataForm.value.nameZh && !dataForm.value.nameEn) {
  //   dataFormRef.value?.validate(valid => {
  //     if (!valid) {
  //
  //     }
  //   })
  // }
  if (!attrVal || !attrVal.trim()) {
    attrValError.value = true
    attrValue.value = ''
    return
  }
  const isRepeta = dataForm.value.attrValues.find((el) => {
    return el.valueZh === attrVal || el.valueEn === attrVal
  })
  if (isRepeta) {
    return ElMessage.warning('已存在相同属性值')
  }
  dataForm.value.attrValues.push({ attrValueId: null, attrId: null, valueZh: attrVal, valueEn: '' })
  attrValue.value = ''
}

/**
 * 删除属性值
 */
const deleteAttrCalue = (idx) => {
  dataForm.value.attrValues.splice(idx, 1)
}

/**
 * 失焦时属性值是否为空
 * @default id 值发生变化的列索引
 * @default type 1:中文 2：英文
 */
const checkIntValue = (idx, type) => {
  const attrValue = dataForm.value.attrValues[idx]
  const value = type === 1 ? attrValue.valueZh : attrValue.valueEn
  dataForm.value.attrValues.forEach((el, index) => {
    // 输入值已存在
    if (idx !== index) {
      if (type === 1 && (value && el.valueZh) && value === el.valueZh) {
        ElMessage({
          message: '属性值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValue.valueZh = ''
      }
      if (type === 2 && (value && el.valueEn) && value === el.valueEn) {
        ElMessage({
          message: '属性值已存在, 请重新输入',
          type: 'error',
          duration: 1000
        })
        attrValue.valueEn = ''
      }
    }
  })
  dataForm.value.attrValues[idx] = attrValue
}
/**
 * 处理上传数据
 */
const loadAttrAndValueName = () => {
  dataForm.value.attrLangList.splice(0, dataForm.value.attrLangList.length)
  if (dataForm.value.attrLangList) {
    dataForm.value.attrLangList.push({ name: dataForm.value.nameZh, desc: dataForm.value.descZh, lang: 1 })
  }
  if (dataForm.value.nameEn) {
    dataForm.value.attrLangList.push({ name: dataForm.value.nameEn, desc: dataForm.value.descEn, lang: 2 })
  }
  // dataForm.value.attrLangList = [
  //   { name: dataForm.value.nameZh, desc: dataForm.value.descZh, lang: 1 },
  //   { name: dataForm.value.nameEn, desc: dataForm.value.descEn, lang: 2 }
  // ]
  // 基本属性 && 非搜索类型 && 没有属性值
  if (dataForm.value.attrType === 1 && dataForm.value.searchType === 0 && !dataForm.value.attrValues.length) {
    dataForm.value.attrValues = []
    return true
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
  return true
}
/**
 * 表单提交
 */
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (dataForm.value.attrType === 1 && (!dataForm.value.categoryIds || !dataForm.value.categoryIds.length)) {
      ElMessage({
        message: '请至少选择一个分类',
        duration: 1500
      })
      return
    }
    if (dataForm.value.attrType === 1 && dataForm.value.searchType === 1 && !dataForm.value.attrValues.length) {
      ElMessage({
        message: '请至少创建一个属性值',
        duration: 1500
      })
      return
    }
    if (dataForm.value.attrValues.find(el => !el.valueZh)) {
      ElMessage({
        message: '中文属性值不能为空！',
        type: 'error',
        duration: 1500
      })
      return
    }

    if (!loadAttrAndValueName()) {
      return
    }
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
.attr-manage {
  .attr-int {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .add-btn {
      margin-left: 10px;
    }
  }

  .attr-val {
    background: #f8f8f8;
    margin-top: 20px;
    box-sizing: border-box;

    .attr-scr {
      height: 180px;
      overflow-y: auto;
      padding: 10px 20px;
    }

    .lang-head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-right: 50px;

      .lang-int {
        display: block;
        width: 48%;
        text-align: center;
      }

      .lang-int:not(:last-child) {
        margin-right: 10px;
      }
    }

    .attr-val-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .attr-val-int:not(:last-child) {
        margin-right: 10px;
      }
    }

    .attr-val-item:not(:last-child) {
      margin-bottom: 10px;
    }

    .attr-val-item .int-con {
      display: block;
      width: 100%;
    }

    .attr-val-item .txt-del-btn {
      margin-left: 15px;
    }
  }

  .attrVal-error {
    font-size: 12px;
    color: #ff4949;
  }

  // 上级分类列表溢出
  .overflow-scrolling {
    display: block;
    max-height: 200px;
    overflow: auto;
  }
}

.required {
  color: #ff4949;
  margin-right: 4px;
}
</style>
