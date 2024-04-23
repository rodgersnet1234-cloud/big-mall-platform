<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.sysAccessKeyId? $t('table.edit'): $t('table.create')"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="right"
      label-width="120px"
      style="width: 500px; margin-left:50px;"
      @submit.prevent
    >
      <!-- 名称 -->
      <el-form-item
        label="密钥名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          maxlength="30"
          show-word-limit
        />
      </el-form-item>
      <!-- 系统类型 -->
      <el-form-item
        label="适用系统类型"
        maxlength="30"
        prop="type"
      >
        <el-radio-group
          v-model="dataForm.sysType"
          @change="updateSysType(dataForm.sysType)"
        >
          <el-radio
            v-for="(value, index) in typeList"
            :key="index"
            :label="value.sysType"
          >
            {{ value.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="[1,3].includes(dataForm.sysType)"
        :label="['','商家','','供应商'][dataForm.sysType]+'范围'"
        prop="type"
      >
        <el-radio-group v-model="dataForm.shopRange">
          <el-radio :label="1">
            全部商家
          </el-radio>
          <el-radio :label="2">
            指定{{ ["",'商家','',"供应商"][dataForm.sysType] }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="[1,3].includes(dataForm.sysType) && dataForm.shopRange === 2">
        <select-account-range
          v-if="!dataForm.usabilityShopId && dataForm.sysType ===1"
          :table-list="dataForm.shopDetailList"
          :type="1"
          :shop-id="dataForm.usabilityShopId"
          :single-election="1"
          @get-ids="(id) => dataForm.usabilityShopId = id"
        />
        <select-account-range
          v-if="!dataForm.usabilityShopId && dataForm.sysType ===3"
          :table-list="dataForm.shopDetailList"
          :type="3"
          :shop-id="dataForm.usabilityShopId"
          :single-election="1"
          @get-ids="(id) => dataForm.usabilityShopId = id"
        />
        <el-form-item
          v-else-if="showInfo?.[dataForm.sysType===1? 'shopName':'supplierName']"
          :label="[
            '',
            '商家名称',
            '',
            '供应商名称'][dataForm.sysType]"
        >
          {{ showInfo?.[dataForm.sysType===1? 'shopName':'supplierName'] }}&nbsp;
          <el-icon @click.stop="dataForm.usabilityShopId = 0">
            <Close />
          </el-icon>
        </el-form-item>
      </template>
      <!-- 备注 -->
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          type="textarea"
          maxlength="100"
          show-word-limit
          :autosize="{ minRows: 3, maxRows: 6}"
        />
      </el-form-item>
      <!-- 账号id -->
      <el-form-item
        v-if="dataForm.sysAccessKeyId"
        label="账号ID"
        prop="accessId"
      >
        <span> {{ dataForm.accessId }} </span>
      </el-form-item>
      <!-- 密钥 -->
      <el-form-item
        v-if="dataForm.sysAccessKeyId"
        label="密钥"
        prop="accessKey"
      >
        <span> {{ dataForm.accessKey }} </span>
      </el-form-item>
      <el-form-item
        v-if="dataForm.sysType !== 0"
        label="授权"
      >
        <div>
          <div>
            <el-radio-group v-model="dataForm.premType">
              <el-radio :label="0">
                全部权限
              </el-radio>
              <el-radio :label="1">
                指定权限
              </el-radio>
            </el-radio-group>
          </div>
          <template v-if="dataForm.premType===1">
            <el-tree
              v-if="dataForm.sysType===1"
              ref="menuListTreeRef"
              :data="treeDataShopMenuList"
              style="flex:1"
              :props="menuListTreeProps"
              node-key="menuId"
              show-checkbox
            />
            <el-tree
              v-else-if="dataForm.sysType===2"
              ref="menuListTreeRef"
              :data="treeDateSysMenuList"
              style="flex:1"
              :props="menuListTreeProps"
              node-key="menuId"
              show-checkbox
            />
            <el-tree
              v-else-if="dataForm.sysType===3"
              ref="menuListTreeRef"
              :data="treeDataSupplierMenuList"
              style="flex:1"
              :props="menuListTreeProps"
              node-key="menuId"
              show-checkbox
            />
          </template>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">
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
import * as api from '@/api/rbac/sys-access-key'
import { listWithPermissions as httpListWithPermissions } from '@/api/rbac/menu'
import { getManageDetail as httpShopGetManageDetail } from '@/api/platform/audit-shop'
import { getManageDetail as httpSupplierGetManageDetail } from '@/api/platform/audit-supplier'
import { ElMessage } from 'element-plus'
import { computed, nextTick, watch } from 'vue'

const emit = defineEmits(['refreshDataList'])

const visible = ref(false)
const dataForm = reactive({
  sysAccessKeyId: 0,
  name: null,
  remark: null,
  accessId: null,
  accessKey: null,
  sysType: 0,
  usabilityShopId: 0
})
const typeList = [
  { sysType: 0, label: '用户端' },
  { sysType: 1, label: '商家端' },
  { sysType: 3, label: '供应商' },
  { sysType: 2, label: '平台端' }
]

const menuListTreeRef = ref(null)
const menuList = ref([])
const sysMenuList = ref([])
const shopMenuList = ref([])
const supplierMenuList = ref([])
const menuListTreeProps = reactive({
  label: 'title',
  children: 'children'
})
const treeDataShopMenuList = computed(() => menuWithPermissionToTree(shopMenuList.value))
const treeDateSysMenuList = computed(() => menuWithPermissionToTree(sysMenuList.value))
const treeDataSupplierMenuList = computed(() => menuWithPermissionToTree(supplierMenuList.value))

const validName = (rule, value, callback) => {
  if (validNoEmptySpace(value)) {
    callback(new Error('内容不能只有空格'))
  }
  callback()
}

const dataRule = {
  name: [
    { required: true, message: '请输入密钥名称', trigger: 'blur' },
    { validator: validName, trigger: 'blur' }
  ]
}

const dataFormRef = ref(null)
const init = (sysAccessKeyId) => {
  dataForm.sysAccessKeyId = sysAccessKeyId || 0
  dataForm.sysType = 0
  visible.value = true
  let nodeList = []
  menuList.value = []
  nextTick(() => {
    dataFormRef.value?.resetFields()
    // 1商家 2平台 3供应商 菜单列表和按钮列表
    Promise.all([
      httpListWithPermissions({ sysType: 1 }),
      httpListWithPermissions({ sysType: 2 }),
      httpListWithPermissions({ sysType: 3 })
    ]).then(responses => {
      const [res, res2, res3] = responses
      shopMenuList.value = res
      sysMenuList.value = res2
      supplierMenuList.value = res3
    }).then(() => {
      if (!dataForm.sysAccessKeyId) {
        menuList.value = [treeDataShopMenuList.value, treeDateSysMenuList.value, treeDataSupplierMenuList.value][dataForm.sysType - 1]
        return
      }
      api.get(sysAccessKeyId).then(data => {
        dataForm.name = data.name
        dataForm.remark = data.remark
        dataForm.accessId = data.accessId
        dataForm.accessKey = data.accessKey
        dataForm.usabilityShopId = data.usabilityShopId
        dataForm.sysType = data.sysType
        if ([1, 2, 3].includes(dataForm.sysType)) {
          menuList.value = [treeDataShopMenuList.value, treeDateSysMenuList.value, treeDataSupplierMenuList.value][dataForm.sysType - 1]
        }
        if (dataForm.sysAccessKeyId) {
          nodeList = getNode(menuList.value)
        }
        dataForm.shopRange = data.usabilityShopId !== 0 ? 2 : 1
        if (data.premType) dataForm.premType = data.premType

        const selectMenuIdList = data.menuIdList.concat(data.menuPermissionId.map((item) => (item + tempPermissionToMenuKey))).filter(x => !nodeList.includes(x))
        nextTick(() => {
          menuListTreeRef.value?.setCheckedKeys(selectMenuIdList)
        })
      })
    })
  })
}

// 查找菜单节点id
const getNode = (list) => {
  const res = []
  list.forEach(item => {
    if (item.children) {
      res.push(item.menuId, ...getNode(item.children))
    }
  })
  return res
}
// 查找菜单节点id
const updateSysType = (sysType) => {
  dataForm.usabilityShopId = 0
  dataForm.menuIdList = []
  let nodeList = []
  if (sysType === 1) {
    menuList.value = treeDataShopMenuList.value
  } else if (sysType === 2) {
    menuList.value = treeDateSysMenuList.value
  } else if (sysType === 3) {
    menuList.value = treeDataSupplierMenuList.value
  }
  if (dataForm.sysAccessKeyId) {
    nodeList = getNode(menuList.value)
  }
  const selectMenuIdList = dataForm.menuIdList.filter(x => !nodeList.includes(x))
  menuListTreeRef.value?.setCheckedKeys(selectMenuIdList)
}
// 表单提交
const onSubmit = () => {
  const menuPermissionId = []
  const menuIdList = []
  // const menuIdList = [].concat(menuListTreeRef.value?.getCheckedKeys(), menuListTreeRef.value?.getHalfCheckedKeys())
  const checkeNode = [].concat(menuListTreeRef.value?.getCheckedNodes(), menuListTreeRef.value?.getHalfCheckedNodes()).map(item => {
    if (item.type === 1) {
      menuPermissionId.push(item.menuPermissionId)
    } else if (item.type === 0) {
      menuIdList.push(item.menuId)
    }
    return item
  })

  if (!checkeNode.length && dataForm.sysType !== 0 && dataForm.premType === 1) {
    return ElMessage({
      message: '请选择授权项！',
      type: 'warning',
      duration: 1500
    })
  }
  dataForm.menuIdList = dataForm.premType === 1 ? menuIdList : undefined
  dataForm.menuPermissionId = dataForm.premType === 1 ? menuPermissionId : undefined
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    const request = dataForm.sysAccessKeyId ? api.update(dataForm) : api.save(dataForm)
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
  })
}
// 获取商家/供应商 信息
watch(() => dataForm.usabilityShopId, (val) => {
  if (val) {
    getshopInfo(val)
  }
})

