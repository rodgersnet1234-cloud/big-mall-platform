<template>
  <div class="gray-box top-redius border-bottom-gray">
    <el-tabs
      id="tabs"
      type="card"
      style="margin-top: -15px;"
    >
      <el-tab-pane :label="$t('platform.config.chineseConfig')">
        <tiny-mce
          v-if="contentCN"
          v-model="contentCN"
          style="width: 1000px"
        />
      </el-tab-pane>
    </el-tabs>
    <el-button
      v-permission="['platform:config:save']"
      style="margin-top: 10px"
      type="primary"
      @click="onSubmit"
    >
      {{
        $t("platform.config.save")
      }}
    </el-button>
  </div>
</template>

<script setup>
import TinyMce from '@/components/tiny-mce/index.vue'
import * as api from '@/api/platform/sys-config.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  params: {
    type: Object,
    default () {
      return {
        title: '',
        keyCN: '',
        keyEN: '',
        remarkCN: '',
        remarkEN: ''
      }
    }
  }
})
const emit = defineEmits(['refreshDataList'])

const contentCN = ref('')
const contentEN = ref('')

onMounted(() => {
  init()
})

const init = () => {
  nextTick(() => {
    api.get(props.params.keyCN).then(data => {
      if (data) {
        contentCN.value = data
      }
    })
    api.get(props.params.keyEN).then(data => {
      if (data) {
        contentEN.value = data
      }
    })
  })
}
// 表单提交
const onSubmit = () => {
  api.save({
    paramKey: props.params.keyCN,
    paramValue: contentCN.value,
    remark: props.params.remarkCN
  }).then(data => {
    if (data) {
      init()
    }
    ElMessage({
      message: $t('platform.config.operationSuccess'),
      type: 'success',
      duration: 1500,
      onClose: () => {
        emit('refreshDataList')
      }
    })
  })
}

</script>
<style lang="scss" scoped>
@use '../index.scss';
</style>
