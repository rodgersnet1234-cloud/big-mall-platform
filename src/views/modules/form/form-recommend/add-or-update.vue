<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.formId ? $t('table.edit'): $t('table.create')"
    class="form-recommend-add-or-update"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="dataRule"
      label-position="right"
      label-width="180px"
      @submit.prevent
    >
      <el-form-item
        :label="'报表名称'"
        prop="formName"
      >
        <el-input
          v-model="dataForm.formName"
          :placeholder="'请输入报表名称'"
          maxlength="50"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item :label="'报表介绍'">
        <el-input
          v-model="dataForm.content"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          :placeholder="'请输入推荐报表的介绍内容'"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        :label="'时间周期'"
        prop="timeType"
      >
        <el-radio-group v-model="dataForm.timeType">
          <el-radio :label="1">
            {{ '自然日' }}
          </el-radio>
          <el-radio :label="2">
            {{ '自然周' }}
          </el-radio>
          <el-radio :label="3">
            {{ '自然月' }}
          </el-radio>
        </el-radio-group>
        <el-tooltip
          class="item"
          effect="light"
          :content="'根据选择的类型，生成对应时间周期的报表'"
          placement="top"
        >
          <span>
            <el-icon class="question"><QuestionFilled /></el-icon>
          </span>
        </el-tooltip>
      </el-form-item>
      <el-form-item
        :label="'时间范围'"
        prop="timeRange"
        style="width:500px;"
      >
        <el-input
          v-model="dataForm.timeRange"
          :placeholder="'时间不能为空'"
          @change="setTimeRange"
        >
          <template #prepend>
            {{ '近' }}
          </template>
          <template #append>
            {{ dataForm.timeType === 1? '天' : dataForm.timeType === 2?'周':'月' }}
            <el-tooltip
              class="item"
              effect="light"
              :content="'如选择近1天，则该报表会自动更新为当前天的数据，近2天，则该报表会自动更新为当前天 + 昨天的数据'"
              placement="top"
            >
              <span>
                <el-icon class="question"><QuestionFilled /></el-icon>
              </span>
            </el-tooltip>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        :label="'序号'"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          controls-position="right"
          :min="1"
          :max="100000000"
          @change="seqChange"
        />
      </el-form-item>
      <el-form-item
        :label="'选择指标'"
        prop="formItem"
      >
        <el-card class="box-card">
          <el-row style="width:100%">
            <el-col
              v-for="item in formItemList"
              :key="item.id"
              :span="4"
            >
              <el-link
                v-if="!item.select"
                :underline="false"
                class="buttonClick"
                @click="onSelectItem(item.id,true)"
              >
                {{ item.value }}
              </el-link>
              <el-link
                v-else
                :underline="false"
                type="success"
                class="buttonClick"
                @click="onSelectItem(item.id,false)"
              >
                {{ item.value }}
              </el-link>
            </el-col>
          </el-row>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-tag
          v-for="item in formItemListSelect"
          :key="item.id"
          closable
          class="tag"
          type="info"
          @close="onSelectItem(item.id,false)"
        >
          {{ item.value }}
        </el-tag>
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
import * as api from '@/api/form/form'
import { Debounce } from '@/utils/debounce'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['refreshDataList'])
// eslint-disable-next-line no-unused-vars
const validateNumber = (rule, value, callback) => {
  const reg = /[^\d]/
  if (!reg.test(value) && value > 0) {
    callback()
  } else {
    callback(new Error('请输入大于0的数字'))
  }
}
// eslint-disable-next-line no-unused-vars
const validateName = (rule, value, callback) => {
  if (!value || !value.trim()) {
    callback(new Error('报表名称不能为空'))
  } else {
    callback()
  }
}
const dataRule = {
  formName: [
    { required: true, message: '报表名称不能为空', trigger: 'blur' },
    { validator: validateName, trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '开始时间不能为空', trigger: 'blur' }
  ],
  endTime: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' }
  ],
  timeRange: [
    { required: true, message: '结束时间不能为空', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' }
  ]
}
// 获取分类数据 formType true:推荐报表
const dataForm = ref({
  formId: 0,
  formName: '',
  content: '',
  timeType: 2,
  formItemIds: '',
  startTime: '',
  endTime: '',
  timeRange: 1,
  time: '',
  seq: 1
})
const dataFormRef = ref(null)
const formItemListSelect = ref([])
const visible = ref(false)
const onInit = (id) => {
  visible.value = true
  dataForm.value.formId = id || 0
  nextTick(() => {
    dataForm.value.formName = ''
    dataForm.value.content = ''
    dataForm.value.timeType = 2
    dataForm.value.formItemIds = ''
    dataForm.value.timeRange = 1
    dataForm.value.seq = 1
    dataForm.value.time = ''
    formItemListSelect.value = []
    dataFormRef.value?.resetFields()
  })
  if (dataForm.value.formId) {
    // 获取产品数据
    api.get(dataForm.value.formId).then(data => {
      dataForm.value = data
      dataForm.value.time = dataForm.value.startTime && dataForm.value.endTime ? [moment(dataForm.value.startTime, 'YYYY-MM-DD'), moment(dataForm.value.endTime, 'YYYY-MM-DD')] : []
      onGetFormItem()
    })
  } else {
    nextTick(() => {
      dataFormRef.value?.resetFields()
      dataForm.value.imgUrl = ''
    })
    onGetFormItem()
  }
}
const seqChange = () => {
  if (!dataForm.value.seq) {
    dataForm.value.seq = 1
  }
}

