<template>
  <div class="component-live-add-or-update">
    <el-dialog
      v-model="visible"
      :title="$t('liveRoom.viewLRoomInfo')"
      :close-on-click-modal="false"
      style="min-width:950px"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        label-width="120px"
        @submit.prevent
      >
        <el-form-item
          :label="$t('liveRoom.roomName')"
          prop="name"
        >
          <el-input
            v-model.trim="dataForm.name"
            disabled
            maxlength="17"
            show-word-limit
            style="width:534px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('liveRoom.anchorName')"
          prop="nickName"
        >
          <el-input
            v-model.trim="dataForm.nickName"
            maxlength="15"
            disabled
            show-word-limit
            style="width:534px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('liveRoom.anchorMobile')"
          prop="userMobile"
        >
          <el-input
            v-model="dataForm.userMobile"
            :maxlength="11"
            disabled
            style="width:534px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('liveRoom.liveTime')"
          class="liveTime"
        >
          <div class="live-time-row">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="dataForm.startTime"
                disabled
                type="date"
                :picker-options="pickerOptions"
                value-format="YYYY-MM-DD"
                style="width:144px"
              />
              <el-time-select
                v-model="startTimeValue"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30'
                }"
                style="width:106px"
                disabled
                :placeholder="$t('time.startTime')"
              />
            </el-form-item>
            <div class="tip">
              {{ $t("date.tip") }}
            </div>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="dataForm.endTime"
                disabled
                type="date"
                :picker-options="pickerOptions"
                value-format="YYYY-MM-DD"
                style="width:144px"
              />
              <el-time-select
                v-model="endTimeValue"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '23:30'
                }"
                style="width:106px"
                disabled
                :placeholder="$t('time.endTime')"
              />
            </el-form-item>
            <br>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('liveRoom.liveBackgroundImage')"
          prop="coverImg"
        >
          <img-upload
            v-model="dataForm.coverImg"
            disabled
          />
        </el-form-item>
        <!-- <el-form-item
          :label="$t('liveRoom.anchorSharingPicture')"
          prop="shareImg"
        >
          <img-upload
            v-model="dataForm.shareImg"
            disabled
          />
        </el-form-item> -->
        <el-form-item
          :label="$t('liveRoom.liveCoverImage')"
          prop="feedsImg"
        >
          <img-upload
            v-model="dataForm.feedsImg"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="直播商品"
          style="width: 900px"
          class="prods-box"
          required
        >
          <el-row>
            <el-col
              v-for="(liveProd, index) in liveRoomProdList"
              :key="index"
              :span="4"
              style="margin-bottom: 10px;"
            >
              <el-card
                :body-style="{ padding: '0px' }"
                style="height: 140px; width: 120px"
              >
                <ImgShow
                  :src="liveProd.mainImgUrl"
                  :img-style="{width:'100%',height:'104px'}"
                />
                <div class="card-prod-bottom">
                  <div class="card-prod-name">
                    {{ liveProd.spuName }}
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button
          @click="back()"
        >
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import * as http from '@/api/live/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDateTimeRange, getParseTime } from '@/utils/datetime'
const emit = defineEmits(['refreshDataList'])
const Data = reactive({
  pickerOptions: {
    disabledDate (time) {
      return time.getTime() < (new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime())
    }
  },
  liveRoomProdList: [],
  dataForm: {
    roomId: null,
    name: null,
    nickName: null,
    userMobile: null,
    coverImg: null,
    shareImg: null,
    feedsImg: null,
    liveStatus: null,
    startTime: null,
    endTime: null
  },
  visible: false,
  startTimeValue: '',
  endTimeValue: '',
  isDisabledDate: false
})
const { pickerOptions, liveRoomProdList, dataForm, startTimeValue, endTimeValue, visible } = toRefs(Data)

const dataFormRef = ref()
const init = (data) => {
  if (data) {
    Data.dataForm = JSON.parse(JSON.stringify(data))
    Data.dataForm.roomId = data.roomId
  } else {
    Data.dataForm.liveStatus = 0
  }
  Data.visible = true
  Data.isSubmit = false
  Data.liveRoomProdList = []
  nextTick(() => {
    dataFormRef.value.resetFields()
    const datetimeRange = getDateTimeRange()
    Data.dataForm.startTime = datetimeRange.startTime
    Data.dataForm.endTime = datetimeRange.endTime
    Data.startTimeValue = datetimeRange.currentTime
    Data.endTimeValue = datetimeRange.currentTime
    if (Data.dataForm.roomId) {
      http.getLiveRoomInfo(Data.dataForm.roomId).then((data) => {
        Data.dataForm = JSON.parse(JSON.stringify(data))
        Data.tmepStartTime = data.startTime
        Data.startTimeValue = Data.dataForm.startTime ? Data.dataForm.startTime.substring(11, Data.dataForm.startTime.length - 3) : ''
        Data.endTimeValue = Data.dataForm.endTime ? Data.dataForm.endTime.substring(11, Data.dataForm.endTime.length - 3) : ''
        Data.dataForm.startTime = getParseTime(Data.dataForm.startTime, '{y}-{m}-{d}')
        Data.dataForm.endTime = getParseTime(Data.dataForm.endTime, '{y}-{m}-{d}')
        // 当前时间超出开始时间时，开始时间不可修改
        if (new Date() > Date.parse(data.startTime)) {
          Data.isDisabledDate = true
        } else {
          startTimeCountDown()
        }
      })
      // 获取商品列表
      http.getLiveRoomProdPage(Data.dataForm.roomId).then((data) => {
        Data.liveRoomProdList = data.map(x => x.spuSearchVO)
        if (Data.dataForm.status !== null && Data.dataForm.status === -1) {
          // 用户注销
          ElMessage($t('live.liveAnchorNotExist'))
        } else if (Data.dataForm.status !== null && Data.dataForm.status !== 1) {
          // 用户禁用
          ElMessageBox.confirm($t('live.liveAnchorError'))
        }
      })
    }
  })
}

// 直播开始时间倒计时
const startTimeCountDown = () => {
  if (new Date().getTime() < Date.parse(Data.tmepStartTime)) {
    Data.liveTimer = setTimeout(Data.startTimeCountDown, 1000)
  } else {
    Data.isDisabledDate = true
    Data.liveTimer && clearTimeout(Data.liveTimer)
  }
}
defineExpose({ init })
const back = () => {
  Data.visible = false
  emit('refreshDataList')
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item__content) {
  display: block;
}

.live-time-row {
  display: flex;

  .tip {
    margin: 0 10px;
  }
}

.liveTime ::v-deep(.el-form-item__error) {
  top: 60px;
}

.liveTime ::v-deep(.el-form-item__label:before) {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}

.prods-box {
  .card-prod-bottom {
    .card-prod-name {
      display: block;
      padding: 0 5px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
.component-live-add-or-update{
  .btn-box{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
