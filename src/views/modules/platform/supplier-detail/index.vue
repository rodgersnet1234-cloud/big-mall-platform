<template>
  <div class="app-container shop-detail">
    <!-- 导航栏 -->
    <div class="nav-box">
      <div class="nav">
        <div
          :class="['nav-item', navStatus === 0 ? 'active' : '']"
          @click="switchNav(0)"
        >
          基本信息
        </div>
        <div
          :class="['nav-item', navStatus === 1 ? 'active' : '']"
          @click="switchNav(1)"
        >
          工商信息
        </div>
        <div
          :class="['nav-item', navStatus === 2 ? 'active' : '']"
          @click="switchNav(2)"
        >
          签约信息
        </div>
        <div
          :class="['nav-item', navStatus === 3 ? 'active' : '']"
          @click="switchNav(3)"
        >
          财务信息
        </div>
      </div>
    </div>
    <!-- 模块 -->
    <div class="shop-info-box">
      <el-alert
        v-if="supplierStatus.supplierStatus===6&&shopAuditStatus.remarks&&paySettlementType===1"
        :title="`您的开店申请未通过！原因是：${shopAuditStatus.remarks}。`"
        type="error"
        show-icon
        style="margin-top: 20px;"
      />
      <el-alert
        v-else-if="paySettlementType===1 && shopBasicInfo.idCardCollectProcessStatus!==4 && (shopBasicInfo.supplierStatus===3 || shopBasicInfo.supplierStatus===5) && shopBasicInfo.type===1"
        title="当前影印件状态异常，可在工商信息中刷新影印件状态"
        type="error"
        show-icon
        style="margin-top: 20px;"
      />
      <!-- 基本信息 -->
      <div
        v-if="navStatus === 0"
        class="basic-info-mod"
      >
        <!-- 供应商审核状态 -->
        <div class="audit-status">
          <!-- status 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核 -->
          <!-- supplierStatus 供应商状态(-1:已删除 0: 停业中 1:营业中 2:平台下线 3:待审核 4:供应商申请中  6.上线审核失败) -->
          <div
            v-if="shopAuditStatus"
            class="audit-item"
          >
            <span class="weak">审核状态：</span>
            <span v-if="shopAuditStatus.status === -1">未通过</span>
            <span v-if="shopAuditStatus.status === 0">未审核</span>
            <span v-if="shopAuditStatus.status === 1">已通过</span>
            <span v-if="shopAuditStatus.status === 2">平台下线</span>
          </div>
          <div class="audit-item">
            <span class="weak">帐号状态：</span>
            <span v-if="supplierStatus.accountStatus === 0">禁用</span>
            <span v-if="supplierStatus.accountStatus === 1">启用</span>
            <span v-if="supplierStatus.accountStatus === -1">删除</span>
          </div>
          <div class="audit-item">
            <span class="weak">供应商状态：</span>
            <span v-if="supplierStatus.supplierStatus === -1">已删除</span>
            <span v-if="supplierStatus.supplierStatus === 0">停业中</span>
            <span v-if="supplierStatus.supplierStatus === 1">营业中</span>
            <span v-if="supplierStatus.supplierStatus === 2">平台下线</span>
            <span v-if="supplierStatus.supplierStatus === 3">开店待审核</span>
            <span v-if="supplierStatus.supplierStatus === 4">开店申请中</span>
            <span v-if="supplierStatus.supplierStatus === 5">上线待审核</span>
            <span v-if="paySettlementType===1 && supplierStatus.supplierStatus === 6">上线审核失败</span>
          </div>
        </div>
        <!-- 信息 -->
        <div class="basic-info-list">
          <div class="left-info">
            <div class="basic-info-item">
              <p class="tit">
                供应商账号：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.supplierAccount }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>供应商名称：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.supplierName }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>联系人：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.contactName }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>联系方式：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.contactPhone }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>联系邮箱：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.email }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>所在地区：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.province }}{{ shopBasicInfo.city }}{{ shopBasicInfo.area }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                <span class="asterisk">*</span>详细地址：
              </p>
              <p
                v-if="shopBasicInfo"
                class="txt"
              >
                {{ shopBasicInfo.detailAddress }}
              </p>
            </div>
            <div class="basic-info-item">
              <p class="tit">
                供应商简介：
              </p>
              <p
                v-if="shopBasicInfo.intro"
                class="txt"
              >
                {{ shopBasicInfo.intro }}
              </p>
              <p
                v-if="!shopBasicInfo.intro"
                class="txt weak"
              >
                暂无
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- /基本信息 -->

      <!-- 工商信息 -->
      <div
        v-if="navStatus === 1"
        class="business-info-list"
      >
        <div class="left-info">
          <div class="business-info-item">
            <p class="tit">
              <span class="asterisk">*</span>统一社会信用代码：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.creditCode }}
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              <span class="asterisk">*</span>企业名称：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.firmName }}
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              <span class="asterisk">*</span>法定代表人：
            </p>
            <p
              v-if="businessInfo.representative"
              class="txt"
            >
              {{ businessInfo.representative }}
            </p>
            <p
              v-else
              class="txt weak"
            >
              暂无
            </p>
          </div>
          <div
            v-if="paySettlementType===1"
            class="business-info-item"
          >
            <p class="tit">
              <span class="asterisk">*</span>法人身份证：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.legalIds }}
            </p>
          </div>
          <div
            v-if="paySettlementType===1"
            class="business-info-item"
          >
            <p class="tit">
              <span class="asterisk">*</span>法人手机号：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.legalPhone }}
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              注册资本：
            </p>
            <p
              v-if="businessInfo.capital"
              class="txt"
            >
              {{ businessInfo.capital }}
            </p>
            <p
              v-else
              class="txt weak"
            >
              暂无
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              住所：
            </p>
            <p
              v-if="businessInfo.residence"
              class="txt"
            >
              {{ businessInfo.residence }}
            </p>
            <p
              v-else
              class="txt weak"
            >
              暂无
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              成立日期：
            </p>
            <p
              v-if="businessInfo.foundTime"
              class="txt"
            >
              {{ businessInfo.foundTime }}
            </p>
            <p
              v-else
              class="txt weak"
            >
              暂无
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              <span class="asterisk">*</span>营业期限：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.startTime && businessInfo.startTime.slice(0,10) + ' - ' + (!businessInfo.endTime ? '无固定期限' : businessInfo.endTime.slice(0, 10)) }}
            </p>
          </div>
          <div class="business-info-item">
            <p class="tit">
              <span class="asterisk">*</span>经营范围：
            </p>
            <p
              v-if="businessInfo"
              class="txt"
            >
              {{ businessInfo.businessScope }}
            </p>
          </div>
        </div>

        <div class="right-info">
          <div class="business-info-item">
            <p
              class="tit"
              style="width: 152px"
            >
              <span class="asterisk">*</span>营业执照副本电子版：
            </p>
            <el-image
              v-if="businessInfo && businessInfo.businessLicense"
              class="info-img"
              style="width: 100px; height: 100px"
              :src="businessInfo.businessLicense.indexOf('http')===-1 ? resourcesUrl + businessInfo.businessLicense : businessInfo.businessLicense"
              :preview-src-list="businessInfo.businessLicense.indexOf('http')===-1 ? [resourcesUrl + businessInfo.businessLicense] : [businessInfo.businessLicense]"
            >
              <template #error>
                <div class="image-slot">
                  <img
                    style="width: 100px; height: 100px"
                    src="@/assets/images/def.png"
                  >
                </div>
              </template>
            </el-image>
          </div>
          <div
            class="business-info-item"
            style="display: -webkit-box"
          >
            <p
              class="tit"
              style="width: 152px"
            >
              <span class="asterisk">*</span>法人身份证：
            </p>
            <el-image
              v-if="businessInfo && businessInfo.identityCardFront"
              class="info-img"
              style="width: 100px; height: 100px"
              :src="businessInfo.identityCardFront.indexOf('http')===-1 ? resourcesUrl + businessInfo.identityCardFront : businessInfo.identityCardFront"
              :preview-src-list="businessInfo.identityCardFront.indexOf('http')===-1 ? [resourcesUrl + businessInfo.identityCardFront] : [businessInfo.identityCardFront]"
            >
              <template #error>
                <img
                  class="img-slot"
                  src="~@/assets/images/def.png"
                >
              </template>
            </el-image>
            <el-image
              v-if="businessInfo && businessInfo.identityCardLater"
              class="info-img"
              style="width: 100px; height: 100px"
              :src="businessInfo.identityCardLater.indexOf('http')===-1 ? resourcesUrl + businessInfo.identityCardLater : businessInfo.identityCardLater"
              :preview-src-list="businessInfo.identityCardLater.indexOf('http')===-1 ? [resourcesUrl + businessInfo.identityCardLater] : [businessInfo.identityCardLater]"
            >
              <template #error>
                <img
                  class="img-slot"
                  src="~@/assets/images/def.png"
                >
              </template>
            </el-image>
            <p
              v-if="!businessInfo.identityCardFront && !businessInfo.identityCardLater"
              class="txt weak"
            >
              暂无
            </p>
          </div>
          <!-- 通联开启下，影印件状态未通过且店铺审核状态为待审核则显示提示信息 -->
          <div
            v-if="paySettlementType===1 && shopBasicInfo.idCardCollectProcessStatus!==4 && (shopBasicInfo.supplierStatus===3|| shopBasicInfo.supplierStatus===5) && shopBasicInfo.type===1"
            class="business-info-item"
          >
            <p class="tit" />
            <span
              class="update-btn"
              @click="dataUpdate"
            >
              <el-icon class="el-icon-refresh-right"><Refresh /></el-icon>
              <span>{{ businessInfo.updateTime }}数据更新</span>
            </span>
          </div>
        </div>
        <!-- 重新上传影印件弹窗 -->
        <businessInfoReupload
          v-if="reuploadVisible"
          ref="businessInfoReuploadRef"
          :supplier-id="businessInfo.supplierId"
          :company-id="businessInfo.supplierCompanyId"
          @refresh-status="queryShopBasicInfo"
        />
      </div>
      <!-- /工商信息 -->

      <!-- 签约信息 -->
      <div
        v-if="navStatus === 2"
        class="contract-info table-box"
      >
        <!-- 签约类目 -->
        <div class="contracted-items contract-category">
          <div class="tips">
            <p class="tit">
              <span class="asterisk">*</span>签约类目
            </p>
            <p class="txt weak">
              已签约
              <span class="txt-bold">{{ categoryContract.length }}</span>
              个类目 最多可签约
              <span class="txt-bold">200</span>
              个类目
            </p>
          </div>
          <div class="table-box">
            <!--  height="286" -->
            <el-table
              :data="categoryContract"
              style="width: 100%"
              header-cell-class-name="table-header"
              row-class-name="table-row"
            >
              <el-table-column
                prop="name"
                label="类目"
              />
              <el-table-column
                prop="parentName"
                label="上级类目"
              />
              <el-table-column
                prop="platformRate"
                label="类目扣率"
              >
                <template #default="{ row }">
                  <span v-if="row.customizeRate === null">{{ row.platformRate }} %</span>
                  <span v-else>{{ row.customizeRate }} %</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="qualifications"
                label="经营资质"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.imgs.length"
                    class
                  >
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="tab-img"
                      style="width: 60px; height: 60px"
                      :src="img"
                      preview-teleported
                      :preview-src-list="scope.row.imgs"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <span v-if="!scope.row.imgs.length">--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="categoryStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.categoryStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.categoryStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- 签约品牌 -->
        <div class="contracted-items contract-brands">
          <div class="tips">
            <p class="tit">
              <span class="asterisk" />签约品牌
            </p>
            <p class="txt weak">
              已签约
              <span class="txt-bold">{{ platformBrandList.length + customizeBrandList.length }}</span>
              个品牌 最多可签约
              <span class="txt-bold">20</span>
              个品牌
            </p>
          </div>
          <div class="table-box">
            <!-- height="286" -->
            <el-table
              :data="platformBrandList"
              style="width: 100%"
              header-cell-class-name="table-header"
              row-class-name="table-row"
            >
              <el-table-column
                prop="name"
                label="品牌名称"
              />
              <el-table-column
                prop="firstLetter"
                label="检索首字母"
              />
              <el-table-column
                prop="parentName"
                label="上级类目"
              />
              <el-table-column
                prop="imgUrl"
                label="品牌logo"
              >
                <template #default="scope">
                  <el-image
                    v-if="scope.row.imgUrl"
                    class="tab-img"
                    style="width: 60px; height: 60px"
                    :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                    preview-teleported
                    :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                  >
                    <template #error>
                      <img
                        class="img-slot"
                        src="~@/assets/images/def.png"
                      >
                    </template>
                  </el-image>
                </template>
              </el-table-column>
              <el-table-column
                prop="imgs"
                label="授权文件"
              >
                <template #default="scope">
                  <div v-if="scope.row.imgs.length">
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="tab-img"
                      style="width: 60px; height: 60px"
                      :src="img"
                      preview-teleported
                      :preview-src-list="scope.row.imgs"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <span v-if="!scope.row.imgs.length">--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="brandStatus"
                label="状态"
                width="80"
              >
                <template #default="scope">
                  <div
                    v-if="scope.row.brandStatus === 1"
                    class="tag-txt"
                  >
                    正常
                  </div>
                  <div
                    v-if="scope.row.brandStatus === 0"
                    class="tag-txt red-tag-txt"
                  >
                    下架
                  </div>
                </template>
              </el-table-column>
            </el-table>

            <!--  height="286" -->
            <el-table
              v-if="pageType === 'toAudit'"
              :data="customizeBrandList"
              style="width: 100%"
              header-cell-class-name="table-header"
              row-class-name="table-row"
            >
              <el-table-column
                prop="name"
                label="供应商自增"
              />
              <!-- label="品牌名称" -->
              <el-table-column
                prop="firstLetter"
              />
              <el-table-column
                prop="parentName"
              />
              <!-- label="别名" -->
              <el-table-column
                prop="imgUrl"
              >
                <!-- label="品牌logo" -->
                <template #default="scope">
                  <div v-if="scope.row.imgUrl">
                    <el-image
                      v-if="scope.row.imgUrl"
                      class="tab-img"
                      style="width: 60px; height: 60px"
                      :src="scope.row.imgUrl.indexOf('http')===-1 ? resourcesUrl + scope.row.imgUrl : scope.row.imgUrl"
                      preview-teleported
                      :preview-src-list="scope.row.imgUrl.indexOf('http')===-1 ? [resourcesUrl + scope.row.imgUrl] : [scope.row.imgUrl]"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="imgs"
              >
                <!-- label="授权文件" -->
                <template #default="scope">
                  <div v-if="scope.row.imgs.length">
                    <el-image
                      v-for="(img,index) in scope.row.imgs"
                      :key="index"
                      class="tab-img"
                      style="width: 60px; height: 60px"
                      :src="(img).indexOf('http')===-1 ? resourcesUrl + img : img"
                      preview-teleported
                      :preview-src-list="(img).indexOf('http')===-1 ? [resourcesUrl + img] : [img]"
                    >
                      <template #error>
                        <img
                          class="img-slot"
                          src="~@/assets/images/def.png"
                        >
                      </template>
                    </el-image>
                  </div>
                  <span v-if="!scope.row.imgs.length">--</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="brandStatus"
                label="状态"
                width="80"
              >
                <template #default="{row}">
                  <el-tag
                    v-if="row.type === 0 && row.brandStatus === 1"
                    effect="plain"
                  >
                    正常
                  </el-tag>
                  <el-tag
                    v-if="row.type === 0 && row.brandStatus === 0"
                    type="danger"
                    effect="plain"
                  >
                    下架
                  </el-tag>
                  <!-- 自定义的品牌 -->
                  <div
                    v-if="row.type === 1 && row.brandStatus === 3"
                    class="tag-txt"
                    style="padding-left:10px;"
                  >
                    待审核
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-if="pageType !== 'toAudit' && paySettlementType!==1">
          <!-- 签约有效期 -->
          <div class="contracted-items s-item">
            <div class="tips">
              <div class="tit">
                <span class="asterisk">*</span>签约有效期
              </div>
              <div class="txt weak">
                供应商供应商有效期
              </div>
            </div>
            <div class="si-content">
              <div class="contract-time-box">
                <el-date-picker
                  v-model="shopBasicInfo.contractStartTime"
                  style="width:170px;"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  placeholder="开始日期"
                  disabled
                />
                <span style="margin: 0 10px">-</span>
                <div class="end-time">
                  <el-date-picker
                    v-model="shopBasicInfo.contractEndTime"
                    style="width:170px;"
                    type="date"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="shopBasicInfo.contractStartTime&& !shopBasicInfo.contractEndTime ? '' : '结束日期'"
                    disabled
                  />
                  <span
                    v-if="shopBasicInfo.contractStartTime&& !shopBasicInfo.contractEndTime"
                    class="text disable"
                  >
                    无固定期限
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /签约信息 -->

      <!-- 财务信息 -->
      <div
        v-if="navStatus === 3"
        class="financial-info"
      >
        <div class="table-box">
          <div class="tips">
            <p class="tit">
              <span class="asterisk">*</span>结算银行账户
            </p>
            <p
              v-if="paySettlementType!==1"
              class="txt weak"
            >
              已添加
              <span class="txt-bold">{{ settlementAccounts.length }}</span>
              个结算账户，最多可添加
              <span class="txt-bold">5</span>
              个结算账户
            </p>
            <p
              v-if="paySettlementType===1"
              class="txt weak"
            >
              已添加
              <span class="txt-bold">{{ settlementAccounts.length }}</span>
              个结算账户，最多可添加
              <span class="txt-bold">10</span>
              个结算账户
              <span>
                ，
                <span class="txt-bold">1</span>
                个法人账户
              </span>
            </p>
          </div>
          <el-table
            :data="settlementAccounts"
            style="width: 100%"
            header-cell-class-name="table-header"
            row-class-name="table-row"
          >
            <el-table-column
              prop="bankName"
              label="银行"
            />
            <el-table-column
              align="left"
              prop="recipientName"
              :min-width="paySettlementType===1?'130':null"
              label="账户名"
            >
              <template #default="scope">
                <div class="recipient-name">
                  <span>{{ scope.row.recipientName }}</span>
                  <div
                    v-if="paySettlementType===1&&scope.row.bankCardPro===0"
                    class="tip"
                  >
                    法人账户
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="cardNo"
              label="账号"
            />
            <el-table-column
              prop="branchName"
              label="银行开户行"
            />
            <el-table-column
              prop="isDefault"
              label="主账号"
              width="100px"
            >
              <template #default="scope">
                {{ scope.row.isDefault ? '是' : '否' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!-- /财务信息 -->
    </div>

    <!-- 脚部 -->
    <div
      v-if="pageType === 'toAudit' && supplierStatus.supplierStatus !== 5"
      class="footer"
    >
      <div class="foot-box">
        <div
          class="btn"
          @click="openAuditPopup(1)"
        >
          审核
        </div>
        <div
          class="btn"
          @click="openAuditPopup(-1)"
        >
          驳回
        </div>
      </div>
    </div>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="auditDialogVisible"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      :show-close="false"
      class="audit-dialog"
    >
      <template #header>
        <div class="head">
          <span class="tit">供应商审核</span>
          <span class="sub-tit">请补充签约信息</span>
        </div>
      </template>
      <div class="content">
        <el-form
          ref="auditformRef"
          label-width="100px"
          :model="auditform"
          :rules="auditformRules"
          @submit.prevent
        >
          <el-form-item
            label="签约有效期"
            prop="date"
          >
            <div class="contract-time-box">
              <el-date-picker
                v-model="contractStartTime"
                style="width:170px;"
                type="date"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="开始日期"
                :clearable="false"
              />
              <span style="margin: 0 10px">-</span>
              <div class="end-time">
                <el-date-picker
                  ref="endTimeRef"
                  v-model="contractEndTime"
                  style="width:170px;"
                  type="date"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="endTimeFlag&&contractStartTime&& !contractEndTime ? '' : '结束日期'"
                  clearable
                  @change="endTimeFlag = false"
                  @focus="endTimeFlag = false"
                  @blur="onEndTimePickerBlur"
                />
                <span
                  v-if="endTimeFlag&&contractStartTime&& !contractEndTime"
                  class="text"
                  @click="focusEndTime"
                >
                  无固定期限
                </span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="reviewStoreApplications(1)"
          >提交</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 驳回弹窗 -->
    <el-dialog
      ref="reviewDialogRef"
      v-model="reviewDialogVisible"
      title="请填写驳回原因"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      destroy-on-close
      class="remarks"
    >
      <el-input
        v-model="remarks"
        type="textarea"
        :rows="2"
        maxlength="200"
        placeholder="请填写驳回原因"
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="reviewStoreApplications(-1)"
          >提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { Debounce } from '@/utils/debounce'
import * as api from '@/api/platform/audit-supplier'
import { ElMessage } from 'element-plus'

// 图片前缀
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const supplierId = ref(useRoute().query.supplierId || 0)
// 页面类型 查看详情/审核申请
const pageType = ref(useRoute().query.pageType || '')
// 导航切换
const navStatus = ref(0)

// 供应商审核状态
const shopAuditStatus = ref({})
// 供应商状态
const supplierStatus = ref({})

// 供应商基本信息
const shopBasicInfo = ref({})

// 供应商工商信息
const businessInfo = ref({})

// 供应商分类签约信息
const categoryContract = ref([])

// 平台品牌签约信息
const platformBrandList = ref([])

// 自增签约品牌信息
const customizeBrandList = ref([])

// 供应商财务信息
const settlementAccounts = ref([])

// 审核信息
const auditform = reactive({
  date: [],
  supplierType: '2'
})
// 审核弹窗
const auditDialogVisible = ref(false)
// 签约有效期
const contractStartTime = ref('')
const contractEndTime = ref('')
// 供应商类型
// const merchantType = ref(0)
const validContractTime = (rule, value, callback) => {
  if (!contractStartTime.value) {
    callback(new Error($t('请选择签约有效期')))
  } else if (contractEndTime.value && new Date(contractStartTime.value).getTime() > new Date(contractEndTime.value).getTime()) {
    // 判断签约结束时间是否在签约开始时间之前
    callback(new Error($t('签约结束时间不能在签约开始时间之前')))
  } else {
    callback()
  }
}
const auditformRules = reactive({
  date: [
    { validator: validContractTime, trigger: 'change' }
  ],
  supplierType: [
    { required: true, message: '请选择供应商类型', trigger: 'change' }
  ]
})
// 驳回弹窗
const reviewDialogVisible = ref(false)
// 驳回备注
const remarks = ref('')
const useAllinpay = useAllinpayStore()
const paySettlementType = useAllinpay.paySettlementType
const reuploadVisible = ref(false) // 重新上传弹窗

onMounted(() => {
  // 查询基本信息
  queryShopBasicInfo()
  // 供应商审核状态
  queryShopAuditStatus()
})

const switchNav = (value) => {
  navStatus.value = value
  if (value === 1) {
    // 查询工商信息
    queryShopBusinessInfo()
  } else if (value === 2) {
    // 查询分类签约信息
    queryCategoryContractInfo()
    // 查询品牌签约信息
    queryBrandSigningInfo()
  } else if (value === 3) {
    // 查询财务信息
    queryShopFinancialInfo()
  } else {
    // 查询基本信息
    queryShopBasicInfo()
  }
}

/**
 * 供应商审核状态
 */
const queryShopAuditStatus = () => {
  api.getShopAuditStatus(supplierId.value).then(data => {
    shopAuditStatus.value = data
    supplierStatus.value = data.supplierDetail
  })
}

/**
 * 查询基本信息
 */
const queryShopBasicInfo = () => {
  api.getManageDetail({ supplierId: supplierId.value }).then(data => {
    shopBasicInfo.value = data
  })
}

/**
 * 查询工商信息
 */
const queryShopBusinessInfo = () => {
  const params = { supplierId: supplierId.value }
  if (pageType.value === 'toAudit') {
    params.status = 0
  }
  api.queryBusinessInfo(params).then(data => {
    businessInfo.value = data || {}
  })
}

/**
 * 查询分类签约信息
 */
const queryCategoryContractInfo = () => {
  api.queryCategoryContract({ shopId: supplierId.value, sysType: 3 }).then(data => {
    categoryContract.value = data
    categoryContract.value.forEach(el => {
      const imgUrls = el.qualifications ? el.qualifications.split(',') : []
      if (imgUrls.length) {
        el.imgs = handleImgUrl(imgUrls)
      } else {
        el.imgs = []
      }
    })
  })
}

/**
 * 查询品牌签约信息
 */
const queryBrandSigningInfo = () => {
  api.queryBrandSigning({ shopId: supplierId.value, sysType: 3 }).then(data => {
    data.platformBrandList.forEach((item) => {
      let parentName = ''
      if (item.categories) {
        parentName = `${item.categories[0].categories[0].name}>${item.categories[0].categories[1].name}>${item.categories[0].name}`
      }
      item.parentName = parentName
    })
    platformBrandList.value = data.platformBrandList
    platformBrandList.value.forEach(el => {
      const plaImgs = el.qualifications ? el.qualifications.split(',') : []
      if (plaImgs.length) {
        el.imgs = handleImgUrl(plaImgs)
      } else {
        el.imgs = []
      }
    })
    customizeBrandList.value = data.customizeBrandList
    customizeBrandList.value.forEach(el => {
      let parentName = ''
      if (el.categories) {
        parentName = `${el.categories[0].categories[0].name}>${el.categories[0].categories[1].name}>${el.categories[0].name}`
      }
      el.parentName = parentName
      const cusImgs = el.qualifications ? el.qualifications.split(',') : []
      if (cusImgs.length) {
        el.imgs = handleImgUrl(cusImgs)
      } else {
        el.imgs = []
      }
    })
  })
}

const handleImgUrl = (imgUrls) => {
  const imgs = []
  imgUrls.forEach((img) => {
    if (img.indexOf('http') === -1 || img.indexOf('https') === -1) {
      const image = resourcesUrl + img
      imgs.push(image)
    } else {
      imgs.push(img)
    }
  })
  return imgs
}

/**
 * 查询财务信息
 */
const queryShopFinancialInfo = () => {
  api.queryFinancialInfo({ supplierId: supplierId.value }).then(data => {
    settlementAccounts.value = data
  })
}

/**
 * 打开审核弹窗
 */
const openAuditPopup = (status) => {
  if (status === 1) {
    // 审核
    endTimeFlag.value = true
    auditDialogVisible.value = true
    return
  }
  if (status === -1) {
    // 驳回
    remarks.value = ''
    reviewDialogVisible.value = true
  }
}

const endTimeFlag = ref(true)
const endTimeRef = ref(null)
const focusEndTime = () => {
  endTimeRef.value?.focus()
}
const onEndTimePickerBlur = () => {
  if (!contractEndTime.value) {
    endTimeFlag.value = true
  }
}

const auditformRef = ref(null)
/**
 * 提交供应商申请审核
 */
const reviewStoreApplications = Debounce((status) => {
  let param = {}
  param = {
    supplierId: supplierId.value,
    status // 0 未审核 1已通过 -1未通过 2平台下线 3 平台下线待审核
  }
  // 审核
  if (status === 1) {
    auditformRef.value?.validate(valid => {
      if (!valid) {
        return
      }
      param.supplierType = auditform.supplierType
      param.contractStartTime = contractStartTime.value
      param.contractEndTime = contractEndTime.value
      auditApply(status, param)
    })
    return
  }
  // 驳回，备注必填
  if (status === -1) {
    if (!remarks.value.trim() || remarks.value.trim().length > 200) {
      ElMessage({
        message: '请填写200字以内的驳回原因！',
        type: 'error',
        duration: 1000
      })
      return
    }
    param.remarks = remarks.value.trim() // 驳回备注
    auditApply(status, param)
  }
}, 2000)

const router = useRouter()
const auditApply = (status, param) => {
  api.auditData(param).then(() => {
    ElMessage({
      message: status === 1 ? '审核通过' : '申请已驳回',
      type: 'success',
      duration: 1000
    })
    if (status === 1) {
      auditformRef.value?.resetFields() // 清空表单
      auditformRef.value?.clearValidate() // 表单验证关闭时清除错误验证信息
    } else {
      remarks.value = ''
    }
    reviewDialogVisible.value = false
    router.push('/platform/supplier-manage?activeName=2')
  })
}

const businessInfoReuploadRef = ref(null)
// 数据更新
const dataUpdate = Debounce(function () {
  api.updateIdCardStatus({ supplierId: businessInfo.supplierId }).then(data => {
    if (data === 4) {
      // 审核成功就刷新页面
      location.reload()
    } else if (data === 0 || data === 2 || data === 3) {
      // 审核失败，弹窗让用户重新上传
      reuploadVisible.value = true
      nextTick(() => {
        businessInfoReuploadRef.value?.init(data)
      })
      queryShopBusinessInfo()
    } else if (data === 1) {
      // 待审核则更新工商信息
      queryShopBusinessInfo()
    }
  })
}, 1500)

</script>

<style lang="scss" scoped>
.app-container {
  margin-bottom: 30px;
}
.app-container.shop-detail {
  font-size: 14px;
  color: #333;
  min-height: 852px;
  .red-tag-txt {
    color: #ff4949;
  }

  // 导航栏
  .nav-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    .nav {
      position: relative;
      display: inline-block;
      display: flex;
      white-space: nowrap;
      .nav-item {
        margin: 0;
        font-size: 14px;
        line-height: 1em;
        padding: 15px 20px;
        color: #999;
        cursor: pointer;
      }
      .nav-item.active {
        color: #155bd4;
        background: rgba(24,144,255, 0.06);
        border-radius: 4px 4px 0 0;
        border-bottom: 2px solid #155bd4;
      }
    }
  }
  .nav-box::before {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    border-bottom: 1px solid #f0f0f0;
    content: '';
  }

  .shop-info-box {
    margin-bottom: 80px;
    // 公共
    p {
      margin: 0;
    }
    .asterisk {
      color: #FF2120;
      padding-right: 5px;
    }
    .tips {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      .tit {
        font-size: 16px;
        min-width: 80px;
      }
      .txt.weak {
        font-size: 12px;
        color: #999;
        margin-left: 10px;
      }
      .txt-bold {
        color: #333;
      }
    }
    .si-content {
      margin-top: 20px;
      margin-bottom: 25px;
    }
    .table-box {
      display: block;
      width: 100%;
      margin: 20px 0;
      ::v-deep(.el-table th), ::v-deep(.el-table td) {
        border-color: #f0f0f0;
        height: 40px;
        line-height: 40px;
      }
      ::v-deep(.el-table td) {
        height: 56px;
        line-height: 56px;
      }
      ::v-deep(.el-table__row:last-child){
        td {
          border-bottom: 0;
        }
      }
      ::v-deep(.el-table th) {
        background: #fafafa;
      }
      ::v-deep(.el-table__body-wrapper) {
        max-height: 245px;
        overflow-y: scroll;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
      }
      ::v-deep(.el-table__body-wrapper::-webkit-scrollbar) {
        display: none; /* Chrome Safari */
      }
      ::v-deep(.el-table__body) {
        width: 100%;
      }
    }
    // 图片
    .tab-img {
      width: auto;
      height: auto;
      max-width: 60px;
      max-height: 60px;
      margin-right: 5px;
      cursor: pointer;
    }

    // 基本信息模块
    .basic-info-mod {
      // 审核状态
      .audit-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        background: #f5f5f5;
        padding: 20px 40px;
        line-height: 1em;
        margin-top: 20px;
        p.tit {
          width: 95px;
        }
        .weak {
          color: #666;
        }
      }
    }

    // 签约信息
    .contract-info {
      margin-top: 20px;
    }
    // 财务信息
    .financial-info {
      margin: 20px 0;
      .tips {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-bottom: 20px;
        .txt {
          margin-right: 5px;
        }
      }
      .table-box {
        margin-top: 10px;
        ::v-deep(.el-table__body-wrapper) {
          max-height: 504px;
        }
      }
    }

  }

  // 脚部
  .footer {
    z-index: 8;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    box-shadow: 4px 2px 5px 5px #eee;
    background: #fff;
    margin-left: -24px;
    .foot-box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .btn {
        padding: 10px 20px;
        margin-right: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      .btn:first-child {
        background: #155bd4;
        color: #fff;
      }
      .btn:last-child {
        border: 1px solid #d9d9d9;
      }
    }
  }

}
// 审核弹窗
.audit-dialog {
  ::v-deep(.el-dialog__header) {
    padding: 0;
    padding-bottom: 0;
  }
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
    padding-bottom: 0;
  }
  .head {
    line-height: 1em;
    font-size: 16px;
    color: #333;
    .sub-tit {
      color: #999;
      font-size: 12px;
      margin-left: 10px;
    }
  }
  ::v-deep(.el-form) {
    margin-top: 20px;
  }
}
// 信息 / 工商
.business-info-list,
.basic-info-list {
  display: flex;
  align-items: start;
  justify-content: flex-start;
  width: 100%;
  margin: 20px 0;
  .left-info {
    width: 550px;
    margin-right: 20px;
    text-align: left;
  }
  .right-info {
    width: 40%;
    min-width: 300px;
  }

  .business-info-item,
  .basic-info-item {
    display: flex;
    justify-content: flex-start;
    padding: 15px 30px;
    line-height: 24px;
    .tit {
      min-width: 90px;
      text-align: right;
    }
    .txt {
      display: block;
      word-break: break-all;
      letter-spacing: 1px;
    }

    .weak {
      color: #999;
    }
    .update-btn {
      cursor: pointer;
    }
    .el-icon-refresh-right {
      color: #409eff;
      font-weight: 600;
      margin-right: 5px;
    }
  }
  .business-info-item > .info-img{
    min-width: 80px;
    min-height: 80px;
  }
  .business-info-item > .info-img:not(:nth-child(2)) {
    margin-left: 20px;
  }
  .business-info-item .tit {
    min-width: 140px;
  }
}

.contract-time-box{
  display: flex;
  align-items: center;
  .end-time {
    position: relative;
    .text {
      position: absolute;
      left: 30px;
      line-height: 32px;
      font-size: 14px;
      &.disable{
        color: #a8abb2;
        cursor: no-drop;
      }
    }
  }
}

</style>
