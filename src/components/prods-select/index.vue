<template>
  <el-dialog
    v-model="visible"
    title="商品选择"
    :modal-append-to-body="false"
    :append-to-body="true"
    top="4vh"
    :close-on-click-modal="false"
    width="800px"
    class="prod-select-box"
    @close="closeModule"
  >
    <el-form
      :inline="true"
      :model="searchForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item label="商品名称">
        <el-input
          v-model.trim="searchForm.spuName"
          placeholder="商品名称"
          clearable
          style="width: 180px"
        />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryListFiltered"
          :props="categoryTreeProps"
          :clearable="true"
          style="width: 180px"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSearchProd"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onResetSearch">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="main-content prods-select-body">
      <div class="table-con">
        <el-table
          ref="prodTableRef"
          v-loading="dataListLoading"
          :data="pageData.dataList"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
          @select="selectChangeHandle"
          @select-all="selectAllHandle"
        >
          <el-table-column
            v-if="isSingle"
            width="50"
            header-align="center"
            align="center"
          >
            <template #default="{row}">
              <el-radio
                v-model="singleSelectspuId"
                :label="row.spuId"
                class="radio-box"
                @change="getSelectProdRow(row)"
              >
                {{ '' }}
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!isSingle"
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="spuName"
            align="left"
            label="商品名称"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.spuName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="140"
            label="商品图片"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <ImgShow
                  :src="row.mainImgUrl"
                  :img-style="{width:'100px',height:'100px'}"
                />
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="priceFee"
            header-align="center"
            align="center"
            label="商品价格"
            width="200px"
          />
        </el-table>
      </div>
    </div>
    <!-- 分页 -->
    <pagination
      v-show="pageData.total > 0"
      v-model:page="searchForm.pageNum"
      v-model:limit="searchForm.pageSize"
      style="text-align: right"
      :total="pageData.total"
      @pagination="getPageData"
    />
    <template #footer>
      <span>
        <el-button
          @click="visible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="onSubmitProds()"
        >确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList, formatPrice, deepClone } from '@/utils'
import { page } from '@/api/product/list'
import { categoryPage } from '@/api/product/category'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshSelectProds'])
const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  },
  prodType: {
    default: 0,
    type: Number
  },
  dataUrl: {
    default: '/prod-manage/prod-manage/page',
    type: String
  }
})

const visible = ref(false)
const searchForm = ref({
  pageSize: 10,
  pageNum: 1,
  spuType: null,
  spuStatus: 0,
  keyword: '',
  categoryId: null,
  spuName: ''
})
const pageData = ref({
  dataList: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const singleSelectspuId = ref(0)
const selectProds = ref([])
const dataListSelections = ref([])
const categoryList = ref([])
const selectedCategory = ref([])
const shopCategoryId = ref(null)
const dataListLoading = ref(false)
const categoryTreeProps = ref({
  value: 'categoryId',
  label: 'name'
})
const filterSup = ref(false)
const indexImg = ref(false)
const filterSupDelivery = ref(false)

const init = (initSelectProds, option) => {
  if (option) {
    filterSup.value = option.filterSup || false
    indexImg.value = option.indexImg || false
    filterSupDelivery.value = option.filterSupDelivery || false
  }
  singleSelectspuId.value = 0
  selectProds.value = initSelectProds || []
  visible.value = true
  dataListLoading.value = true
  onResetSearch()
  if (selectProds.value) {
    selectProds.value.forEach(row => {
      dataListSelections.value.push(row)
    })
  }
  getPageData(true)
  getCategoryList()
}

const getCategoryList = () => {
  categoryPage().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}

/**
 * 上级分类选项不要展示没有三级分类的分类
 */
const categoryListFiltered = computed(() => {
  const List = deepClone(categoryList.value)
  return List.filter(i => i.children)
})

const prodTableRef = ref(null)
const getPageData = (init = false) => {
  searchForm.value.spuType = props.spuType
  searchForm.value.spuStatus = 1
  const paramsData = { ...searchForm.value }
  if (filterSup.value) {
    paramsData.isSupplierType = 1
  }
  if (indexImg.value) {
    paramsData.appDisplay = 1
  }
  if (filterSupDelivery.value) {
    paramsData.isSupplierDelivery = 1
  }
  page(paramsData).then(data => {
    pageData.value.total = data.total
    pageData.value.dataList = data.list || []
    if (pageData.value.dataList.length) {
      pageData.value.dataList.forEach(prod => {
        prod.priceFee = formatPrice(prod.priceFee, 1).toFixed(2)
      })
    }
    dataListLoading.value = false

    if (init && selectProds.value.length) {
      nextTick(() => {
        selectProds.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index], true)
        })
      })
    } else if (dataListSelections.value.length) {
      nextTick(() => {
        dataListSelections.value.forEach(row => {
          const index = pageData.value.dataList.findIndex((prodItem) => prodItem.spuId === row.spuId)
          prodTableRef.value?.toggleRowSelection(pageData.value.dataList[index], true)
        })
      })
    }
  })
}

