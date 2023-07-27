<template>
  <el-dialog
    v-model="visible"
    :title="$t('product.spuTag.updateProdTagSeq')"
    width="30%"
  >
    <!-- native modifier has been removed, please confirm whether the function has been affected  -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      :label-width="$t('language') === 'language' ? '210px' : '120px'"
      @submit.prevent
    >
      <el-form-item
        :label="$t('product.spuTag.seq')"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          :max="99999"
          :controls="false"
        />
        <!-- <span>{{ $t("user.scoreTip1") }}</span> -->
      </el-form-item>
      <!-- <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="number"></el-input>
        <span>正数代表增加，负数代表减少，只能输入整数</span>
      </el-form-item>-->
      <el-form-item>
        <el-button
          @click="visible = false"
        >
          {{
            $t('table.cancel')
          }}
        </el-button>
        <el-button
          type="primary"
          :loading="confirmLoad"
          @click="confirm"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/product/tag-prod'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const confirmLoad = ref(false)
const isConfirm = ref(false)
const tagId = ref(0)
const seq = ref(0)
const dataForm = reactive({
  growthValue: null,
  seq: 0,
  remark: null
})
const ids = ref([])
const productTagParams = ref([])
const validateNumber = (rule, value, callback) => {
  if (parseInt(value) === value) {
    callback()
  } else {
    callback(new Error('请输入整数'))
  }
  //       if (!/^(-)?[1-9]+[0-9]*$/.test(value)) {
  //   callback(new Error(this.$i18n.t('prodTag.tips')))
  // }
}
const dataRule = {
  seq: [
    { required: true, message: $t('user.userManager.scoreTip2'), trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}
const init = (id, idList) => {
  confirmLoad.value = false
  isConfirm.value = false
  visible.value = true
  ids.value = idList
  // dataForm = {}
  seq.value = 0
  tagId.value = id
}

const dataFormRef = ref(null)
const confirm = () => {
  dataFormRef.value?.validate((valid) => {
    if (!valid) {
      return
    }
    if (!seq.value && seq.value !== 0) {
      ElMessage({
        message: '排序不能为空',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (!ids.value) {
      return
    }
    if (isConfirm.value) {
      return
    }
    ids.value.forEach(id => {
      const productTagParam = {}
      productTagParam.spuId = id
      productTagParam.tagId = tagId.value
      productTagParam.seq = dataForm.seq
      productTagParams.value.push(productTagParam)
    })
    confirmLoad.value = true
    isConfirm.value = true
    const request = api.updateProdSeq(productTagParams.value)
    request.then(() => {
      productTagParams.value = []
      ElMessage({
        message: $t('table.actionSuccess'),
        type: 'success',
        duration: 1500,
        onClose: () => {
          visible.value = false
          confirmLoad.value = false
          emit('refreshDataList')
          dataFormRef.value?.resetFields()
        }
      })
    }).catch(() => {
      confirmLoad.value = false
      isConfirm.value = false
    })
  })
}
defineExpose({ init })
</script>
