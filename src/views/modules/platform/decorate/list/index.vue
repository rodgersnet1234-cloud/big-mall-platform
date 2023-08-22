<template>
  <div class="app-container-10 container-f0f2f5 app-main feature-list-container">
    <div class="search-bar">
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        @submit.prevent
        @keyup.enter="getPage(true)"
      >
        <div class="input-row">
          <el-form-item
            prop="pageName"
            :label="$t('shopFeature.list.pageName')"
            class="search-form-item"
          >
            <el-input
              v-model="searchForm.pageName"
              type="text"
              :placeholder="$t('shopFeature.list.pageName')"
            />
          </el-form-item>
          <el-button
            class="operation-btn"
            type="primary"
            @click="onSearch()"
          >
            {{ $t('table.search') }}
          </el-button>
          <el-button
            class="operation-btn"
            @click="onResetSearch(searchFormRef)"
          >
            重置
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="main-content">
      <el-button
        v-permission="['platform:shopRenovation:savePC']"
        class="primary-btn"
        type="primary"
        @click="newPageSelect"
      >
        {{ $t('shopFeature.list.newMicroPage') }}
      </el-button>
      <!--微页面列表-->
      <div class="content-box table-con">
        <el-table
          :data="miniPageList"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            :label="$t('shopFeature.list.pageName')"
          >
            <template #default="scope">
              <div>
                {{ scope.row.name }}
                <el-tag
                  v-if="scope.row.homeStatus===1"
                  effect="dark"
                  style="margin-left: 10px;"
                >
                  {{ $t('shopFeature.list.shopHomePage') }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            :label="$t('shopFeature.list.createTime')"
          />
          <el-table-column
            align="center"
            prop="updateTime"
            :label="$t('shopFeature.list.updateTime')"
          />
          <el-table-column
            align="center"
            :label="$t('shopFeature.list.oper')"
            width="280"
          >
            <template #default="scope">
              <div class="text-btn-con">
                <el-button
                  v-permission="['platform:shopRenovation:viewPC']"
                  type="primary"
                  link
                  @click="onSelect(scope.row)"
                >
                  {{ $t('shopFeature.list.view') }}
                </el-button>
                <el-button
                  v-permission="['platform:shopRenovation:updatePC']"
                  type="primary"
                  link
                  @click="onEdit(scope.row)"
                >
                  {{ $t('shopFeature.list.edit') }}
                </el-button>
                <el-button
                  v-permission="['platform:shopRenovation:deletePC']"
                  type="primary"
                  link
                  @click="onDelete(scope.row)"
                >
                  {{ $t('shopFeature.list.delete') }}
                </el-button>
                <el-button
                  v-permission="['platform:shopRenovation:updateHomePagePC']"
                  type="primary"
                  link
                  @click="onSetHomePage(scope.row.renovationId)"
                >
                  {{ scope.row.homeStatus!==1 ? $t('shopFeature.list.setHomePage'): $t('shopFeature.list.cancelHomePage') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :current-page="perProps.pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="perProps.pageSize"
        :total="perProps.total"
        layout="->,total, sizes, prev, pager, next, jumper"
        @size-change="onChangeSize"
        @current-change="onChangeCurrent"
      />
    </div>

    <template-select
      v-if="isShowtemplateSelect"
      ref="templateSelectRef"
      @select-template="goCreatePage"
    />
  </div>
</template>

<script setup>
import templateSelect from '../template/components/template-select.vue'
import request from '@/utils/request'
import { ElMessageBox, ElMessage } from 'element-plus'
const router = useRouter()
const miniPageList = ref([]) // 列表页
const perProps = ref({
  pageNum: 1, // 当前页
  pageSize: 10, // 每页显示多少条
  total: 0 // 总数
})
const isShowtemplateSelect = ref(false)
const searchForm = ref({
  pageName: ''
})
onMounted(() => {
  // 获取微页面列表
  getMiniPageList()
})

// 获取微页面列表
const getMiniPageList = () => {
  const { pageNum, pageSize } = perProps.value
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/page',
    methods: 'get',
    params: {
      pageNum, // 当前页
      pageSize, // 每页显示多少条
      renovationType: 1, // 1表示pc端，2表示移动端
      name: searchForm.value.pageName
    }
  }).then((data) => {
    miniPageList.value = data.list
    perProps.value.total = data.total
  })
}

// 新建微页面
const goCreatePage = (id) => {
  // 跳转到装修页面
  const obj = {
    type: 'add',
    template: '0'
  }
  if (id > -1) {
    obj.templateId = id
  }
  const newPage = router.resolve({
    path: 'decorate-create-edit',
    query: obj
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
const templateSelectRef = ref(null)

const newPageSelect = () => {
  isShowtemplateSelect.value = true
  nextTick(() => {
    templateSelectRef.value.init()
  })
}
// 每页数
const onChangeSize = (val) => {
  perProps.value.pageSize = val
  getMiniPageList()
}

// 当前页
const onChangeCurrent = (val) => {
  perProps.value.pageNum = val
  getMiniPageList()
}
// 编辑
const onEdit = (row) => {
  const newPage = router.resolve({
    path: 'decorate-create-edit',
    query: {
      renovationId: row.renovationId,
      type: 'edit',
      template: '0'
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}
// 删除
const onDelete = (item) => {
  ElMessageBox.confirm($t('shopFeature.list.deleteTips'), $t('shopFeature.list.tips'), {
    confirmButtonText: $t('shopFeature.edit.confirm'),
    cancelButtonText: $t('shopFeature.edit.cancel'),
    type: 'warning'
  }).then(() => {
    request({
      url: '/mall4cloud_admin/mp/shop_renovation/delete_pc',
      params: {
        renovationId: item.renovationId
      },
      method: 'delete'
    }).then(() => {
      const totalPage = Math.ceil((perProps.value.total - 1) / perProps.value.pageSize)
      const currentPage = perProps.value.pageNum > totalPage ? totalPage : perProps.value.pageNum
      perProps.value.pageNum = currentPage < 1 ? 1 : currentPage
      ElMessage.success($t('shopFeature.list.deleteSuccess'))
      getMiniPageList()
    })
  })
}
const searchFormRef = ref(null)
const onResetSearch = (formName) => {
  formName.resetFields()
  getMiniPageList()
}
// 设置为主页
const onSetHomePage = (renovationId) => {
  request({
    url: '/mall4cloud_admin/mp/shop_renovation/update_home_status_pc',
    params: {
      renovationId
    },
    method: 'put'
  }).then(() => {
    ElMessage.success($t('shopFeature.list.operSuccess'))
    getMiniPageList()
  })
}
const onSearch = () => {
  perProps.value.pageNum = 1
  perProps.value.pageSize = 10
  getMiniPageList()
}
// 查看
const onSelect = (item) => {
  const newPage = router.resolve({
    path: 'decorate-select-decorate',
    query: {
      renovationId: item.renovationId,
      type: 'detail'
    }
  })
  window.open(newPage.href, '_blank', 'noopener,noreferrer')
}

</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