watch(() => [dataForm.sysType, dataForm.shopRange], ([sysType, shopRange]) => {
  if (![1, 3].includes(sysType) || shopRange !== 2) {
    dataForm.usabilityShopId = 0
  }
  showInfo.value = null
})
const showInfo = ref(null)
// 获取商家/供应商信息
const getshopInfo = (shopId) => {
  // httpShopGetManageDetail商家 httpSupplierGetManageDetail供应商 请求
  // 需要根据dataForm.sysType 判断是哪个请求
  [httpShopGetManageDetail, httpSupplierGetManageDetail][dataForm.sysType - 1]({
    [['shopId', 'supplierId'][[dataForm.sysType - 1]]]: shopId
  }).then((data) => {
    showInfo.value = data
  })
}
// 用于临时将权限转化为"菜单"的key
const tempPermissionToMenuKey = 5498415864
// 把菜单和菜单资源数据生成树状结构（参数为数据menuWithPermissionsParam）
const menuWithPermissionToTree = (menuWithPermissionsParam) => {
  const tempMenus = []
  for (const key in menuWithPermissionsParam) {
    const menuWithPermission = menuWithPermissionsParam[key]
    tempMenus.push({
      menuId: menuWithPermission.menuId,
      parentId: menuWithPermission.parentId,
      title: menuWithPermission.title,
      type: 0 // 0 菜单 1按钮
    })
    if (menuWithPermission.menuPermissions.length) {
      const permissions = menuWithPermission.menuPermissions
      for (const pkey in permissions) {
        const permission = permissions[pkey]
        tempMenus.push({
          menuId: permission.menuPermissionId + tempPermissionToMenuKey,
          menuPermissionId: permission.menuPermissionId,
          parentId: permission.menuId,
          title: permission.name,
          type: 1 // 0 菜单 1按钮
        })
      }
    }
  }

  return treeDataTranslate(tempMenus, 'menuId')
}

defineExpose({ init })
</script>
