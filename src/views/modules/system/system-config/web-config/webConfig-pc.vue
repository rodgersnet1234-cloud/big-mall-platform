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
      <div class="table-con webConfig-pc-table">
        <el-table
          ref="webConfigPcTableRef"
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
          <el-table-column
            prop="loginLogoImg"
            :label="$t('rbac.webConfig.logo')"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <!-- <img v-if="scope.row.loginLogoImg" :src="scope.row.loginLogoImg" width="100%"> -->
                <ImgShow
                  :src="row.loginLogoImg"
                  :img-style="{width:'100%'}"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 登录背景 -->
          <el-table-column
            prop="loginBgImg"
            :label="$t('rbac.webConfig.loginBg')"
            width="150"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <!-- <img v-if="scope.row.loginBgImg" :src="scope.row.loginBgImg" width="100%"> -->
                <ImgShow
                  :src="row.loginBgImg"
                  :img-style="{width:'100%'}"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 版权声明-中文 -->
          <el-table-column
            prop="copyrightCn"
            :label="$t('rbac.webConfig.bsCopyright') + '-' + $t('rbac.webConfig.chinese')"
            width="150"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.copyrightCn }}
              </div>
            </template>
          </el-table-column>
          <!-- 底部二维码 -->
          <el-table-column
            prop="pcQrcodeImg"
            :label="$t('rbac.webConfig.pcQrcodeImg')"
            width="150"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <!-- <img v-if="scope.row.pcQrcodeImg" :src="scope.row.pcQrcodeImg" width="100%"> -->
                <ImgShow
                  :src="row.pcQrcodeImg"
                  :img-style="{width:'100%'}"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 公司名称-中文 -->
          <el-table-column
            prop="pcCompanyNameCn"
            :label="$t('rbac.webConfig.pcCompanyName') + '-' + $t('rbac.webConfig.chinese')"
            width="150"
          >
            <template #default="scope">
              {{ scope.row.pcCompanyNameCn }}
            </template>
          </el-table-column>
          <!-- 底部扩展信息-中文 -->
          <el-table-column
            prop="pcCompanyInfoCn"
            :label="$t('rbac.webConfig.pcCompanyInfo') + '-' + $t('rbac.webConfig.chinese')"
            width="150"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.pcCompanyInfoCn }}
              </div>
            </template>
          </el-table-column>
          <!-- 网站标题文本-中文 -->
          <el-table-column
            prop="titleContentCn"
            :label="$t('rbac.webConfig.pcTitleContent') + '-' + $t('rbac.webConfig.chinese')"
            width="150"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.titleContentCn }}
              </div>
            </template>
          </el-table-column>
          <!-- 网站标题图标 -->
          <el-table-column
            prop="titleImg"
            :label="$t('rbac.webConfig.pcTitleImg')"
            width="150"
          >
            <template #default="{row}">
              <div class="table-cell-image">
                <!-- <img v-if="scope.row.titleImg" :src="scope.row.titleImg" width="100%"> -->
                <ImgShow
                  :src="row.titleImg"
                  :img-style="{width:'100%'}"
                />
              </div>
            </template>
          </el-table-column>
          <!-- 图文LOGO -->
          <el-table-column
            prop="pcLogoImgText"
            :label="$t('rbac.webConfig.pcLogoImgText')"
            width="150"
          >
            <template #default="{row}">
              <!-- <img v-if="scope.row.pcLogoImgText" :src="scope.row.pcLogoImgText" width="100%"> -->
              <ImgShow
                :src="row.pcLogoImgText"
                :img-style="{width:'100%'}"
              />
            </template>
          </el-table-column>
          <!-- 导航欢迎语-中文 -->
          <el-table-column
            prop="pcWelcomeCn"
            :label="$t('rbac.webConfig.pcWelcome') + '-' + $t('rbac.webConfig.chinese')"
            width="150"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.pcWelcomeCn }}
              </div>
            </template>
          </el-table-column>
          <!-- 激活状态 -->
          <el-table-column
            prop="isActivity"
            :label="$t('rbac.webConfig.activationStatus')"
            width="150"
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

                type="text"
                @click="onAddOrUpdate(scope.row.id)"
              >
                {{ $t("table.edit") }}
              </el-button>
              <el-button
                v-if="!scope.row.isActivity"
                v-permission="['platform:webConfig:delete']"
                type="text"
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
let pageLoading = ref(true)
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
const configType = ref(3) // 配置类型（1:平台端 2:商家端 3:PC端 4:h5端）

const getPage = () => {
  pageLoading = true
  api.page(pageQuery, configType).then(pageVO => {
    pageVO.list.forEach(item => {
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          if (/Img/.test(key) || /Icon/.test(key)) {
            item[key] = item[key] && item[key].indexOf('http') > -1 ? item[key] : item[key] = import.meta.env.VITE_APP_RESOURCES_URL + item[key]
          }
        }
      }
    })
    // pageVO = pageVO
    pageLoading = false
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