/**
 * 指定时间范围输入框验证
 */
const setTimeRange = () => {
  const num = Math.round(dataForm.value.timeRange)
  dataForm.value.timeRange = num < 1 ? 1 : num
  if (num >= 100000000) {
    dataForm.value.timeRange = 100000000
  }
}

/**
 * 获取报表项数据
 */
const formItemList = ref([])

const onGetFormItem = () => {
  api.getFormItem(2).then(data => {
    formItemList.value = data
    if (dataForm.value.formItemIds) {
      const ids = dataForm.value.formItemIds.split(',')
      formItemList.value.forEach(element => {
        if (ids.indexOf(element.id.toString()) > -1) {
          element.select = true
          formItemListSelect.value.push(element)
        }
      })
    }
  })
}
/**
 * 选择报表项
 */
const onSelectItem = (id) => {
  formItemListSelect.value = []
  formItemList.value.forEach(element => {
    if (element.id === id) {
      element.select = !element.select
    }
    if (element.select) {
      formItemListSelect.value.push(element)
    }
  })
}
// 表单提交
let isSubmit = true
const onSubmit = Debounce(() => {
  dataForm.value.recommendForm = true
  dataForm.value.timeFormat = 2
  dataFormRef.value?.validate((valid) => {
    if (valid) {
      if (formItemListSelect.value.length < 1) {
        ElMessage.error('请选择指标')
        return
      }
      if (!isSubmit) {
        return true
      }
      if (dataForm.value.timeFormat === 1) {
        dataForm.value.startTime = dataForm.value.time[0]
        dataForm.value.endTime = dataForm.value.time[1]
      }
      isSubmit = false
      dataForm.value.formItemIds = onGetFormItemIds()
      const param = dataForm.value
      const request = param.formId ? api.update(param) : api.save(param)
      request.then(() => {
        ElMessage({
          message: $t('table.actionSuccess'),
          type: 'success',
          duration: 1500,
          onClose: () => {
            isSubmit = true
            visible.value = false
            emit('refreshDataList')
            dataFormRef.value?.resetFields()
          }
        })
      }).catch(() => {
        isSubmit = true
      })
    }
  })
})
/**
 * 获取已选择的报表项id
 */
const onGetFormItemIds = () => {
  let ids = ''
  formItemListSelect.value.forEach(item => {
    ids = ids + item.id + ','
  })
  ids = ids.substring(0, ids.length - 1)
  return ids
}
defineExpose({ onInit })
</script>
<style lang="scss" scoped>
.form-recommend-add-or-update{
  .tag {
  margin: 0 10px;
}
}

</style>
