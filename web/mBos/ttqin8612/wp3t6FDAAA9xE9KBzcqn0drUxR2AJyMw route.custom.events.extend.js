mbos('page').bind('afterOnload', function () {
    // rem --> px
    ; (function (win, doc) {
        function change() {
            var rem = (doc.documentElement.clientWidth * 20) / 375
            doc.documentElement.style.fontSize = rem + 'px'
            var d = document.createElement('div')
            d.style.cssText = 'width:10rem;height:0;overflow: hidden;position:absolute;z-index:-1;visibility: hidden;'
            document.body.appendChild(d)
            var dw = d.offsetWidth // 10rem的实际展示px值

            document.body.removeChild(d)
            realRem = (rem * rem * 10) / dw
            doc.documentElement.style.fontSize = realRem + 'px'
        }
        if ($('body').length >= 1) {
            change()
        }
        win.addEventListener('load', change, false)
        win.addEventListener('resize', change, false)
        win.addEventListener('orientationchange', change, false)
    })(window, document)

    var _private = {}
    // 获取mbos参数
    _private._mbosParams = mbos.getRequestParams()
    // 域名
    _private._hostname = window.location.origin
    // 企业号
    _private._storeEid = _private._mbosParams.storeEid || _private._mbosParams.eid
    // 异常列表数据
    // _private.abnormalList = []
    // 开关组件
    var switchBtn = {
        props: {
            isSwitch: {
                type: Boolean,
                require: true
            }
        },
        template: '#switchBtn',
        methods: {
            swtichFn: function () {
                this.$emit('switch')
            }
        }
    }
    // 单据入口
    var plus = {
        template: '#plus',
        data: function () {
            return {
                menus: [],
                attendanceClosePng: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-close.png'
            }
        },
        created: function () {
            var appid = mbos.getRequestParams().appid
            var eid = mbos.getRequestParams().eid
            this.menus = [
                {
                    img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-leave.png',
                    text: localeResource.plusMenu1,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW'
                },
                {
                    img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-overTime.png',
                    text: localeResource.plusMenu2,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&path=OT8612&name=edit.editui&operateState=ADDNEW'
                },
                {
                    img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-fillSignCard.png',
                    text: localeResource.plusMenu3,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&path=mysign8612&name=mysignRecordList.custom'
                },
                {
                    img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-fillSignCard.png',
                    text: localeResource.plusMenu4,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&path=fill8612&name=fillSignCard.editui&operateState=ADDNEW&type=autocard'
                },
                //20230530 隐藏出差
                // {
                //   img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-trip.png',
                //   text: localeResource.plusMenu5,
                //   url:
                //     '/mbos/page/loadPage?storeEid=' +
                //     _private._storeEid +
                //     '&appid=' +
                //     appid +
                //     '&eid=' +
                //     eid +
                //     '&path=trip8612&name=edit.editui&operateState=ADDNEW'
                // },
                {
                    img: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-cancelLeave.png',
                    text: localeResource.plusMenu6,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&path=cancel8612&name=canCancelList.custom'
                },

                //隐藏出差确认
                // {
                //   img: '/mbos/store/' + _private._storeEid + '/fileLibrary/scheduling-出差确认.png',
                //   text: localeResource.plusMenu7,
                //   url:
                //     '/mbos/page/loadPage?storeEid=' +
                //     _private._storeEid +
                //     '&appid=' +
                //     appid +
                //     '&eid=' +
                //     eid +
                //     '&path=busiAsk8612&name=businessList.custom&fromPage=ttqin8612'
                // }
//      BT-00756150   【8612第二轮集成测试】【移动端】档案变更需要屏蔽入口
                // {
                //   img:
                //     "/mbos/store/" +
                //     _private._storeEid +
                //     "/fileLibrary/attendance-default.png",
                //   text: localeResource.plusMenu8,
                //   url:
                //     "/mbos/page/loadPage?storeEid=" +
                //     _private._storeEid +
                //     "&appid=" +
                //     appid +
                //     "&eid=" +
                //     eid +
                //     "&path=AtsFile8612&name=FileChange.editui&fromPage=ttqin8612&operateState=ADDNEW"
                // }
            ]
        },
        methods: {
            move: function (item) {
                location.href = item.url
            },
            close: function () {
                this.$emit('close')
            }
        }
    }
    // 班次打卡图
    var banImg = {
        template: '#banImg',
        data: function () {
            return {
                rem: (document.documentElement.clientWidth * 20) / 375
            }
        },
        props: ['list', 'card'],
        created: function () {
            this.cardWidth = 2.3 * this.rem
            this.calcTotalLine()
        },
        watch: {
            list:function (newVal, oldVal) {
                this.list = newVal
                // 计算每个时间轴的长度
                this.calcTotalLine()
            }
        },
        methods: {
            // 计算每个时间轴的长度
            calcTotalLine: function(){
                if (this.list.length == 2) {
                    this.totalLineWidth = (18.75 - 1 - 1 - 1 - 0.2) * this.rem
                } else if (this.list.length == 4) {
                    this.totalLineWidth = ((18.75 - 1 - 1 - 1) / 2 - 0.2) * this.rem
                } else {
                    this.totalLineWidth = ((18.75 - 1 - 1 - 1) / 3 - 0.2) * this.rem
                }
            },

            getCardLeft: function (index) {
                //    当出现比第一个时间小的时候为跨天班
                var minlistTime = new Date('1970/01/01 ' + this.list[0]).getTime() //
                var listStartTime = new Date('1970/01/01 ' + this.list[index - 2]).getTime()
                var listEndTime = new Date('1970/01/01 ' + this.list[index - 1]).getTime()
                listStartTime = listStartTime < minlistTime ? listStartTime + 24 * 60 * 60 * 1000 : listStartTime
                listEndTime = listEndTime < minlistTime ? listEndTime + 24 * 60 * 60 * 1000 : listEndTime

                //    当出现比第一个时间小的时候为跨天班
                var minCardTime = 0
                if (this.card[0]) {
                    minCardTime = new Date('1970/01/01 ' + this.card[0]).getTime()
                } else {
                    minCardTime = new Date('1970/01/01 ' + this.list[0]).getTime()
                }
                var cardStartTime = new Date('1970/01/01 ' + this.card[index - 2]).getTime()
                cardStartTime = cardStartTime < minCardTime ? cardStartTime + 24 * 60 * 60 * 1000 : cardStartTime
//         R20221012-3423 潘倩 跨天上班 时间可能是23：00--06：00
                var cardEndTime = new Date('1970/01/01 ' + this.card[index - 1]).getTime()
                // 开始打卡时间是昨天 可能存在打卡开始时间大于打卡结束时间
                cardStartTime = cardEndTime < cardStartTime ? cardStartTime - 24 * 60 * 60 * 1000 : cardStartTime

                // 计算左标签位置
                if (cardStartTime <= listStartTime) {
                    return {
                        left: '0',
                        background: '#8bd251'
                    }
                } else if (cardStartTime < listEndTime) {
                    var leftPercent = (cardStartTime - listStartTime) / (listEndTime - listStartTime)
                    return {
                        left: leftPercent * (this.totalLineWidth - this.cardWidth) + 'px',
                        background: ''
                    }
                } else {
                    return {
                        left: this.totalLineWidth - this.cardWidth + 'px',
                        background: ''
                    }
                }
            },
            getCardRight: function (index) {
                //    当出现比第一个时间小的时候为跨天班
                var minlistTime = new Date('1970/01/01 ' + this.list[0]).getTime()
                var listStartTime = new Date('1970/01/01 ' + this.list[index - 2]).getTime()
                var listEndTime = new Date('1970/01/01 ' + this.list[index - 1]).getTime()
                listStartTime = listStartTime < minlistTime ? listStartTime + 24 * 60 * 60 * 1000 : listStartTime
                listEndTime = listEndTime < minlistTime ? listEndTime + 24 * 60 * 60 * 1000 : listEndTime

                //    当出现比第一个时间小的时候为跨天班
                var minCardTime = 0
                if (this.card[0]) {
                    minCardTime = new Date('1970/01/01 ' + this.card[0]).getTime()
                } else {
                    minCardTime = new Date('1970/01/01 ' + this.list[0]).getTime()
                }
                var cardEndTime = new Date('1970/01/01 ' + this.card[index - 1]).getTime()
                cardEndTime = cardEndTime < minCardTime ? cardEndTime + 24 * 60 * 60 * 1000 : cardEndTime
                // 计算右标签位置
                if (cardEndTime >= listEndTime) {
                    return {
                        right: '0',
                        background: '#8bd251'
                    }
                } else if (cardEndTime < listStartTime) {
                    return {
                        right: this.totalLineWidth - this.cardWidth + 'px',
                        background: ''
                    }
                } else {
                    var rightPercent = (listEndTime - cardEndTime) / (listEndTime - listStartTime)
                    return {
                        right: rightPercent * (this.totalLineWidth - this.cardWidth) + 'px',
                        background: ''
                    }
                }
            },
            getStyleObj: function (index) {
                //    当出现比第一个时间小的时候为跨天班
                var minlistTime = new Date('1970/01/01 ' + this.list[0]).getTime()
                var listStartTime = new Date('1970/01/01 ' + this.list[index - 2]).getTime()
                var listEndTime = new Date('1970/01/01 ' + this.list[index - 1]).getTime()
                listStartTime = listStartTime < minlistTime ? listStartTime + 24 * 60 * 60 * 1000 : listStartTime
                listEndTime = listEndTime < minlistTime ? listEndTime + 24 * 60 * 60 * 1000 : listEndTime

                //    当出现比第一个时间小的时候为跨天班
                var minCardTime = 0
                if (this.card[0]) {
                    minCardTime = new Date('1970/01/01 ' + this.card[0]).getTime()
                } else {
                    minCardTime = new Date('1970/01/01 ' + this.list[0]).getTime()
                }
                var cardStartTime = new Date('1970/01/01 ' + this.card[index - 2]).getTime()
                cardStartTime = cardStartTime < minCardTime ? cardStartTime + 24 * 60 * 60 * 1000 : cardStartTime
                var cardEndTime = new Date('1970/01/01 ' + this.card[index - 1]).getTime()
                cardEndTime = cardEndTime < minCardTime ? cardEndTime + 24 * 60 * 60 * 1000 : cardEndTime
                var lineStartPercent
                if (cardStartTime < listStartTime) {
                    lineStartPercent = 0
                } else if (cardStartTime < listEndTime) {
                    lineStartPercent = ((cardStartTime - listStartTime) * 100) / (listEndTime - listStartTime)
                } else {
                    lineStartPercent = 100
                }
                var lineEndPercent
                if (cardEndTime > listEndTime) {
                    lineEndPercent = 0
                } else if (cardEndTime < listStartTime) {
                    lineEndPercent = 100
                } else {
                    lineEndPercent = ((listEndTime - cardEndTime) * 100) / (listEndTime - listStartTime)
                }
                return {
                    width: 100 - lineStartPercent - lineEndPercent + '%',
                    left: lineStartPercent + '%'
                }
            }
        }
    }
    // 首页
    var cA = {
        template: '#comA',
        data: function () {
            return {
                yesterday: '',
                today: '',
                tomorrow: '',
                pic: '',
                personInfo: {
                    name: '',
                    pic: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png'
                },
                yesterdayData: {
                    hasAtsHisFile: false
                },
                todayData: {
                    hasAtsHisFile: false
                },
                todayListShift: ['08:00-', '18:00'],
                yesListShift: ['08:00-', '18:00'],
                tomorrowData: {
                    hasAtsHisFile: false
                },
                list: [],
                card: [],
                holidays: 0,
                soup: '',
                attendanceNone: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-none.png'
            }
        },
        components: {
            banImg: banImg
        },
        created: function () {
            var _this = this
            var t = new Date()
            this.today =
                t.getFullYear() +
                '-' +
                (t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1) +
                '-' +
                (t.getDate() < 10 ? '0' + t.getDate() : t.getDate())
            var t = new Date()
            t.setDate(t.getDate() - 1)
            this.yesterday =
                t.getFullYear() +
                '-' +
                (t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1) +
                '-' +
                (t.getDate() < 10 ? '0' + t.getDate() : t.getDate())
            var t = new Date()
            t.setDate(t.getDate() + 1)
            this.tomorrow =
                t.getFullYear() +
                '-' +
                (t.getMonth() + 1 < 10 ? '0' + (t.getMonth() + 1) : t.getMonth() + 1) +
                '-' +
                (t.getDate() < 10 ? '0' + t.getDate() : t.getDate())
            // 获取首页数据
            var param = [{}]
            mbos.eas.invokeScript({
                name: 'getHomeData',
                param: param,
                success: function (resp) {
                    _this.holidays = resp.myHoliday.yearLimit
                    _this.personInfo = resp.personInfo
                    _this.personInfo.pic = resp.personInfo.pic
                        ? 'data:image/png;base64,' + resp.personInfo.pic
                        : '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png'
                    _this.yesterdayData = resp.yesterdayAtsDetail
                    _this.yesListShift =
                        resp.yesterdayAtsDetail.listShift && resp.yesterdayAtsDetail.listShift.length !== 0
                            ? resp.yesterdayAtsDetail.listShift.map(function (item, index) {
                                if (index % 2 === 0) {
                                    item += '-'
                                } else {
                                    item += '&nbsp;&nbsp;'
                                }
                                return item
                            })
                            : []
                    _this.list = resp.yesterdayAtsDetail.listShift || []
                    _this.card = resp.yesterdayAtsDetail.fetchCardList || []
                    _this.todayData = resp.todayPunchCard
                    _this.todayListShift =
                        resp.todayPunchCard.listShift && resp.todayPunchCard.listShift.length !== 0
                            ? resp.todayPunchCard.listShift.map(function (item, index) {
                                if (index % 2 === 0) {
                                    item += '-'
                                } else {
                                    item += '&nbsp;&nbsp;'
                                }
                                return item
                            })
                            : []
                    _this.tomorrowData = resp.tomorrowSchShift
                    _this.tomListShift =
                        resp.tomorrowSchShift.listShift && resp.tomorrowSchShift.listShift.length !== 0
                            ? resp.tomorrowSchShift.listShift.map(function (item, index) {
                                if (index % 2 === 0) {
                                    item += '-'
                                } else {
                                    item += '&nbsp;&nbsp;'
                                }
                                return item
                            })
                            : []
                },
                error: function (res) {
                    mbos.ui.showError({
                        title: localeResource.netError
                    })
                }
            })
            this.getSoup()
        },
        mounted: function () {
            $('.part1').css(
                'background-image',
                'url(/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-ttq_banner.png)'
            )
        },
        methods: {
            getSoup: function () {
                /*
                  var _this = this;
                  mbos.eas.invokeScript({
                    name:"chickenSoup",
                    param:[{}],
                    success:function(resp){
                      var soup = resp.data.split('------')[0];
                      if(soup.length > 25){
                        _this.getSoup();
                      }else{
                        _this.soup = soup;
                      }
                    }
                   })
                   */
            },
            getDetail: function (date) {
                this.$router.push({ path: '/detail', query: { date: date } })
            },
            getRank: function () {
                this.$router.push({ path: '/rankList' })
            },
            toShift: function () {
                // this.$router.push({path: '/shift'});
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=trans8612&name=shift.custom&date=' +
                    this.tomorrow +
                    '&dayType=' +
                    this.tomorrowData.dayType
            },
            getTomorrow: function () {
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=ttqin8612&name=route.custom&date=' +
                    this.tomorrow +
                    '#/cC'
                // this.$router.push({path: '/cC', query: {date: this.tomorrow}});
            },
            getVacation: function () {
                this.$router.push({ path: '/vacation' })
            }
        },
        computed: {
            testYesterdayattendanceState: function () {
                if (!this.yesterdayData.attendanceState) {
                    return
                }
                if (
                    this.yesterdayData.attendanceState.indexOf(localeResource.absenseTest) >= 0 ||
                    this.yesterdayData.attendanceState.indexOf(localeResource.lateTest) >= 0 ||
                    this.yesterdayData.attendanceState.indexOf(localeResource.absenseTest) >= 0
                ) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
    // 下拉菜单
    var dropDown = {
        template: '#dropDown',
        data: function () {
            return {
                sort: localeResource.allType
            }
        },
        props: ['list'],
        methods: {
            drop: function (item) {
                this.$emit('drop', item)
            },
            hidden: function () {
                this.$emit('hidden', false)
            }
        }
    }
    // 月总览
    var cB = {
        template: '#comB',
        data: function () {
            return {
                year: 2018,
                month: 04,
                resp: [], // 汇总前数组
                afterSum: [], // 汇总后数组
                notSum: false, // 如果为true，则显示“未汇总计算”
                personInfo: {
                    pic: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png',
                    personName: '',
                    orgName: ''
                },
                questionImg: "/mbos/store/" + _private._storeEid + '/fileLibrary/tips.png'
            }
        },
        created: function () {
            this.year = new Date().getFullYear()
            this.month = new Date().getMonth() + 1 >= 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
            this.dayStr = new Date().getDate() >= 10 ? new Date().getDate() : '0' + (new Date().getDate())
            this.getData()
        },
        methods: {
            getData: function (year, month) {
                var _this = this
                var year = _this.year
                var month = _this.month
                var dayStr = _this.dayStr
                // var month = month || new Date().getMonth()+1 > 10 ? new Date().getMonth()+1 : '0'+(new Date().getMonth()+1);
                var param = [
                    {
                        day: year.toString() + "-" + month.toString() + "-" + dayStr
                    }
                ]
                var params = [{ attendPeriod: year.toString() + month.toString() }]
                mbos.eas.invokeScript({
                    name: 'getMonthData',
                    param: param,
                    success: function (resp) {
                        _this.personInfo = resp.personInfo

                        _this.personInfo.pic = resp.personInfo.personPhoto
                            ? 'data:image/png;base64,' + resp.personInfo.personPhoto
                            : '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png'
                        if (resp.data.length > 0 && resp.data[0].id != null) {
                            // 异常列表数据
                            sessionStorage.setItem('abnormalList',JSON.stringify(resp.data))
                            //补丁更新
                            resp.data = resp.data.sort(function (a, b) {
                                return a.index - b.index
                            })
                            // resp.data.splice(6, 1) // 依据BT-00689235，增加上早退
                            resp.data.forEach(function (item) {
                                item.lname = item.name || ''
                                // item.name = item.name ? item.name.replace("_", " ").substring(0,6) : '';
                                // item.name = item.name ? item.name.replace('_', ' ').substring(0, 6) : ''
                                switch (item.id) {
                                    case '8LgrTXZKTx2YfyKicAak6slQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-late.png'
                                        item.ename = 'late'
                                        break
                                    case 'PXjpyKulQbCyJWBcIj0wYMlQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-early.png'
                                        item.ename = 'early'
                                        break
                                    case 'SLcdGrAgTrOENwOJUF6NS8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-absent.png'
                                        item.ename = 'absent'
                                        break
                                    case 'avjVRvY8Q6mTRi7CTQrQPMlQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-leave.png'
                                        item.ename = 'leave'
                                        break
                                    case '8r0AAAAMHZXJUGZW':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-overTime.png'
                                        item.ename = 'overTime'
                                        break
                                    case '93z0VIXISdGN7Gh2rbZkw8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-fillSignCard.png'
                                        item.ename = 'fillSignCard'
                                        break
                                    case 'bs5IQj7ZRricx8Eqy7CALclQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-trip.png'
                                        item.ename = 'trip'
                                        break
                                    case 'lvexEquhQH2G7iFgaTkOV8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-lackCard.png'
                                        item.ename = 'lackCard'
                                        break
                                    default:
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-default.png'
                                        break
                                }
                            })
                        } else {
                            resp.data.forEach(function (item) {
                                if (item.name == '加班') {
                                    mbos('item').hide()
                                }
                                item.name = item.name ? item.name.replace('_', '') : ''
                                item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-' + item.ename + '.png'
                            })
                        }
                        // var temp = {}
                        // resp.data.forEach(function (item) {
                        //     if (easContext.locale) {
                        //         temp = {
                        //             l1: item.ename,
                        //             l2: item.name,
                        //             l3: item.name
                        //         }
                        //         item.name = temp[easContext.locale]
                        //     }
                        // })
                        _this.resp = resp.data
                        // mbos.msgBox.showError(JSON.stringify(_this.resp))
                    },
                    error: function (res) { }
                })

                mbos.eas.invokeScript({
                    name: 'getMonthSumData',
                    param: params,
                    success: function (resp) {
                        _this.notSum = resp.notSum
                        if (resp.data.length > 0 && resp.data[0].id != null) {
                            //补丁更新
                            resp.data = resp.data.sort(function (a, b) {
                                return a.index - b.index
                            })
                            // resp.data.splice(6, 1) // 依据BT-00689235，增加上早退
                            resp.data.forEach(function (item) {
                                item.lname = item.name || ''
                                // item.name = item.name ? item.name.replace("_", " ").substring(0,6) : '';
                                // item.name = item.name ? item.name.replace('_', ' ').substring(0, 6) : ''
                                // item.name = item.name
                                switch (item.id) {
                                    case '8LgrTXZKTx2YfyKicAak6slQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-late.png'
                                        item.ename = 'late'
                                        break
                                    case 'PXjpyKulQbCyJWBcIj0wYMlQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-early.png'
                                        item.ename = 'early'
                                        break
                                    case 'SLcdGrAgTrOENwOJUF6NS8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-absent.png'
                                        item.ename = 'absent'
                                        break
                                    case 'avjVRvY8Q6mTRi7CTQrQPMlQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-leave.png'
                                        item.ename = 'leave'
                                        break
                                    case '8r0AAAAMHZXJUGZW':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-overTime.png'
                                        item.ename = 'overTime'
                                        break
                                    case '93z0VIXISdGN7Gh2rbZkw8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-fillSignCard.png'
                                        item.ename = 'fillSignCard'
                                        break
                                    case 'bs5IQj7ZRricx8Eqy7CALclQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-trip.png'
                                        item.ename = 'trip'
                                        break
                                    case 'lvexEquhQH2G7iFgaTkOV8lQZlY=':
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-lackCard.png'
                                        item.ename = 'lackCard'
                                        break
                                    default:
                                        item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-default.png'
                                        break
                                }
                            })
                        } else {
                            resp.data.forEach(function (item) {
                                if (item.name == '加班') {
                                    mbos('item').hide()
                                }
                                item.name = item.name ? item.name.replace('_', '') : ''
                                item.pic = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-' + item.ename + '.png'
                            })
                        }
                        // var temp = {}
                        // resp.data.forEach(function (item) {
                        //     if (easContext.locale) {
                        //         temp = {
                        //             l1: item.ename,
                        //             l2: item.name,
                        //             l3: item.name
                        //         }
                        //         item.name = temp[easContext.locale]
                        //     }
                        // })
                        _this.afterSum = resp.data
                        // mbos.msgBox.showError(JSON.stringify(_this.resp))
                    },
                    error: function (res) { }
                })
            },
            getDetail: function (type, lname, id) {
                sessionStorage.setItem(
                    'monthDetail',
                    JSON.stringify({ type: type, name: lname, year: this.year, month: this.month, id: id })
                )
                this.$router.push({ path: '/monthDetail' })
            },
            getDetailSum: function (type, lname, id) {
                sessionStorage.setItem(
                    'monthDetail',
                    JSON.stringify({ type: type, name: lname, year: this.year, month: this.month, id: id })
                )
                //this.$router.push({ path: '/monthDetail' })
            },
            minus: function () {
                if (+this.month === 1) {
                    this.year--
                    this.month = 12
                } else {
                    if (this.month-- <= 10) {
                        this.month = '0' + this.month
                    } else {
                        this.month = this.month
                    }
                }
                this.getData(this.year, this.month)
            },
            add: function () {
                if (+this.month === 12) {
                    this.year++
                    this.month = '01'
                } else {
                    if (this.month++ < 9) {
                        this.month = '0' + this.month
                    } else {
                        this.month = this.month
                    }
                }
                this.getData(this.year, this.month)
            },
            // 点击汇总前、后弹出提示信息
            showTips: function (tips) {
                mbos.msgBox.showError(tips)
            }
        }
    }
    // 月总览详情
    var monthDetail = {
        template: '#monthDetail',
        data: function () {
            return {
                name: localeResource.allError,
                filters: [{ id: '', name: localeResource.allError } ].concat(JSON.parse(sessionStorage.getItem('abnormalList'))),
                list: [],
                drop: false,
                attendanceNoPng: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-no.png'
            }
        },
        created: function () {
            var param = JSON.parse(sessionStorage.getItem('monthDetail') || '{}')
            ; (this.name = param.name), this.getList(param.id, param.year, param.month)
        },
        components: {
            dropDown: dropDown
        },
        methods: {
            toDay: function (date) {
                this.$router.push({ path: '/detail', query: { date: date } })
            },
            getList: function (projectId, year, month) {
                var _this = this
                var year = year || new Date().getFullYear()
                var month =
                    month || (new Date().getMonth() + 1 > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1))
                var param = [
                    {
                        year: year.toString(),
                        month: month.toString(),
                        // attendanceStateName: type || '',
                        projectId: projectId
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'getMonthDetail',
                    param: param,
                    success: function (resp) {
                        _this.list = resp
                    },
                    error: function (res) { }
                })
            },
            dr: function (data) {
                this.drop = false
                var param = JSON.parse(sessionStorage.getItem('monthDetail') || '{}')
                //   消除bug  this.month获取不到 没必要重新设置
                // sessionStorage.setItem(
                //   'monthDetail',
                //   JSON.stringify({ id: data.id, name: data.name, year: this.year, month: this.month })
                // )
                this.name = data.name
                this.getList(data.id, param.year, param.month)
            },
            h: function () {
                this.drop = false
            }
        }
    }
    // 确认对话框
    var confirm = {
        template: '#confirmDialog',
        data: function () {
            return {
                isShow: true,
                confirmText: localeResource.confirm_attendance, // 英文环境的确认提示文本
                // 月份数组
                monthObj: {
                    '01':'January',
                    '02':'February',
                    '03':'March',
                    '04':'April',
                    '05':'May',
                    '06':'Jun',
                    '07':'July',
                    '08':'August',
                    '09':'September',
                    '10':'October',
                    '11':'November',
                    '12':'December'
                }
            }
        },
        props: ['date', 'isDay'],
        created: function () {
            // 如果是应为就改变提示
            if (easContext.locale === 'en_US') {
                this.setUsMsg();
            }
        },
        methods: {
            // 更改在英文环境下的提示
            setUsMsg: function () {
                var keys = Object.keys(this.monthObj)
                // this.date有两种情况 一种是 2022-04-20，另一种是2022year04month
                var year = this.date.slice(0, 4)
                if (this.date.includes('month')) {
                    // 按月确认考勤
                    for(var i = 0; i < keys.length;i++){
                        var month = this.date.slice(8,10)
                        if (month == keys[i]) {
                            this.confirmText = this.confirmText.replace('$month', this.monthObj[month])
                            this.confirmText = this.confirmText.replace('$year', year)
                        }
                    }
                } else {
                    // 按日确认考勤
                    for(var j = 0; j < keys.length; j++){
                        var month1 = this.date.slice(5,7)
                        if (month1 == keys[j]) {
                            var day = this.date.slice(8)
                            this.confirmText = this.confirmText.replace('$month', this.monthObj[month1])
                            this.confirmText = this.confirmText.replace('$year', day + ',' + year)
                        }
                    }
                }
            },
            showPast: function () {
                this.isShow = !this.isShow
            },
            sure: function () {
                this.$emit('sure')
            },
            cancel: function () {
                this.$emit('cancel')
            }
        }
    }
    // 考勤月历
    var cC = {
        template: '#comC',
        data: function () {
            return {
                d: [
                    localeResource.week7,
                    localeResource.week1,
                    localeResource.week2,
                    localeResource.week3,
                    localeResource.week4,
                    localeResource.week5,
                    localeResource.week6
                ],
                dates: [],
                year: 2018,
                month: 10,
                day: 1,
                days: 30,
                date: '2017-10-10',
                nowDate: '',
                drop: false,
                confirm: false,
                isDay: false,
                item: 0,
                li: [],
                card: ['', '', '', '', '', ''],
                type: localeResource.all,
                shiftName: localeResource.shiftName,
                list: ['08:00-', '18:00'],
                attendanceState: '',
                resp: {
                    hasScheduleShift: false,
                    isAttendance: false
                },
                isToday: false,
                isAfter: false,
                hasCard: true,
                isShowShift: false,
                rate: {},
                red: {
                    background: '#f35959'
                },
                checkIndex: 1,
                hasSync: false,
                attendanceDui: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-dui.png'
            }
        },
        components: {
            dropDown: dropDown,
            confirm: confirm,
            banImg: banImg,
            switchBtn: switchBtn
        },
        created: function () {
            var _this = this
            this.year = this.double(new Date().getFullYear())
            this.month = this.double(new Date().getMonth() + 1)
            this.day = this.double(new Date().getDate())
            this.date = this.year + '-' + this.month + '-' + this.day
            this.nowDate = this.year + '-' + this.month + '-' + this.day
            var tempSelectDate = sessionStorage.getItem('tempSelectDate')
            if (tempSelectDate) {
                this.year = tempSelectDate.substr(0, 4)
                this.month = tempSelectDate.substr(5, 2)
            }

            var isShowShift = localStorage.getItem('isShowShift')
            if (isShowShift && isShowShift == 'false') {
                this.isShowShift = false
            } else {
                this.isShowShift = true
            }
            this.dateShow(mbos.getRequestParams().date)
            if (localStorage.getItem('syncCardPatch') == 'true') {
                this.hasSync = true
            } else {
                this.syncCard('first')
            }
        },
        methods: {
            minus: function () {
                if (+this.month === 1) {
                    this.year--
                    this.month = 12
                } else {
                    if (this.month-- <= 10) {
                        this.month = '0' + this.month
                    } else {
                        this.month = this.month
                    }
                }
                sessionStorage.setItem('tempSelectDate', this.year + '-' + this.month + '-01')
                this.dateShow()
            },
            add: function () {
                if (+this.month === 12) {
                    this.year++
                    this.month = '01'
                } else {
                    if (this.month++ < 9) {
                        this.month = '0' + this.month
                    } else {
                        this.month = this.month
                    }
                }
                sessionStorage.setItem('tempSelectDate', this.year + '-' + this.month + '-01')
                this.dateShow()
            },
            slide: function (e) {
                var that = this
                var startX = e.changedTouches[0].clientX
                var startY = e.changedTouches[0].clientY
                e.currentTarget.ontouchend = function (event) {
                    var moveX = event.changedTouches[0].clientX - startX
                    var moveY = event.changedTouches[0].clientY - startY
                    if (moveY > moveX / 2 && moveY < -(moveX / 2) && moveX < -100) {
                        // 左滑

                        that.add()
                    } else if (moveY > -(moveX / 2) && moveY < moveX / 2 && moveX > 100) {
                        // 右滑

                        that.minus()
                    } else if (moveX > moveY / 2 && moveX < -(moveY / 2) && moveY < -100) {
                        // 上滑
                        // that.$emit("slide", "top")
                    } else if (moveX > -(moveY / 2) && moveX < moveY / 2 && moveY > 100) {
                        // 下滑
                        // that.$emit("slide", "bottom")
                    }
                }
            },
            dateShow: function (date, type) {
                var _this = this
                if (date) {
                    var arr = date.split('-')
                    this.month = this.double(arr[1])
                    this.day = this.double(arr[2])
                    // BT-00754498 考勤日历的确认考勤不需要备注说明
                    // this.isDay = true
                    this.date = this.year + '-' + this.month + '-' + this.day
                } else {
                    // this.isDay = false
                    this.date = this.year + '-' + this.month + '-' + this.day
                }
                this.dates = []
                // this.getDays(this.year, this.month);
                // for(var i=1;i<this.days+1;i++){
                //   this.dates.push(i);
                // }
                var p1 = [
                    {
                        year: this.year.toString(),
                        month: this.month.toString(),
                        atsStateCondition: type || ''
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'getPersonCalendar',
                    param: p1,
                    success: function (resp) {
                        _this.dates = resp.map(function (item, index) {
                            item.day = index + 1
                            var date = _this.year + '-' + _this.month + '-' + (item.day > 9 ? item.day : '0' + item.day)
                            item.date = date
                            item.after = true //new Date(date) >= new Date() ? true : false;
                            if (
                                item.atsStateValue &&
                                item.standardHour &&
                                (item.atsStateName === localeResource.late2 ||
                                    item.atsStateName === localeResource.absenteeism2 ||
                                    item.atsStateName === localeResource.leaveEarly2)
                            ) {
                                var percent =
                                    (item.atsStateTimeType === localeResource.minute ? item.atsStateValue / 60 : item.atsStateValue) /
                                    item.standardHour
                                if (percent <= 0.25) {
                                    item.rate = {
                                        'z-index': 10,
                                        background: 'transparent',
                                        transform: 'rotate(45deg)',
                                        'border-top-color': 'transparent!important'
                                    }
                                } else if (percent <= 0.5 && percent > 0.25) {
                                    item.rate = {
                                        'z-index': 10,
                                        background: 'transparent',
                                        transform: 'rotate(45deg)',
                                        'border-top-color': 'transparent!important',
                                        'border-right-color': 'transparent!important'
                                    }
                                } else if (percent <= 0.75 && percent > 0.5) {
                                    item.rate = {
                                        'z-index': 10,
                                        background: 'transparent',
                                        transform: 'rotate(45deg)',
                                        'border-top-color': 'transparent!important',
                                        'border-right-color': 'transparent!important',
                                        'border-bottom-color': 'transparent!important'
                                    }
                                } else if (percent >= 1) {
                                    item.rate = { border: 'none!important' }
                                }
                            } else {
                                item.rate = { 'z-index': 10, background: 'transparent' }
                            }
                            return item
                        })
                        var d1 = new Date(_this.year + '-' + _this.month + '-' + '01').getDay()
                        for (var i = 0; i < d1; i++) {
                            _this.dates.unshift({
                                day: '-'
                            })
                        }
                        //           _this.dates.forEach(function(item, index){
                        //             if(item.day == _this.day){

                        //             }
                        //           })
                        var tempSelectDate = sessionStorage.getItem('tempSelectDate')
                        if (tempSelectDate) {
                            _this.getDay(parseInt(tempSelectDate.substr(8, 2)))
                        } else if (+_this.month === new Date().getMonth() + 1 && +_this.year === new Date().getFullYear()) {
                            _this.getDay(_this.day)
                        } else {
                            _this.getDay(1)
                        }
                    },
                    error: function (res) { }
                })
            },
            getDays: function (year, month, type) {
                var _this = this
                // month = parseInt(month, 10);
                // var d= new Date(year, month, 0);
                // this.days = d.getDate();
                var p1 = [
                    {
                        year: this.year.toString(),
                        month: this.month.toString(),
                        atsStateCondtion: type || ''
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'getPersonCalendar',
                    param: p1,
                    success: function (resp) {
                        _this.dates = resp
                    },
                    error: function (res) { }
                })
            },
            getDay: function (item) {
                var _this = this
                _this.checkIndex = +item
                this.date = this.year + '-' + this.month + '-' + (item.toString().length === 1 ? '0' + item : item)
                sessionStorage.setItem('tempSelectDate', this.date)
                var p2 = [
                    {
                        date: _this.date
                    }
                ]
                var date = new Date()
                var today = date.getYear() + 1900 + '/' + (date.getMonth() + 1) + '/' + date.getDate()
                var d = this.year + '/' + (+this.month) + '/' + (+item);
                this.isToday = today === d;
                this.isAfter = new Date(today) < new Date(d);
                mbos.eas.invokeScript({
                    name: 'getDayAttendance',
                    param: p2,
                    success: function (resp) {
                        _this.resp = resp
                        // resp.fetchCardList = (resp.fetchCardList && resp.fetchCardList.length) ? resp.fetchCardList.filter(Boolean) : [];
                        var cardList = resp.fetchCardList || []
                        _this.hasCard = cardList.some(function (item) {
                            return item !== ''
                        })
                        _this.shiftName = resp.shiftName
                        _this.attendanceState = resp.attendanceState
                        if (resp.isAttendance) {
                            _this.li = resp.listShift || []
                            _this.card = resp.fetchCardList || []
                            _this.listShift = _this.li.map(function (item, index) {
                                if (index % 2 === 0) {
                                    item += '-'
                                } else {
                                    item += '&nbsp;&nbsp;'
                                }
                                return item
                            })
                        }
                    },
                    error: function (res) { }
                })
            },
            dList: function (item) {
                this.drop = true
                if (item === 'type') {
                    this.list = [
                        { key: '', val: localeResource.allError },
                        { key: 'absent', val: localeResource.absenteeism2 },
                        { key: 'late', val: localeResource.late2 },
                        { key: 'early', val: localeResource.leaveEarly2 },
                        { key: 'leave', val: localeResource.holiday },
                        { key: 'overTime', val: localeResource.overtime },
                        { key: 'trip', val: localeResource.workOutside }
                    ]
                } else {
                    this.list = [
                        { key: 1, val: localeResource.ttqNote1 },
                        { key: 2, val: localeResource.ttqNote2 }
                    ]
                }
            },
            dr: function (data) {
                this.drop = false
                if (this.list.length === 2) {
                    var isYun = !!navigator.userAgent.match(/Qing\/.*;(iOS|iPhone|Android).*/)
                    if (isYun) {
                        mbos.eas.invokeScript({
                            name: 'getSuperior',
                            param: [{}],
                            success: function (resp) {
                                var openId = JSON.parse(JSON.stringify(resp))[0].superiorOpenId
                                XuntongJSBridge.call(
                                    'selectPersons',
                                    {
                                        isMulti: false,
                                        isShowMe: false,
                                        // 'range':[openId],
                                        selected: [openId]
                                    },
                                    function (result) {
                                        if (result.data) {
                                            XuntongJSBridge.call(
                                                'chat',
                                                {
                                                    openId: result.data.persons[0].openId
                                                },
                                                function (result) {
                                                    // mbos.msgBox.showError("结果："+JSON.stringify(result));
                                                }
                                            )
                                        }
                                    }
                                )
                            },
                            error: function (err) {
                                console.log(err)
                            }
                        })
                        // XuntongJSBridge.call('selectPersons',{
                        //   'isMulti':false,
                        //   'isShowMe':false
                        // }, function(result){
                        //   //mbos.msgBox.showError(JSON.stringify(result.data.persons[0]));
                        //   XuntongJSBridge.call('chat',  {
                        //     'openId': result.data.persons[0].openId
                        //   }, function(result) {
                        //     mbos.msgBox.showError("结果："+JSON.stringify(result));
                        //   });
                        // })
                    }
                } else {
                    this.type = data.val
                    this.dateShow('', data.key)
                }
            },
            double: function (num) {
                return num.toString().length === 1 ? '0' + num : num
            },
            h: function () {
                this.drop = false
            },
            shift: function () {
                // this.$router.push({path: '/shift'});
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=trans8612&name=shift.custom&date=' +
                    this.date +
                    '&dayType=' +
                    this.resp.dayType
            },
            attendanceConfirm: function () {
                this.confirm = true
            },
            sure: function () {
                this.confirm = false
                this.beforeSure()
            },
            beforeSure: function () {
                var param = [
                    {
                        date: this.year + '-' + this.month || '2018-03-11',
                        type: 'month'
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'canAttendResultConfirm',
                    param: param,
                    success: function (resp) {
                        if (resp.returnResult) {
                            mbos.eas.invokeScript({
                                name: 'attendResultConfirm',
                                param: param,
                                success: function (resp) {
                                    mbos.msgBox.showError(localeResource.ttqNote3)
                                },
                                error: function (res) { }
                            })
                        } else {
                            mbos.msgBox.showError(resp.returnMsg)
                        }
                    },
                    error: function (res) { }
                })
            },
            beforeRefresh: function () {
                if (!localStorage.getItem('time')) {
                    localStorage.setItem('time', +new Date())
                    this.refresh()
                } else {
                    var stime = localStorage.getItem('time')
                    var etime = +new Date()
                    if (etime - stime > 10 * 60 * 1000) {
                        this.refresh()
                        localStorage.setItem('time', etime)
                    } else {
                        mbos.msgBox.showError(localeResource.ttqNote8)
                    }
                }
            },
            refresh: function () {
                var param = [
                    {
                        date: this.date || '2018-01-01'
                    }
                ]
                var _this = this
                mbos.eas.invokeScript({
                    name: 'refreshAttendanceResult',
                    param: param,
                    success: function (resp) {
                        if (resp.flag === '1') {
                            mbos.msgBox.showError(localeResource.ttqNote5, function () {
                                // location.reload();
                                location.href =
                                    '/mbos/page/loadPage?storeEid=' +
                                    _private._storeEid +
                                    '&appid=' +
                                    mbos.getRequestParams().appid +
                                    '&eid=' +
                                    mbos.getRequestParams().eid +
                                    '&path=ttqin8612&name=route.custom&date=' +
                                    _this.date +
                                    '#/cC'
                            })
                        } else {
                            mbos.msgBox.showError(localeResource.ttqNote4)
                        }
                    },
                    error: function (res) { }
                })
            },
            fillCard: function () {
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=fill8612&name=fillSignCard.editui&operateState=ADDNEW&date=' +
                    this.date
            },
            switchShift: function () {
                this.isShowShift = !this.isShowShift
                localStorage.setItem('isShowShift', this.isShowShift)
            },
            cancel: function () {
                this.confirm = false
            },
            getDetail: function () {
                this.$router.push({ path: '/detail', query: { date: this.date } })
            },
            syncCard: function (first) {
                if (first != 'first') {
                    var lastSyncTime = localStorage.getItem('syncCardTime')
                    if (lastSyncTime && new Date().getTime() - lastSyncTime < 10000) {
                        mbos.ui.showError(localeResource.ttqNote7)
                        return
                    }
                    if (
                        new Date().getHours() == 8 ||
                        new Date().getHours() == 9 ||
                        new Date().getHours() == 17 ||
                        new Date().getHours() == 18
                    ) {
                        mbos.msgBox.showError(localeResource.mysignNote4)
                        return
                    }
                }

                var _self = this
                var startDate = this.year + '-' + this.month + '-01'
                var endDay
                if (
                    this.month == '01' ||
                    this.month == '03' ||
                    this.month == '05' ||
                    this.month == '07' ||
                    this.month == '08' ||
                    this.month == '10' ||
                    this.month == '12'
                ) {
                    endDay = '31'
                } else if (this.month == '04' || this.month == '06' || this.month == '09' || this.month == '11') {
                    endDay = '30'
                } else if (+this.year % 400 == 0 || (+this.year % 100 != 0 && +this.year % 4 == 0)) {
                    endDay = '29'
                } else {
                    endDay = '28'
                }
                var endDate = this.year + '-' + this.month + '-' + endDay
                // console.log(startDate, endDate)

                mbos.eas.invokeScript({
                    name: 'GetPunchCardFromCloudService',
                    param: [
                        {
                            realBeginDate: startDate,
                            realEndDate: endDate
                        }
                    ],
                    success: function (resp) {
                        // console.log(resp)
                        if (first == 'first') {
                            _self.hasSync = true
                            localStorage.setItem('syncCardPatch', 'true')
                        } else {
                            mbos.ui.showError(
                                resp.errorString.split('</br>')[1] + '<br/>' + resp.errorString.split('</br>')[4],
                                function () {
                                    location.reload()
                                }
                            )
                            localStorage.setItem('syncCardTime', new Date().getTime())
                        }
                    },
                    error: function (e) { }
                })
            }
        },
        computed: {
            testYesterdayattendanceState: function () {
                if (!this.attendanceState) {
                    return
                }
                if (
                    this.attendanceState.indexOf(localeResource.absenseTest) >= 0 ||
                    this.attendanceState.indexOf(localeResource.lateTest) >= 0 ||
                    this.attendanceState.indexOf(localeResource.absenseTest) >= 0
                ) {
                    return true
                } else {
                    return false
                }
            },
            confirmDate: function () {
                return this.year + localeResource.year + this.month + localeResource.month
            }
        }
    }
    // 假勤在办
    var cD = {
        template: '#comD',
        data: function () {
            return {
                items: [
                    {
                        name: localeResource.yearHolidayApp,
                        status: localeResource.noAgree,
                        date: '2018-01-01',
                        time: '2' + localeResource.day
                    }
                ],
                isHalfDayOff: false,
                sort: localeResource.allType,
                drop: false,
                list: [
                    { key: '', val: localeResource.allType },
                    { key: 'leaveBill', val: localeResource.ttqNote9 },
                    { key: 'overTimeBill', val: localeResource.ttqNote10 },
                    { key: 'tripBill', val: localeResource.ttqNote11 },
                    { key: 'fillSignCard', val: localeResource.ttqNote12 },
                    { key: 'cancelLeaveBill', val: localeResource.ttqNote13 },
                    { key: 'changeShift', val: localeResource.ttqNote14 },
                    { key: 'canTripBill', val: localeResource.ttqNote15 },
                    { key: 'abnormalAttendance', val: localeResource.attenAbAgency }
                    // { key: 'atsFileBill', val: localeResource.ttqNote19 }
                ]
            }
        },
        components: {
            dropDown: dropDown
        },
        activated: function () {
            var _this = this
            var param = [
                {
                    // personId: 'u5x8JzsXT2q0dN26ARw/L4Dvfe0=',
                    showSort: ''
                }
            ]
            var ttqingBillType = sessionStorage.getItem('ttqingBillType')
            if (ttqingBillType) {
                this.sort = this.list.filter(function (item) {
                    return item.key === ttqingBillType
                })[0].val
            }

            // if(mbos.getRequestParams().billType){
            //   this.sort = this.list.filter(function(item){
            //     return item.key === mbos.getRequestParams().billType;
            //   })[0].val
            // }
            this.getData(ttqingBillType || '')
            mbos.eas.invokeScript({
                name: 'getSetIsCtrlHalfDayOff',
                param: param,
                success: function (resp) {
                    _this.isHalfDayOff = resp.isHalfDayOff
                    _this.pmBeginTime = resp.pmBeginTime
                    _this.amBeginTime = resp.amBeginTime
                    _this.pmEndTime = resp.pmEndTime
                    _this.amEndTime = resp.amEndTime
                },
                error: function (res) { }
            })
        },
        methods: {
            getDoneList: function () {
                this.$router.push({ path: '/done' })
            },
            getData: function (type) {
                var _this = this
                var param = [
                    {
                        showSort: 'sevenDaysInclude',
                        attendanceStateCondition: type || ''
                    }
                ]
                new Promise((resolve, reject) => {
                    mbos.eas.invokeScript({
                        name: 'attendanceInOffice',
                        param: param,
                        success: function (resp) {
                            resp.map(function (item) {
                                // if (type === 'abnormalAttendance') {
                                // 如果是考勤异常待办 state的状态重新取值
                                if (item.name === localeResource.attenAbAgency) {
                                    item.billType = 'abnormalAttendance'
                                    item.state = item.billState
                                }
                                switch (item.state) {
                                    case localeResource.noAgree:
                                        item.color = '#f5a623'
                                        break
                                    case localeResource.approving:
                                        item.color = '#55a0f5'
                                        break
                                    case localeResource.approveFail:
                                        item.color = '#f35959'
                                        break
                                    case localeResource.approveSuccess:
                                        item.color = '#26b175'
                                        break
                                    case localeResource.noSubmit:
                                        item.color = '#fc8555'
                                        break
                                }
                                item.attendDate += ' '
                            })
                            _this.items = resp;
                            resolve(resp)
                        },
                        error: function (res) { }
                    })
                }).then(value => {
                    var flag = false
                    if (value) {
                        value.forEach(item => {
                            if (item.state === localeResource.noSubmit) {
                                flag = true
                                return
                            }
                        })
                    }
                    if (flag) {
                        _this.initSwiper()
                    }
                })
            },
            talk: function () {
                var isYun = !!navigator.userAgent.match(/Qing\/.*;(iOS|iPhone|Android).*/)
                if (isYun) {
                    XuntongJSBridge.call(
                        'chat',
                        {
                            openId: 'ge6sjw12sda2scdfefe2'
                        },
                        function (result) {
                            // mbos.msgBox.showError("结果："+JSON.stringify(result));
                        }
                    )
                }
            },
            getDetail: function (item) {
                var _this = this
                delete item.color
                if (item.state === localeResource.noSubmit) {
                    var param = [
                        {
                            billId: item.billId,
                            billType: item.billType
                        }
                    ]
                    mbos.eas.invokeScript({
                        name: 'billCanEditCheck',
                        param: param,
                        success: function (resp) {
                            if (resp.flag === 1) {
                                if (item.applyPersonId === item.personId) {
                                    _this.direction(item.billType, JSON.stringify(item), 'edit')
                                } else {
                                    mbos.msgBox.showError(localeResource.ttqNote16)
                                }
                            } else {
                                mbos.msgBox.showError(resp.errorString)
                            }
                        },
                        error: function (res) { }
                    })
                } else {
                    _this.direction(item.billType, JSON.stringify(item), 'view')
                }
            },
            direction: function (type, param, stat) {
                var _this = this
                var appid = mbos.getRequestParams().appid
                var storeEid = mbos.getRequestParams().storeEid || mbos.getRequestParams().eid
                var eid = mbos.getRequestParams().eid
                var am = (_this.amBeginTime == null || _this.amEndTime == null) ? "" : [_this.amBeginTime, _this.amEndTime]
                var pm = (_this.pmBeginTime == null || _this.pmEndTime == null) ? "" : [_this.pmBeginTime, _this.pmEndTime]
                var billID = JSON.parse(param).billId //显示附件
                switch (type) {
                    case 'fillSignCard':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=fill8612&billID=' +
                            encodeURIComponent(billID) +
                            '&name=fillSignCard.editui&operateState=ADDNEW&stat=' +
                            stat +
                            '&param=' +
                            encodeURIComponent(param)
                        break
                    case 'overTimeBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=OT8612&billID=' +
                            encodeURIComponent(billID) +
                            '&name=edit.editui&operateState=ADDNEW' +
                            '&stat=' +
                            stat
                        break
                    case 'leaveBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW&stat=' +
                            stat +
                            '&am=' +
                            am +
                            '&pm=' +
                            pm + '&billID=' + encodeURIComponent(billID)+
                            '&param=' + encodeURIComponent(param)
                        break
                    case 'tripBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid  + '&billID=' + encodeURIComponent(billID) +
                            '&path=trip8612&name=edit.editui&operateState=ADDNEW&param=' +
                            encodeURIComponent(param) +
                            '&stat=' +
                            stat
                        break
                    case 'cancelLeaveBill':
                        var param = JSON.parse(param)
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=cancel8612&name=edit.editui&operateState=ADDNEW&leaveBillId=' +
                            encodeURIComponent(param.leaveBillId) +
                            '&leaveBillEntryId=' +
                            encodeURIComponent(param.leaveBillEntryId) +
                            '&id=' +
                            encodeURIComponent(param.billId) +
                            '&billID=' +
                            encodeURIComponent(param.billId) +
                            '&holidayTypeId=' +
                            encodeURIComponent(param.holidayTypeId) +
                            '&beginTime=' +
                            param.realBeginTime +
                            '&endTime=' +
                            param.realEndTime +
                            '&length=' +
                            param.realLeaLength +
                            '&isHalfDayOff=' +
                            _this.isHalfDayOff +
                            '&unitName=' +
                            encodeURI(param.unit) +
                            '&cancelReason=' +
                            (param.cancelReason || ' ') +
                            '&pmBeginTime=' +
                            _this.pmBeginTime +
                            '&amBeginTime=' +
                            _this.amBeginTime +
                            '&pmEndTime=' +
                            _this.pmEndTime +
                            '&amEndTime=' +
                            _this.amEndTime +
                            '&stat=' +
                            stat +
                            '&state=' +
                            param.state
                        break
                    case 'changeShift':
                        if (stat === 'edit') {
                            location.href =
                                '/mbos/page/loadPage?storeEid=' +
                                _private._storeEid +
                                '&appid=' +
                                appid +
                                '&eid=' +
                                eid +
                                '&path=trans8612&name=shift.custom&param=' +
                                encodeURIComponent(param)
                        } else {
                            location.href =
                                '/mbos/page/loadPage?storeEid=' +
                                _private._storeEid +
                                '&appid=' +
                                appid +
                                '&eid=' +
                                eid +
                                '&path=trans8612&name=shiftDetail.custom&param=' +
                                encodeURIComponent(param)
                        }
                        break
                    case 'canTripBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=busiAsk8612&name=businessAck.navui&fromPage=ttqin8612&param=' +
                            encodeURIComponent(param) +
                            '&stat=' +
                            stat
                        break
                    case "atsFileBill":
                        location.href =
                            "/mbos/page/loadPage?storeEid=" +
                            _private._storeEid +
                            "&appid=" +
                            appid +
                            "&eid=" +
                            eid +
                            "&path=AtsFile8612&name=FileChange.editui&fromPage=ttqin8612&param=" +
                            encodeURIComponent(param) +
                            "&stat=" +
                            stat
                        break
                    case 'abnormalAttendance':
                        sessionStorage.setItem('exceptionAgencyDetail', param)
                        this.$router.push('/exception-agency')
                        break
                }
            },
            dr: function (data) {
                this.drop = false
                sessionStorage.setItem('ttqingBillType', data.key)
                this.getData(data.key)
                this.sort = data.val
            },
            h: function () {
                this.drop = false
            },
            initSwiper: function () {
                var expansion = null //是否存在展开的contents
                var container = document.querySelectorAll(".comD .swiperActive") //找到所有的左滑盒子
                for (var index = 0; index < container.length; index++) {
                    var x, y, X, Y, swipeX, swipeY
                    //监听左滑盒子的触摸事件
                    container[index].addEventListener("touchstart", function (event) {
                        //获取触摸点的坐标targetTouches[0].pageX,Y
                        x = event.changedTouches[0].pageX
                        y = event.changedTouches[0].pageY
                        swipeX = true
                        swipeY = true
                        if (expansion) {
                            //判断是否展开，如果展开则收起
                            expansion.className = "dItem comdSwiperight swiperActive"
                        }
                    })
                    container[index].addEventListener("touchmove", function (event) {
                        X = event.changedTouches[0].pageX
                        Y = event.changedTouches[0].pageY
                        //判断左右滑动
                        if (swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0) {
                            // 阻止事件冒泡
                            event.stopPropagation()
                            if (X - x > 10) {
                                //右滑
                                event.preventDefault() // 取消事件的默认动作
                                this.className = "dItem comdSwiperight swiperActive"
                            }
                            if (x - X > 10) {
                                //左滑
                                event.preventDefault()
                                this.className = "dItem comdSwipeleft swiperActive" //左滑展开
                                expansion = this
                            }
                            swipeY = false
                        }
                        // 上下滑动
                        if (swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                            swipeX = false
                        }
                    })
                }
                $(document).click(function () {
                    event.stopPropagation()
                    event.preventDefault()
                    $(".comD .dItem").prop("class", "dItem comdSwiperight swiperActive")
                })
            },
            checkSwiper: function (item, e) {
                let _this = this
                e.stopPropagation()
                mbos.ui.showConfirm({
                    title: localeResource.tips,
                    msg: localeResource.confirm_del,
                    callback: function (data) {
                        if (data === 0) {
                            //确定删除
                            _this.deleteBill(item)
                        } else {
                            $(".comD .dItem").prop(
                                "class",
                                "dItem comdSwiperight swiperActive"
                            )
                        }
                    }
                })
            },
            deleteBill: function (item) {
                var ttqingBillType = sessionStorage.getItem("ttqingBillType")
                var _this = this
                var deleteBillId = [
                    {
                        deleteBillId: item.billId
                    }
                ]
                mbos.eas.invokeScript({
                    name: "deleteBill",
                    param: deleteBillId,
                    success: function (resp) {
                        //重新调页面
                        _this.getData(ttqingBillType || "")
                    },
                    error: function (res) {
                        mbos.msgBox.showError("请联系管理员升级补丁")
                    }
                })
            }
        }
    }
    // 日考勤详情
    var detail = {
        template: '#detail',
        data: function () {
            return {
                add: false,
                date: '',
                list: [],
                card: [],
                data: { puncnCardRecord: [] },
                confirm: false,
                isDay: true
            }
        },
        components: {
            banImg: banImg,
            confirm: confirm
        },
        created: function () {
            var _this = this
            // this.date =  this.$route.query.date;
            this.date = this.$route.query.date
                .split('/')
                .map(function (item) {
                    return item.length === 1 ? '0' + item : item
                })
                .join('-')
            var param = [
                {
                    date: _this.date || '2018-03-11'
                }
            ]
            mbos.eas.invokeScript({
                name: 'getDayDetail',
                param: param,
                success: function (resp) {
                    _this.list = resp.shiftList
                    _this.card = resp.fetchCardList
                    _this.data = resp
                },
                error: function (res) { }
            })
        },
        methods: {
            // sure: function(){
            //   this.beforeSure();
            //   var param = [{
            //     date: this.date || '2018-03-11',
            //     type: 'day',
            //     remark: ''
            //   }];
            //   mbos.eas.invokeScript({
            //     name:"attendResultConfirm",
            //     param:param,
            //     success:function(resp){
            //       console.log(resp)
            //     },
            //     error:function(res){
            //     }
            //   })
            // },
            beforeRefresh: function () {
                var time = 'time' + this.date
                if (!sessionStorage.getItem(time)) {
                    sessionStorage.setItem(time, +new Date())
                    this.refresh()
                } else {
                    var stime = sessionStorage.getItem(time)
                    var etime = +new Date()
                    if (etime - stime > 10 * 60 * 1000) {
                        this.refresh()
                        sessionStorage.setItem(time, etime)
                    } else {
                        mbos.msgBox.showError(localeResource.ttqNote8)
                    }
                }
            },
            refresh: function () {
                var param = [
                    {
                        date: this.date || '2018-01-01'
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'refreshAttendanceResult',
                    param: param,
                    success: function (resp) {
                        if (resp.flag === '1') {
                            mbos.msgBox.showError(localeResource.ttqNote5, function () {
                                location.reload()
                            })
                        } else {
                            mbos.msgBox.showError(localeResource.ttqNote6)
                        }
                    },
                    error: function (res) { }
                })
            },
            attendanceConfirm: function () {
                this.confirm = true
            },
            sure: function () {
                this.confirm = false
                this.beforeSure()
            },
            beforeSure: function () {
                var param = [
                    {
                        date: this.date || '2018-03-11',
                        type: 'day',
                        remark: $('textarea').val()
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'canAttendResultConfirm',
                    param: param,
                    success: function (resp) {
                        if (resp.returnResult) {
                            mbos.eas.invokeScript({
                                name: 'attendResultConfirm',
                                param: param,
                                success: function (resp) {
                                    mbos.msgBox.showError(localeResource.ttqNote3)
                                },
                                error: function (res) { }
                            })
                        } else {
                            mbos.msgBox.showError(resp.returnMsg)
                        }
                    },
                    error: function (res) { }
                })
            },
            cancel: function () {
                this.confirm = false
            },
            fillCard: function () {
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=fill8612&name=fillSignCard.editui&operateState=ADDNEW&date=' +
                    this.date
            },
            leave: function () {
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW&date=' +
                    this.date
            }
        },
        computed: {
            testYesterdayattendanceState: function () {
                if (!this.data.attendanceState) {
                    return
                }
                if (
                    this.data.attendanceState.indexOf(localeResource.absenseTest) >= 0 ||
                    this.data.attendanceState.indexOf(localeResource.lateTest) >= 0 ||
                    this.data.attendanceState.indexOf(localeResource.absenseTest) >= 0
                ) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
    // 部门排名
    var RankList = {
        template: '#rankList',
        data: function () {
            return {
                items: [
                    // {depPeronName: '张三', personPhoto: '/mbos/systemimage/default_sudokuitem1.png', time: '200h', attendanceCount: 10, unit: 'h', like: false, rank: 1}
                ],
                list: [
                    { key: 'normal', val: localeResource.sortByAttendance },
                    { key: 'overTime', val: localeResource.ttqNote17 },
                    { key: 'trip', val: localeResource.ttqNote18 }
                ],
                my: {
                    // rank: 1,
                    // personPhoto: '/mbos/systemimage/default_sudokuitem1.png'
                    hasLike: false
                },
                drop: false,
                sort: localeResource.sortByAttendance,
                esort: 'normal',
                attendance1: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-1.png',
                attendance2: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-2.png',
                attendance3: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-3.png',
                attendanceZan: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-zan.png'
            }
        },
        components: {
            dropDown: dropDown
        },
        created: function () {
            if (mbos.getRequestParams().attendanceStateCondition) {
                var arr = this.list.filter(function (item) {
                    return item.key === mbos.getRequestParams().attendanceStateCondition
                })
                this.sort = arr[0].val
            }
            this.getData(mbos.getRequestParams().attendanceStateCondition || 'normal')
        },
        mounted: function () {
            // background: url(/mbos/store/4000148/fileLibrary/attendance-ttq_banner.png);
            $('.rankList .bg').css(
                'background-image',
                'url(/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-ttq_banner.png)'
            )
        },
        methods: {
            zan: function (item) {
                if (item.depPeronId !== this.my.depPeronId) {
                    item.hasLike = !item.hasLike
                    item.hasLike === true ? item.likeCount++ : item.likeCount--
                    var _this = this
                    this.date = this.$route.query.date
                    var param = [
                        {
                            personId: 'u5x8JzsXT2q0dN26ARw/L4Dvfe0=',
                            beLikePersonId: item.depPeronId,
                            attendanceStateCondition: this.esort ? this.esort : 'normal'
                        }
                    ]
                    mbos.eas.invokeScript({
                        name: 'addLike',
                        param: param,
                        success: function (resp) {
                            // console.log(resp)
                        },
                        error: function (res) { }
                    })
                }
            },
            getData: function (sort) {
                var _this = this
                this.date = this.$route.query.date
                var param = [
                    {
                        attendanceStateCondition: sort ? sort : 'normal'
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'getRankList',
                    param: param,
                    success: function (resp) {
                        if (resp.depRanking.length === 0) return
                        _this.items = resp.depRanking.map(function (item) {
                            item.personPhoto = item.personPhoto
                                ? 'data:image/png;base64,' + item.personPhoto
                                : '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png'
                            return item
                        })
                        _this.my = resp.myRanking
                        _this.my.personPhoto = resp.myRanking.personPhoto
                            ? 'data:image/png;base64,' + resp.myRanking.personPhoto
                            : '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-pic.png'
                    },
                    error: function (res) { }
                })
            },
            dr: function (data) {
                this.drop = false
                this.sort = data.val
                this.esort = data.key
                this.getData(data.key)
            },
            h: function () {
                this.drop = false
            }
        }
    }
    // 调班
    var shift = {
        template: '#shift',
        data: function () {
            return {
                sort: localeResource.changeTran,
                dsort: localeResource.workday,
                bsort: localeResource.shiftName + 'A',
                drop: false
            }
        },
        components: {
            dropDown: dropDown
        },
        methods: {
            dr: function (data) {
                this.drop = false
                this[data.type] = data.val
            },
            h: function () {
                this.drop = false
            },
            showDrop: function (data) {
                this.drop = true
                switch (data) {
                    case 'sort':
                        this.list = [
                            { key: 1, val: localeResource.changeTran, type: 'sort' },
                            { key: 2, val: localeResource.tranSelf, type: 'sort' },
                            { key: 3, val: localeResource.tranColleague, type: 'sort' }
                        ]
                        break
                    case 'dsort':
                        this.list = [
                            { key: 1, val: localeResource.workday, type: 'dsort' },
                            { key: 2, val: localeResource.restday2, type: 'dsort' },
                            { key: 3, val: localeResource.legalHoliday2, type: 'dsort' }
                        ]
                        break
                    case 'bsort':
                        this.list = [
                            { key: 1, val: localeResource.shiftName + 'A', type: 'bsort' },
                            { key: 2, val: localeResource.shiftName + 'B', type: 'bsort' },
                            { key: 3, val: localeResource.shiftName + 'C', type: 'bsort' }
                        ]
                        break
                }
            }
        }
    }
    // 已完成在办列表
    var done = {
        template: '#done',
        components: {
            dropDown: dropDown
        },
        data: function () {
            return {
                sort: localeResource.allType,
                drop: false,
                list: [
                    { key: '', val: localeResource.allType },
                    { key: 'leaveBill', val: localeResource.ttqNote9 },
                    { key: 'overTimeBill', val: localeResource.ttqNote10 },
                    { key: 'tripBill', val: localeResource.ttqNote11 },
                    { key: 'fillSignCard', val: localeResource.ttqNote12 },
                    { key: 'cancelLeaveBill', val: localeResource.ttqNote13 },
                    { key: 'changeShift', val: localeResource.ttqNote14 },
                    { key: 'canTripBill', val: localeResource.ttqNote15 },
                    { key: 'abnormalAttendance', val: localeResource.attenAbAgency }
                    // { key: 'atsFileBill', val: localeResource.ttqNote19 }
                ],
                items: []
            }
        },
        created: function () {
            var _this = this
            this.getData()
            mbos.eas.invokeScript({
                name: 'getSetIsCtrlHalfDayOff',
                param: [{}],
                success: function (resp) {
                    _this.isHalfDayOff = resp.isHalfDayOff
                    _this.pmBeginTime = resp.pmBeginTime
                    _this.amBeginTime = resp.amBeginTime
                    _this.pmEndTime = resp.pmEndTime
                    _this.amEndTime = resp.amEndTime
                },
                error: function (res) { }
            })
        },
        methods: {
            getData: function (key) {
                var _this = this
                var param = [
                    {
                        // personId: 'u5x8JzsXT2q0dN26ARw/L4Dvfe0=',
                        showSort: 'sevenDaysBefore',
                        attendanceStateCondition: key || ''
                    }
                ]
                mbos.eas.invokeScript({
                    name: 'attendanceInOffice',
                    param: param,
                    success: function (resp) {
                        resp.map(function (item) {
                            // 如果是考勤异常待办 state的状态重新取值
                            if (item.name === localeResource.attenAbAgency) {
                                item.billType = 'abnormalAttendance'
                                item.state = item.billState.alias
                            }
                            switch (item.state) {
                                case localeResource.noAgree:
                                    item.color = '#f5a623'
                                    break
                                case localeResource.approving:
                                    item.color = '#55a0f5'
                                    break
                                case localeResource.approveFail:
                                    item.color = '#f35959'
                                    break
                                case localeResource.approveSuccess:
                                    item.color = '#26b175'
                                    break
                                case localeResource.noSubmit:
                                    item.color = '#fc8555'
                                    break
                            }
                        })
                        _this.items = resp
                    },
                    error: function (res) { }
                })
            },
            dr: function (data) {
                this.drop = false
                this.getData(data.key)
                this.sort = data.val
            },
            h: function () {
                this.drop = false
            },
            getDetail: function (item) {
                var _this = this
                delete item.color
                if (item.state === localeResource.noSubmit) {
                    var param = [
                        {
                            billId: item.billId,
                            billType: item.billType
                        }
                    ]
                    mbos.eas.invokeScript({
                        name: 'billCanEditCheck',
                        param: param,
                        success: function (resp) {
                            if (resp.flag === 1) {
                                if (item.applyPersonId === item.personId) {
                                    _this.direction(item.billType, JSON.stringify(item), 'edit')
                                } else {
                                    mbos.msgBox.showError(localeResource.ttqNote16)
                                }
                            } else {
                                mbos.msgBox.showError(resp.errorString)
                            }
                        },
                        error: function (res) { }
                    })
                } else {
                    _this.direction(item.billType, JSON.stringify(item), 'view')
                }
            },
            direction: function (type, param, stat) {
                var _this = this
                var appid = mbos.getRequestParams().appid
                var eid = mbos.getRequestParams().eid
                var storeEid = mbos.getRequestParams().storeEid || mbos.getRequestParams().eid
                var am = [_this.amBeginTime, _this.amEndTime]
                var pm = [_this.pmBeginTime, _this.pmEndTime]
                var billID = JSON.parse(param).billId //显示附件
                switch (type) {
                    case 'fillSignCard':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=fill8612&billID=' +
                            encodeURIComponent(billID) +
                            '&name=fillSignCard.editui&operateState=ADDNEW&param=' +
                            encodeURIComponent(param) +
                            '&stat=view'
                        break
                    case 'overTimeBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=OT8612&billID=' +
                            encodeURIComponent(billID) +
                            '&name=edit.editui&operateState=ADDNEW&param=' +
                            encodeURIComponent(param) +
                            '&stat=view'
                        break
                    case 'leaveBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW&param=' +
                            encodeURIComponent(param) +
                            '&stat=view&am=' +
                            am +
                            '&pm=' +
                            pm + '&billID=' + encodeURIComponent(billID)
                        break
                    case 'tripBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=trip8612&name=edit.editui&operateState=ADDNEW&param=' +
                            encodeURIComponent(param) +
                            '&stat=view'
                        break
                    case 'cancelLeaveBill':
                        var param = JSON.parse(encodeURIComponent(param))
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=cancel8612&name=edit.editui&operateState=ADDNEW&leaveBillId=' +
                            encodeURIComponent(param.leaveBillId) +
                            '&id=' +
                            encodeURIComponent(param.billId) +
                            '&billID=' +
                            encodeURIComponent(param.billId) +
                            '&holidayTypeId=' +
                            encodeURIComponent(param.holidayTypeId) +
                            '&beginTime=' +
                            param.realBeginTime +
                            '&endTime=' +
                            param.realEndTime +
                            '&length=' +
                            param.realLeaLength +
                            '&unitName=' +
                            encodeURI(param.unit) +
                            '&cancelReason=' +
                            param.cancelReason +
                            '&stat=view'
                        break
                    case 'changeShift':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=trans8612&name=shiftDetail.custom&stat=view&param=' +
                            encodeURIComponent(param)

                        break
                    case 'canTripBill':
                        location.href =
                            '/mbos/page/loadPage?storeEid=' +
                            _private._storeEid +
                            '&appid=' +
                            appid +
                            '&eid=' +
                            eid +
                            '&path=busiAsk8612&name=businessAck.navui&fromPage=ttqin8612&param=' +
                            encodeURIComponent(param) +
                            '&stat=view'
                        break
                    case "atsFileBill":
                        location.href =
                            "/mbos/page/loadPage?storeEid=" +
                            _private._storeEid +
                            "&appid=" +
                            appid +
                            "&eid=" +
                            eid +
                            "&path=AtsFile8612&name=FileChange.editui&fromPage=ttqin8612&param=" +
                            encodeURIComponent(param) +
                            "&stat=" +
                            stat
                        break
                    case 'abnormalAttendance':
                        sessionStorage.setItem('exceptionAgencyDetail', param)
                        this.$router.push('/exception-agency')
                        break
                }
            }
        }
    }
    // 我的假期
    var vacation = {
        template: '#vacation',
        data: function () {
            return {
                isShow: false,
                list: [],
                text: localeResource.loseHoliday,
                attendanceOverduePng: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-overdue.png'
            }
        },
        created: function () {
            var _this = this
            var param = [
                {
                    personId: 'u5x8JzsXT2q0dN26ARw/L4Dvfe0='
                }
            ]
            mbos.eas.invokeScript({
                name: 'getMyHoliday',
                param: param,
                success: function (resp) {
                    _this.list = resp
                },
                error: function (res) { }
            })
        },
        methods: {
            past: function () {
                this.isShow = !this.isShow
                // isShow为true，即显示失效
                this.text = !this.isShow ? localeResource.loseHoliday : localeResource.effectiveHoliday
            },
            leaveBill: function (type) {
                location.href =
                    '/mbos/page/loadPage?storeEid=' +
                    _private._storeEid +
                    '&appid=' +
                    mbos.getRequestParams().appid +
                    '&eid=' +
                    mbos.getRequestParams().eid +
                    '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW&type=' +
                    type
            },
            releaveBill: function () {
                var realBeginDate = $('.s_time').text()
                mbos.eas.invokeScript({
                    name: 'GetPunchCardFromCloudService',
                    param: [
                        {
                            realBeginDate: startDate,
                            realEndDate: endDate
                        }
                    ],
                    success: function (resp) {
                        // console.log(resp)
                    },
                    error: function (e) { }
                })
            }
        }
    }
    var exceptionAgency = {
        template: '#expection-agency',
        props: {
            isSwitch: {
                type: Boolean,
                require: true
            }
        },
        data: function () {
            return {
                showDropdown: false,
                showDropdownMask: false,
                info: {},
                types: [],
                showDialog: false,
                status: null,
                exceKey: null,
                showMore: true
            }
        },
        methods: {
            onGoto: function (type) {
                // 已反馈 接收异常
                if (type.url === 'showDialog') {
                    this.exceKey = type.key
                    this.status = type.name
                    this.showDialog = true
                    this.showDropdown = false
                } else {
                    location.href = type.url
                }
            },
            onViewMore: function () {
                this.showDropdown = true
                this.showDropdownMask = true
            },
            onHideDropdown: function () {
                this.showDropdown = false
                this.showDropdownMask = false
            },
            onBack: function () {
                this.$router.go(-1)
            },
            getInfo: function () {
                try {
                    this.info = JSON.parse(sessionStorage.getItem('exceptionAgencyDetail'))
                } catch (error) {
                    this.info = {}
                }

                this.info.result = (this.info.attendanceValue || '') + (this.info.attendanceCompany || '')

                try {
                    this.info._shiftInfo = this.info.shiftDatil.scheduleShiftInfo[0].defaultShift.name
                } catch (error) {
                    this.info._shiftInfo = ''
                }

                try {
                    var scheduleShiftItems = this.info.shiftDatil.scheduleShiftInfo[0].items
                    if (scheduleShiftItems && scheduleShiftItems.length > 0) {
                        var shiftTimeString = '' //班次时间
                        var shiftCoreTimeString = '' //核心工作时间
                        for (var i = 0; i < scheduleShiftItems.length; i++) {
                            var lastItem = scheduleShiftItems[scheduleShiftItems.length - 1]
                            var preTime = lastItem.preTime
                            var nextTime = lastItem.nextTime
                            var preFloat = lastItem.preFloatAdjusted == null ? 0 : lastItem.preFloatAdjusted
                            var nextFloat = lastItem.nextFloatAdjusted == null ? 0 : lastItem.nextFloatAdjusted
                            var preDateTime = lastItem.preDateTime
                            var nextDateTime = lastItem.nextDateTime
                            var preTimeString = this.getPreTime(preFloat, preDateTime)
                            var nextTimeString = this.getNextTime(nextFloat, nextDateTime)
                            shiftCoreTimeString += preTimeString + '-' + nextTimeString
                            shiftTimeString += preTime + '-' + nextTime
                            if (i !== scheduleShiftItems.length - 1) {
                                shiftCoreTimeString += ';'
                                shiftTimeString += ';'
                            }
                        }
                        this.info.shiftTimeString = shiftTimeString //班次时间
                        this.info.shiftCoreTimeString = shiftCoreTimeString //核心工作时间
                    }
                } catch (error) {
                    console.warn(error)
                }

                try {
                    this.info._realWorkTime = this.info.realWorkTime.realWorkTime
                } catch (error) {
                    this.info._realWorkTime = ''
                }
            },
            onDialogConfirm: function () {
                var that = this
                // 对话框确认事件
                var billId = this.info.id
                if (this.exceKey == 'receiveException') {
                    var param = [
                        {
                            billId: billId
                        }
                    ]
                    mbos.eas.invokeScript({
                        name: 'receiveException',
                        param: param,
                        success: function (resp) {
                            if (resp.success == true || resp == 'true') {
                                var param = [
                                    {
                                        billId: billId
                                    }
                                ]
                                mbos.eas.invokeScript({
                                    name: 'changeAbnormalAttendBillState',
                                    param: param,
                                    success: function (resp) {
                                        that.showDialog = false
                                        that.$router.go(-1)
                                    },
                                    error: function (res) {
                                        console.log(res)
                                    }
                                })
                            } else {
                                mbos.msgBox.showError('error', localeResource.no_acceptable_items)
                            }
                        },
                        error: function (res) {
                            console.log(res)
                        }
                    })
                } else {
                    var param = [
                        {
                            billId: billId
                        }
                    ]
                    mbos.eas.invokeScript({
                        name: 'feedBack',
                        param: param,
                        success: function (resp) {
                            if (resp.success == true || resp == 'true') {
                                var param = [
                                    {
                                        billId: billId
                                    }
                                ]
                                mbos.eas.invokeScript({
                                    name: 'changeAbnormalAttendBillState',
                                    param: param,
                                    success: function (resp) {
                                        that.showDialog = false
                                        that.$router.go(-1)
                                    },
                                    error: function (res) { }
                                })
                            } else {
                                mbos.msgBox.showError('error', localeResource.no_acceptable_items)
                            }
                        },
                        error: function (res) {
                            console.log(res)
                        }
                    })
                }
            },
            onDialogCancel: function () {
                this.showDialog = false
            },
            getPreTime: function (preFloat, preDateTime) {
                var preFloat = Number(preFloat)
                var preDateTime = new Date(preDateTime)
                var tempPreDateTime = new Date(preDateTime.getTime() + preFloat * 60 * 1000)
                var preFloatTime = tempPreDateTime.toTimeString()
                var preTime = preFloatTime.substring(0, 5)
                return preTime
            },
            getNextTime: function (nextFloat, nextDateTime) {
                var nextFloat = Number(nextFloat)
                var nextDateTime = new Date(nextDateTime)
                var tempNextDateTime = new Date(nextDateTime.getTime() - nextFloat * 60 * 1000)
                var nextFloatTime = tempNextDateTime.toTimeString()
                var nextTime = nextFloatTime.substring(0, 5)
                return nextTime
            }
        },
        created: function () {
            try {
                this.info = JSON.parse(sessionStorage.getItem('exceptionAgencyDetail'))
            } catch (error) {
                this.info = {}
            }

            // 如果当前订单已经审批通过, 隐藏查看更多的按钮
            if (localeResource.approveSuccess === this.info.billState) {
                this.showMore = false
            }

            var attendDate = this.info.attendanceDate
            var abnormalId = this.info.id
            var appid = mbos.getRequestParams().appid
            var eid = mbos.getRequestParams().eid
            this.types = [
                // {
                //     key: 'receiveException',
                //     name: localeResource.receiveException,
                //     url: 'showDialog'
                // },
                // {
                //     key: 'feedback',
                //     name: localeResource.feedback,
                //     url: 'showDialog'
                // },
                {
                    key: 'leave',
                    name: localeResource.holiday,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&attendDate=' +
                        attendDate +
                        '&abnormalId=' +
                        encodeURIComponent(abnormalId) +
                        '&path=leave8612&name=leaveBillLast.editui&operateState=ADDNEW'
                },
                {
                    key: 'buzTrip',
                    name: localeResource.buzTrip,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&attendDate=' +
                        attendDate +
                        '&abnormalId=' +
                        encodeURIComponent(abnormalId) +
                        '&path=trip8612&name=edit.editui&operateState=ADDNEW'
                },
                {
                    key: 'bk',
                    name: localeResource.bk,
                    url:
                        '/mbos/page/loadPage?storeEid=' +
                        _private._storeEid +
                        '&appid=' +
                        appid +
                        '&eid=' +
                        eid +
                        '&attendDate=' +
                        attendDate +
                        '&abnormalId=' +
                        encodeURIComponent(abnormalId) +
                        '&path=fill8612&name=fillSignCard.editui&operateState=ADDNEW&type=autocard'
                }
            ]
            this.getInfo()
        }
    }

    var routes = [
        { path: '/', meta: { title: localeResource.homePage, tab: true }, component: cA, name: 'a' },
        {
            path: '/cB',
            meta: { title: localeResource.monthOverview, tab: true, keepAlive: true },
            component: cB,
            name: 'b'
        },
        {
            path: '/cC',
            meta: { title: localeResource.monthAttendance, keepAlive: true, tab: true },
            component: cC,
            name: 'c'
        },
        { path: '/cD', meta: { title: localeResource.attendance, tab: true, keepAlive: true }, component: cD, name: 'd' },
        { path: '/detail', meta: { title: localeResource.routeNote1 }, component: detail },
        { path: '/ranklist', meta: { title: localeResource.routeNote2 }, component: RankList },
        { path: '/shift', meta: { title: localeResource.routeNote3 }, component: shift },
        { path: '/done', meta: { title: localeResource.routeNote4 }, component: done },
        { path: '/monthdetail', meta: { title: localeResource.routeNote5 }, component: monthDetail },
        { path: '/vacation', meta: { title: localeResource.myHoliday }, component: vacation },
        { path: '/confirm', meta: { title: localeResource.routeNote6 }, component: confirm },
        { path: '/exception-agency', meta: { title: localeResource.routeNote6 }, component: exceptionAgency }
    ]

    var router = new VueRouter({
        routes: routes
    })
    router.beforeEach(function (to, from, next) {
        if (to.meta.title) {
            //如果设置标题，拦截后设置标题
            document.title = to.meta.title
        }
        next()
    })
    // 入口
    setTimeout(function () {
        new Vue({
            router: router,
            el: '#app',
            data: function () {
                return {
                    tabShow: true,
                    bills: false,
                    a: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-a1.png',
                    b: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-b1.png',
                    c: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-c1.png',
                    d: '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-d1.png',
                    date: '',
                    localeResource: {}
                }
            },
            created: function () {
                this[this.$route.name] =
                    '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-' + this.$route.name + '.png'
                this.localeResource = localeResource || {}
            },
            watch: {
                $route: function (to, from) {
                    this[to.name] = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-' + to.name + '.png'
                    this[from.name] = '/mbos/store/' + _private._storeEid + '/fileLibrary/attendance-' + from.name + '1.png'
                    if (to.meta.tab) {
                        this.tabShow = true
                    } else {
                        this.tabShow = false
                    }
                }
            },
            components: {
                cA: cA,
                cB: cB,
                cC: cC,
                cD: cD,
                plus: plus
            },
            methods: {
                close: function () {
                    this.bills = false
                }
            }
        }).$mount('#app')
    })
    Vue.prototype.localeResource = localeResource || {}
    // 隐藏云之家右上角菜单
    setTimeout(function() {
        qing.call('closePop');
    }, 1000)
})
