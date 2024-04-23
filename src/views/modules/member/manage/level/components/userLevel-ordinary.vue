<template>
  <div class="component-userLevel-ordinary">
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['user:level:save']"
          type="primary"
          @click="onAddRow"
        >
          {{ $t('user.level.addLevel') }}
        </el-button>
        <el-button
          v-if="isUpdateData"
          v-permission="['user:level:update']"
          @click="onUpdateUserLevel"
        >
          {{ $t('user.level.updateUserData') }}
        </el-button>
        <el-tag
          v-if="isUpdateData"
          type="warning"
        >
          {{ $t('user.level.updateSoon') }}
        </el-tag>
      </div>
      <div class="table-con">
        <el-table
          :data="dataForm.userLevels"
          header-cell-class-name="table-header"
          row-class-name="table-row-low"
        >
          <el-table-column
            prop="level"
            fixed
            :label="$t('user.level.grade')"
            align="left"
            width="80"
          >
            <template #default="scope">
              <div class="table-cell-text">
                <span>{{ scope.row.level }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="levelName"
            fixed
            :label="$t('user.level.levelName')"
            align="center"
            width="120"
          >
            <template #default="scope">
              <div class="table-cell-text">
                <span>{{ scope.row.levelName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="couponsNum"
            fixed
            :label="'优惠券数量'"
            align="center"
            width="120"
          >
            <template #default="scope">
              <div class="table-cell-text">
                <span>{{ scope.row.couponsNum }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="userRightsList"
            fixed
            label="会员权益"
            align="left"
          >
            <template #default="scope">
              <div class="table-cell-text">
                {{ scope.row.userRightsNameList.join('、') || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="needGrowth"
            :label="$t('user.level.growthRange')"
            align="center"
          >
            <template #default="scope">
              <div class="table-cell-text">
                <span>{{ scope.row.needGrowth }}</span>
                <span v-if="scope.$index < dataForm.userLevels.length-1">&nbsp;~&nbsp;</span>
                <span
                  v-if="scope.$index < dataForm.userLevels.length-1"
                >{{ dataForm.userLevels[scope.$index+1].needGrowth-1 }}</span>
                <span v-if="scope.$index === dataForm.userLevels.length-1">&nbsp;~ ∞</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            width="150"
            align="center"
          >
            <template #default="scope">
              <div class="table-btn-con">
                <el-button
                  v-permission="['user:level:update']"
                  type="primary"
                  link
                  @click.prevent="onAddOrUpdate(scope.$index)"
                >
                  {{ scope.$index+1 > maxLength ? $t('table.save') : $t('table.edit') }}
                </el-button>
                <el-button
                  v-if="scope.$index === dataForm.userLevels.length -1 && scope.$index !== 0"
                  v-permission="['user:level:delete']"
                  type="primary"
                  link
                  @click.prevent="onDeleteRow(scope.$index)"
                >
                  {{ $t('user.level.remove') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="onGetData"
    />
  </div>
</template>

<script setup>
import * as api from '@/api/user/level.js'
import AddOrUpdate from './userLevel-add-or-update.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const addOrUpdateVisible = ref(false)
const dataForm = ref({
  parentId: null,
  id: null,
  levelType: 0,
  userLevels: []
})
const maxLength = ref(0)
const isUpdateData = ref(false)

onMounted(() => {
  onGetData()
})

// 获取数据
const onGetData = () => {
  api.list(0).then(data => {
    data.forEach(el => {
      el.userRightsNameList = []
      for (let i = 0; i < el.userRightsList.length; i++) {
        const element = el.userRightsList[i]
        el.userRightsNameList.push(element.rightsName)
      }
    })
    dataForm.value.userLevels = data
    maxLength.value = data.length
    dataForm.value.userLevels.forEach(item => {
      if (item.updateStatus === 0) {
        isUpdateData.value = true
      }
    })
  })
}

// 新增 / 修改
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (index) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(dataForm.value.userLevels, index, dataForm.value.levelType)
  })
}
// 删除列
const onDeleteRow = (index) => {
  ElMessageBox.confirm($t('user.level.isDeleOper'), $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    dataForm.value.id = dataForm.value.userLevels[index].userLevelId
    // 删除列并更新数据
    if (dataForm.value.id) {
      api.remove(dataForm.value.id).then(() => {
        isUpdateData.value = false
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
        onGetData()
      })
    } else {
      onGetData()
    }
  })
}
// 增加列
const onAddRow = () => {
  if (dataForm.value.userLevels.length >= 4) {
    ElMessage({
      message: $t('user.level.atMost'),
      type: 'warning'
    })
    return
  }
  if (dataForm.value.userLevels.length > maxLength.value) {
    ElMessage({
      message: $t('user.level.saveFirst'),
      type: 'warning'
    })
    return
  }
  onAddOrUpdate()
}
const onUpdateUserLevel = () => {
  api.updateUserLevel().then(() => {
    location.reload()
  })
}

</script>

<style lang="scss" scoped>
.component-userLevel-ordinary {
  .main-content {
    margin-top: 0;
  }
}
</style>
