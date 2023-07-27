<template>
  <div class="gray-box top-redius border-bottom-gray">
    <el-tabs
      id="tabs"
      type="card"
      style="marginTop:-15px"
    >
      <el-tab-pane :label="$t('platform.config.chineseConfig')">
        <tiny-mce
          v-model="contentCN"
          style="width: 1000px"
        />
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('platform.config.englishConfig')">
        <tiny-mce
          v-model="contentEN"
          style="width: 1000px"
        />
      </el-tab-pane> -->
    </el-tabs>
    <el-button
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
import TinyMce from '@/components/tinymce/index.vue'
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

// onMounted(() => {
//   init()
// })

// const init = () => {
//   nextTick(() => {
//     api.get(params.keyCN).then(data => {
//       if (data) {
//         contentCN = data
//       }
//     })
//     api.get(params.keyEN).then(data => {
//       if (data) {
//         contentEN = data
//       }
//     })
//   })
// }
// // 表单提交
// const onSubmit = () => {
//   api.save({
//     paramKey: params.keyCN,
//     paramValue: contentCN,
//     remark: params.remarkCN
//   })
//   api.save({
//     paramKey: params.keyEN,
//     paramValue: contentEN,
//     remark: params.remarkEN
//   }).then(data => {
//     if (data) {
//       init()
//     }
//     ElMessage({
//       message: $t('platform.config.operationSuccess'),
//       type: 'success',
//       duration: 1500,
//       onClose: () => {
//         emit('refreshDataList')
//       }
//     })
//   })
// }

</script>
