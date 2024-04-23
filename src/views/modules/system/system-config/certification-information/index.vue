<template>
  <!-- 步骤 -->
  <div
    v-if="stateSubmit===0"
    class="page-certification-information"
  >
    <div class="title-tips">
      <div class="title-right">
        <el-icon color="#FFA900">
          <WarningFilled />
        </el-icon>
        <span>
          主体未认证时将会限制微信收款及余额提现等功能。为了不影响商城日常经营，建议及时完成主体认证。
        </span>
      </div>
      <span>申请单编号：2055645456454546</span>
    </div>

    <div class="information-content">
      <!-- 步骤 -->
      <div class="post-step">
        <div
          class="step-item"
          :class="{'active': postingSteps === 1 || postingSteps === 2 || postingSteps === 3 || postingSteps === 4 || postingSteps === 5 }"
        >
          <!-- 1.填写主体信息 -->
          <div class="step-txt">
            1.填写主体信息
          </div>
        </div>
        <div
          class="step-item"
          :class="{'active': postingSteps === 2 || postingSteps === 3 || postingSteps === 4 || postingSteps === 5}"
        >
          <!-- 2.填写经营信息 -->
          <div class="step-txt">
            2.填写经营信息
          </div>
        </div>
        <div
          class="step-item"
          :class="{'active': postingSteps === 3 || postingSteps === 4 || postingSteps === 5}"
        >
          <!-- 3.填写行业资质 -->
          <div class="step-txt">
            3.填写行业资质
          </div>
        </div>
        <div
          class="step-item"
          :class="{'active': postingSteps === 4 || postingSteps === 5}"
        >
          <!-- 4.结算账户 -->
          <div class="step-txt">
            4.结算账户
          </div>
        </div>  <div
          class="step-item"
          :class="{'active': postingSteps === 5}"
        >
          <!-- 5.超级管理员 -->
          <div class="step-txt">
            5.超级管理员
          </div>
        </div>
      </div>
      <!-- 1.填写主体信息 -->
      <div v-if="postingSteps===1">
        <div
          class="subject-information"
        >
          <div style="display: inline-block;">
            主体信息
          </div>
          <span>请上传“营业执照”，需年检章齐全，当年注册除外</span>
        </div>
        <el-form
          ref="ruleFormRef"
          style="margin-top: 30px;"
          :model="ruleForm"
          :rules="rules"
          label-width="166px"
          :size="formSize"
          status-icon
        >
          <el-form-item
            label="营业执照"
            prop="licenseImg"
          >
            <div>
              <img-upload
                v-model:value="ruleForm.licenseImg"
                @new-img="imgChange(1,'licenseImg')"
              />
              <div class="hint">
                请上传彩色照片or彩色扫描件or加盖公章鲜章的复印件。可添加“微信支付”相关水印（微信支付认证）
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="注册号"
            prop="registration"
            style="margin:30px 0"
          >
            <el-input
              v-model="ruleForm.registration"
              placeholder="请输入"
              style="width: 268px;"
            />
          </el-form-item>
          <el-form-item
            label="注册地址"
            prop="desc"
          >
            <div>
              <el-input
                v-model="ruleForm.desc"
                placeholder="请输入"
                type="textarea"
              />
              <div class="hint">
                注册地址需与营业执照登记住所一致
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="营业期限"
            prop="tradeResource"
            style="margin:30px 0;"
          >
            <el-radio-group
              v-model="ruleForm.tradeResource"
              style="display: block;"
            >
              <el-row>
                <el-col
                  :span="4"
                >
                  <el-radio
                    :label="0"
                  >
                    区间有效
                  </el-radio>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'date1'"
                    :rules="
                      ruleForm.tradeResource==0 ?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                  >
                    <el-date-picker
                      v-model="ruleForm.date1"
                      type="date"
                      placeholder="开始时间"
                      style="margin-left:30px;width:152px"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  class="text-center"
                  :span="2"
                />
                <span
                  class="text-gray-500"
                  style="font-size: 14px;margin: 0 7px"
                >至</span>
                <el-col
                  :span="8"
                >
                  <el-form-item
                    :rules="
                      ruleForm.tradeResource==0 ?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                    :prop="'date2'"
                  >
                    <el-date-picker
                      v-model="ruleForm.date2"
                      placeholder="结束时间"
                      style="width:152px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top:20px;">
                <el-col
                  :span="4"
                >
                  <el-radio
                    :label="1"
                  >
                    长期有效
                  </el-radio>
                </el-col>
                <el-col :span="15">
                  <el-form-item
                    prop="tradeLongTermDate"
                    :rules="
                      ruleForm.tradeResource == '1' ?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                    class="long-term"
                  >
                    <el-date-picker
                      v-model="ruleForm.tradeLongTermDate"
                      type="date"
                      placeholder="开始时间"
                      @change="dateChange('date1','date2')"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="商户名称"
            prop="trader"
          >
            <div>
              <el-input
                v-model="ruleForm.trader"
                placeholder="请输入"
                style="width: 268px"
              />
              <div class="hint">
                若营业执照商务名称为空或为“无”，请填写“个体户+经营者姓名”，如“个体户张三”
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="经营者姓名"
            prop="operator"
            style="margin-top:30px"
          >
            <el-input
              v-model="ruleForm.operator"
              placeholder="请输入"
              style="width: 268px"
            />
          </el-form-item>
          <div
            class="subject-information"
            style="margin: 64px 0 40px 0;"
          >
            <div style="display: inline-block;">
              法定代表人证件
            </div>
            <span>请上传“陈橙子”的身份证信息</span>
          </div>
          <el-form-item
            label="证件类型"
            prop="region"
          >
            <el-select
              v-model="ruleForm.region"
              placeholder="请输入"
            >
              <el-option
                label="中国大陆居民-身份证"
                value="shanghai"
              />
              <el-option
                label="中国大陆居民-身份证"
                value="beijing"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="证件照正面"
            style="margin: 30px 0;"
            prop="frontCardImg"
          >
            <div>
              <img-upload
                v-model:value="ruleForm.frontCardImg"
                @new-img="imgChange(1,'frontCardImg')"
              />
              <div class="hint">
                如你的证件类型是身份证，请在此处上传人像面
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="证件照反面"
            prop="reverseCarImg"
          >
            <div>
              <img-upload
                v-model:value="ruleForm.reverseCarImg"
                @new-img="imgChange(1,'reverseCarImg')"
              />
              <div class="hint">
                如你的证件类型是身份证，请在此处上传国徽面
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="证件姓名"
            prop="idCarName"
            style="margin: 30px 0;"
          >
            <el-input
              v-model="ruleForm.idCarName"
              placeholder="请输入"
              style="width: 268px"
            />
          </el-form-item>          <el-form-item
            label="证件号码"
            prop="idCarNumber"
          >
            <el-input
              v-model="ruleForm.idCarNumber"
              placeholder="请输入"
              style="width: 268px"
            />
          </el-form-item>
          <el-form-item
            label="证件有效期"
            style="margin: 30px 0;"
            prop="idCarPeriodValidity"
          >
            <el-radio-group
              v-model="ruleForm.idCarPeriodValidity"
              style="display: block;"
            >
              <el-row>
                <el-col
                  :span="4"
                >
                  <el-radio
                    :label="0"
                  >
                    区间有效
                  </el-radio>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'carValidityDate1' "
                    :rules="
                      ruleForm.idCarPeriodValidity == 0 ?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                  >
                    <el-date-picker
                      v-model="ruleForm.carValidityDate1"
                      type="date"
                      placeholder="开始时间"
                      style="margin-left:30px;width:152px"
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  class="text-center"
                  :span="2"
                />
                <span
                  class="text-gray-500"
                  style="font-size: 14px;margin: 0 7px"
                >至</span>
                <el-col
                  :span="8"
                >
                  <el-form-item
                    :prop="'carValidityDate2'"
                    :rules="
                      ruleForm.idCarPeriodValidity == 0 ?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                  >
                    <el-date-picker
                      v-model="ruleForm.carValidityDate2"
                      placeholder="结束时间"
                      style="width:152px"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row style="margin-top:20px;">
                <el-col
                  :span="4"
                >
                  <el-radio
                    :label="1"
                  >
                    长期有效
                  </el-radio>
                </el-col>
                <el-col :span="15">
                  <el-form-item
                    :prop="'carLongTerm'"
                    :rules="
                      ruleForm.idCarPeriodValidity == 1?[{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }]:''
                    "
                    class="long-term"
                  >
                    <el-date-picker
                      v-model="ruleForm.carLongTerm"
                      type="date"
                      placeholder="开始时间"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="是否为受益所有人"
            prop="beneficiaryOwner"
          >
            <el-radio-group v-model="ruleForm.beneficiaryOwner">
              <el-radio :label="0">
                是
              </el-radio>
              <el-radio :label="1">
                <span style="margin-right:10px">否，非经营者</span>
                <el-tooltip
                  placement="right"
                >
                  <template #content>
                    根据国家相关法律法规，您需要提供公司受益所有人的<br>
                    信息。受益所有人需符合至少以下条件之一：<br>
                    1. 直接或者间接拥有超过25%公司股权或者表决权的自<br>
                    然人；<br>
                    2. 通过人事、财务等其他方式对公司进行控制的自然<br>
                    人； <br>
                    3. 公司的高级管理人员，包括公司的经理、副经理、财<br>
                    务负责人，上市公司董事会秘书和公司章程规定的其他<br>
                    人员
                  </template>
                  <span><el-icon class="question"><QuestionFilled /></el-icon></span>
                </el-tooltip>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 1.填写主体信息end -->
      <!-- 2.填写经营信息 -->
      <div v-if="postingSteps===2">
        <div
          class="subject-information"
        >
          <div style="display: inline-block;">
            经营信息
          </div>
        </div>
        <el-form
          ref="busInFormationRef"
          :model="busInFormation"
          :rules="rules2"
          label-width="166px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item
            label="商户简称"
            prop="merchantName"
            style="margin:30px 0;"
          >
            <div>
              <el-input
                v-model="busInFormation.merchantName"
                style="width: 268px;"
                placeholder="请输入"
              />
              <div
                class="hint"
                style="height: auto; "
              >
                1. 在支付完成页向买家展示，需与微信经营类目相关。<br> 2. 简称要求：<br> ①不支持单纯以人名来命名，若为个体户经营，可用“个体户+经营者名称+业务”命名，如“个体户张三”或“张三餐饮店”；<br> ②不支持无实际意义的文案，如“xx特约商户”、“800”、“xx客服电话xxx”；
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="客服电话"
            prop="serviceNumber"
          >
            <div>
              <el-input
                v-model="busInFormation.serviceNumber"
                style="width: 268px;"
                placeholder="请输入"
              />
              <div
                class="hint"
                style="height: auto;"
              >
                1. 请填写真实有效的客服电话，将在交易记录中向买家展示，提供咨询服务<br> 2. 请确保电话通常，以便入驻后平台回拨确认
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="经营场景"
            prop="type"
            style="margin: 30px 0 50px 0;"
          >
            <div>
              <div>
                <el-checkbox-group
                  v-model="busInFormation.type"
                  @change="changVisibles"
                >
                  <el-checkbox
                    label="线下场景"
                    name="type"
                  />
                  <el-checkbox
                    label="公众号"
                    name="type"
                  />
                  <el-checkbox
                    label="小程序"
                    name="type"
                  />

                  <el-checkbox
                    label="APP"
                    name="type"
                  />
                  <el-checkbox
                    label="互联网网站"
                    name="type"
                  />
                  <el-checkbox
                    label="企业微信"
                    name="type"
                  />
                </el-checkbox-group>
              </div>
              <div
                class="hint"
                style="height: auto;"
              >
                请勾选实际售卖商品/提供服务场景（至少一项），以便审核通过后开通所需的支付权限 查看对应的支付权限
                <br>
                建议只勾选目前必须的场景，以便尽快通过入驻审核，其他支付权限可在入驻后根据实际需要发起申请
              </div>
            </div>
          </el-form-item>
          <div v-if="isVisible1">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                线下场所
              </div>
              <span>你选择了“线下场所场景，入驻成功后，服务商可帮商户发起付款码支付、JSAPI支付，同时系统将会对地址等信息进行核实</span>
            </div>
            <el-form-item
              label="线下场所名称"
              prop="placeName"
              style="margin: 30px 0;"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.placeName"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="线下场所省市"
              prop="currentAddr"
            >
              <el-cascader
                ref="cascaderAddrRef"
                v-model="busInFormation.currentAddr"
                style="width: 268px;"
                :options="addrList"
                :props="addrListTreeProps"
                placeholder="请选择"
                @change="handleAddrChange"
              />
            </el-form-item>
            <el-form-item
              label="线下场所地址"
              prop="placeAddress"
              style="margin:30px 0"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.placeAddress"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                >
                  请填写详细的经营场所信息，如有多个场所，选择一个主要场所填写即可
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="线下场所门头照片"
              prop="doorHeaderImg"
            >
              <div>
                <img-upload
                  v-model:value="busInFormation.doorHeaderImg"
                />
                <div class="hint">
                  请上传门店照片(要求门店招牌清晰可见)。若为停车场、售卖机等无固定门头照片的经营场所，请提供真实的经营现场照片
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="线下场所内部照片"
              prop="inDoorImg"
            >
              <div>
                <img-upload
                  v-model:value="busInFormation.inDoorImg"
                />
                <div class="hint">
                  请上传门店照片(要求门店招牌清晰可见)。若为停车场、售卖机等无固定门头照片的经营场所，请提供真实的经营现场照片
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="线下场所对应的公众号APPID"
              prop="merchantAppId"
              style="margin:30px 0"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.merchantAppId"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height: auto;"
                >
                  1、可填写已认证的公众号、小程序、应用的APPID，其中公众号APPID需是已认证的服务号、政府或媒体类型的订阅号。AppiD查看指引<br>
                  2、完成进件后，系统发起特约商户号与该AppID的绑定(即配置为sub appid，可在发起支付时传入)<br>
                  (1) 若APPID主体与商家主体一致，则直接完成绑定;<br>
                  (2)若APPID主体与商家主体不一致，则商户签约时显示联合营运承诺函》，并且AppID的管理员需登录公众平台认绑定意愿;(暂不支持绑定异主体的应用A读PPID)
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="isVisible2">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                公众号
              </div>
              <span>审核通过后，服务商可帮商家发起JSAPI支付</span>
            </div>
            <el-form-item
              label="APPID所属"
              prop="resource"
              style="margin: 30px 0;"
            >
              <el-radio-group v-model="busInFormation.resource">
                <el-radio :label="0">
                  服务商公众号appid
                </el-radio>
                <el-radio :label="1">
                  商家公众号appid
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="busInFormation.resource===0"
              label="服务商APPID"
              prop="serviceAPPID"
              style="margin-bottom:30px"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.serviceAPPID"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  可选择服务商商户号已绑定的APPID，需为已认证的服务号、政府或媒体类型的订阅号
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-if="busInFormation.resource===1"
              label="商家appid"
              prop="merchantAppId"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.merchantAppId"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                >
                  可选择服务商商户号已绑定的APPID，需为已认证的服务号、政府或媒体类型的订阅号
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="公众号页面截图"
              prop="pageScreenshot"
              style="margin-bottom:30px"
            >
              <div>
                <imgs-upload
                  v-model="busInFormation.pageScreenshot"
                  :limit="5"
                />
                <div
                  class="hint"
                  style="height:auto"
                >
                  请提供展示商品/服务的页面截图/设计稿（最多5张），若小程序未建设完善或未上线请务必提供
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="isVisible3">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                小程序
              </div>
              <span>你选择了“小程序”场景，审核通过后，服务商可帮商家发起JSAPI支付</span>
            </div>
            <el-form-item
              label="小程序APPID"
              prop="applet"
              style="margin:30px 0"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.applet"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  1、请填写已认证的小程序APPID。AppID查看指引<br>
                  2、完成进件后，系统发起特约商户号与该AppID的绑定(即配置为sub appid，可在发起支付时传入)。<br>
                  (1) 若APPID主体与商家主体/服务商主体一致，则直接完成绑定。<br>
                  (2)若APPID主体与商家主体/服务商主体不一致，则商户签约时显示《联合营运承诺函》，并且AppID的管理员需登录公众平台确认绑定意愿。<br>
                </div>
              </div>
            </el-form-item>

            <el-form-item
              label="小程序截图"
              prop="appletScreenshot"
            >
              <div>
                <imgs-upload
                  v-model="busInFormation.appletScreenshot"
                  :limit="5"
                />
                <div class="hint">
                  请提供展示商品/服务的页面截图/设计稿(最多5张)，若小程序未建设完善或未上线请务必提供。
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="isVisible4">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                APP
              </div>
              <span>你选择了“APP”场景，审核通过后，服务商可帮商家发起APP支付</span>
            </div>
            <el-form-item
              label="APPID所属"
              prop="resource2"
              style="margin: 30px 0;"
            >
              <el-radio-group v-model="busInFormation.resource2">
                <el-radio :label="0">
                  服务商公众号appid
                </el-radio>
                <el-radio :label="1">
                  商家公众号appid
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="busInFormation.resource2===0"
              label="服务商应用AppId"
              prop="appServiceAPPID"
              style="margin-bottom:30px"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.appServiceAPPID"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  可填写当前服务商商户号已绑定的应用AppD: 查看APPID指引
                </div>
              </div>
            </el-form-item>
            <el-form-item
              v-if="busInFormation.resource2===1"
              label="商家应用AppId"
              prop="appMerchantAppId"
              style="margin-bottom:30px"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.appMerchantAppId"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  请填写与商家主体一致且已认证的应用APPID; 暂不支持绑定异主体的APPID<br>
                  审该通过后，系统将发起待约商家商户号与该ApID的绑定(即配置为su appid) ，服务商随后可在发起支付时选择传入该appid，以完成支付，并获取sub_openid用<br>
                  于数据统计，营销等业务场景 。AppID查看指引
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="APP截图"
              prop="appScreenshot"
              style="margin-bottom:30px"
            >
              <div>
                <imgs-upload
                  v-model="busInFormation.appScreenshot"
                  :limit="5"
                />
                <div
                  class="hint"
                  style="height:auto"
                >
                  请提供APP首页截图，尾页截图，应用内截图，支付页截图各1张 查看示例
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="isVisible5">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                互联网网站
              </div>
              <span>你选择了“互联网网站”场景，审核通过后，服务商可帮商家发起JSAPI支付、Native支付</span>
            </div>

            <el-form-item
              label="互联网网站域名"
              prop="domainName"
              style="margin:30px 0"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.domainName"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  如为PC端商城、智能终端等场景，可上传官网链接(格式需以http://或https://开头)；<br>
                  网站域名需ICP备案，若备案主体与申请主体不同，请上传加盖公章的网站授权函
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="网站授权函"
              style="margin-bottom:30px"
            >
              <div>
                <img-upload
                  v-model:value="busInFormation.authorizationImg"
                />
                <div
                  class="hint"
                  style="height:auto"
                >
                  若备案主体与申请主体不同，请务必上传加盖公章的网站授权函
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="互联网网站对应的商家AppID(选填)"
              style="margin-bottom:30px"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.internetAppid"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  1.可填写已认证的公众号，小程席，应用的APPID，其中公众号APPID需是已认证的服务号、政府或媒体类型的订阅号。ADplD查看指引<br>
                  2.完成进件后，系统发起特约商户号与该AppID的绑定(即配置为sub appid，可在发起支付时传入)<br>
                  (1) 若APPID主体与商家主体一致，则直接完成绑定:<br>
                  (2)若APPID主体与商家主体不一致，则商户签约时显示《联合营运承诺函》，并且AppID的管理员需登录公众平台确认绑定意愿;(暂不支持绑定异主体的应用APPID)
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="isVisible6">
            <div
              class="subject-information"
            >
              <div style="display: inline-block;">
                企业微信
              </div>
              <span> 你选择了“企业微信"场景，审核通过后，商家可自行发起JSAPI支付、Native支付</span>
            </div>

            <el-form-item
              label="商家企业微信CorpID"
              prop="WeComCorpID"
              style="margin:30px 0"
            >
              <div>
                <div>
                  <el-input
                    v-model="busInFormation.WeComCorpID"
                    placeholder="请输入"
                    style="width: 268px;"
                  />
                </div>
                <div
                  class="hint"
                  style="height:auto"
                >
                  可填写与商家主体一致且已认证的企业微信CorpD;审核通过后，系统将为商家开通企业微信专区的自有交易权限，并完成商家商户号与该CorpID的定;CorpID查看指引
                </div>
              </div>
            </el-form-item>
            <el-form-item
              label="企业微信页面截图"
              prop="WeComPageScreenshot"
            >
              <div>
                <imgs-upload
                  v-model="busInFormation.WeComPageScreenshot"
                />
                <div
                  class="hint"
                  style="height:auto"
                >
                  请提供展示商品/服务的页面截图/设计稿 (最多5张) 查看示例
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 2.填写经营信息end -->
      <!-- 3.填写行业资质 -->
      <div v-if="postingSteps===3">
        <div
          class="subject-information"
        >
          <div style="display: inline-block;">
            经营信息
          </div>
        </div>
        <el-form
          ref="qualificationFormRef"
          :model="qualificationForm"
          :rules="rules3"
          label-width="166px"
          status-icon
        >
          <el-form-item
            label="所属行业"
            prop="region"
            style="margin: 30px 0 37px 0;"
          >
            <el-select
              v-model="qualificationForm.region"
              style="width: 268px;"
            >
              <el-option
                label="中国大陆居民-身份证"
                value="shanghai"
              />
              <el-option
                label="中国大陆居民-身份证"
                value="beijing"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="结算费率"
            prop="merchantName"
          >
            <div>
              <el-input
                v-model="qualificationForm.merchantName"
                placeholder="--"
                style="width: 268px;"
              />
            </div>
          </el-form-item>

          <el-form-item
            label="特殊资质"
            style="margin: 30px 0;"
          >
            <div>
              <imgs-upload
                v-model="qualificationForm.qualificationImg"
              />
              <div class="hint">
                根据所属行业进行提示，如餐饮的就是餐饮服务许可证
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="优惠费率活动"
            style="margin: 30px 0 37px 0;"
          >
            <el-select
              v-model="qualificationForm.activityRegion"
              style="width: 268px;"
            >
              <el-option
                label="中国大陆居民-身份证"
                value="shanghai"
              />
              <el-option
                label="中国大陆居民-身份证"
                value="beijing"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="优惠费率活动值"
          >
            <div>
              <el-input
                v-model="qualificationForm.reduceAmount"
                type="number"
                :min="0.01"
                :step="0.01"
                :max="99999"
                style="width: 268px;"
                @blur="checkNumber(1)"
              >
                <template #append>
                  %
                </template>
              </el-input>
              <div class="hint">
                请输入数字，支持两个小数点，需在优惠费率活动的费率范围内
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="优惠费率活动补充材料"
            style="margin: 30px 0;"
          >
            <div>
              <imgs-upload
                v-model="qualificationForm.followUpImg"
              />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 3.填写行业资质end -->
      <!-- 4.结算账户 -->
      <div v-if="postingSteps===4">
        <div
          class="subject-information"
        >
          <div style="display: inline-block;">
            结算账户
          </div>
          <span>请填写所属行业、特殊资质等信息</span>
        </div>
        <el-form
          ref="accountFormRef"
          :model="accountForm"
          :rules="rules4"
          label-width="166px"
          status-icon
        >
          <el-form-item
            style="margin: 30px 0;"
            label="账户类型"
          >
            <div>
              对公银行账户
            </div>
          </el-form-item>
          <el-form-item
            label="开户名称"
          >
            <div>
              广州市蓝海创新科技有限公司
            </div>
          </el-form-item>
          <el-form-item
            label="开户行"
            prop="bank"
            style="margin: 30px 0;"
          >
            <div>
              <el-select
                v-model="accountForm.bank"
                style="width: 268px;"
              >
                <el-option
                  label="中国大陆居民-身份证"
                  value="shanghai"
                />
                <el-option
                  label="中国大陆居民-身份证"
                  value="beijing"
                />
              </el-select>
              <div class="hint">
                城市商业银行、农村商业银行、信用合作联社及其他银行，请选择“其他银行”
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="开户支行"
            required
          >
            <div>
              <div style="display:flex">
                <el-form-item prop="provinceId">
                  <el-select
                    v-model="accountForm.provinceId"
                    style="width: 104px;"
                    placeholder="省份"
                    :disabled="pickerDisabled"
                    @change="onSelectProvince"
                  >
                    <el-option
                      v-for="province in provinceList"
                      :key="province.areaId"
                      :label="province.areaName"
                      :value="province.areaId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item prop="cityId">
                  <el-select
                    v-model="accountForm.cityId"
                    style="width: 104px;margin:0 8px"
                    placeholder="城市"
                    :disabled="pickerDisabled"
                    @change="onSelectCity"
                  >
                    <el-option
                      v-for="city in cityList"
                      :key="city.areaId"
                      :label="city.areaName"
                      :value="city.areaId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="subBranch"
                >
                  <el-select
                    v-model="accountForm.subBranch"
                    style="width: 268px;"
                    placeholder="支行"
                    :disabled="pickerDisabled"
                  >
                    <el-option
                      v-for="area in subBranchList"
                      :key="area.areaId"
                      :label="area.areaName"
                      :value="area.areaId"
                    />
                  </el-select>
                </el-form-item>
              </div>
              <div class="hint">
                如果找不到所在城市，请选择所在地区或者上级城市
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="银行账号"
            prop="bankAccount"
            style="margin:30px 0"
          >
            <el-input
              v-model="accountForm.bankAccount"
              placeholder="请输入"
              style="width: 268px;"
            />
          </el-form-item>
        </el-form>
      </div>
      <!-- 4.结算账户end -->
      <!-- 5.超级管理员 -->
      <div v-if="postingSteps===5">
        <div
          class="subject-information"
        >
          <div style="display: inline-block;">
            超级管理员
          </div>
          <span>超级管理员将接收开户信息及完成签约，并可进行商户号的日常重要管理及资金操作。请确定超级管理员为商户法定代表人或经办人再进行操作</span>
        </div>
        <el-form
          ref="superAdminRef"
          :model="superAdmin"
          :rules="rules5"
          label-width="166px"
          status-icon
        >
          <el-form-item
            label="超管身份"
            prop="resource"
            style="margin: 37px 0 30px 0;"
          >
            <el-radio-group v-model="superAdmin.resource">
              <el-radio :label="0">
                法定发表人/经营者
              </el-radio>
              <el-radio :label="1">
                经办人
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="超管姓名"
            prop="name"
            style="margin:30px 0"
          >
            <el-input
              v-model="superAdmin.name "
              placeholder="请输入"
              style="width: 268px;"
            />
          </el-form-item>
          <el-form-item
            label="超管身份"
            prop="resource2"
            style="margin: 37px 0 30px 0;"
          >
            <el-radio-group v-model="superAdmin.resource2">
              <el-radio :label="0">
                证件号码
              </el-radio>
              <el-radio :label="1">
                微信openid
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="证件号码"
            prop="carNumber"
            style="margin:30px 0"
          >
            <el-input
              v-model="superAdmin.carNumber"
              placeholder="请输入"
              style="width: 268px;"
            />
          </el-form-item>
          <el-form-item
            v-if="superAdmin.resource===1"
            label="微信openid"
            prop="wxOpenId"
            style="margin:30px 0"
          >
            <el-input
              v-model="superAdmin.wxOpenId"
              placeholder="请输入"
              style="width: 268px;"
            />
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="phoneNumber"
            style="margin:30px 0"
          >
            <div>
              <el-input
                v-model="superAdmin.phoneNumber"
                placeholder="请输入"
                style="width: 268px;"
                maxlength="11"
              />
              <div class="hint">
                城市商业银行、农村商业银行、信用合作联社及其他银行，请选择“其他银行”
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="email"
            style="margin:30px 0"
          >
            <div>
              <el-input
                v-model="superAdmin.email"
                placeholder="请输入"
                style="width: 268px;"
              />
              <div class="hint">
                用于接收微信支付的开户邮件及日常业务通知
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <!-- 5.超级管理员end -->
    </div>
    <div
      class="foot-btn"
    >
      <div class="inner">
        <div v-if="postingSteps === 1">
          <el-button
            plain
            @click="goBack"
          >
            返回
          </el-button>
          <el-button
            plain
            @click="save"
          >
            保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="toNextStep"
          >
            下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 2">
          <el-button
            @click="postingSteps=1"
          >
            上一步
          </el-button>
          <el-button
            @click="save"
          >
            保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="toNextStep"
          >
            下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 3">
          <el-button
            @click="postingSteps=2"
          >
            上一步
          </el-button>
          <el-button
            @click="save"
          >
            保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="toNextStep"
          >
            下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 4">
          <el-button
            @click="postingSteps=3"
          >
            上一步
          </el-button>
          <el-button
            @click="save"
          >
            保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="toNextStep"
          >
            下一步
          </el-button>
        </div>
        <div v-if="postingSteps === 5">
          <el-button
            @click="postingSteps=4"
          >
            上一步
          </el-button>
          <el-button
            @click="save"
          >
            保存草稿
          </el-button>
          <el-button
            type="primary"
            @click="toNextStep"
          >
            提交
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <wait-page v-if="stateSubmit===1" />
</template>
<script setup>
import moment from 'moment'
import ImgUpload from '@/components/img-upload/index.vue'
import { ElMessage } from 'element-plus'
import * as addrApi from '@/api/delivery/transport'
import { treeDataTranslate } from '@/utils'
import { isEmail, isMobile, checkIDCard } from '@/utils/validate'
import ImgsUpload from '@/components/imgs-upload/index.vue'
import waitPage from './components/wait-page.vue'
const stateSubmit = ref(0)
const postingSteps = ref(1)
const formSize = ref('default')
const ruleFormRef = ref(null)
onMounted(() => {
  // 请求地址列表
  queryAddressList()
})

