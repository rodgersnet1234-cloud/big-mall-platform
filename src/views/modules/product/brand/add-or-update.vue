<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.brandId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    class="brand-add-upd"
    top="150px"
    width="900px"
    @close="closeDialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      style="width:800px;margin-left:50px;"
      @submit.prevent
    >
      <!-- 中文品牌名称 -->
      <el-form-item
        label="品牌名称"
        prop="nameZh"
      >
        <el-input
          v-model="dataForm.nameZh"
          placeholder="请输入品牌名称"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <!-- 英文品牌名称 -->
      <!-- <el-form-item :label="$t('form.nameEn')" prop="nameEn">
        <el-input v-model="dataForm.nameEn" placeholder="请输入品牌名称" maxlength="30" show-word-limit />
      </el-form-item> -->
      <!-- 中文品牌描述 -->
      <el-form-item
        label="品牌描述"
        prop="descZh"
      >
        <el-input
          v-model="dataForm.descZh"
          type="textarea"
          :rows="2"
          maxlength="50"
          show-word-limit
          placeholder="请输入品牌描述"
          @input="change($event)"
        />
      </el-form-item>
      <!-- 英文品牌描述 -->
      <!-- <el-form-item :label="$t('form.descEn')" prop="descEn">
        <el-input v-model="dataForm.descEn" type="textarea" :rows="2" maxlength="50" show-word-limit placeholder="请输入品牌描述" @input="change($event)" />
      </el-form-item> -->
      <!-- 品牌logo图片 -->
      <el-form-item
        :label="$t('product.brand.imgUrl')"
        prop="imgUrl"
      >
        <img-upload v-model:value="dataForm.imgUrl" />
      </el-form-item>
      <!-- 检索首字母 -->
      <el-form-item
        :label="$t('product.brand.firstLetter')"
        prop="firstLetter"
      >
        <el-input
          v-model="dataForm.firstLetter"
          placeholder="请输入首字母"
          maxlength="1"
          show-word-limit
        />
      </el-form-item>
      <!-- 选择分类 -->
      <el-form-item
        :label="$t('product.category.categoryParent')"
        prop="categoryIds"
        class="classify"
      >
        <category-group
          :selected-categories="selectedCategories"
          :multiple="true"
          show-word-limit
          @select-or-revise-category="selectOrReviseCategory"
          @delete-category-item-of-selected="deleteCategoryItemOfSelected"
        />
        <!-- <p v-show="classifyHint" @input="change($event)">请选择品牌分类</p> -->
      </el-form-item>
      <!-- 排序 -->
      <el-form-item
        :label="$t('product.brand.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :max="999997"
          :precision="0"
          :min="0"
        />
      </el-form-item>
      <!-- 置顶 -->
      <el-form-item
        :label="$t('product.brand.isTop')"
        prop="isTop"
      >
        <el-checkbox v-model="isTop">
          置顶
        </el-checkbox>
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
    <category-selector
      v-if="categorySelectorVisible"
      ref="categorySelectorRef"
      @get-category-selected="getCategorySelected"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/brand'
import ImgUpload from '@/components/img-upload/index.vue'
import categorySelector from '@/components/category-selector/index.vue'
import categoryGroup from '@/components/category-group/index.vue'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const isTop = ref(false)
const dataForm = reactive({
  brandId: 0,
  nameZh: null,
  nameEn: null,
  descZh: null,
  descEn: null,
  imgUrl: null,
  isTop: false,
  firstLetter: null,
  categoryIds: [], // 分类id列表
  seq: 0,
  selectedCategories: []
  // status: 1
})
const selectedCategories = ref([])
const categorySelectorVisible = ref(false) // 分类弹窗显隐
const validateFirstLetter = (rule, value, callback) => {
  const regexp = /^[A-Z]{1}$/
  if (!regexp.test(value)) {
    callback(new Error('请输入一位大写字母'))
  } else {
    callback()
  }
}
const rules = {
  nameZh: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  firstLetter: [
    { required: true, message: '请输入检索首字母', trigger: 'blur' },
    { validator: validateFirstLetter, trigger: 'blur' }
  ],
  imgUrl: [
    { required: true, message: '请选择品牌logo', trigger: 'blur' }
  ],
  categoryIds: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ]
}
const language = computed(() => {
  return useAppStore().language === 'zh' ? 1 : 2
})
const dataFormRef = ref(null)
watch(() => selectedCategories.value, (newQuestion, oldQuestion) => {
  dataForm.selectedCategories = newQuestion
  nextTick(() => {
    dataFormRef.value.validateField('selectedCategories')
  })
})

watch(() => dataForm.imgUrl, (newValue, oldValue) => {
  dataForm.imgUrl = newValue
  nextTick(() => {
    dataFormRef.value.validateField('imgUrl')
  })
})

