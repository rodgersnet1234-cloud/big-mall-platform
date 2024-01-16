<template>
  <div class="app-container">
    <!-- 1.条件筛选 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <!-- 分组名称 -->
        <el-form-item :label="$t('product.spu.name') + '：'">
          <el-input
            v-model="searchParam.spuName"
            :placeholder="$t('product.spu.name')"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getPage()"
          >
            {{ $t('table.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main-content">
      <div class="operation-bar">
        <el-button
          type="primary"
          @click="goBackHandle()"
        >
          {{ $t("product.spuTag.returnTagManage") }}
        </el-button>
        <el-button
          type="primary"
          @click="selectProdHandle()"
        >
          {{ $t("table.addGood") }}
        </el-button>
        <el-button
          :type="selectedProdList.length <= 0 ? '' : 'primary' "
          :disabled="selectedProdList.length <= 0"
          @click="onDelete()"
        >
          {{ $t("table.batchDelete") }}
        </el-button>
        <el-button
          :type="selectedProdList.length <= 0 ? '' : 'primary'"
          :disabled="selectedProdList.length <= 0"
          @click="updateSeqHandle()"
        >
          {{ $t("product.spuTag.updateProdTagSeq") }}
        </el-button>
        <div class="all-check-con">
          <div
            v-if="page.list.length"
            class="change-prod-status"
          >
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              class="all-check-btn"
              @change="handleCheckAllChange"
            >
              当页全选
              <span
                v-if="checkedCount"
                class="had-checked"
              >已选商品 {{ checkedCount }}</span>
            </el-checkbox>
          </div>
        </div>
      </div>
      <!-- 列表相关区域 -->
      <div class="table-con">
        <el-table
          ref="prodInfTableRef"
          v-loading="pageLoading"
          :data="page.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
          @selection-change="onSelectSome"
        >
          <el-table-column
            v-if="page.list.length"
            width="55"
            type="selection"
            :selectable="selectable"
          />
          <!-- 更新时间 -->
          <!-- <el-table-column class="table-item" :label="$t('table.updateTime')" prop="updateTime" align="center">
            <template slot-scope="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column> -->

          <!-- 商品名称 -->
          <el-table-column
            class="table-item"
            :label="$t('product.spu.name')"
            prop="spuName"
            align="left"
          >
            <template #default="{row}">
              <span class="table-cell-text">{{ row.spuName }}</span>
            </template>
          </el-table-column>

          <!-- 商品图片 -->
          <el-table-column
            class="table-item"
            :label="$t('product.spu.imgUrls')"
            align="center"
            width="200"
          >
            <template #default="{row}">
              <div
                v-if="row.mainImgUrl"
                class="table-cell-image"
              >
                <ImgShow :src="row.mainImgUrl" />
              </div>
            </template>
          </el-table-column>
          <!-- 排序号 -->
          <el-table-column
            class="table-item"
            :label="$t('product.spuTag.seq')"
            prop="seq"
            align="center"
          />
          <el-table-column
            class="table-item"
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <el-button
                link
                type="primary"
                :disabled="
                  (row.activityStatus === 2 || row.activityStatus > 5) &&
                    row.groupProdStatus === 1
                "
                @click="onDelete(row)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <pagination
      v-show="page.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="page.total || 0"
      @pagination="getPage()"
    />

    <!-- 商品选择弹窗-->
    <!-- 如果要更改dataUrl，在商品选择组件选择商品后的判断处也要更改一下 -->
    <prods-select
      v-if="selectGroupProdVisible"
      ref="ProdsSelectRef"
      data-url="/group/prod/getNotGroupProdPage"
      @refresh-data-list="refreshChange"
    />
    <update-seq
      v-if="updateSeqVisible"
      ref="updateSeqRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import ProdsSelect from './components/tag-select-prod.vue'
import UpdateSeq from './components/update-prod-seq.vue'
import * as api from '@/api/product/tag-prod'
import { ElMessageBox, ElMessage } from 'element-plus'

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
// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = reactive({
  spuName: '',
  tagId: 0
})
const tagId = ref(0)
const selectGroupProdVisible = ref(false)
const updateSeqVisible = ref(false)
const dataListLoading = ref(false)
// 多选
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedCount = ref(0)
// 被选中的商品列表
const selectedProdList = ref([])

onMounted(() => {
  getPage()
})

const route = useRoute()
const router = useRouter()
const getPage = () => {
  dataListLoading.value = true
  tagId.value = route.query.id
  searchParam.tagId = tagId.value
  api.pageSpuByTagId({ ...pageQuery, ...searchParam }).then(data => {
    page.list = data.list
    page.total = data.total
    page.pages = data.pages
    if (!page.list) {
      page.list = []
    }
    pageLoading.value = false
  }).catch(err => {
    if (err.code === 'A00007' && !err.success) {
      router.push('/platform-default/spu-tag')
    }
  })
}

// 表格复选框能否勾选事件
const selectable = () => {
  return page.list.length > 0
}

const updateSeqRef = ref(null)
// 新增 / 修改
const updateSeqHandle = () => {
  const ids = selectedProdList.value.map(item => {
    return item.spuId
  })
  updateSeqVisible.value = true
  nextTick(() => {
    updateSeqRef.value?.init(tagId.value, ids)
  })
}
// 多选变化
const onSelectSome = (value) => {
  const count = value.length
  checkedCount.value = count
  checkAll.value = count && count === page.list.length
  isIndeterminate.value = count > 0 && count < page.list.length
  // 提取出商品id列表
  const prodList = []
  if (value.length > 0) {
    value.forEach(item => {
      prodList.push(item)
    })
  }
  selectedProdList.value = prodList
}
const onDelete = (row) => {
  const ids = row ? [row.spuId] : selectedProdList.value.map(item => {
    return item.spuId
  })
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(ids))
}
const deleteById = (ids) => {
  api.deleteByIds({
    id: tagId.value,
    spuIds: ids
  }).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500
    })
    getPage()
  })
}
/**
 * 刷新回调
 */
const refreshChange = () => {
  selectGroupProdVisible.value = false
  updateSeqVisible.value = false
  getPage()
}

const prodInfTableRef = ref(null)
/**
 * 表格全选/全不选
 */
const handleCheckAllChange = () => {
  prodInfTableRef.value?.toggleAllSelection()
  isIndeterminate.value = false
}

const ProdsSelectRef = ref(null)
// 选择商品操作
const selectProdHandle = () => {
  selectGroupProdVisible.value = true
  nextTick(() => {
    ProdsSelectRef.value?.init(tagId.value)
  })
}
// 返回路由跳转
const goBackHandle = () => {
  router.push({ path: '/platform-default/spu-tag' })
}

</script>
<style lang="scss" scoped>
.all-check-con {
  padding-left: 10px;
  margin-top: 20px;
}
</style>
