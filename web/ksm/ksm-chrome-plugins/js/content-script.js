var contentScript = {
  firstUrl:
    'http://ksm.kingdee.com:8000/ccsp/allFeedback!allFeedbackList.action?orderby=&d-148731-e=2&6578706f7274=1&query=',
  lastUrl:
    '&6578706f7276=1&exportFlag=true&pageDataOnly=true&pageSize=500&currentPage=1',
  platform: [],
  queryAll: false, // 判断是否是点击查询全部，点击时不需要渲染echarts只需要渲染table
  department: '',   // 存部门名称
  isRerender: false,  // 根据部门是否相同，判断是否重新渲染
  atsMenus: ["缺卡检查","考勤业务组织设置","考勤档案","打卡记录","补签","出差","加班","出勤记录","考勤计算","移动签到审核","员工排班查询","员工排班","考勤组排班","行政组织排班","取卡规则","班次设置","考勤组","轮班规则","自动排班","智能排班","个人加班额度","部门加班额度","个人加班额度调整申请","部门加班额度调整申请","加班额度控制参数","加班额度控制启用设置","个人加班额度方案","部门加班额度方案","考勤项目","考勤制度","员工变动考勤业务规则设置","考勤结果明细","考勤结果汇总","考勤统计分析报表","月考勤报表"],
  holidayMenus: ["假期业务组织设置","员工假期档案","假期额度","请假单","请假确认单","假期汇总转薪资","假期类型","额度规则","假期制度","调休规则","假期项目","员工变动假期业务规则设置","假期汇总表","调休明细表"],
  baseDatas: ["加班原因", "加班类型", "加班补偿方式", "出差类型", "补签卡原因", "考勤设备", "班次类型", "日历模板 ", "法定假日", "工作日历", "考勤周期", "考勤状态", "哺乳假类型"],
  wordTags: ["员工变动", "业务规则设置", "排班", "流程", "班次", "补卡", "工作流", "调班", "OSF", "多时区", "后台事务","补丁","缺卡"],
  init: function (name, url, department) {
    this.wordTags = this.wordTags.concat(this.atsMenus.concat(this.holidayMenus).concat(this.baseDatas));
    var self = this;
    self.platform = name;
    self.isRerender = department === self.department ? false : true;
    self.department = department;
    if (self.isRerender) {
      if (!$('#myModal').length) {
        self.createTmp();
        self.createMask();
      }
      self.sendSearch(name);
    }
    $("#myModal").is(':hidden') ?  $("#myModal").modal('show') : null
    setTimeout(function() {
      $('#myModal .modal-body').scrollTop(0);
    }, 1000)
  },

  /**
   * 请求所有人
   */
  sendSearch: function (name) {
    var self = this;
    var url = self.concatUrl(name);
    self.showLoading();
    $.ajax({
      type: 'get',
      url: url,
      success: function (data) {
        if (data.data) {
          self.hideLoading();
          if (!self.queryAll) {
            self.initEcharts(data.data);
          };
          self.queryAll = false;
          self.processDataBefore(data.data);
          self.initTable(data.data);
          self.initDownloadExcel(data.data, name);
        }
      }
    });
  },

  /**
   * 初始化echarts
   */
  initEcharts: function (data) {
    var self = this;
    var count = data.length - 1;
    var obj = {};
    for (var n = 1; n < data.length; n++) {
      for (var m = 0; m < self.platform.length; m++) {
        if (data[n].includes(self.platform[m])) {
          obj[self.platform[m]]
            ? (obj[self.platform[m]] = obj[self.platform[m]] + 1)
            : (obj[self.platform[m]] = 1);
          continue;
        } else {
          obj[self.platform[m]] ? null : (obj[self.platform[m]] = 0);
        }
      }
    }
    var xData = Object.keys(obj);
    var yData = Object.values(obj);
    var myChart = echarts.init(document.getElementById('leftBar'));
    var option = {
      title: {
        text:  self.department+'提单总数:' + count + '个'
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: {
          interval: 0,
          rotate: 30
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: yData,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
          },
          itemStyle: {
            normal: {
              color: '#5B8FF9',
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#404040',
                  fontSize: 18
                },
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return '';
                  }
                }
              }
            }
          }
        }
      ]
    };

    myChart.setOption(option);
    myChart.off('click').on('click', function (params) {
      self.searchSomeOne(params.name);
    });
  },

  /**
   * 点击柱状图搜索某个人的提单
   */
  searchSomeOne: function (name) {
    var self = this;
    var url = self.concatUrl([name]);
    self.showLoading();
    $.ajax({
      type: 'get',
      url: url,
      success: function (data) {
        if (data.data) {
          self.hideLoading();
          self.processDataBefore(data.data);
          self.initTable(data.data);
          self.initDownloadExcel(data.data, name);
        }
      }
    });
  },

  /** name : []
   * 拼接url
   */
  concatUrl: function (name) {
    var url = '';
    !Array.isArray(name) ? (name = eval(name)) : null;
    var len = name.length;
    for (var n = 0; n < len; n++) {
      if (n === len - 1) {
        url += " dealUser.realName = '" + name[n] + "' ";
      } else {
        url += " dealUser.realName = '" + name[n] + "' or";
      }
    }
    url = this.firstUrl + encodeURIComponent(url) + this.lastUrl;
    return url;
  },
 /**
   * 初始化excel表格
   */
  initDownloadExcel: function (data, name) {
//    var data = [["单号","主题","问题类型","反馈时间","产品","版本","模块","客户产品","客户版本","客户模块","状态","处理环节","处理人","整单超期","系统来源","客户名称","反馈组织","活动名称"],["R20210715-2018","补卡单提交分别走流程","数据问题","2021-07-15 15:02:58","金蝶s-HR","金蝶s-HR2.0","考勤管控","金蝶s-HR","2.0","考勤管控","处理中","账套分析","潘定荣","未超期","KSMforEAS","中信科移动通信技术股份有限公司","客户",""],["R20210714-0749","调用OSF接口失败","数据问题","2021-07-14 10:30:31","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","德信控股集团有限公司","客户",""],["R20210715-1308","出差单套打如何取到出差确认单上的实际出差日期","数据问题","2021-07-13 21:17:23","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（分组并发）","8.2","s-HR考勤管理","处理中","账套分析","潘定荣","超期","KSMforEAS","广西路桥工程集团有限公司","客户",""],["R20210716-2009","流程已经结束，但是单据还是审批中状态","环境问题","2021-07-13 17:40:58","金蝶EAS","EAS8.2","s-HR假期管理","EAS（分组并发）","8.2","工作流管理平台","处理中","环境分析","潘定荣","未超期","KSMforEAS","广西路桥工程集团有限公司","客户",""],["R20210713-2243","补签卡不应该选择未来时间、且补签时间改成选择，不要手写","程序错误","2021-07-13 15:06:55","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","超期","KSMforEAS","北京云房易邦网络科技有限责任公司","客户",""],["R20210712-3768","二开调用出差确认事物，报找不到DEP元数据错误","数据问题","2021-07-12 19:33:03","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","深圳市顺丰同城物流有限公司","客户",""],["R20210709-1552","补卡单打回修改后提交报错","程序错误","2021-07-09 12:56:43","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","超期","KSMforEAS","力旺集团有限公司","客户",""],["R20210708-3086","系统升级之后考勤计算排班批量修改界面有提示报错，但可以保存","数据问题","2021-07-08 16:41:57","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","上海瑞龙投资管理有限公司","客户",""],["R20210712-1839","创建补签卡，没有弹出证明人选择框，无法选择证明人","数据问题","2021-07-08 11:24:32","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","福建嵩霖集团有限公司","客户",""],["R20210707-0551","补签卡信息填写时间，格式不正确的提示需要更改","程序错误","2021-07-07 09:59:00","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","开发资源评估","潘定荣","严重超期","KSMforEAS","中广核高新核材集团有限公司","客户",""],["R20210708-3070","补签卡单、加班单审核通过，考勤计算后，还是在未参与计算单据","数据问题","2021-07-06 17:35:21","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","松下信息系统（上海）有限公司北京分公司","客户",""],["R20210705-1509","【员工排班】-【员工排班查询】-【排班时间修订】，选择班次，为什么自动带出了行政组织制造中心？","程序错误","2021-07-05 11:55:28","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","超期","客户提单","华鼎国联四川动力电池有限公司","客户",""],["R20210702-1105","【86sp1】打卡记录作废后、考勤计算审核后最后修改人不显示","程序错误","2021-07-02 11:02:45","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","通达（厦门）科技有限公司","客户",""],["R20210701-1995","补签卡问题","数据问题","2021-07-01 14:41:40","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","天虹数科商业股份有限公司","客户",""],["R20210630-3878","补签卡列表的缺卡检查增加组织范围权限","程序错误","2021-06-30 18:23:42","金蝶EAS","EAS8.5","s-HR假期管理","EAS（分组并发）","8.5","s-HR假期管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","新湖财富投资管理有限公司","客户",""],["R20210630-2353","出差单控制不可以补提，","程序错误","2021-06-30 15:07:19","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","爱博诺德（北京）医疗科技股份有限公司","客户",""],["R20210629-1979","员工排班查询能否增加一个字段，加班补偿方式","数据问题","2021-06-29 14:11:21","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","上海永升物业管理有限公司","客户",""],["R20210628-1612","【86sp1】补签卡审批通过后，员工考勤计算后，明细内仍不显示补卡信息，需从新反审批提交生效才能取到","数据问题","2021-06-28 13:46:00","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","通达（厦门）科技有限公司","客户",""],["R20210628-0532","出差单上的确认状态为【确认中】","环境问题","2021-06-28 10:11:17","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云并发制)","8.6","s-HR考勤管理","处理中","环境分析","潘定荣","未超期","KSMforEAS","陕西西凤酒股份有限公司","客户",""],["R20210626-1509","【86sp1】考勤计算批量补提打卡，选中多人，仅会显示部分员工的补卡","数据问题","2021-06-26 22:12:27","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","通达（厦门）科技有限公司","客户",""],["R20210626-0500","员工排班选择班次加载非常慢","数据问题","2021-06-26 11:52:01","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","未超期","KSMforEAS","锦心明信投资(深圳)有限公司","客户",""],["R20210626-0420","【86sp1】员工离职后，考勤档案自动禁用后，考勤计算补提补签卡无法找到离职人员","程序错误","2021-06-26 11:33:32","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","通达（厦门）科技有限公司","客户",""],["R20210625-3542","员工排班查询列表，员工编码查询不出结果","程序错误","2021-06-25 18:33:26","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","广州市卓越里程教育科技有限公司","客户",""],["R20210621-4090","复制新增班次报错","程序错误","2021-06-21 19:43:49","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管控","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管控","处理中","错误分析","潘定荣","严重超期","KSMforEAS","江西金力永磁科技股份有限公司","客户",""],["R20210618-1738","关于出差单时间的校验","数据问题","2021-06-18 14:08:00","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","上海永升物业管理有限公司","客户",""],["R20210622-2081","8.6sp1员工排班查询纵向列表无数据显示，横向正常（8.6升级测试）","数据问题","2021-06-18 13:54:41","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（注册用户）","8.2","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","江苏大明金属制品有限公司","客户",""],["R20210615-3026","补签卡补签期限控制失效","程序错误","2021-06-15 17:03:44","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","河南驼人医疗器械集团有限公司","客户",""],["R20210621-2910","补签卡的缺卡检查为空","程序错误","2021-06-15 09:01:10","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","杭州诺贝尔陶瓷有限公司","客户",""],["R20210612-0893","考勤计算中点击“排班批量修改”报错","程序错误","2021-06-12 21:12:46","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","上海复旦微电子集团股份有限公司","客户",""],["R20210611-1783","内勤、外勤需控制补卡次数","数据问题","2021-06-11 14:16:59","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","青岛崂应海纳光电环保集团有限公司","客户",""],["R20210611-0913","在出差申请单复制标准视图新增了流程视图，审批人审批时没有显示出差信息","程序错误","2021-06-11 10:59:01","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(公有云)","8.6","工作流管理平台","处理中","错误分析","潘定荣","严重超期","KSMforEAS","东陶机器(广州)有限公司","客户",""],["R20210610-2274","更新PT150181补丁后。后台事物执行报错","环境问题","2021-06-10 15:08:57","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（分组并发）","8.2","s-HR考勤管理","处理中","环境分析","潘定荣","严重超期","KSMforEAS","温氏食品集团股份有限公司","客户",""],["R20210610-2189","后台任务自动排班执行不成功","程序错误","2021-06-10 14:57:15","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","上海复旦微电子集团股份有限公司","客户",""],["R20210609-2984","复制班次报错","程序错误","2021-06-09 16:38:17","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","深圳市特发集团有限公司","客户",""],["R20210608-1592","不允许提前补签，但没效果","数据问题","2021-06-08 12:23:47","金蝶EAS","金蝶s-HR云托管租赁8.5","s-HR考勤管理","金蝶s-HR云托管租赁","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","福建巨电新能源股份有限公司","客户",""],["R20210610-3054","补签卡附件控制失效","数据问题","2021-06-08 11:55:51","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","河南驼人医疗器械集团有限公司","客户",""],["R20210607-1647","补签卡列表数据导出重复","数据问题","2021-06-07 12:22:58","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","广州市卓越里程教育科技有限公司","客户",""],["R20210604-4167","班次复制新增时报错","程序错误","2021-06-04 23:30:27","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","上海复旦微电子集团股份有限公司","客户",""],["R20210604-0702","员工自助出差单时间控件选择小时有点卡顿","数据问题","2021-06-04 10:19:16","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","盛丰物流集团有限公司","客户",""],["R20210603-3823","蒙万强的补签卡单提交工作流可以提交生效报错","程序错误","2021-06-03 17:45:24","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","深圳市瑞丰光电子股份有限公司","客户",""],["R20210602-2832","员工补卡超过次数显示","数据问题","2021-06-02 15:35:42","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（注册用户）","8.2","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","深圳金一文化发展有限公司","客户",""],["R20210601-0179","BOS工作流的审批人和条件，能不能发起的时候由发起人来控制人和条件","程序错误","2021-06-01 09:07:31","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","工作流管理平台","处理中","错误分析","潘定荣","严重超期","IM","曲靖市发展投资集团有限公司","客户",""],["R20210528-2765","客户反馈补丁不习惯，系统遗留的问题耽误客户处理业务","数据问题","2021-05-28 16:26:48","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(公有云)","8.6","s-HR人事考勤薪酬","处理中","账套分析","潘定荣","严重超期","KSMforEAS","赫得纳米科技重庆有限公司","客户",""],["R20210528-0432","补签卡单在流程中修改保存提交报错","程序错误","2021-05-28 09:52:54","金蝶EAS","EAS8.5","s-HR考勤管控","EAS（分组并发）","8.5","s-HR考勤管控","处理中","错误分析","潘定荣","严重超期","KSMforEAS","吉林省力旺房地产开发有限公司","客户",""],["R20210527-2394","出差单单据页面点击提交生效没有反应","程序错误","2021-05-27 15:04:26","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(公有云)","8.6","s-HR人事考勤薪酬","处理中","错误分析","潘定荣","严重超期","KSM工单","外星人智造互联技术(山西)有限公司","机构",""],["R20210526-1707","8.5sp1排班查询列表没有颜色显示","数据问题","2021-05-26 13:54:59","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","安踏体育用品集团有限公司","客户",""],["R20210520-0322","出差单时间冲突校验","程序错误","2021-05-20 09:31:37","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","上海核工程研究设计院有限公司","客户",""],["R20210517-3061","出差免打卡出现旷工","程序错误","2021-05-17 16:51:43","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","河南驼人医疗器械集团有限公司","客户",""],["R20210512-1801","复制班次设置提示标识符过长","程序错误","2021-05-12 13:27:03","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","广州市炳胜食艺餐饮有限公司","客户",""],["R20210511-2986","补签卡-缺勤检查这个界面能否单独作为一个菜单使用","应用问题","2021-05-11 16:14:00","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","应用问题答复","潘定荣","严重超期","KSMforEAS","江西万年青水泥股份有限公司","客户",""],["R20210510-3965","【特殊支持报备】补签单提交。领导审批后单据挂起，帮忙分析下原因","数据问题","2021-05-10 19:01:31","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","烽火通信科技股份有限公司","客户",""],["R20210510-2497","代管员工无法自动排班","程序错误","2021-05-10 15:15:14","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","西安沃丰商业运营管理有限公司","客户",""],["R20210510-0869","8611考勤计算-批量补提单据不生效.","程序错误","2021-05-10 10:38:22","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","众安集团有限公司","客户",""],["R20210508-4673","出差1天，员工自助首页显示出差（分钟）为1","程序错误","2021-05-08 23:33:49","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","众安集团有限公司","客户",""],["R20210507-3033","调班生效到排班","应用问题","2021-05-07 15:51:58","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","应用问题答复","潘定荣","严重超期","KSMforEAS","唐山陆凯科技有限公司","客户",""],["R20210506-3037","补签卡设置逻辑","程序错误","2021-05-06 16:20:46","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云并发制)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","陕西西凤酒股份有限公司","客户",""],["R20210506-2618","缺卡检查时间点不对","程序错误","2021-05-06 15:33:12","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","广东溢丰环保集团股份有限公司","客户",""],["R20210506-1456","两个不同账号查询缺卡记录时查询出的人员范围不同","程序错误","2021-05-06 11:47:23","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","青岛提迪凯电子有限公司","客户",""],["R20210506-0246","关联： R20210402-3028 问题:排班时间修订无法选择班次","数据问题","2021-05-06 09:24:44","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（注册用户）","8.2","s-HR员工管理","处理中","账套分析","潘定荣","严重超期","呼叫中心","辽宁红运投资(集团)有限公司","客户",""],["R20210430-0701","考勤计算功能和排班列表查询功能慢","数据问题","2021-04-30 10:33:32","金蝶EAS","EAS8.2","s-HR考勤管理","EAS（分组并发）","8.2","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","温氏食品集团股份有限公司","客户",""],["R20210429-1866","员工排版查询、补签卡行政组织过滤条件未生效","应用问题","2021-04-28 09:59:53","金蝶EAS","EAS8.2","s-HR考勤管理","金蝶s-HR云托管租赁","8.2","s-HR考勤管理","处理中","应用问题答复","潘定荣","严重超期","KSMforEAS","河钢数字技术股份有限公司","客户",""],["R20210427-3306","补签卡单填写完成后点击提交工作流报错，提示没有匹配的流程。若先点击保存在点击提交工作流就可以提交","数据问题","2021-04-27 16:54:12","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","深圳市瑞丰光电子股份有限公司","客户",""],["R20210422-1361","shr 8.6打PT156181补丁，单人补签卡单据入口条件异常，不能直接提交工作流， 直接提交工作报错；未打此补丁之前，研发给了私包js处理了，重新部署私包也不行","数据问题","2021-04-22 11:37:33","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","IM","现代重工(中国)投资有限公司","客户",""],["R20210422-0889","出差单出现问题","程序错误","2021-04-22 10:39:47","金蝶EAS","金蝶s-HR云托管租赁8.5","s-HR考勤管理","金蝶s-HR云托管租赁","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","广州尊博医疗器械有限公司","客户",""],["R20210421-2530","sHR8.6 sp1 补卡单搜索员工，然后选择员工后只带出员工编号信息。","程序错误","2021-04-21 15:25:07","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","深圳市优博讯科技股份有限公司","客户",""],["R20210421-0186","考勤地点更新","数据问题","2021-04-21 09:09:14","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","上海核工程研究设计院有限公司","客户",""],["R20210417-0788","缺卡检查与考勤单据、排班的名称的关系，及考勤结果明细","程序错误","2021-04-16 15:25:27","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","信泰(福建)科技有限公司","客户",""],["R20210415-0629","不管是考勤档案还是假期档案，工作日历都是空","数据问题","2021-04-15 10:12:13","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","深圳市瑞丰光电子股份有限公司","客户",""],["R20210413-2699","出差单中直接输入员工姓名不能带出组织和职位","程序错误","2021-04-13 15:40:31","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","广东巴德富科技有限公司","客户",""],["R20210409-3464","导入班次报错：加班补偿方式不可用","环境问题","2021-04-09 17:37:21","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云订阅)","8.6","s-HR考勤管理","处理中","环境分析","潘定荣","严重超期","KSMforEAS","安踏体育用品集团有限公司","客户",""],["R20210409-2990","排班导入失败","程序错误","2021-04-09 16:30:35","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","深圳市顺丰同城物流有限公司","客户",""],["R20210406-2583","出差单分录莫名丢失","数据问题","2021-04-06 15:25:15","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（注册用户）","8.5","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","舒华体育股份有限公司","客户",""],["R20210331-0760","流程审批通过节点挂起，撤销挂起刷新才会通过","数据问题","2021-03-30 14:14:39","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR假期管理","EAS Cloud标准产品(私有云订阅)","8.6","工作流管理平台","处理中","账套分析","潘定荣","严重超期","KSMforEAS","安踏体育用品集团有限公司","客户",""],["R20210311-2992","班后智能排班程序错误","数据问题","2021-03-11 16:24:49","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","重庆平伟汽车科技股份有限公司","客户",""],["R20210302-2006","员工补卡之后，补签卡的记录未插入到打卡记录中","数据问题","2021-03-02 13:55:30","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","账套分析","潘定荣","严重超期","KSMforEAS","湖南文和友小龙虾有限公司","客户",""],["R20210203-3342","考勤业务组织调整后无法排班","程序错误","2021-02-03 17:19:51","金蝶EAS Cloud","EAS Cloud标准产品8.6","s-HR考勤管理","EAS Cloud标准产品(私有云)","8.6","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","西安沃丰商业运营管理有限公司","客户",""],["R20210122-2001","BOTP报错，组织内码为空","数据问题","2021-01-22 14:46:02","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","工作流管理平台","处理中","账套分析","潘定荣","严重超期","KSMforEAS","江苏益客食品集团股份有限公司","客户",""],["R20210114-2916","班前智能排班有有员工无法正常生成排班班次","程序错误","2021-01-14 16:10:29","金蝶EAS","EAS8.5","s-HR考勤管理","EAS（分组并发）","8.5","s-HR考勤管理","处理中","错误分析","潘定荣","严重超期","KSMforEAS","晋城福盛钢铁有限公司","客户",""]]

    var str = "";
    //var str = "博客, 域名\nBlog, 2\njb51.net, 3";
    for(var i in data) {
        str += data[i].toString() + "\n";
    }
    var uri = 'data:text/csv;charset=utf-8,' + str;
    var fileName = "提单分析 " +name + " " + new Date().toISOString() + ".csv";
//    var downloadLink = document.createElement("a");
    $('#myDownload').text(fileName);
    $('#myDownload').attr("href", uri);
    $('#myDownload').attr("download", fileName);
    $('#exportExcel').on('click', function (e) {
        $('#myDownload')[0].click();
    });
//    downloadLink.href = uri;
//    downloadLink.download = fileName;
//
//    document.body.appendChild(downloadLink);
//    downloadLink.click();
//    document.body.removeChild(downloadLink);
  },
  /**
   ],"pageNo":1,"fullListSize":0};* 初始化table
   */
  processDataBefore: function (data, name) {

    data[0].splice(1,0,"问题分类标签");
    for (var n = 1; n < data.length; n++) {
      var aRow = data[n];
      var rowTitle = aRow[1];
      var resultWordTags = "";
      for (var i = 0; i < this.wordTags.length; i ++) {
        var wordTag = this.wordTags[i];
        if (rowTitle && -1 != rowTitle.toLowerCase().indexOf(wordTag.toLowerCase())) {
           resultWordTags += (resultWordTags.length > 0 ? " " : "") + wordTag;
        }
      }

      aRow.splice(1, 0, resultWordTags);
    }
  },
  initTable: function (data, name) {
    var head = data[0];
    this.createThead(head);
    this.createTbody(data);
    this.numAddEvent();
  },

  /**
   * 创建表头
   */
  createThead: function (data) {
    var thStr = '';
    for (var n = 0; n < data.length; n++) {
      thStr += '<th>' + data[n] + '</th>';
    }
    $('#myTable .thead').empty();
    $('#myTable .thead').append(thStr);
  },

  /**
   * 创建表体
   */
  createTbody: function (data) {
    var trStr = '';
    for (var n = 1; n < data.length; n++) {
      var currentTr = '';
      for (var m = 0; m < data[n].length; m++) {
        if (m === 0) {
          currentTr +=
            '<td class="firstTd"><span class="num">' +
            data[n][m] +
            '</span></td>';
        } else {
          currentTr += '<td>' + data[n][m] + '</td>';
        }
      }
      currentTr = '<tr>' + currentTr + '</tr>';
      trStr += currentTr;
    }
    $('#myTable .tbody').empty();
    $('#myTable .tbody').append(trStr);
  },
  /**
   * 组装弹窗Modal
   */
  createTmp: function () {
    var self = this;
    let modal = [
      '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">',
      '<div class="modal-dialog modal-lg" role="document">',
      '<div class="modal-content">',
      '<div class="modal-header">',
      '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
      '<h4 class="modal-title" id="myModalLabel">提单部门统计</h4>',
      '</div>',
      '<a id="myDownload"/>',
      '<div class="modal-body">',
      '<div class="echarts">',
      '<div id="leftBar" style="height:400px;"></div>',
      '</div>',
      '<div class="formTable">',
      '<div class="table-responsive">',
      '<table class="table table-striped table-bordered table-hover" id="myTable">',
      '<thead>',
      '<tr class="thead">',
      '</tr>',
      '</thead>',
      '<tbody class="tbody">',

      '</tbody>',
      '</table>',
      '</div>',
      '</div>',
      '</div>',
      '<div class="modal-footer">',
      '<button type="button" class="myBtn" data-dismiss="modal">关闭</button>',
      '<button type="button" class="myBtn myBtnPrimary" id="exportExcel">下载Excel</button>',
      '<button type="button" class="myBtn myBtnPrimary" id="queryAll1">查询全部</button>',
      '</div>',
      '</div>',
      '</div>',
      '</div>'
    ];
    modal = modal.join('');
    $('body').append(modal);

    $('#myModal #queryAll')
      .off('click')
      .on('click', function () {
        self.queryAll = true;
        self.sendSearch(self.platform);
      });
  },
  /**
   * 第一行添加事件监听
   */
  numAddEvent: function () {
    var self = this;
    $('.firstTd .num')
      .off('click')
      .on('click', function (e) {
        var id = $(e.target).html();
        self.quickSearch(id);
      });
  },
  /**
   * 通过提单号搜索feedBackId
   */
  quickSearch: function (id) {
    var self = this;
    self.showLoading();
    $.ajax({
      url:
        "http://ksm.kingdee.com:8000/ccsp/allFeedback!allFeedbackList.action?query=obj.number='"+id+"'&orderby=",
      type: 'get',
      success: function (data) {
        if (data) {
          self.hideLoading();
          // 根据feedBackId去跳转提单详情
          var feedBackId = data.match(/<tr id=\"(\S*)\"/)[1];
          window.open(
            'http://ksm.kingdee.com:8000/ccsp/feedBack!dealFeedBack.action?feedBackId=' +
              feedBackId
          );
        }
      }
    });
  },
  /**
   * 创建遮罩层
   */
  createMask: function () {
    let mask = [
      '<div class="modal fade" id="loadingModal" backdrop="static" keyboard="false">',
      '<div style="width: 200px;z-index: 20000; position: absolute; text-align: center; left: 50%; top: 50%;margin-left:-100px;margin-top:-10px">',
      '<div class="myLoading">',
      '<span></span>',
      '<span></span>',
      '<span></span>',
      '<span></span>',
      '<span></span>',
      '</div>',
      '<h5 id="loadText">加载中...</h5>',
      '</div>',
      '</div>'
    ];
    mask = mask.join('');
    $('body').append(mask);
  },

  /**
   * 显示loading
   */
  showLoading: function (loadText) {
    if (!loadText) {
      $('#loadText').html(loadText);
    }
    $('#loadingModal').modal({ backdrop: 'static', keyboard: false });
  },
  /**
   * 隐藏loading
   */
  hideLoading: function () {
    $('#loadingModal').modal('hide');
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //判断是否为要处理的消息
  var name = eval(request.name);
  var currentUrl = request.url;
  var department = request.title;
  contentScript.init(name, currentUrl, department);
  sendResponse({ result: 'ok' });
});