const ruleForm = reactive({
  licenseImg: 'flag', // 营业执照
  trader: 'flag', // 商户名称
  registration: 'flag', // 注册号
  operator: 'flag', // 经营者
  date1: '', // 开始时间
  date2: '', // 结束时间
  tradeLongTermDate: '', // 营业长期有效
  desc: 'flag', // 注册地址
  region: '', // 证件类型
  tradeResource: 0, // 营业期限
  carLongTerm: '', // 证件长期有效
  carValidityDate1: '', // 开始时间
  carValidityDate2: '', // 结束时间
  frontCardImg: 'flag', // 身份证正面
  reverseCarImg: 'flag', // 身份证反面
  idCarName: 'flag', // 证件姓名
  idCarNumber: 'flag', // 证件号码
  idCarPeriodValidity: 0, // 证件有效期
  beneficiaryOwner: 0 // 是否为受益所有人
})
const rules = reactive({
  licenseImg: [{ required: true, message: '请上传营业执照', trigger: ['blur', 'change'] }],
  // date1: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  // date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  // tradeLongTermDate: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  // carValidityDate1: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  // carValidityDate2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  // carLongTerm: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
  tradeResource: [{ required: true, message: '请选择营业期限', trigger: 'change' }],
  desc: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  trader: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
  operator: [{ required: true, message: '请输入经营者姓名', trigger: 'blur' }],
  region: [{ required: true, message: '请选择证件类型', trigger: 'change' }],
  frontCardImg: [{ required: true, message: '请上证件照正面', trigger: ['blur', 'change'] }],
  reverseCarImg: [{ required: true, message: '请上证件照反面', trigger: ['blur', 'change'] }],
  registration: [{ required: true, message: '请输入注册号', trigger: 'blur' }],
  idCarName: [{ required: true, message: '请输入证件姓名', trigger: 'blur' }],
  idCarNumber: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
  idCarPeriodValidity: [{ required: true, message: '请选择证件有效期', trigger: 'change' }],
  beneficiaryOwner: [{ required: true, message: '请选择是否为受益所有人', trigger: 'change' }]
})
const router = useRouter()

