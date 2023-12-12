<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.sysUserId? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :rules="dataRule"
      :model="dataForm"
      label-position="right"
      label-width="80px"
      @submit.prevent
    >
      <!-- 昵称 -->
      <el-form-item
        :label="$t('platform.shopUser.nickName')"
        prop="nickName"
      >
        <el-input
          v-model="dataForm.nickName"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <!-- 头像 -->
      <el-form-item
        :label="$t('platform.shopUser.avatar')"
        prop="avatar"
        label-width="80px"
      >
        <img-upload
          v-model="dataForm.avatar"
          @input="onPropChage('avatar')"
        />
      </el-form-item>
      <!-- 员工编号 -->
      <el-form-item
        :label="$t('platform.shopUser.code')"
        prop="code"
      >
        <el-input
          v-model="dataForm.code"
          maxlength="60"
          show-word-limit
        />
      </el-form-item>
      <!-- 联系方式 -->
      <!-- <el-form-item :label="$t('platform.shopUser.mobileNumber')" prop="phoneNum">
        <el-input v-model="dataForm.phoneNum" maxlength="11" />
      </el-form-item> -->
      <!-- 选择角色 -->
      <el-form-item
        v-if="dataForm.isAdmin !== 1"
        label="选择角色"
        prop="roleIds"
      >
        <el-select
          v-model="dataForm.roleIds"
          multiple
          placeholder="请选择"
          style="width: 60%"
        >
          <el-option
            v-for="item in roleOpts"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="visible = false"
        >
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="onSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import * as api from '@/api/platform/sys-user'
import * as roleApi from '@/api/rbac/role'
import ImgUpload from '@/components/img-upload/index.vue'
import { Debounce } from '@/utils/debounce'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  sysUserId: 0,
  shopId: null,
  nickName: null,
  avatar: null,
  code: null,
  phoneNum: null,
  hasAccount: null,
  roleIds: []
})
const roleOpts = ref([])
const dataRule = {
  nickName: [
    { required: true, message: '昵称不能为空', trigger: 'blur' }
  ],
  avatar: [
    { required: true, message: '头像不能为空', trigger: 'blur' }
  ]
}
const dataFormRef = ref(null)
const init = (sysUserId) => {
  dataForm.sysUserId = sysUserId || 0
  visible.value = true
  dataForm.isAdmin = 0
  nextTick(() => {
    dataFormRef.value?.resetFields()
    roleApi.list().then(data => {
      roleOpts.value = data
    })
    if (dataForm.sysUserId) {
      api.get(sysUserId).then(data => {
        dataForm.sysUserId = data.sysUserId
        dataForm.shopId = data.shopId
        dataForm.nickName = data.nickName
        dataForm.avatar = data.avatar
        dataForm.code = data.code
        dataForm.phoneNum = data.phoneNum
        dataForm.phoneNum = data.phoneNum
        dataForm.hasAccount = data.hasAccount
        dataForm.roleIds = data.roleIds
        dataForm.isAdmin = data.isAdmin
      })
    }
  })
}
// 表单提交 Debounce:防抖函数
const onSubmit = Debounce(function () {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      const request = dataForm.sysUserId ? api.update(dataForm) : api.save(dataForm)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
        useRouter().go(0)
      })
    }
  })
}, 1000)
defineExpose({ init })
/**
 * 触发表单校验
 * @param prop 校验项
 */
const onPropChage = (prop) => {
  dataFormRef.value?.validateField(prop)
}
</script>