// 单选商品事件
const getSelectProdRow = (row) => {
  dataListSelections.value = [row]
}

// 全选事件
const selectAllHandle = () => {
  pageData.value.dataList.forEach((tableItem) => {
    const selectedProdIndex = dataListSelections.value.findIndex((selectedProd) => {
      if (!selectedProd) {
        return false
      }
      return selectedProd.spuId === tableItem.spuId
    })
    if (selectedProdIndex == -1) {
      dataListSelections.value.push(tableItem)
    }
  })
}

// 多选点击事件
const selectChangeHandle = (selection) => {
  pageData.value.dataList.forEach((tableItem) => {
    const selectedProdIndex = selection.findIndex((selectedProd) => {
      if (!selectedProd) {
        return false
      }
      return selectedProd.spuId === tableItem.spuId
    })
    const dataSelectedProdIndex = dataListSelections.value.findIndex((dataSelectedProd) => dataSelectedProd.spuId === tableItem.spuId)
    if (selectedProdIndex > -1 && dataSelectedProdIndex === -1) {
      dataListSelections.value.push(tableItem)
    } else if (selectedProdIndex === -1 && dataSelectedProdIndex > -1) {
      dataListSelections.value.splice(dataSelectedProdIndex, 1)
    }
  })
}

// 获取分类id
const handleChange = (val) => {
  shopCategoryId.value = val[val.length - 1]
}

// 根据条件搜索商品
const onSearchProd = () => {
  searchForm.value.pageNum = 1
  searchForm.value.keyword = searchForm.value.spuName
  searchForm.value.categoryId = shopCategoryId.value
  getPageData()
}

// 清空搜索条件
const onResetSearch = () => {
  searchForm.value.spuName = ''
  shopCategoryId.value = null
  selectedCategory.value = idList(categoryList.value, shopCategoryId.value, 'categoryId', 'children').reverse()
}

const closeModule = () => {
  searchForm.value.spuName = ''
  shopCategoryId.value = null
  dataListSelections.value = []
  prodTableRef.value?.clearSelection()
  searchForm.value.pageSize = 10
  searchForm.value.pageNum = 1
}

// 确定事件
const onSubmitProds = () => {
  const prods = []
  dataListSelections.value.forEach(item => {
    const prodIndex = prods.findIndex((prod) => prod.spuId === item.spuId)
    if (prodIndex === -1) {
      prods.push(
        {
          spuId: item.spuId,
          spuName: item.spuName,
          imgUrls: item.imgUrls,
          mainImgUrl: item.mainImgUrl,
          activityId: item.activityId,
          prodType: item.prodType
        }
      )
    }
  })
  if (!prods.length) {
    ElMessage.warning('请选择商品！')
    return
  }
  if (dataListSelections.value.length > 0) {
    emit('refreshSelectProds', prods)
  }
  dataListSelections.value = []
  visible.value = false
}

defineExpose({ init })
</script>
<style lang="scss" scoped>
.main-content.prods-select-body{
  padding: 0;
  max-height: 480px;
  overflow: auto;
  .table-con {
    padding-bottom: 20px;
  }
}
</style>
