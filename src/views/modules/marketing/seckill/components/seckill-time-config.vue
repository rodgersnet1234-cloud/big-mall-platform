<template>
  <div class="components-seckill-time-config app-container">
    <!-- 新的秒杀页 -->
    <div class="seckill-container">
      <!--  秒杀设置 -->
      <div class="content-box">
        <div class="content">
          <div class="message">
            操作提示:
          </div>
          <div class="description">
            <p>每日开展多场秒杀活动，场次由平台进行设置，以整点为场次开始时间，每日最多设置12场</p>
            <p>商家可自由选择参加场次</p>
            <p>每场秒杀活动固定2小时结束</p>
          </div>
        </div>
      </div>
      <div class="time-table">
        <el-row>
          <el-col :span="2">
            <div class="left">
              每日场次设置：
            </div>
          </el-col>
          <el-col :span="22">
            <div class="right">
              <div
                v-for="item in timeTable"
                :key="item.value"
                class="time-item"
              >
                <div
                  :class="item.active?'time-active':''"
                  @click="selectTime(item.value)"
                >
                  {{ item.label }}
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="left">
              秒杀轮播图设置：
            </div>
          </el-col>
          <el-col :span="22">
            <div class="time-item">
              <div class="part-form-item">
                <imgs-upload
                  v-model="dataForm.imgUrls"
                  :limit="5"
                />
                <div class="banner-tips">
                  秒杀轮播海报，建议尺寸750px*240px，最多添加5张，大小不超过2M;
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="bar-button">
        <el-button
          v-permission="['seckill:time:save']"
          type="primary"
          @click="onSaveTime"
        >
          保 存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as api from '@/api/seckill/seckill-time.js'
import imgsUpload from '@/components/imgs-upload/index.vue'
import { ElMessage } from 'element-plus'

const timeTable = ref([{
  value: 0,
  label: '00:00',
  active: false
}, {
  value: 1,
  label: '01:00',
  active: false
}, {
  value: 2,
  label: '02:00',
  active: false
}, {
  value: 3,
  label: '03:00',
  active: false
}, {
  value: 4,
  label: '04:00',
  active: false
}, {
  value: 5,
  label: '05:00',
  active: false
}, {
  value: 6,
  label: '06:00',
  active: false
}, {
  value: 7,
  label: '07:00',
  active: false
}, {
  value: 8,
  label: '08:00',
  active: false
}, {
  value: 9,
  label: '09:00',
  active: false
}, {
  value: 10,
  label: '10:00',
  active: false
}, {
  value: 11,
  label: '11:00',
  active: false
}, {
  value: 12,
  label: '12:00',
  active: false
}, {
  value: 13,
  label: '13:00',
  active: false
}, {
  value: 14,
  label: '14:00',
  active: false
}, {
  value: 15,
  label: '15:00',
  active: false
}, {
  value: 16,
  label: '16:00',
  active: false
}, {
  value: 17,
  label: '17:00',
  active: false
}, {
  value: 18,
  label: '18:00',
  active: false
}, {
  value: 19,
  label: '19:00',
  active: false
}, {
  value: 20,
  label: '20:00',
  active: false
}, {
  value: 21,
  label: '21:00',
  active: false
}, {
  value: 22,
  label: '22:00',
  active: false
}, {
  value: 23,
  label: '23:00',
  active: false
}])
const dataForm = reactive({
  seckillTimeList: [],
  imgUrls: '',
  remark: '',
  paramKey: '',
  paramValue: ''
})
const seckillTimeList = ref([])
onMounted(() => {
  dataForm.paramValue = ''
  getData()
})

// 点击选中时间端
const selectTime = (value) => {
  let count = 0
  timeTable.value[value].active = !timeTable.value[value].active
  timeTable.value.forEach((item) => {
    if (item.active) {
      count++
    }
  })
  if (count > 12) {
    timeTable.value[value].active = !timeTable.value[value].active
    ElMessage({
      message: '最多选择12个场次',
      type: 'warning'
    })
    return
  }
  const selsetArr = []
  seckillTimeList.value = []
  timeTable.value.forEach((item) => {
    if (item.active) {
      selsetArr.push(item.value)
      seckillTimeList.value.push(item.value)
    }
  })
}

// 获取数据
const getData = () => {
  nextTick(() => {
    api.get('SECKILL_TIME_CONFIG').then(data => {
      if (data != null && data !== '') {
        const result = JSON.parse(data.paramValue)
        dataForm.imgUrls = result.imgUrls
        dataForm.seckillTimeList = result.seckillTimeList
        seckillTimeList.value = dataForm.seckillTimeList
        seckillTimeList.value.forEach(element => {
          for (let i = 0; i < timeTable.value.length; i++) {
            const item = timeTable.value[i]
            if (item.value === element) {
              item.active = true
              break
            }
          }
        })
      }
    })
  })
}

// 提交表单
const onSaveTime = () => {
  const value = {
    seckillTimeList: seckillTimeList.value,
    imgUrls: dataForm.imgUrls
  }
  dataForm.paramValue = JSON.stringify(value)
  dataForm.remark = '秒杀场次选择'
  dataForm.paramKey = 'SECKILL_TIME_CONFIG'
  api.saveOrUpdate(dataForm).then(() => {
    getData()
    ElMessage({
      message: $t('table.actionSuccess'),
      type: 'success',
      duration: 1500
    })
  })
}

</script>
<style lang="scss" scoped>
.seckill-container {
  .content-box {
    margin-bottom: 16px;
    background-color: #cde3f8;
    border: 1px solid #7cbdfa;
    .content {
      padding: 15px;
      .description {
        font-size: 14px;
        line-height: 7px;
      }
    }
  }
  .part-form-item {
    width: 100%;
    margin-top: 20px;
    // 轮播图
    .banner-tips {
      margin-top: 10px;
      font-size: 13px;
      color: #999;
    }
  }
  .time-table{
    .left{
      font-size: 16px;
    }
    .right{
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      box-sizing: border-box;
      .time-item{
        flex: 0 0 12.5%;
        width: 100px;
        border: 1px solid rgb(221, 221, 221);
        height: 50px;
        line-height: 50px;
        text-align: center;
        display: inline-block;
        font-size: 14px;
        color: #727272;
        cursor: pointer;
        .time-active{
          color: #ffffff;
          background-color: #7cbdfa;
        }
      }
    }
  }
  .bar-button {
    z-index: 1;
    width: 100%;
    bottom: 0;
    padding: 10px 20px;
    background: #fff;
    margin-left: -24px;
  }
}
</style>
