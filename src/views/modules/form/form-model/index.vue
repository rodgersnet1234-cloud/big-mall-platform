<template>
  <div class="page-form-model">
    <div class="main-content">
      <div
        v-for="form in formList"
        :key="form.id"
        class="card-item"
      >
        <el-card
          shadow="never"
          class="card-item-card"
        >
          <template #header>
            <div class="clearfix title">
              <el-tooltip
                v-if="form.formName.length > 12"
                effect="light"
                placement="top"
              >
                <template #content>
                  <span>
                    {{ form.formName.substring(0,25) }}
                    <br v-if="form.formName.length>25">
                    {{ form.formName.substring(25,50) }}
                    <br v-if="form.formName.length>50">
                    {{ form.formName.substring(50,75) }}
                    <br v-if="form.formName.length>75">
                    {{ form.formName.substring(75,1000) }}
                  </span>
                </template>
                <div class="hid">
                  {{ form.formName }}
                </div>
              </el-tooltip>
              <span v-else>{{ form.formName }}</span>
            </div>
          </template>
          <div class="title-text">
            <el-tooltip
              effect="light"
              placement="top"
            >
              <template #content>
                <div>
                  {{ form.content.substring(0,25) }}
                  <br v-if="form.content.length>25">
                  {{ form.content.substring(25,50) }}
                  <br v-if="form.content.length>50">
                  {{ form.content.substring(50,75) }}
                  <br v-if="form.content.length>75">
                  {{ form.content.substring(75,1000) }}
                </div>
              </template>
              <span>{{ form.content }}</span>
            </el-tooltip>
          </div>
          <div class="content-container">
            <div class="content">
              <span>时间周期：</span>
              <span class="content-item">自然 + {{ form.timeType === 1 ? '天' : form.timeType === 2 ? '周' : '月' }}</span>
            </div>
            <div class="content">
              <span>时间范围：</span>
              <span
                class="content-item"
              >近{{ form.timeRange }}{{ form.timeType === 1 ? '天' : form.timeType === 2 ? '周' : '月' }}</span>
            </div>
            <div class="content">
              <span>指标数量：</span>
              <span class="content-item">{{ form.formItemList.length }}个</span>
            </div>
            <div class="content-last">
              <span class="content-title">报表指标：</span>
              <span class="content-last-item">
                <el-tooltip
                  effect="light"
                  placement="top"
                >
                  <template #content><div>
                    {{ form.formItems.substring(0,25) }}
                    <br v-if="form.formItems.length>25">
                    {{ form.formItems.substring(25,50) }}
                    <br v-if="form.formItems.length>50">
                    {{ form.formItems.substring(50,75) }}
                    <br v-if="form.formItems.length>75">
                    {{ form.formItems.substring(75,1000) }}
                  </div></template>
                  <span>{{ form.formItems }}</span>
                </el-tooltip>
              </span>
            </div>
          </div>
          <div style="text-align:center;">
            <el-button
              v-permission="['platform:form:add']"
              class="primary"
              @click="addHandle(form.formId)"
            >
              加入平台报表
            </el-button>
          </div>
        </el-card>
      </div>
      <div
        v-if="formList.length === 0"
        class="noData"
      >
        暂无数据
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addVisible"
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    />
  </div>
</template>

<script setup>
import AddOrUpdate from '../add-or-update.vue'
import * as api from '@/api/form/form'
const formList = ref([])
const addVisible = ref(false)
onMounted(() => {
  // 携带参数查询
  const query = useRoute().query
  if (Object.keys(query).length > 0) {
    getDataList(query)
  } else {
    getDataList()
  }
})

/**
 * 获取数据列表
 */
const getDataList = () => {
  api.listRecommendForm().then(data => {
    formList.value = data
    formList.value.forEach(form => {
      let items = ''
      form.formItemList.forEach(item => {
        items = items + item.value + '、'
      })
      items = items.substring(0, items.length - 1)
      form.formItems = items
    })
  })
}
// 新增 / 修改
const addOrUpdateRef = ref(null)
const addHandle = (id) => {
  addVisible.value = true
  nextTick(() => {
    addOrUpdateRef.value?.onInit(id, true)
  })
}

</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
