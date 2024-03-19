<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.categoryId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    top="10vh"
    width="750px"
    @closed="closeDialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      class="category-form"
      @submit.prevent
    >
      <!-- 上级分类 -->
      <el-form-item
        v-if="(dataForm.level
          || (!dataForm.level && !dataForm.categoryId)) "
        :label="$t('product.category.categoryParent')"
      >
        <div>
          <category-group
            :selected-categories="selectedCategories"
            :show-category-select-btn="showCategorySelectBtn"
            :is-create-category="showCategorySelectBtn"
            :single="true"
            @select-or-revise-category="()=>{selectOrReviseCategory(selectedCategories)}"
            @delete-category-item-of-selected="deleteCategoryItemOfSelected"
          />
          <!-- 文字说明 -->
          <div class="tips-text-part">
            <p class="tips">
              {{ $t('product.category.categoryParentTip') }}
            </p>
          </div>
        </div>
      </el-form-item>
      <!-- 分类名称 -->
      <el-form-item
        label="分类名称"
        prop="nameZh"
      >
        <el-col>
          <el-input
            v-model="dataForm.nameZh"
            :placeholder="$t('product.category.enterCateName')"
            maxlength="30"
            show-word-limit
          />
        </el-col>
      </el-form-item>
      <!-- 分类图片 -->
      <el-form-item
        v-if="selectedCategories.length !== 1"
        :required="isRequiredImg || dataForm.level === 2"
        :label="$t('product.category.imgUrl')"
        prop="imgUrl"
      >
        <div>
          <img-upload
            v-model="dataForm.imgUrl"
            :show-delete="true"
            @input="onPropChage('imgUrl')"
          />
          <span>{{ $t('product.category.recommImgSize') }}{{ dataForm.parentId ? '75*75' : '255*100' }}</span>
        </div>
      </el-form-item>
      <!-- 分类扣率-->
      <el-form-item
        v-if="dataForm.level === 2"
        :label="$t('product.category.deductionRate')"
        prop="deductionRate"
      >
        <el-input-number
          v-model.number="dataForm.deductionRate"
          type="number"
          controls-position="right"
          :precision="2"
          :step="0.1"
          :min="0"
          :max="99.99"
        />
        %
      </el-form-item>
      <!-- 排序 -->
      <el-form-item
        :label="$t('product.category.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          controls-position="right"
          :precision="0"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="dataFormCancel"
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
      :has-three-category="false"
      @get-category-selected="getCategorySelected"
    />
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/category'
import ImgUpload from '@/components/img-upload/index.vue'
import categorySelector from '@/components/category-selector/index.vue'
import categoryGroup from '@/components/category-group/index.vue'
import { validNoEmptySpace } from '@/utils/validate'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  categoryId: 0,
  shopId: null,
  parentId: 0,
  name: null,
  desc: null,
  path: null,
  status: '1',
  icon: '',
  imgUrl: '',
  level: null,
  deductionRate: '',
  seq: 1,
  notChenkedIcon: '', // 分类图标（未选中状态）
  chenkedIcon: '' // 分类图标（选中状态）
})
const isRequiredImg = ref(false) // 图片分类一级不必填
const showCategorySelectBtn = ref(true)
const categorySelectorVisible = ref(false)
const selectedCategories = ref([])

const validNoEmptySpaceTemp = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error($t('product.category.nameNotEmpty')))
  } else {
    callback()
  }
}
const validNoEmptyImg = (rule, value, callback) => {
  if (selectedCategories.value.length > 0 && !value) {
    callback(new Error($t('product.category.imageNoNull')))
  } else {
    callback()
  }
}

const rules = {
  nameZh: [
    { required: true, message: $t('product.category.categoryNoNull'), trigger: 'blur' },
    { validator: validNoEmptySpaceTemp, trigger: 'blur' }
  ],
  imgUrl: [
    { validator: validNoEmptyImg, trigger: 'blur' }
  ],
  deductionRate: [
    { required: true, message: $t('product.category.deductionRateNoNull'), trigger: 'blur' }
  ],
  chenkedIcon: [
    { required: true, message: '请上传选中状态下的分类图标', trigger: 'blur' }
  ]
}

