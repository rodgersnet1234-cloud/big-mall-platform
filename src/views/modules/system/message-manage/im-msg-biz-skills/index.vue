<template>
  <div class="im-msg-biz-skills">
    <div class="new-page-title">
      <div class="line" />
      <div class="text">
        自动回复
      </div>
    </div>
    <div class="im-msg-content">
      <div class="im-msg-letf">
        <div
          class="content-box"
        >
          <el-form
            label-position="left"
          >
            <el-form-item
              class="el-form-item"
              label="启用状态"
            >
              <el-switch
                v-model="imAutoReplyData.status"
                @change="onChangeState"
              />
              <span class="status-tips">启用后，当天买家用户发送第一条消息或者无客服在线时，系统会自动进行回复</span>
            </el-form-item>
          </el-form>
          <div class="checkbox-msg">
            <el-checkbox
              v-model="imAutoReplyData.content.sendTextState"
              label="发送文字信息"
              name="type"
              @change="changeSendTextState"
            />
            <div class="text-msg">
              <p style="margin: 0">
                回复内容:
              </p>
              <div>
                <div class="content">
                  <div v-if="editText">
                    <el-input
                      v-model="content"
                      class="tarea"
                      type="textarea"
                      maxlength="500"
                    />
                    <div class="count">
                      <div class="count-text">
                        还可以输入
                        <i>
                          {{ remainingCount }}
                        </i>
                        字
                      </div>
                    </div>
                    <div class="save-btn">
                      <el-button
                        style="margin-right: 10px;"
                        type="primary"
                        @click="onSave"
                      >
                        保存
                      </el-button>
                      <el-button @click="editText = !editText">
                        取消
                      </el-button>
                    </div>
                  </div>
                  <span v-else>{{ imAutoReplyData.content.content }}</span>
                </div>
                <el-button
                  v-if="!editText"
                  type="primary"
                  link
                  class="edit-btn"
                  @click="onEditText"
                >
                  编辑
                </el-button>
              </div>
            </div>
          </div>
          <div style="margin-top:10px">
            <div class="checkbox">
              <el-checkbox
                v-model="imAutoReplyData.content.sendIssusState"
                label="发送常见问题"
                name="type"
                @change="changeCommonQuestion"
              />
              <p class="max-msg">
                最多添加10条
              </p>
            </div>
            <div class="issues-box">
              <el-button
                v-if="imAutoReplyData.content.issues?.length<10||!imAutoReplyData.content.issues"
                @click="onAddOrUpdate()"
              >
                添加问题
              </el-button>

              <div
                v-for="(item,index) in imAutoReplyData.content.issues"
                :key="item.id"
                style="margin-top: 15px;"
              >
                <div
                  class="issues-list"
                >
                  <div>
                    <span class="issues">
                      问题
                      {{ `${index+1}` }}</span>
                    <span>{{ item.issues }}</span>
                  </div>
                  <div
                    class="button-list"
                  >
                    <el-button
                      v-if="index!==0"
                      type="primary"
                      link
                      @click="updateList(index,'up')"
                    >
                      上移
                    </el-button>
                    <el-button
                      v-if="index<imAutoReplyData.content.issues.length-1"
                      type="primary"
                      link
                      @click="updateList(index,'down')"
                    >
                      下移
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="onAddOrUpdate(item.id)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="primary"
                      link
                      @click="removeItem(item.id)"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                <div class="answer">
                  <span>
                    答案:
                    {{ item.content }}</span>
                </div>
              </div>
            </div>
            <el-button
              type="primary"
              @click="onSubmit()"
            >
              保存
            </el-button>
          </div>
        </div>
      </div>
      <div class="im-msg-right">
        <div class="navigation-bar">
          <el-icon><ArrowLeft /></el-icon>
          <div class="user-name">
            {{ '平台客服' }}
          </div>
        </div>
        <div class="msg-box-wrapper">
          <div class="msg-box">
            <div class="user-send">
              <div class="bubble">
                {{ '你好' }}
              </div>
              <div class="image">
                <img
                  src="@/assets/im_box/userImg.jpg"
                  alt=""
                >
              </div>
            </div>

            <div
              v-if="imAutoReplyData.content.sendTextState||imAutoReplyData.content.sendIssusState"
              class="service-send"
            >
              <div class="image">
                <img
                  src="@/assets/im_box/customer-service.png"
                  alt=""
                >
              </div>
              <div class="bubble">
                <div
                  v-if="imAutoReplyData.content.sendTextState"
                  class="text"
                >
                  {{ imAutoReplyData.content.content || content }}
                </div>

                <ul v-if="imAutoReplyData.content.sendIssusState">
                  <li
                    v-for="item in imAutoReplyData.content.issues"
                    :key="item.id"
                  >
                    • {{ item.issues }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="reply">
          <div class="input-box" />
          <img
            src="@/assets/images/add.png"
          >
          <el-button class="send-btn">
            {{ $t('chat.send') }}
          </el-button>
        </div>
      </div>
    </div>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="refreshChange"
    />
  </div>
</template>

<script setup>
import addOrUpdate from './add-or-update.vue'
import * as http from '@/api/im-msg-biz-skills'
import { ElMessage } from 'element-plus'

const editText = ref(false)
const onEditText = () => {
  content.value = imAutoReplyData.value.content.content
  editText.value = !editText.value
}

const imAutoReplyData = ref({
  content: { sendIssusState: false, sendTextState: false },
  status: false
})
const infoStatus = {
  sendIssusState: false, sendTextState: false
}
const issuesArr = ref([])
const dataInfo = ref(false)
onMounted(() => {
  imAutoReplyInfo()
})
const imAutoReplyInfo = () => {
  http.get().then((data) => {
    dataInfo.value = !data
    if (data?.content) {
      data.content = JSON.parse(data.content)
      imAutoReplyData.value = data
      infoStatus.sendIssusState = imAutoReplyData.value.content.sendIssusState
      infoStatus.sendTextState = imAutoReplyData.value.content.sendTextState
      imAutoReplyData.value.status = !!imAutoReplyData.value.status
    }
  })
}
const updateData = ref({ type: -1 })
const onSave = () => {
  if (!content || typeof content.value !== 'string' || content.value.trim() === '') {
    return ElMessage({
      message: '不能为空',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  imAutoReplyData.value.content.content = content.value
  editText.value = false
}
const onChangeState = (state) => {
  if (state && !imAutoReplyData.value.content.sendTextState && !imAutoReplyData.value.content.sendIssusState) {
    imAutoReplyData.value.status = false
    return ElMessage({
      message: '请勾选其中一个自动回复选项',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const addOrUpdateVisible = ref(false)
const addOrUpdateRef = ref(null)
const onAddOrUpdate = (id) => {
  addOrUpdateVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.init(id, imAutoReplyData.value.content.issues)
  })
}
let result
const refreshChange = (obj) => {
  issuesArr.value.push(obj)
  if (imAutoReplyData.value.content.issues) {
    imAutoReplyData.value.content.issues = replaceItem(imAutoReplyData.value.content.issues, obj)
    result = mergeArraysAndRemoveDuplicates(issuesArr.value, imAutoReplyData.value.content.issues)
  }
  imAutoReplyData.value.content.issues = result || issuesArr.value
  issuesArr.value = []
}
const mergeArraysAndRemoveDuplicates = (arrayA, arrayB) => {
  const mergedArray = arrayB.concat(arrayA)
  const uniqueObjects = Array.from(new Set(mergedArray.map(obj => obj.id))).map(id => {
    return mergedArray.find(obj => obj.id === id)
  })
  return uniqueObjects
}
// 移动数组
const updateList = (index, direction) => {
  const newList = [...imAutoReplyData.value.content.issues]
  if (direction === 'up' && index > 0) {
    // 上移操作
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]
  } else if (direction === 'down' && index < newList.length - 1) {
    // 下移操作
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
  }
  imAutoReplyData.value.content.issues = newList
}
// 删除
const removeItem = (id) => {
  if (imAutoReplyData.value.content.issues.length === 1) {
    ElMessage({
      message: '问题至少保留一个',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  } else {
    imAutoReplyData.value.content.issues = imAutoReplyData.value.content.issues.filter(item => item.id !== id)
  }
}
// 编辑
const replaceItem = (array, newItem) => {
  return array.map(item => {
    if (item.id === newItem.id) {
      return { ...newItem }
    }
    return item
  })
}
const changeCommonQuestion = (e) => {
  if (e && (!imAutoReplyData.value.content.issues || imAutoReplyData.value.content.issues.length === 0)) {
    imAutoReplyData.value.content.sendIssusState = !e
    return ElMessage({
      message: '自动回复问题为空',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const changeSendTextState = (e) => {
  if (e && !imAutoReplyData.value.content.content) {
    imAutoReplyData.value.content.sendTextState = !e
    return ElMessage({
      message: '自动回复文字信息为空',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
}
const onSubmit = () => {
  updateData.value.content = imAutoReplyData.value.content.content
  updateData.value.sendIssusState = imAutoReplyData.value.content.sendIssusState
  updateData.value.sendTextState = imAutoReplyData.value.content.sendTextState
  updateData.value.issues = imAutoReplyData.value.content.issues
  if (imAutoReplyData.value.status && !imAutoReplyData.value.content.sendTextState && !imAutoReplyData.value.content.sendIssusState) {
    return ElMessage({
      message: '请勾选其中一个自动回复选项',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  if (!updateData.value.content && (!updateData.value.issues || updateData.value.issues.length === 0)) {
    return ElMessage({
      message: '自动回复内容不能为空',
      type: 'warning',
      duration: 1500,
      onClose: () => {}
    })
  }
  const param = {
    autoReplyId: imAutoReplyData.value.autoReplyId,
    content: JSON.stringify(updateData.value),
    shopId: imAutoReplyData.value.shopId,
    status: imAutoReplyData.value.status ? 1 : 0
  }
  const request = dataInfo.value ? http.save(param) : http.update(param)
  request.then(() => {
    imAutoReplyInfo()
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500
    })
  })
}
const content = ref('')
const maxCharCount = 500
const remainingCount = ref(500)
watch(() => content.value, () => {
  remainingCount.value = content.value ? maxCharCount - content.value.length : maxCharCount
}, { deep: true })
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