// 经营信息
const addrListTreeProps = reactive({
  value: 'areaId',
  label: 'areaName'
})
const busInFormationRef = ref(null)
const busInFormation = reactive({
  merchantName: 'flag', // 商户名称
  serviceNumber: 'flag', // 客服电话
  count: 'flag',
  delivery: false,
  type: [],
  resource: 0, // 公众号appId所属
  // 线下场所
  placeName: '', // 线下场所名称
  currentAddr: '', // 线下场所省市
  placeAddress: '', // 场所地址
  doorHeaderImg: '', // 线下场所门头照片
  inDoorImg: '', // 线下场所内部照片
  // 小程序
  applet: '', // 小程序AppId
  appletScreenshot: '', // 小程序截图
  // App
  resource2: 0, // APP-appId所属
  appServiceAPPID: '', // app-服务商应用AppID
  appMerchantAppId: '', // app-商家应用appid
  appScreenshot: '', // app截图
  // 互联网网站
  domainName: '', // 互联网网站域名
  authorizationImg: '', // 网站授权函
  internetAppid: '', // 互联网网站对应的商家AppID

  // 公众号
  serviceAPPID: 'flag', // 服务商APPID
  merchantAppId: 'flag', // 商家appid
  pageScreenshot: 'flag', // 公众号页面截图
  // 企业微信
  WeComCorpID: '', //
  WeComPageScreenshot: ''// 企业微信页面截图
})
// 填写行业资质
const rules2 = reactive({
  merchantName: [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
  serviceNumber: [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
  type: [{ type: 'array', required: true, message: '请选择经营场景', trigger: 'change' }],
  resource: [{ required: true, message: '请选择appId所属', trigger: 'change' }],
  resource2: [{ required: true, message: '请选择appId所属', trigger: 'change' }],
  // 线下场所
  placeName: [{ required: true, message: '请输入线下场所名称', trigger: 'blur' }],
  currentAddr: [{ required: true, message: '请选择所在地区', trigger: ['blur', 'change'] }],
  placeAddress: [{ required: true, message: '请输入线下场所地址', trigger: 'blur' }],
  doorHeaderImg: [{ required: true, message: '请上传场所门头照片', trigger: ['blur', 'change'] }],
  inDoorImg: [{ required: true, message: '请上传场所内部照片', trigger: ['blur', 'change'] }],
  // 小程序
  applet: [{ required: true, message: '请输入线小程序APPID', trigger: 'blur' }],
  // App
  appServiceAPPID: [{ required: true, message: '请输入服务商应用APPID', trigger: 'blur' }],
  appMerchantAppId: [{ required: true, message: '请输入商家APPID', trigger: 'blur' }],
  appScreenshot: [{ required: true, message: '请上传app截图', trigger: ['blur', 'change'] }],
  // 互联网网站
  domainName: [{ required: true, message: '请输入服务商APPID', trigger: 'blur' }],
  authorizationImg: [{ required: true, message: '请上传网站授权函截图', trigger: ['blur', 'change'] }],

  // 公众号
  serviceAPPID: [{ required: true, message: '请输入服务商APPID', trigger: 'blur' }],
  merchantAppId: [{ required: true, message: '请输入商家APPID', trigger: 'blur' }],
  pageScreenshot: [{ required: true, message: '请上传公众号页面截图', trigger: ['blur', 'change'] }],
  // 企业微信
  WeComCorpID: [{ required: true, message: '请输入商家企业微信CorpID', trigger: 'blur' }],
  WeComPageScreenshot: [{ required: true, message: '请上传企业微信页面截图', trigger: ['blur', 'change'] }]
})
const qualificationFormRef = ref(null)
const qualificationForm = reactive({
  region: '', // 所属行业
  merchantName: '', // 结算费率
  qualificationImg: '', // 特殊资质
  activityRegion: '',
  reduceAmount: '', // 优惠费率活动值
  followUpImg: ''// 优惠费率活动补充材料

})
/**
 * 请求地址列表
 */
const addrList = ref([])
const queryAddressList = () => {
  addrApi.listAreaOfEnable({}).then(data => {
    addrList.value = treeDataTranslate(data, 'areaId', 'parentId')
  })
}
/**
 * 监听地址改变
 */
const cascaderAddrRef = ref(null)
const handleAddrChange = (value) => {
  if (value.length > 0) {
    // const labels = cascaderAddrRef.value.getCheckedNodes()[0].pathLabels
    // qualificationForm.province = labels[0]
    // qualificationForm.provinceId = value[0]
    // qualificationForm.city = labels[1]
    // qualificationForm.cityId = value[1]
  }
  // mapLocation(true)
}

const rules3 = reactive({
  region: [{ required: true, message: '请选择所诉行业', trigger: 'change' }]
})
const accountFormRef = ref(null)
const accountForm = reactive({
  bank: '', // 开户行
  provinceId: 'flag', // null, // 省份
  cityId: 'flag', // null, // 城市
  subBranch: 'flag', // null, // 支行
  bankAccount: ''// 银行账户

})
const rules4 = reactive({
  bank: [{ required: true, message: '请选择开户行', trigger: 'change' }],
  provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
  cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
  subBranch: [{ required: true, message: '请选择支行', trigger: 'change' }],
  bankAccount: [{ required: true, message: '请输入银行账户', trigger: 'blur' }]
})
// eslint-disable-next-line no-unused-vars
const validateEmail = (rule, value, callback) => {
  if (!isEmail(value) || value.indexOf(' ') !== -1) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validateMobile = (rule, value, callback) => {
  if (!isMobile(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
// eslint-disable-next-line no-unused-vars
const validIDCard = (rule, value, callback) => {
  if (!value || !checkIDCard(value)) {
    callback(new Error('请输入正确的法人身份证'))
  } else {
    callback()
  }
}
const superAdminRef = ref(null)
const superAdmin = reactive({
  resource: '', // 超管身份
  name: '', // 姓名
  resource2: 0, // 超管身份
  carNumber: '', // 证件号码
  wxOpenId: '', // 微信openid
  phoneNumber: '', // 手机号码
  email: '' // 邮箱

})
const rules5 = reactive({
  resource: [{ required: true, message: '请选择超管身份', trigger: 'change' }],
  resource2: [{ required: true, message: '请选择超管身份', trigger: 'change' }],
  name: [{ required: true, message: '请输入超管姓名', trigger: 'blur' }],
  carNumber: [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    { validator: validIDCard, trigger: 'blur' }
  ],
  wxOpenId: [{ required: true, message: '请输入微信openid', trigger: 'blur' }],
  phoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: validateMobile, trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱号', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ]

})
// 省份
const provinceList = ref([])
// 城市
// 省份选择
const onSelectProvince = () => {
  console.log('选择省份')
}
const cityList = ref([])
const onSelectCity = () => {
  console.log('选择城市')
}
const subBranchList = ref([])
// 输入框的数据改变时，对值进行校验
const checkNumber = () => {
  const reduceAmount = parseFloat(qualificationForm.reduceAmount)
  qualificationForm.reduceAmount = formatNumber(reduceAmount)
}
// 格式化输入的优惠券减免金额
const formatNumber = number => {
  number = parseFloat(number.toFixed(2))
  if (!number) {
    return
  }
  const maxNumber = 99999.99
  if (number >= maxNumber) {
    return maxNumber
  }
  if (number < 0.01) {
    return 0.01
  }
  return number
}
/**
* 图片的值发生改变，重新校验对应表单字段
* @param {*} formName 表单类型 1-基本信息 2-工商信息
* @param {*} prop 图片字段名
*/
const imgChange = (formName, prop) => {
  if (formName === 1) {
    ruleFormRef.value?.clearValidate(prop)
  } else if (formName === 2) {
    busInFormationRef.value?.clearValidate(prop)
  }
}
const goBack = () => {
  router.go(-1)
}
// 清理时间校验
const dateChange = (formName, formName2) => {
  if (formName2) {
    ruleFormRef.value.clearValidate(formName2)
  }
  ruleFormRef.value.clearValidate(formName)
}
// 清理时间校验
const carTimeChange = (formName, formName2) => {
  if (formName2) {
    ruleFormRef.value.clearValidate(formName2)
  }
  ruleFormRef.value?.clearValidate(formName)
}
const toNextStep = () => {
  if (postingSteps.value === 1) {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        postingSteps.value += 1
      } else {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
      }
    })
  }
  if (postingSteps.value === 2) {
    busInFormationRef.value?.validate((valid) => {
      if (valid) {
        postingSteps.value += 1
      } else {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
      }
    })
  }
  if (postingSteps.value === 3) {
    qualificationFormRef.value?.validate((valid) => {
      if (valid) {
        postingSteps.value += 1
      } else {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
      }
    })
  }
  if (postingSteps.value === 4) {
    accountFormRef.value?.validate((valid) => {
      if (valid) {
        postingSteps.value += 1
      } else {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
      }
    })
  }
  if (postingSteps.value === 5) {
    superAdminRef.value?.validate((valid) => {
      if (valid) {
        onSubmit()
      } else {
        ElMessage({
          message: '请先将必填信息填写完整！',
          duration: 1500
        })
      }
    })
  }
}
const isVisible1 = ref(false)
const isVisible2 = ref(false)
const isVisible3 = ref(false)
const isVisible4 = ref(false)
const isVisible5 = ref(false)
const isVisible6 = ref(false)
const changVisibles = () => {
  isVisible1.value = judgeStrArrIncludeOtherString('线下场景')
  isVisible2.value = judgeStrArrIncludeOtherString('公众号')
  isVisible3.value = judgeStrArrIncludeOtherString('小程序')
  isVisible4.value = judgeStrArrIncludeOtherString('APP')
  isVisible5.value = judgeStrArrIncludeOtherString('互联网网站')
  isVisible6.value = judgeStrArrIncludeOtherString('企业微信')
}
const judgeStrArrIncludeOtherString = (str) => {
  console.log(busInFormation.type, 'busInFormation.type')
  return busInFormation.type?.includes(str)
}
// 提交认证
const onSubmit = () => {
  console.log('提交认证')
  stateSubmit.value = 1
}
</script>
<style lang="scss" scoped>
.page-certification-information{
  background: #f9f9f9;

  .title-tips{
    display: flex;
    justify-content: space-between;
    width: 100%;
    line-height: 32px;
    font-size: 14px;
    color: #666666;
    background: #FFF7DD;
    border: 1px solid #FFD888;
    border-radius: 2px;
    padding: 5px 22px;
    margin-bottom: 20px;
    .title-right{
      display: flex;
      align-items: center;
    }
    span{
      margin-left: 3px;
    }
  }
 .information-content{
   width: 100%;
   background: #FFFFFF;
   border: 1px solid #FFF;
   padding: 20px;

   // 步骤
   .post-step {
     display: flex;
     align-content: center;
     justify-content: space-between;
     .step-item {
       position: relative;
       flex: 1;
       .step-txt {
         display: block;
         font-size: 14px;
         text-align: center;
         box-sizing: border-box;
         background: #f9f9f9;
         padding: 12px 0;
       }
     }
     .step-item.active {
       .step-txt {
         color: #fff;
         background: #155bd4;
       }
     }
     // 右箭头
     .step-item:not(:last-child) {
       .step-txt {
         margin-right: 10px;
       }
       &::after {
         position: absolute;
         top: 0;
         right: 0;
         content: '';
         width: 0;
         height: 0;
         border-top: 20px solid transparent;
         border-left: 10px solid #f9f9f9;
         border-bottom: 20px solid transparent;
       }
     }
     .step-item.active:not(:last-child) {
       &::after {
         border-left: 10px solid #155bd4;
       }
     }
     // 左箭头
     .step-item:not(:first-child) {
       &::before {
         position: absolute;
         top: 0;
         left: 0;
         content: '';
         width: 0;
         height: 0;
         border-top: 20px solid transparent;
         border-left: 10px solid #fff;
         border-bottom: 20px solid transparent;
       }
     }
   }
   .subject-information{
     margin-top: 20px;
     height:40px;
     line-height: 40px;
     background: #F9F9F9;
     & >div{
      font-size: 20px;
      font-weight: 700;
      padding:0 12px 0 20px;
     }
     & >span{
      color:#999999
     }
   }
   .hint{
     margin-top: 8px;
     font-size: 12px;
     color: #999999;
     height: 20px;
     line-height: 20px;
  }
}
  /* 脚部按钮 */
  .foot-btn {
    position: fixed;
    bottom: 0;
    width: calc(100% - 270px);
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    // border-top: 1px solid #ddd;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 1999;
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
:deep(.el-form-item__content){
  flex: none;
}
:deep(.el-textarea ){
  width: 268px;
}
:deep(.el-textarea__inner){
  min-height: 140px !important;
}
.long-term {
  :deep(.el-input__wrapper){
    width: 269px;
    margin-left: 30px;
  }
}
:deep(.plugin-images .el-upload),
:deep(.imgs-upload-components .el-upload--picture-card),
:deep(.imgs-upload-components .el-upload-list--picture-card .el-upload-list__item){
  width: 80px;
  height: 80px;
  border-radius: 2px 2px 2px 2px;
  background: #f7f8fa;
}

}

</style>