watch(() => selectedCategories.value, (list) => {
  isRequiredImg.value = !!list.length
})

const init = (categoryId, level) => {
  visible.value = true
  dataForm.value.categoryId = categoryId || 0
  nextTick(() => {
    if (!dataForm.value.categoryId) {
      return
    }
    if (categoryId) {
      showCategorySelectBtn.value = false
      dataForm.value.level = level
      api.get(categoryId).then(data => {
        dataForm.value = data
        data.categoryLangList.forEach(item => {
          if (item.lang === 1) {
            dataForm.value.nameZh = item.name
          } else if (item.lang === 2) {
            dataForm.value.nameEn = item.name
          }
        })
        data.categories?.forEach((item) => {
          selectedCategories.value.push({ name: item.name, dataList: item.dataList })
        })
      })
    }
  })
}

const categorySelectorRef = ref(null)
/**
 * 选择分类弹窗
 */
const selectOrReviseCategory = (selectedCategories) => {
  categorySelectorVisible.value = true
  nextTick(() => {
    categorySelectorRef.value.init(1, selectedCategories.value) // 1代表从创建分类进入
  })
}

/**
 * 获取子组件返回数据
 */
const getCategorySelected = (selectedCategoryList, parentId) => {
  if (selectedCategoryList && selectedCategoryList.length > 0) {
    dataForm.value.level = selectedCategoryList.length
  }
  categorySelectorVisible.value = false
  selectedCategories.value = selectedCategoryList
  dataForm.value.parentId = parentId
}

// 删除选中的某一项分类
const deleteCategoryItemOfSelected = () => {
  if (dataForm.value.level === 2) {
    dataForm.value.level = 0
  }
  selectedCategories.value.splice(0, selectedCategories.value.length)
  dataForm.value.parentId = 0
}

const dataFormRef = ref(null)
// 表单提交
const onSubmit = Debounce(function () {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    // 层级 0第一级
    dataForm.value.level = !selectedCategories.value.length ? 0 : selectedCategories.value.length
    // 深拷贝dataForm，使页面展示数据不受下面数据修改的影响
    const data = JSON.parse(JSON.stringify(dataForm.value))
    // 将两个状态的图标拼接起来，前为未选中状态，后为选中状态
    // dataForm.value.icon = [dataForm.value.notChenkedIcon, dataForm.value.chenkedIcon].join(',')
    if (data.level === 1) {
      data.imgUrl = ''
    }
    data.icon = ''
    data.notChenkedIcon = undefined
    data.chenkedIcon = undefined
    data.categoryLangList = []
    data.categoryLangList.push({ lang: 1, name: data.nameZh })
    data.categoryLangList.push({ lang: 2, name: data.nameEn })
    const request = data.categoryId ? api.update(data) : api.save(data)
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
})
defineExpose({ init })

// 点击取消
const dataFormCancel = () => {
  visible.value = false
  dataFormRef.value.resetFields()
}
// 关闭dialog时
const closeDialog = () => {
  dataForm.value = {
    categoryId: 0,
    shopId: null,
    parentId: 0,
    nameZh: null,
    nameEn: null,
    desc: null,
    path: null,
    status: '1',
    icon: '',
    imgUrl: '',
    level: null,
    seq: 1,
    chenkedIcon: '',
    notChenkedIcon: ''
  }
  selectedCategories.value = []
  showCategorySelectBtn.value = true
  dataFormRef.value.resetFields()
}
/**
 * 触发表单校验
 * @param prop 校验项
 */
const onPropChage = (prop) => {
  dataFormRef.value?.validateField(prop)
}
</script>

<style lang="scss" scoped>
// 相关说明文字提示
.tips-text-part {
  display: inline-block;
  background: #fffcf2;
  border: 1px solid #F6C023;
  padding: 5px;
  font-size: 12px;
  color: #666;
  line-height: 1.5em;
  margin-top: 5px;

  p {
    margin: 0;
    line-height: 1.5em;
  }

  p:not(:last-child) {
    margin-bottom: 10px;
  }
}
</style>