const init = (brandId) => {
  dataForm.brandId = brandId || 0
  isTop.value = false
  visible.value = true
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (!dataForm.brandId) {
      return
    }
    api.get(brandId).then(data => {
      dataForm.brandId = data.brandId
      dataForm.nameZh = data.nameZh
      dataForm.nameEn = data.nameEn
      dataForm.descZh = data.descZh
      dataForm.descEn = data.descEn
      dataForm.imgUrl = data.imgUrl
      dataForm.isTop = data.isTop
      dataForm.firstLetter = data.firstLetter
      dataForm.categoryIds = data.categoryIds
      dataForm.seq = data.seq
      dataForm.selectedCategories = data.categories
      if (dataForm.isTop === 1) {
        isTop.value = true
      }
      data.brandLangList.forEach(brandLang => {
        if (brandLang.lang === 1) {
          dataForm.nameZh = brandLang.name
          dataForm.descZh = brandLang.desc
        } else if (brandLang.lang === 2) {
          dataForm.nameEn = brandLang.name
          dataForm.descEn = brandLang.desc
        }
      })
      categoryShow(data.categories) // 分类回显
    })
  })
}
const { proxy } = getCurrentInstance()
const change = (e) => {
  proxy.$forceUpdate()
}
/**
 * 分类回显
 */
const categoryShow = (categories) => {
  if (categories.length) {
    let categoryObj = {}
    const categoryIds = []
    categories.forEach((el, index) => {
      categoryIds.push(el.categoryId)
      categoryObj.firstCategoryName = el.categories[0].name
      categoryObj.secondCategoryName = el.categories[1].name
      categoryObj.threeCategoryName = el.name
      selectedCategories.value.push(categoryObj)
      categoryObj = {}
    })
    dataForm.categoryIds = categoryIds
  }
}

const categorySelectorRef = ref(null)
/**
 * 选择分类弹窗
 */
const selectOrReviseCategory = () => {
  categorySelectorVisible.value = true
  nextTick(() => {
    categorySelectorRef.value?.init() // 1代表从创建分类进入
  })
}

/**
 * 获取子组件返回数据
 */
const getCategorySelected = (selectedCategoryList, categoryId) => {
  categorySelectorVisible.value = false
  const categoryObj = {}
  categoryObj.firstCategoryName = selectedCategoryList[0].name
  categoryObj.secondCategoryName = selectedCategoryList[1].name
  categoryObj.threeCategoryName = selectedCategoryList[2].name
  // 去重
  if (selectedCategories.value.length) {
    dataForm.categoryIds.forEach((item, index) => {
      if (item === categoryId) {
        selectedCategories.value.splice(index, 1)
        dataForm.categoryIds.splice(index, 1)
      }
    })
  }
  if (!dataForm.categoryIds) {
    dataForm.categoryIds = []
  }
  console.log('categoryId', categoryId)
  dataForm.categoryIds.push(categoryId)
  selectedCategories.value.push(categoryObj)
  if (dataForm.selectedCategories) {
    dataForm.selectedCategories.push(categoryObj)
  } else {
    dataForm.selectedCategories = categoryObj
  }
}

// 删除选中的某一项分类
const deleteCategoryItemOfSelected = (index) => {
  selectedCategories.value.splice(index, 1)
  dataForm.categoryIds.splice(index, 1)
}

// 关闭dialog时
const closeDialog = () => {
  dataForm.brandId = 0
  dataForm.nameZh = null
  dataForm.nameEn = null
  dataForm.desc = null
  dataForm.imgUrl = null
  dataForm.firstLetter = null
  dataForm.categoryIds = []
  dataForm.seq = 0
  selectedCategories.value = []
  console.log(22)
}

// 表单提交
const onSubmit = Debounce(() => {
  dataForm.isTop = isTop ? 1 : 0
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    const brandLangList = []
    brandLangList.push({ lang: 1, name: dataForm.nameZh, desc: dataForm.descZh })
    brandLangList.push({ lang: 2, name: dataForm.nameEn, desc: dataForm.descEn })
    dataForm.brandLangList = brandLangList
    const request = dataForm.brandId ? api.update(dataForm) : api.save(dataForm)
    request.then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          emit('refreshDataList')
          dataFormRef.value.resetFields()
        }
      })
    })
  })
}, 1500)
defineExpose({ init })
</script>

<style lang="scss" scoped>
.brand-add-upd.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-add-upd {
  p {
    margin: 0;
  }
  .el-form-item.el-form-item--medium {
    .el-form-item--medium .el-form-item__label {
      text-align: right !important;
    }
  }

}

p{
  margin: 0;
}
</style>
<style scoped>
@media (max-width: 1440px) {
  .brand-add-upd ::v-deep(.el-dialog){
    margin-top: 160px !important;
  }
}
</style>
