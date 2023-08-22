<template>
  <el-dialog
    v-model="visible"
    :title="$t('product.spu.prodSelect')"
    :modal="false"
    top="100px"
    :close-on-click-modal="false"
    @close="dialogClose()"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      class="demo-form-inline"
      @submit.prevent
    >
      <el-form-item :label="$t('product.spu.name')">
        <el-input
          v-model="name"
          :placeholder="$t('product.spu.name')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$t('product.spu.categoryName')">
        <el-cascader
          v-model="selectedCategory"
          expand-trigger="hover"
          :options="categoryList"
          :props="categoryTreeProps"
          :clearable="true"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="searchProd"
        >
          {{
            $t("table.search")
          }}
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="clean"
        >
          {{
            $t("table.clear")
          }}
        </el-button>
      </el-form-item>
    </el-form>
    <div
      class="tip"
      style="color: #e43130"
    >
      注意：当商品少于三件时，该分组不显示
    </div>
    <div class="prods-select-body">
      <el-table
        ref="prodTableRef"
        v-loading="dataListLoading"
        :data="page.list"
        border
        style="width: 100%"
        :row-key="getRowKeys"
        @selection-change="selectChangeHandle"
      >
        <el-table-column
          v-if="!isSingle"
          type="selection"
          :reserve-selection="true"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          prop="shopName"
          header-align="center"
          align="center"
          :label="$t('table.shopName')"
        />
        <el-table-column
          align="center"
          width="140"
          :label="$t('product.spu.imgUrls')"
        >
          <template #default="{row}">
            <!-- <img v-if="row.mainImgUrl" :src="row.mainImgUrl" width="100" height="100">
            <img v-if="!row.mainImgUrl" src="~@/assets/images/def.png" width="100" height="100"> -->
            <ImgShow
              :src="row.mainImgUrl"
              :img-style="{width:'100px',height:'100px'}"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="spuName"
          header-align="center"
          align="center"
          :label="$t('product.spu.name')"
        />
      </el-table>
      <!-- 分页条 -->
      <pagination
        v-show="page.total>0"
        v-model:page="pageQuery.pageNum"
        v-model:limit="pageQuery.pageSize"
        :total="page.total"
        @pagination="getDataList()"
      />
    </div>
    <template #footer>
      <span>
        <el-button @click="visible = false">{{
          $t('table.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="submitProds()"
        >{{
          $t('table.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { treeDataTranslate, idList } from '@/utils'
// import Big from 'big.js'
import * as api from '@/api/product/tag-prod'
import { categoryPage } from '@/api/product/category'
import Pagination from '@/components/pagination/index.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean
  },
  prodType: {
    default: null,
    type: Number
  }
})

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = reactive({
  product: ''
})
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const singleSelectProdId = ref(0)
const allData = ref([])
const selectProds = ref([])
const dataList = ref([])
const name = ref('')
const isSubmit = ref(false)
const shopCategoryId = ref(null)
const pageIndex = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)
const tagId = ref(0)
const dataListLoading = ref(false)
const addOrUpdateVisible = ref(false)
const dataListSelections = ref([])
const categoryList = ref([])
const selectedCategory = ref([])
const categoryTreeProps = reactive({
  value: 'categoryId',
  label: 'name'
})
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const page = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
// 查询参数
const searchParam = ref({
  keyword: '',
  categoryId: null
})

onActivated(() => {
  getDataList()
})

const prodTableRef = ref(null)

// const beforeUnmount(() => {
//   prodTableRef.value?.clearSelection()
// })

// 获取数据列表
const init = (id) => {
  console.log('tag' + id)
  singleSelectProdId.value = 0
  tagId.value = id
  visible.value = true
  dataListLoading.value = true
  shopCategoryId.value = null
  selectedCategory.value = []
  name.value = ''
  isSubmit.value = false
  searchParam.value.categoryId = ''
  searchParam.value.keyword = ''
  // name = ''
  dataListSelections.value = []
  pageQuery.pageSize = 10
  pageQuery.pageNum = 1
  getDataList()
  getCategoryList()
}
const getCategoryList = () => {
  categoryPage().then((data) => {
    categoryList.value = treeDataTranslate(data, 'categoryId', 'parentId')
  })
}
const getDataList = () => {
  searchParam.value.tagId = tagId
  api.getNotTagProdPage({ ...pageQuery, ...searchParam.value }).then((data) => {
    page.list = data.list
    page.total = data.total
    page.pages = data.pages
    // page.list.forEach(prod => {
    //   prod.priceFee = new Big(prod.priceFee).div(100).toFixed(2)
    // })
    dataListLoading.value = false
    if (selectProds.length) {
      nextTick(() => {
        selectProds.forEach(row => {
          const index = page.list.findIndex((prodItem) => prodItem.spuId === row.spuId)
          if (index >= 0) {
            prodTableRef.toggleRowSelection(page.list[index], true)
          }
        })
      })
    }
  })
}
// 每页数
const sizeChangeHandle = (val) => {
  pageQuery.pageSize = val
  pageQuery.pageNum = 1
  getDataList()
}
// 当前页
const currentChangeHandle = (val) => {
  pageQuery.pageNum = val
  getDataList()
}
// 多选点击事件
const selectChangeHandle = (selection) => {
  // const dataList = page.list
  dataListSelections.value = selection
}
const getRowKeys = (row) => {
  return row.spuId
}
/**
 * 获取分类id
 */
const handleChange = (val) => {
  shopCategoryId.value = val[val.length - 1]
}
/**
 * 根据条件搜索商品
 */
const searchProd = () => {
  pageQuery.pageNum = 1
  searchParam.value = {
    keyword: name,
    categoryId: shopCategoryId.value
  }
  getDataList()
}
/**
 * 清空搜索条件
 */
const clean = () => {
  name.value = ''
  shopCategoryId.value = null
  selectedCategory.value = idList(categoryList, shopCategoryId, 'categoryId', 'children').reverse()
}
// 确定事件
const submitProds = () => {
  if (isSubmit.value) {
    return
  }
  isSubmit.value = true
  const prods = []
  dataListSelections.value.forEach(item => {
    const prodIndex = prods.findIndex((prod) => prod.spuId === item.spuId)
    if (prodIndex === -1) {
      prods.push(
        {
          spuId: item.spuId,
          seq: item.seq,
          name: item.name,
          pic: item.pic,
          activityId: item.activityId,
          prodType: item.prodType
        }
      )
    }
  })
  const addInfo = {}
  addInfo.spuList = prods
  addInfo.id = tagId.value
  const request = api.save(addInfo)
  request.then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        visible.value = false
        emit('refreshDataList')
        dataListSelections.value = []
        // $refs['dataForm'].resetFields()
      }
    })
  }).catch(() => {
    isSubmit.value = false
  })
}
const dialogClose = () => {
  prodTableRef.value?.clearSelection()
}
defineExpose({ init })
</script>
<style scoped>
.tip{
  color: grey;
  /* display: inline-block; */
  height: 30px;
  line-height: 30px;
}
.prods-select-body {
  height: 600px;
  overflow: auto;
  border-top: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
</style>
