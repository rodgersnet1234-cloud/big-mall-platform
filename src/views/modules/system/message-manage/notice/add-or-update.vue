<template>
  <el-dialog
    v-model="visible"
    :title="dataForm.id? $t('table.edit'): $t('table.create')"
    :close-on-click-modal="false"
    top="5vh"
    class="natice-dialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-position="right"
      label-width="90px"
      style="margin: 0 20px;"
      @submit.prevent
    >
      <!-- 公告标题 -->
      <el-form-item
        :label="$t('platform.notice.title')"
        prop="title"
      >
        <el-input
          v-model="dataForm.title"
          placeholder="请输入公告标题"
          show-word-limit
          maxlength="30"
        />
      </el-form-item>
      <el-form-item
        label="发送时间"
        prop="type"
      >
        <el-radio-group v-model="dataForm.immediatelySend">
          <el-radio :label="1">
            立即发送
          </el-radio>
          <el-radio :label="0">
            定时发送
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="dataForm.immediatelySend === 0"
        label="选择时间"
        prop="type"
      >
        <el-date-picker
          v-model="dataForm.sendTime"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="datetime"
          placeholder="输入选择发送时间"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item
        label="公告类型"
        prop="type"
      >
        <el-checkbox-group v-model="dataForm.types">
          <el-checkbox :label="1">
            商家
          </el-checkbox>
          <el-checkbox :label="2">
            用户
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-show="dataForm.types.includes(1)"
        label="商家范围"
        prop="type"
      >
        <el-radio-group v-model="dataForm.shopRange">
          <el-radio :label="1">
            全部商家
          </el-radio>
          <el-radio :label="2">
            指定商家
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <select-account-range
        v-if="dataForm.shopRange == 2 && dataForm.types.includes(1)"
        :table-list="dataForm.shopDetailVOList"
        :type="1"
        @get-ids="(ids) => dataForm.multiShopIds = ids"
      />
      <!-- <el-form-item
        v-show="dataForm.types.includes(3)"
        label="供应商范围"
        prop="type"
      >
        <el-radio-group v-model="dataForm.supplierRange">
          <el-radio :label="1">
            全部供应商
          </el-radio>
          <el-radio :label="2">
            指定供应商
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <select-account-range
        v-if="dataForm.supplierRange == 2 && dataForm.types.includes(3)"
        :table-list="dataForm.supplierDetailList"
        :type="3"
        @get-ids="(ids) => dataForm.supplierIds = ids"
      /> -->
      <el-form-item
        v-show="dataForm.types.includes(2)"
        label="用户范围"
        prop="type"
      >
        <el-radio-group v-model="dataForm.userRange">
          <el-radio :label="1">
            全部用户
          </el-radio>
          <el-radio :label="2">
            指定用户
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <select-account-range
        v-if="dataForm.userRange == 2 && dataForm.types.includes(2)"
        :type="2"
        :table-list="dataForm.userDtailList"
        @get-ids="(ids) => dataForm.userIds = ids"
      />
      <!-- 状态(1:公布 0:撤回) -->
      <el-form-item
        :label="$t('platform.notice.status')"
        prop="status"
      >
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="1">
            公布
          </el-radio>
          <el-radio :label="0">
            撤销
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 是否置顶 -->
      <el-form-item
        :label="$t('platform.notice.isTop')"
        prop="isTop"
      >
        <el-radio-group v-model="dataForm.isTop">
          <el-radio :label="0">
            否
          </el-radio>
          <el-radio :label="1">
            是
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 公告内容 -->
      <el-form-item
        :label="$t('platform.notice.content')"
        prop="content"
      >
        <tiny-mce
          v-if="tinyMceConLoad"
          ref="contentRef"
          v-model="dataForm.content"
        />
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
import * as api from '@/api/platform/notice'
import TinyMce from '@/components/tiny-mce/index.vue'
import { Debounce } from '@/utils/debounce'
import SelectAccountRange from '@/components/select-account-range/index.vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['refreshDataList'])

