<template>
  <div class="app-container mod-attr">
    <!-- 搜索相关区域 -->
    <div class="search-bar">
      <el-form
        :inline="true"
        :model="pageQuery"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item label="规格名称：">
          <el-input
            v-model="pageQuery.name"
            placeholder="规格名称"
            maxlength="20"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getPage(true)"
          >
            查询
          </el-button>
          <el-button
            @click="clearSearchInfo()"
          >
            {{ $t('table.reset') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['score:attr:save']"
          type="primary"
          class="filter-item"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <div class="table-con">
        <!-- 列表相关区域 -->
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%;"
        >
          <!-- 属性名称 -->
          <el-table-column
            label="规格名称"
            prop="name"
            align="center"
          >
            <template #default="{row}">
              <span
                v-for="(name, index) in row.attrLangList"
                :key="index"
              >{{ language === name.lang ? name.name : '' }}</span>
            </template>
          </el-table-column>
          <!-- 属性值 -->
          <el-table-column
            label="规格值"
            prop="attrType"
            align="center"
          >
            <template #default="{row}">
              <div class="table-cell-text">
                {{ row.propValueList.join('/') }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="small-padding fixed-width"
          >
            <template #default="{row}">
              <div class="table-btn-con">
                <el-button
                  v-permission="['score:attr:update']"
                  type="primary"
                  link
                  @click="onAddOrUpdate(row.attrId)"
                >
                  {{ $t('table.edit') }}
                </el-button>
                <el-button
                  v-permission="['score:attr:delete']"
                  type="primary"
                  link
                  @click="onDelete(row.attrId)"
                >
                  {{ $t('table.delete') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 分页条 -->
    <pagination
      v-show="pageVO.total>0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getPage()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import { checkPermission } from '@/directive/permission/index.js'
import AddOrUpdate from './components/add-or-update/index.vue'
import * as api from '@/api/product/attr.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const vPermission = checkPermission

onMounted(() => {
  getPage()
})

const language = computed(() => {
  return useAppStore().language === 'zh' ? 1 : 2
})

// loading
const pageLoading = ref(true)
// 查询参数
const searchParam = {}
let tempSearchForm = null // 保存上次点击查询的请求条件
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1,
  name: null,
  attrType: null
})
// 返回参数
const pageVO = ref({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
const getPage = (newData = false) => {
  pageLoading.value = true
  searchParam.attrType = 0
  if (newData || !tempSearchForm) {
    tempSearchForm = { ...pageQuery, ...searchParam }
  } else {
    tempSearchForm.pageSize = pageQuery.pageSize
    tempSearchForm.pageNum = pageQuery.pageNum
  }
  api.page(tempSearchForm).then(pageVOPar => {
    for (let i = 0; i < pageVOPar.list.length; i++) {
      const item = pageVOPar.list[i]
      item.propValueList = []
      for (let j = 0; j < item.attrValues.length; j++) {
        const element = item.attrValues[j]
        item.propValueList.push(element.value)
      }
    }
    pageVO.value = pageVOPar
    pageLoading.value = false
  })
}

const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (attrId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(attrId)
  })
}

const onDelete = (attrId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(attrId))
}

const deleteById = (attrId) => {
  api.deleteById(attrId).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

// 清空搜索内容
const clearSearchInfo = () => {
  pageQuery.name = ''
  pageQuery.attrType = ''
}

</script>
