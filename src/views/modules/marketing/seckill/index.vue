<template>
  <div class="app-container">
    <!-- 新的秒杀页 -->
    <div class="seckill-container">
      <div class="headline">
        <h3>
          整点秒杀
          <small>当前参与商家{{ num }}个</small>
        </h3>
      </div>
      <div class="tabs">
        <el-tabs>
          <el-tab-pane label="秒杀设置">
            <seckill-time ref="seckillTimeRef" />
          </el-tab-pane>
          <el-tab-pane label="秒杀分类">
            <seckill-category ref="seckillCategoryRef" />
          </el-tab-pane>
          <el-tab-pane label="秒杀活动列表">
            <seckill ref="seckillRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import seckill from './components/seckill-list.vue'
import seckillTime from './components/seckill-time-config.vue'
import seckillCategory from './components/seckill-category.vue'
import * as api from '@/api/seckill/seckill'

const num = ref(0)
onMounted(() => {
  getData()
})

const getData = () => {
  api.getJoinSeckillMerchantNum({}).then(data => {
    num.value = data
  })
}

</script>
<style lang="scss" scoped>
:deep(.mod-seckill-seckill) {
  .is-error .el-input-number__decrease,
  .is-error .el-input-number__increase,
  .is-success .el-input-number__decrease,
  .is-success .el-input-number__increase {
    right: 1px !important;
  }
}
:deep(.seckill-container) {
  .headline {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    line-height: 1;
    position: relative;
    margin-bottom: 16px;
    h3{
      font-size: 18px;
      color: #333;
      font-weight: 400;
    }
    small{
      color: #999;
      font-size: 12px;
      font-weight: 400;
      margin-left: 5px;
    }
  }
  .content-box {
    margin-bottom: 16px;
    background-color: #cde3f8;
    border: 1px solid #7cbdfa;
    .content {
      padding: 15px;
      .massage {
        display: block;
        margin-bottom: 4px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
      }
      .description {
        font-size: 14px;
        line-height: 7px;
      }
    }
  }
  .time-table{
    .left{
      font-size: 14px;
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
    padding: 10px 20px 10px 2.4%;
    background: #fff;
    margin-top: 20px;
  }
  .classify-btn{
    margin: 20px 0;
  }
  .classify-table{
    max-width: 100%;
  }
}
</style>
