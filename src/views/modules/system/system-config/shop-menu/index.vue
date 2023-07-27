<template>
  <!-- <div class="mod-shop-menu app-container"> -->
  <div class="container">
    <div class="main-content">
      <!-- 搜索相关区域 -->
      <div class="operation-bar">
        <!-- <el-button @click="getPage()">{{ $t('table.search') }}</el-button> -->
        <el-button
          v-permission="['rbac:shopMenu:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>
      <!-- 列表相关区域 -->
      <el-table
        :data="menulist"
        header-cell-class-name="table-header"
        row-class-name="table-row-low"
        style="width: 100%;"
        row-key="id"
      >
        <!-- 名称 -->
        <el-table-column
          prop="meta.title"
          header-align="center"
          tree-key="id"
          width="150"
          label="名称"
        />
        <!-- 图标 -->
        <el-table-column
          header-align="center"
          align="center"
          label="图标"
        >
          <template #default="scope">
            <span v-if="scope.row.meta.icon && (scope.row.meta.icon).includes('plus')">
              <el-icon v-if="scope.row.meta.icon">
                <component
                  :is="scope.row.meta.icon.slice(0, -4)"
                  v-if="scope.row.meta.icon"
                  class="icons"
                />
              </el-icon>
            </span>
            <span v-if="scope.row.meta.icon && !(scope.row.meta.icon).includes('plus')"><svg-icon :icon-class="scope.row.meta.icon" /></span>
            <span v-if="!scope.row.meta.icon">-</span>
          </template>
        </el-table-column>
        <!-- 类型 -->
        <el-table-column
          prop="type"
          header-align="center"
          align="center"
          label="类型"
        >
          <template #default="scope">
            <span v-if="scope.row.component === ''">{{ '目录' }}</span>
            <span v-else>{{ '菜单' }}</span>
          </template>
        </el-table-column>
        <!-- 排序号 -->
        <el-table-column
          prop="seq"
          header-align="center"
          align="center"
          label="排序号"
        />
        <!-- 菜单Url -->
        <el-table-column
          prop="path"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="菜单路由"
        />
        <!-- 组件路径 -->
        <el-table-column
          prop="component"
          header-align="center"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="组件路径"
        >
          <template #default="scope">
            <span>{{ scope.row.component || '-' }}</span>
          </template>
        </el-table-column>
        <!-- 菜单显隐 -->
        <el-table-column
          prop="hidden"
          header-align="center"
          align="center"
          label="菜单隐藏"
        />
        <!-- 操作 -->
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template #default="scope">
            <div class="table-btn-con">
              <el-button
                v-permission="['rbac:shopMenu:update']"
                type="primary"
                link
                @click="onAddOrUpdate(scope.row.id)"
              >
                {{ '编辑' }}
              </el-button>
              <el-button
                v-permission="['rbac:shopMenu:delete']"
                type="primary"
                link
                @click="onDelete(scope.row.id)"
              >
                {{ '删除' }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getPage()"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/rbac/menu'
import { treeDataTranslate } from '@/utils'
import AddOrUpdate from './add-or-update.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const menulist = ref([])
// 查询参数
const searchParam = reactive({
  sysType: 1
})
const addOrUpdateVisible = ref(false)
onMounted(() => {
  getPage()
})

const getPage = () => {
  api.menuList({ ...searchParam }).then(data => {
    data.forEach(item => {
      if (item.component === 'Layout') {
        item.component = ''
      }
      if (item.hidden === true) {
        item.hidden = '是'
      } else {
        item.hidden = '否'
      }
    })
    menulist.value = treeDataTranslate(data)
  }).catch(() => {
  })
}
const addOrUpdateRef = ref()
const onAddOrUpdate = (menuId) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(menuId)
  })
}
const onDelete = (menuId) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(menuId))
}
const deleteById = (menuId) => {
  api.deleteByIdAndSysType(menuId, 1).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

</script>
