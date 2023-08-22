<template>
  <div class="mod-level-vip">
    <div class="main-content">
      <div class="operation-bar">
        <el-button
          v-permission="['user:level:save']"
          @click="onAddRow"
        >
          {{ $t('user.level.addLevel') }}
        </el-button>
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
            :label="$t('user.level.level')"
            align="left"
            width="80"
          >
            <template #default="scope">
              <span>{{ scope.row.level }}</span>
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
              <span>{{ scope.row.levelName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="couponsNum"
            fixed
            label="优惠券数量"
            align="center"
            width="120"
          >
            <template #default="scope">
              <span>{{ scope.row.couponsNum }}</span>
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
            v-if="0"
            prop="needAmount"
            :label="$t('user.level.paidMemberPrice')"
            align="center"
            width="100px"
          >
            <template #default="scope">
              <span>{{ scope.row.needAmount }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="0"
            prop="termType"
            :label="$t('user.level.time')"
            align="center"
            width="100"
          >
            <template #default="scope">
              <span>{{ scope.row.termType === 1? $t('user.level.day') :scope.row.termType === 2? $t('user.level.week') :scope.row.termType === 3? $t('user.level.month') :scope.row.termType === 4? $t('user.level.season') : $t('unit.year') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recruitStatus"
            label="招募情况"
            align="center"
            width="100"
          >
            <template #default="scope">
              <span v-if="scope.row.recruitStatus === 1">招募中</span>
              <span v-else>停止招募</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            :label="$t('table.actions')"
            width="250"
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
                  v-if="scope.row.recruitStatus === 0"
                  v-permission="['user:level:updateRecruitStatus']"
                  type="primary"
                  link
                  @click.prevent="onStopOrStartRecruit(scope.row, 1)"
                >
                  {{ $t('user.level.startRecruit') }}
                </el-button>
                <el-button
                  v-if="scope.row.recruitStatus === 1"
                  v-permission="['user:level:updateRecruitStatus']"
                  type="primary"
                  link
                  @click.prevent="onStopOrStartRecruit(scope.row, 0)"
                >
                  {{ $t('user.level.stopRecruit') }}
                </el-button>
                <el-button
                  v-if="scope.$index === dataForm.userLevels.length -1"
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
import AddOrUpdate from './userLevel-add-or-update.vue'
import * as api from '@/api/user/level.js'
import { ElMessageBox, ElMessage } from 'element-plus'

const addOrUpdateVisible = ref(false)

const dataForm = ref({
  parentId: null,
  id: null,
  levelType: 1,
  userLevels: []
})
const maxLength = ref(0)
// isUpdateData: false

onMounted(() => {
  onGetData()
})

// 获取数据
const onGetData = () => {
  api.list(1).then(data => {
    data.forEach(el => {
      el.userRightsNameList = []
      for (let i = 0; i < el.userRightsList.length; i++) {
        const element = el.userRightsList[i]
        el.userRightsNameList.push(element.rightsName)
      }
    })
    dataForm.value.userLevels = data
    maxLength.value = data.length
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
// 开始招募 / 停止招募  status: 1开始招募 0停止招募
const onStopOrStartRecruit = (row, status) => {
  const obj = { ...row }
  obj.recruitStatus = status
  const msg = status === 0 ? $t('user.level.stopRecruitTip') : $t('user.level.startRecruitTip')
  ElMessageBox.confirm(msg, $t('table.tips'), {
    confirmButtonText: $t('table.confirm'),
    cancelButtonText: $t('table.cancel'),
    type: 'warning'
  }).then(() => {
    api.updateRecruitStatus({ ...obj }).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500
      })
      onGetData()
    }).catch(() => { })
  }).catch(() => { })
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
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500
        })
        onGetData()
      }).catch(() => { })
    } else {
      onGetData()
    }
  }).catch(() => { })
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

</script>

<style lang="scss" scoped>
.mod-level-vip {
  .main-content {
    margin-top: 0;
  }
  :deep(.el-table__fixed) {
    height: 100% !important; //解决el-table tab切换多出横线
  }
  :deep(.el-table__fixed-right) {
    height: 100% !important; //解决el-table tab切换多出横线
  }
}
</style>
