<template>
  <div class="mod-webConfig-webConfig">
    <div class="">
      <!-- 操作栏 -->
      <div class="operation-bar">
        <el-button
          v-permission="['platform:webConfig:save']"
          type="primary"
          @click="onAddOrUpdate()"
        >
          {{ $t('table.create') }}
        </el-button>
      </div>

      <!-- 表格 -->
      <div class="table-con webConfig-uni-table">
        <el-table
          ref="webConfigUniTableRef"
          v-loading="pageLoading"
          :data="pageVO.list"
          header-cell-class-name="table-header"
          row-class-name="table-row"
          style="width: 100%"
        >
          <!-- 序号 -->
          <el-table-column
            fixed
            type="index"
            :label="$t('table.id')"
            width="80"
          />
          <!-- 登录logo -->
          <!-- <el-table-column
            prop="loginLogoImg"
            :label="$t('rbac.webConfig.loginLogo')"
          >
            <template slot-scope="scope">
              <div class="table-cell-image">
                <img v-if="scope.row.loginLogoImg" :src="scope.row.loginLogoImg">
              </div>
            </template>
          </el-table-column> -->
          <!-- 网站标题-中文 -->
          <el-table-column
            prop="titleContentCn"
            :label="$t('rbac.webConfig.uniTitleContent')+'-'+$t('rbac.webConfig.chinese')"
          />
          <!-- 网站标题-英文 -->
          <!-- <el-table-column
            prop="titleContentEn"
            :label="$t('rbac.webConfig.uniTitleContent')+'-'+$t('rbac.webConfig.english')"
          /> -->
          <!-- 激活状态 -->
          <el-table-column
            prop="isActivity"
            :label="$t('rbac.webConfig.activationStatus')"
          >
            <template #default="scope">
              <span
                v-if="scope.row.isActivity === 0"
                class="tag-text"
              >{{
                $t("rbac.webConfig.close")
              }}</span>
              <span
                v-if="scope.row.isActivity === 1"
                class="tag-text"
              >{{
                $t("rbac.webConfig.open")
              }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column
            fixed="right"
            align="center"
            :label="$t('table.actions')"
            width="150"
          >
            <template #default="scope">
              <el-button
                v-permission="['platform:webConfig:update']"
                link
                type="primary"
                @click="onAddOrUpdate(scope.row.id)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="!scope.row.isActivity"
                v-permission="['platform:webConfig:delete']"
                link
                type="primary"
                @click="onDelete(scope.row.id)"
              >
                {{ $t("table.delete") }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页条 -->
      <pagination
        v-show="pageVO.total>0"
        v-model:page="pageQuery.pageNum"
        v-model:limit="pageQuery.pageSize"
        :total="pageVO.total"
        @pagination="getPage()"
      />
    </div>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from './webConfig-add-or-update.vue'
import * as api from '@/api/rbac/web-config'
import Pagination from '@/components/Pagination/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// loading
const pageLoading = ref(true)
// 查询的参数
const pageQuery = reactive({
  pageSize: 10,
  pageNum: 1
})
// 返回参数
const pageVO = reactive({
  list: [], // 返回的列表
  total: 0, // 一共多少条数据
  pages: 0 // 一共多少页
})
let addOrUpdateVisible = ref(false)
const configType = ref(4) // 配置类型（1:平台端 2:商家端 3:PC端 4:h5端）

const getPage = () => {
  pageLoading.value = true
  api.page(pageQuery, configType).then(pageVO => {
    pageVO.list.forEach(item => {
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          if (/Img$/.test(key) || /Icon$/.test(key)) {
            item[key] = item[key] && item[key].indexOf('http') > -1 ? item[key] : item[key] = import.meta.env.VITE_APP_RESOURCES_URL + item[key]
          }
        }
      }
    })
    // pageVO = pageVO
    pageLoading.value = false
  })
}
const addOrUpdateRef = ref()
// 新增 / 修改
const onAddOrUpdate = (id) => {
  addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value?.init(configType, id)
  })
}
const onDelete = (id) => {
  ElMessageBox.confirm($t('table.sureToDelete'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => deleteById(id))
}
const deleteById = (id) => {
  api.deleteById(id).then(() => {
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}
/**
 * 刷新回调
 */
const refreshChange = () => {
  pageQuery.pageNum = 1
  getPage()
}

</script>

<style lang="scss" scoped>
.mod-webConfig-webConfig {
  .operation-bar {
    margin-top: 5px;
  }
  .table-con {
    .table-cell-image {
      margin: unset;
    }
  }
}
</style>
