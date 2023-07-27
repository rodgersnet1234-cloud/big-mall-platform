<template>
  <el-dialog
    v-model="visible"
    title="分销员信息"
    :append-to-body="visible"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      label-position="right"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item
        label="分销员手机号"
      >
        <el-input
          v-model="dataForm.userMobile"
          :readonly="true"
        />
      </el-form-item>

      <el-form-item
        label="身份证号码"
      >
        <el-input
          v-model="dataForm.identityCardNumber"
          :readonly="true"
        />
      </el-form-item>

      <el-form-item
        label="真实姓名"
      >
        <el-input
          v-model="dataForm.realName"
          :readonly="true"
        />
      </el-form-item>

      <el-form-item label="身份证正面">
        <el-image
          v-if="dataForm.identityCardPicFront"
          style="width: 100px; height: 100px"
          :src="dataForm.identityCardPicFront"
          :preview-src-list="srcList"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
        <span v-else>无</span>
      </el-form-item>

      <el-form-item label="身份证背面">
        <el-image
          v-if="dataForm.identityCardPicBack"
          style="width: 100px; height: 100px"
          :src="dataForm.identityCardPicBack"
          :preview-src-list="srcList"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
        <span v-else>无</span>
      </el-form-item>

      <el-form-item label="手持身份证">
        <el-image
          v-if="dataForm.identityCardPicHold"
          style="width: 100px; height: 100px"
          :src="dataForm.identityCardPicHold"
          :preview-src-list="srcList"
        >
          <template #error>
            <img
              class="img-slot"
              src="~@/assets/images/def.png"
            >
          </template>
        </el-image>
        <span v-else>无</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>

const visible = ref(false)
const dataForm = reactive({
  realName: '',
  identityCardNumber: '',
  userMobile: '',
  identityCardPicFront: '',
  identityCardPicBack: '',
  identityCardPicHold: ''
})
const srcList = ref([])
const dataFormRef = ref(null)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const init = (data) => {
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
  })
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      if (data[key] && key.indexOf('identityCardPic') > -1 && data[key].indexOf(resourcesUrl) === -1) {
        data[key] = resourcesUrl + data[key]
      }
    }
  }
  dataForm.realName = data.realName
  dataForm.identityCardNumber = data.identityCardNumber
  dataForm.userMobile = data.userMobile
  dataForm.identityCardPicFront = data.identityCardPicFront
  dataForm.identityCardPicBack = data.identityCardPicBack
  dataForm.identityCardPicHold = data.identityCardPicHold
  srcList.value.push(
    dataForm.identityCardPicFront,
    dataForm.identityCardPicBack,
    dataForm.identityCardPicHold
  )
}
defineExpose({ init })
</script>
