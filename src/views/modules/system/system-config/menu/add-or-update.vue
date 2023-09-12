<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.menuId? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
  >
    <!-- 目录和菜单框 -->
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @submit.prevent
      @keyup.enter="onSubmit()"
    >
      <!-- 类型选择 0：目录 1：菜单 -->
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-radio-group v-model="dataForm.type">
          <el-radio
            v-for="(type, index) in dataForm.typeList"
            :key="index"
            :label="index"
          >
            {{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 目录/菜单标题 -->
      <el-form-item
        :label="dataForm.typeList[dataForm.type] + '标题'"
        prop="title"
      >
        <el-input
          v-model="dataForm.title"
          maxlength="32"
          show-word-limit
          :placeholder="dataForm.typeList[dataForm.type] + '标题'"
        />
      </el-form-item>
      <!-- 目录/菜单名称 -->
      <el-form-item
        :label="dataForm.typeList[dataForm.type] + '名称'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          maxlength="32"
          show-word-limit
          :placeholder="dataForm.typeList[dataForm.type] + '名称'"
        />
      </el-form-item>
      <!-- 上级菜单 -->
      <el-form-item label="上级目录">
        <el-cascader
          v-model="selectedMenu"
          clearable
          expand-trigger="hover"
          :options="menuList"
          :props="menuListTreeProps"
          change-on-select
          @change="handleSelectMenuChange"
        />
      </el-form-item>
      <!-- 菜单路由 -->
      <el-form-item
        label="菜单路由"
        prop="url"
      >
        <el-input
          v-model="dataForm.url"
          placeholder="菜单路由"
          maxlength="200"
        />
      </el-form-item>
      <!-- 组件路径 -->
      <el-form-item
        v-if="dataForm.type === 1"
        label="组件路径"
        prop="componentUrl"
      >
        <el-input
          v-model="dataForm.componentUrl"
          placeholder="组件路径"
          maxlength="200"
        />
      </el-form-item>
      <!-- 菜单隐藏 -->
      <el-form-item
        label="菜单隐藏"
        prop="isMenuHide"
      >
        <el-select
          v-model="dataForm.isMenuHide"
          placeholder="请选择"
        >
          <el-option
            v-for="item in menuHideOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 排序号 -->
      <el-form-item
        v-if="dataForm.type !== 2"
        label="排序号"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <!-- 图标 -->
      <el-form-item
        label="图标"
        prop="icon"
      >
        <el-popover
          ref="iconListPopoverRef"
          placement="top"
          trigger="click"
          :width="500"
          popper-class="mod-menu-home__icon-popover"
        >
          <template #reference>
            <el-input
              v-model="dataForm.icon"
              :readonly="true"
              maxlength="32"
            />
          </template>
          <icons-select @select-icon="selectIcon" />
        </el-popover>
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
import * as api from '@/api/rbac/menu.js'
import { treeDataTranslate, idList } from '@/utils/index.js'
import IconsSelect from '@/components/icons-select/index.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])
const visible = ref(false)
const dataForm = ref({
  menuId: 0,
  type: 1,
  typeList: ['目录', '菜单'],
  title: '',
  name: '',
  parentId: 0,
  url: '',
  componentUrl: '',
  isMenuHide: '',
  seq: 0,
  icon: '',
  iconList: []
})
// 必填输入框验证 validateName：验证名称/validateUrl：验证菜单/validateComponent：验证组件路径
// eslint-disable-next-line no-unused-vars
const validateTitle = (rule, value, callback) => {
  if (!value) {
    callback(new Error('菜单标题不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('菜单名称不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateUrl = (rule, value, callback) => {
  if (!/\S/.test(value)) {
    callback(new Error('菜单URL不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateComponent = (rule, value, callback) => {
  if (dataForm.value.type === 1 && !/\S/.test(value)) {
    callback(new Error('组件路径不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateMenuHide = (rule, value, callback) => {
  if (dataForm.value.isMenuHide === '') {
    callback(new Error('菜单是否隐藏不能为空'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateSeq = (rule, value, callback) => {
  if (String(value).length > 10) {
    callback(new Error('长度小于10位'))
  } else {
    callback()
  }
}
const dataRule = {
  title: [
    { required: true, validator: validateTitle, trigger: 'blur' }
  ],
  name: [
    { required: true, validator: validateName, trigger: 'blur' }
  ],
  url: [
    { required: true, validator: validateUrl, trigger: 'blur' }
  ],
  componentUrl: [
    { required: true, validator: validateComponent, trigger: 'blur' }
  ],
  isMenuHide: [
    { required: true, validator: validateMenuHide, trigger: 'blur' }
  ],
  seq: [
    { required: false, validator: validateSeq, trigger: 'blur' }
  ]
}
const menuHideOpts = [{
  value: 0,
  label: '否'
}, {
  value: 1,
  label: '是'
}]
let menuList = ref([])
const selectedMenu = ref([])
const menuListTreeProps = reactive({
  value: 'id',
  label: 'title',
  checkStrictly: true
})
const dataFormRef = ref(null)
watch(visible, (val) => {
  if (val === false) {
    dataFormRef.value?.resetFields()
    initFrameCon()
  }
})
watch(() => dataForm.value.type, () => {
  dataFormRef.value?.clearValidate()
}, {
  deep: true
})
const init = (menuId) => {
  dataForm.value.menuId = menuId || 0
  visible.value = true
  nextTick(() => {
    api.menuList().then(data => {
      data.forEach(item => {
        item.title = item.meta.title
      })
      menuList = treeDataTranslate(data)

      if (dataForm.value.menuId) {
        api.get(menuId).then(data => {
        // 不是目录，才显示组件路径（data.component返回Layout就为目录）
          if (data.component !== 'Layout') {
            dataForm.value.type = 1
            dataForm.value.componentUrl = data.component
          } else {
            dataForm.value.type = 0
            dataForm.value.componentUrl = ''
          }
          dataForm.value.menuId = data.menuId
          dataForm.value.title = data.title
          dataForm.value.name = data.name
          dataForm.value.parentId = data.parentId
          dataForm.value.url = data.path
          dataForm.value.isMenuHide = data.hidden
          dataForm.value.seq = data.seq
          dataForm.value.icon = data.icon
          // idList方法返回的选中菜单数组格式(内容:[{id: value, name: value}])
          // el-cascader回显的数组只需一个id的数字数组，因此需要把id取出来
          const selectedMenuList = idList(menuList, data.parentId).reverse()
          const tempSelectedMenu = []
          selectedMenuList.forEach(item => {
            tempSelectedMenu.push(item.id)
          })
          selectedMenu.value = tempSelectedMenu
        })
      } else {
        const selectedMenuList = idList(menuList, 0).reverse()
        const tempSelectedMenu = []
        selectedMenuList.forEach(item => {
          tempSelectedMenu.push(item.id)
        })
        selectedMenu.value = tempSelectedMenu
      }
    })
  })
}
// 弹框内容初始化
const initFrameCon = () => {
  dataForm.value = {
    menuId: 0,
    type: 1,
    typeList: ['目录', '菜单'],
    title: '',
    name: '',
    parentId: 0,
    url: '',
    componentUrl: '',
    isMenuHide: '',
    seq: 0,
    icon: '',
    iconList: []
  }
}
// 监听上级菜单的改动
const handleSelectMenuChange = (val) => {
  dataForm.value.parentId = val[val.length - 1]
  if (dataForm.value.parentId === undefined) {
    dataForm.value.parentId = 0
  }
}
// 选择图标
const selectIcon = (iconName) => {
  dataForm.value.icon = iconName
}
// 表单提交
const onSubmit = () => {
  dataFormRef.value?.validate(valid => {
    if (valid) {
      // 提交为目录，component为Layout
      let component = ''
      if (parseInt(dataForm.value.type) === 0) {
        component = 'Layout'
      } else {
        component = dataForm.value.componentUrl
      }
      // 把菜单是否隐藏的值，从0/1改为false/true
      let isMenuHide = ''

      if (parseInt(dataForm.value.isMenuHide) === 1) {
        isMenuHide = 1
      } else {
        isMenuHide = 0
      }
      // }
      const params = {
        menuId: dataForm.value.menuId || undefined,
        title: dataForm.value.title,
        name: dataForm.value.name,
        parentId: dataForm.value.parentId,
        component,
        path: dataForm.value.url,
        hidden: isMenuHide,
        seq: dataForm.value.seq,
        icon: dataForm.value.icon
      }
      const request = dataForm.value.menuId ? api.update(params) : api.save(params)
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
