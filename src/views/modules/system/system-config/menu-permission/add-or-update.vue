<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.menuPermissionId? $t('table.edit'): $t('table.create')"
  >
    <div class="up-wrapper">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="dataRule"
        label-width="80px"
        @submit.prevent
        @keyup.enter="onSubmit()"
      >
        <!-- 资源名称 -->
        <el-form-item
          :label="$t('rbac.menuPermission.name')"
          prop="name"
        >
          <el-input
            v-model="dataForm.name"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <!-- 上级菜单 -->
        <el-form-item
          label="上级菜单"
          prop="menuId"
        >
          <el-cascader
            v-model="selectedMenu"
            expand-trigger="hover"
            :options="menuList"
            :props="menuListTreeProps"
            change-on-select
            @change="handleSelectMenuChange"
          />
        </el-form-item>
        <!-- 请求方法 1.GET 2.POST 3.PUT 4.DELETE -->
        <el-form-item
          label="请求方法"
          prop="method"
        >
          <el-radio-group v-model="dataForm.method">
            <el-radio
              v-for="index of 4"
              :key="index"
              :label="index"
            >
              {{ ['', 'GET', 'POST', 'PUT', 'DELETE'][index] }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 资源对应服务器路径 -->
        <el-form-item
          label="资源路径"
          prop="uri"
        >
          <el-input
            v-model="dataForm.uri"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <!-- 权限对应的编码 -->
        <el-form-item
          label="授权标识"
          prop="permission"
        >
          <el-input
            v-model="dataForm.permission"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </div>
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
import { treeDataTranslate, idList } from '@/utils/index.js'
import * as menuApi from '@/api/rbac/menu.js'
import * as api from '@/api/rbac/menu-permission.js'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = ref({
  menuPermissionId: 0,
  menuId: null,
  permission: null,
  name: '',
  uri: '',
  method: 1
})
// eslint-disable-next-line no-unused-vars
const validate = (rule, value, callback) => {
  if (value.trim() === '') {
    callback(new Error('输入内容不能全为空格'))
  } else {
    callback()
  }
}
const dataRule = {
  name: [
    { required: true, message: '资源名称不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ],
  menuId: [
    { required: true, message: '上级菜单不能为空', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请求方法不能为空', trigger: 'blur' }
  ],
  uri: [
    { required: true, message: '资源路径不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }
  ],
  permission: [
    { required: true, message: '授权标识不能为空', trigger: 'blur' },
    { validator: validate, trigger: 'blur' }

  ]
}
const menuList = ref([])
const selectedMenu = ref([])
const menuListTreeProps = reactive({
  value: 'id',
  label: 'title',
  checkStrictly: true
})
const dataFormRef = ref(null)
const init = (menuPermissionId) => {
  dataForm.value.menuPermissionId = menuPermissionId || 0
  visible.value = true
  nextTick(() => {
    dataFormRef.value?.resetFields()
    menuApi.menuList({ sysType: 2 }).then(data => {
      data.forEach(item => {
        item.title = item.meta.title
      })
      menuList.value = treeDataTranslate(data)
      if (dataForm.value.menuPermissionId) {
        api.get(menuPermissionId).then(data => {
          dataForm.value = data
          // idList方法返回的选中菜单数组格式(内容:[{id: value, name: value}])
          // el-cascader回显的数组只需一个id的数字数组，因此需要把id取出来
          const selectedMenuList = idList(menuList.value, data.menuId).reverse()
          const tempSelectedMenu = []
          selectedMenuList.forEach(item => {
            tempSelectedMenu.push(item.id)
          })
          selectedMenu.value = tempSelectedMenu
        })
      } else {
        selectedMenu.value = []
      }
    })
  })
}
const handleSelectMenuChange = (val) => {
  dataForm.value.menuId = val[val.length - 1]
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      const params = {
        menuPermissionId: dataForm.value.menuPermissionId || undefined,
        menuId: dataForm.value.menuId || undefined,
        bizType: 2,
        name: dataForm.value.name,
        permission: dataForm.value.permission,
        uri: dataForm.value.uri,
        method: dataForm.value.method
      }

      const request = dataForm.value.menuPermissionId ? api.update(params) : api.save(params)
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
      })
    }
  })
}
defineExpose({ init })
</script>
