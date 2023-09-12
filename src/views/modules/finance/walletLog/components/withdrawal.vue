<template>
  <div class="table">
    <div class="search">
      <el-form
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        @submit.prevent
      >
        <el-form-item label="提现状态">
          <el-select
            v-model="formInline.region"
            placeholder="提现状态"
          >
            <el-option
              label="审核失败"
              value="shanghai"
            />
            <el-option
              label="审核中"
              value="beijing"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
          >
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="serialNumber"
          label="序号"
          align="center"
        />
        <el-table-column
          prop="remittance"
          label="提现时间"
          align="center"
        />
        <el-table-column
          prop="CUP"
          label="提现状态"
          align="center"
        />
        <el-table-column
          prop="alipay"
          label="操作"
          align="center"
        />
      </el-table>
    </div>
    <!-- 分页条 -->
    <Pagination
      v-model:page="params.pageNum"
      v-model:limit="params.pageSize"
      style="text-align: right"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<script setup>
const total = 0
const params = ref({
  pageNum: 1,
  pageSize: 10
})
const formInline = {
  user: '',
  region: ''
}

const tableData = ref([])

const pagination = (page) => {
  params.value.pageNum = page.pageNum
  params.value.pageSize = page.pageSize
}

</script>

<style lang="scss" scoped>
  .table {
     margin-top: 30px;
     .list{
       padding: 20px 0;
     }
   }
</style>
