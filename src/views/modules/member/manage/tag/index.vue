<template>
  <div class="page-member-manage-tag">
    <div class="title">
      {{ $t('user.tag.allLabels') }}
    </div>
    <div class="content">
      <div class="tabs">
        <el-tabs>
          <el-tab-pane :label="$t('user.tag.conditionLabel')">
            <div class="bg-white add-label">
              <div class="label-wapper btn-bar">
                <el-button
                  v-permission="['user:tag:save']"
                  type="primary"
                  @click="onAddOrUpdate('',1)"
                >
                  {{ $t('user.tag.addLabel') }}
                </el-button>
                <el-button
                  @click="onRefreshLabel()"
                >
                  更新标签数据
                </el-button>
                <div class="font-line">
                  {{ $t('user.tag.updateTime') }}：{{ (customLabelList[customLabelList.length-1]?.statisticUpdateTime) ? customLabelList[customLabelList.length-1].statisticUpdateTime : '暂无更新' }}
                </div>
              </div>
            </div>
            <!-- 不同标签内容 -->
            <div class="bg-white label-content-wrapper">
              <!-- 自定义标签 -->
              <div class="custom-label label-box">
                <div class="label-type-wrapper">
                  <span class="label-type">{{ $t('user.tag.customConditionLabel') }}</span>
                  <span class="label-tips">{{ $t('user.tag.customConditionLabelTips') }}</span>
                </div>
                <div class="label-content">
                  <div
                    v-for="(item, index) in customLabelList"
                    :key="index"
                    class="label-item"
                  >
                    <div class="label-name">
                      {{ item.tagName }}
                    </div>
                    <div class="font-line">
                      {{ $t('user.tag.peopleNum') }}：{{ item.userNum }}
                    </div>
                    <div class="font-line">
                      {{ $t('user.tag.creationTime') }}：{{ item.createTime }}
                    </div>
                    <div class="op-btn-wrapper">
                      <span
                        v-permission="['user:tag:update']"
                        @click="onAddOrUpdate(item.userTagId,1)"
                      >{{ $t('user.tag.editBtn') }}</span>
                      <span
                        v-permission="['user:tag:delete']"
                        @click="onDeleteById(item.userTagId)"
                      >{{ $t('user.tag.deleteBtn') }}</span>
                    </div>
                  </div>
                  <div
                    v-if="!customLabelList.length"
                    class="no-data"
                  >
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('user.tag.manualLabel')">
            <div class="bg-white add-label">
              <div class="label-wapper">
                <el-button
                  v-permission="['user:tag:save']"
                  type="primary"
                  @click="onAddOrUpdate('',0)"
                >
                  {{ $t('user.tag.addLabel') }}
                </el-button>
              </div>
            </div>
            <!-- 标签内容 -->
            <div class="bg-white label-content-wrapper">
              <!-- 手动标签 -->
              <div class="custom-label label-box">
                <div class="label-type-wrapper">
                  <span class="label-type">{{ $t('user.tag.manualLabel') }}</span>
                </div>
                <div class="label-content">
                  <div
                    v-for="(item, index) in manualLabelList"
                    :key="index"
                    class="label-item"
                  >
                    <div class="label-name">
                      {{ item.tagName }}
                    </div>
                    <div class="font-line">
                      {{ $t('user.tag.peopleNum') }}：{{ item.userNum }}
                    </div>
                    <div class="font-line">
                      {{ $t('user.tag.creationTime') }}：{{ item.createTime }}
                    </div>

                    <div class="op-btn-wrapper">
                      <span
                        v-permission="['user:tag:update']"
                        @click="onAddOrUpdate(item.userTagId,0)"
                      >{{ $t('table.edit') }}</span>
                      <span
                        v-permission="['user:tag:delete']"
                        @click="onDeleteById(item.userTagId)"
                      >{{ $t('table.delete') }}</span>
                    </div>
                  </div>
                  <div
                    v-if="!manualLabelList.length"
                    class="no-data"
                  >
                    暂无数据
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 新增/编辑标签 -->
    <user-tag-edit
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-label-list="onTagList()"
    />
  </div>
</template>

<script setup>
import UserTagEdit from './add-or-update.vue'
import * as api from '@/api/user/user-tag.js'
import { ElMessage, ElMessageBox } from 'element-plus'
const customLabelList = ref([])
const manualLabelList = ref([])

const addOrUpdateVisible = ref(false)
onMounted(() => {
  onTagList()
})

const onTagList = () => {
  api.getTagList().then(data => {
    const isCustomLabelList = []
    const isManualLabelList = []
    for (let i = 0; i < data.length; i++) {
      if (data[i].tagType === 1) {
        isCustomLabelList.push(data[i])
      } else if (data[i].tagType === 0) {
        isManualLabelList.push(data[i])
      }
    }
    customLabelList.value = isCustomLabelList
    manualLabelList.value = isManualLabelList
  })
}
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (userTagId, tagType) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(userTagId, tagType)
  })
}

const onRefreshLabel = () => {
  if (!customLabelList.value.length) {
    ElMessage.warning('暂无数据，请添加标签')
    return
  }
  api.batchRefreshTag([]).then(() => {
    onTagList()
    ElMessage.success($t('user.tag.updateSucceeded'))
  })
}

const onDeleteById = (userTagId) => {
  ElMessageBox.confirm('确定进行删除操作', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteById(userTagId).then(() => {
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => onTagList()
      })
    })
  })
}

</script>
<style lang="scss" scoped>
.page-member-manage-tag {
  background-color: #fff;
  padding: 20px;
  .title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .content {
    min-height: 300px;
    padding: 10px;
    background: #f2f2f6;
    border-radius: 6px;
    .bg-white {
      background: #fff;
    }
    .tabs {
      margin: 10px 0 12px;
    }
    .add-label {
      display: flex;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    .label-content-wrapper {
      padding: 10px 10px 10px 20px;
      border-radius: 6px;
      .label-box {
        .label-type-wrapper {
          margin: 10px 0;
          .label-type {
            font-size: 16px;
            font-weight: bold;
          }
          .label-tips {
            font-size: 12px;
            color: #9797A1;
            padding-left: 10px;
          }
        }
        .label-content {
          display: flex;
          flex-wrap: wrap;
          .label-item {
            position: relative;
            box-sizing: content-box;
            width: 198px;
            height: 100px;
            font-size: 12px;
            padding: 10px;
            border: 1px solid #E3E2E5;
            border-radius: 5px;
            margin: 0 5px 10px 0;
            .font-line {
              margin-bottom: 10px;
            }
            .label-name {
              height: 30px;
              font-weight: 700;
              // padding: 0 0 10px;
            }
            .op-btn-wrapper {
              position: absolute;
              bottom: 5px;
              right: 10px;
              color: #2589FF;
              span {
                cursor: pointer;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }

  .no-data {
    color: #999999;
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  &:deep(.el-tabs__header) {
    margin: 0;
  }

  .btn-bar {
    display: flex;
    align-items: end;

    .font-line {
      margin-left: 10px;
      padding-bottom: 5px;
      font-size: 14px;
    }
  }
}
</style>