const pickerOptions = reactive({
  // 设置禁用状态，参数为当前日期
  disabledDate (time) {
    // return time.getTime() < Date.now(); //当天不可选
    return time.getTime() < new Date().getTime() - 86400000 //  - 86400000是否包括当天
  },
  // 控制时分秒不可选
  selectableRange: (() => {
    const data = new Date()
    const hour = data.getHours()
    const minute = data.getMinutes()
    const second = data.getSeconds()
    return [`${hour}:${minute}:${second} - 23:59:59`]
  })()
})
const visible = ref(false)
const dataForm = reactive({
  // id: 1, // 公告id
  // shopId: 1, // 店铺id
  title: '', // 公告标题
  content: '', // 公告内容
  status: 1, // 状态(1:公布 0:撤回)
  isTop: 0, // 是否置顶
  sendTime: '', // 发送时间
  types: [],
  immediatelySend: 1,
  shopRange: 1,
  supplierRange: 1,
  userRange: 1,
  multiShopIds: [],
  supplierIds: [],
  userIds: []
})
const validateTitle = (rule, value, callback) => {
  if (!value) {
    callback(new Error('公告标题不能为空'))
  } else {
    callback()
  }
}
const validateContent = (rule, value, callback) => {
  if (!value) {
    callback(new Error('公告内容不能为空'))
  } else {
    callback()
  }
}
const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { validator: validateTitle, trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { validator: validateContent, trigger: 'change' }
  ]
}
const contentRef = ref()
const dataFormRef = ref()
const tinyMceConLoad = ref(false)
const init = (id) => {
  dataForm.id = id || 0
  dataForm.isTop = 0
  dataForm.status = 1
  dataForm.sendTime = ''
  dataForm.types = []
  dataForm.immediatelySend = 1
  dataForm.shopRange = 1
  dataForm.supplierRange = 1
  dataForm.userRange = 1
  dataForm.multiShopIds = []
  dataForm.supplierIds = []
  dataForm.userIds = []
  dataForm.shopDetailVOList = []
  dataForm.supplierDetailList = []
  dataForm.userDtailList = []
  visible.value = true
  tinyMceConLoad.value = false
  nextTick(() => {
    dataFormRef.value?.resetFields()
    if (!dataForm.id) {
      tinyMceConLoad.value = true
      return
    }
    api.get(id).then(data => {
      dataForm.title = data.title
      dataForm.content = data.content
      tinyMceConLoad.value = true
      dataForm.status = data.status
      dataForm.isTop = data.isTop
      dataForm.sendTime = data.sendTime
      dataForm.types = data.types
      dataForm.immediatelySend = data.immediatelySend
      dataForm.multiShopIds = data.multiShopIds
      dataForm.supplierIds = data.supplierIds
      dataForm.userIds = data.userIds
      dataForm.types = dataForm.types.split(',').map(Number)
      dataForm.shopDetailVOList = data.shopDetailVOList
      dataForm.userDtailList = data.userDtailList
      dataForm.supplierDetailList = data.supplierDetailList
      if (!dataForm.shopDetailVOList) {
        dataForm.shopDetailVOList = []
        dataForm.multiShopIds = []
      } else {
        dataForm.multiShopIds = dataForm.shopDetailVOList.map(item => item.shopId)
      }
      if (!dataForm.userDtailList) {
        dataForm.userDtailList = []
        dataForm.userIds = []
      } else {
        dataForm.userIds = dataForm.userDtailList.map(item => item.userId)
      }
      if (!dataForm.supplierDetailList) {
        dataForm.supplierDetailList = []
        dataForm.supplierIds = []
      } else {
        dataForm.supplierIds = dataForm.supplierDetailList.map(item => item.supplierId)
      }
      dataForm.types.forEach(type => {
        if (type === 1 && dataForm.shopDetailVOList.length > 0) {
          dataForm.shopRange = 2
        }
        if (type === 2 && dataForm.userDtailList.length > 0) {
          dataForm.userRange = 2
        }
        if (type === 3 && dataForm.supplierDetailList.length > 0) {
          dataForm.supplierRange = 2
        }
      })
    })
  })
}
// 表单提交
const onSubmit = Debounce(() => {
  dataFormRef.value?.validate(valid => {
    if (!valid) {
      return
    }
    if (dataForm.immediatelySend === 0 && !dataForm.sendTime) {
      ElMessage({
        message: '请选择发送时间',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.types.length === 0) {
      ElMessage({
        message: '请选择公告类型',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.shopRange === 2 && !dataForm.multiShopIds.length) {
      ElMessage({
        message: '请选择指定商家',
        type: 'error',
        duration: 1500
      })
      return
    }
    // if (dataForm.supplierRange === 2 && !dataForm.supplierIds.length) {
    //   ElMessage({
    //     message: '请选择指定供应商',
    //     type: 'error',
    //     duration: 1500
    //   })
    //   return
    // }
    if (dataForm.userRange === 2 && !dataForm.userIds.length) {
      ElMessage({
        message: '请选择指定用户',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (dataForm.shopRange === 1) {
      dataForm.multiShopIds = []
    }
    if (dataForm.supplierRange === 1) {
      dataForm.supplierIds = []
    }
    if (dataForm.userRange === 1) {
      dataForm.userIds = []
    }
    const isContentLimit = LimitWordCount()
    if (!isContentLimit) {
      return ElMessage({
        message: '公告内容字数过多，请重新输入！',
        type: 'error',
        duration: 1500
      })
    }
    const obj = JSON.parse(JSON.stringify(dataForm))
    obj.types = obj.types.length > 0 ? obj.types.join(',') : null
    obj.multiShopIds = obj.multiShopIds.length > 0 ? obj.multiShopIds.join(',') : null
    obj.supplierIds = obj.supplierIds.length > 0 ? obj.supplierIds.join(',') : null
    obj.userIds = obj.userIds.length > 0 ? obj.userIds.join(',') : null
    const request = dataForm.id ? api.update(obj) : api.save(obj)
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
}, 1500)

/**
 * 富文本字数限制
 */
const LimitWordCount = () => {
  if (!dataForm.content) return true
  // 获取富文本中的内容（去标签去空格）
  const contentStr = dataForm.content
    .replace(/<[^<>]+>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/(\s)+/gi, '')
  // 限制不超过两万字
  return contentStr.length < 20000
}
defineExpose({ init })
</script>

<style lang="scss" scoped>
</style>
