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
              <div class="label-wapper">
                <button
                  v-permission="['user:tag:save']"
                  @click="onAddOrUpdate('',1)"
                >
                  {{ $t('user.tag.addLabel') }}
                </button>
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
                    <div class="font-line">
                      {{ $t('user.tag.updateTime') }}：{{ item.statisticUpdateTime }}
                    </div>
                    <div class="op-btn-wrapper">
                      <span
                        v-permission="['user:tag:refresh']"
                        @click="refreshTag(item.userTagId)"
                      >{{ $t('user.tag.updateBtn') }}</span>
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
                <button
                  v-permission="['user:tag:save']"
                  @click="onAddOrUpdate('',0)"
                >
                  {{ $t('user.tag.addLabel') }}
                </button>
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
const refreshTag = (userTagId) => {
  api.refreshTag(userTagId).then(() => {
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
      .label-wapper {
        button {
          height: 32px;
          font-size: 12px;
          padding: 0 12px;
          background: #fff;
          border: 1px solid #ededed;
          border-radius: 5px;
          margin-left: 10px;
          &:hover {
            color: #2589FF;
            border: 1px solid #2589FF;
          }
        }
      }
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
            height: 118px;
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
}
</style>
