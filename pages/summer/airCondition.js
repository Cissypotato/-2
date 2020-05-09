const app = getApp();
Page({
    data: {
        showLogin: false,
        service_index: 0,
        loginData: {},
        second:60,
        showSecond:false,
        service_num:1,
        isAddNum:false,
        flag: true,
        //以下为页面初始需要从服务端加载的数据
        info_data:{//页面说明数据，包含产品名称、优惠信息、公司信息等
            info_1: '日常家居保洁服务',
            info_2: '本服务有一名保洁员上门服务，请参考您的房屋面积下单',
            info_3: '新用户现在下单 直减15元',
            info_4: '本服务由成都斓设网络科技有限公司提供技术支持',
            info_5: '联系电话：028-88888888',
        },
        banner_data:[//banner数据
           
        ],
        serve_data:[//服务选择数据
           
        ],
        explain_data:[//费用说明
           
        ],
        question_data:[//常见问题数据
           
        ],
        comment_data:[//评论数据
                  
        ],
        recommend_data:[//推荐信息
            
        ],


        //以下为页面动画相关参数
        clientHeight: wx.getSystemInfoSync().windowHeight,
        bubble_anima:'',
        tab_index:0,
        tab_title_show:false,
    },
    onLoad: function(options) {
        // this.getCode()

        //获取页面ID
        // let type_id=options.id?options.id:6
        // this.setData({type_id})
        this.getInitData()
        //获取用户信息
        let user_id = wx.getStorageSync("token")
        this.setData({user_id});

        //开启数据读取
        wx.showLoading({
            title: '',
        })
        setTimeout(()=>{
            this.img_ok()
        },1000)
        wx.hideLoading();

        
    },
    onShow() {
      //获得物管id
     let obj = wx.getLaunchOptionsSync()
       let vip_state = wx.getStorageSync("vip_state")
       console.log(vip_state,'vip_state')
        if(obj.query.server_id){
            wx.setStorageSync('server_id', obj.query.server_id)
            console.log(obj.query.server_id)
        }
        if (vip_state == 1) {
            this.setData({
               flag: false
            })
            this.getInitData()
            // console.log(this.data.type_id,'this.data.type_id')
         }
      
      this.setData({
         vip_state: vip_state
      })
      

    },
    onReady: function () {
        //气泡 初始化
        var animation = wx.createAnimation({
            duration: 0,
            timingFunction: 'ease',
            delay: 0
        });
        animation.opacity(0).translate(200, 0).step()
        this.setData({
            bubble_anima: animation.export()
        });
    },
    getInitData(){
      wx.request({
        url: 'https://ljjz.guaishe.com/index.php/index/Services/returnServices2',
        data: {
            type_id:33
        },
        fail: (res) => {},
        success: (result) => {
            let data=result.data.info
            let info_data=this.data.info_data
            info_data.info_1=data.title.name
            info_data.info_2=data.title.names

            //价格数字变换
            let serve_data = data.services
            if (this.data.vip_state == 1) {
                for (let k = 0; k < serve_data.length; k++) {
                   let price = String(serve_data[k].vip_price);
                   serve_data[k].price_a = price.split('');
                };
             } else if (this.data.vip_state == 0) {
                for (let k = 0; k < serve_data.length; k++) {
                   let price = String(serve_data[k].price);
                   serve_data[k].price_a = price.split('');
                };
             }
          


            let explain_data=[]
            explain_data.push({t:data.services[0].explain1})
            explain_data.push({t:data.services[0].explain2})
            explain_data.push({t:data.services[0].explain3})
            let a = data.services[0].content.replace(/\<img/gi, '<img width="100%" height="auto"')//富文本
            // console.log(data.services[0].comments)
            let comment_data=data.services[0].comments
            for(let i=0;i<comment_data.length;i++){
                comment_data[i].user_tel=comment_data[i].user_tel.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
            }
            let banner_data=[]
            for(let i=0;i<data.img.length;i++){
                // console.log(data.img[i])
                if(data.img[i].img.slice(-3)=="jpg"){
                    banner_data.push(data.img[i])
                }
            }
            // console.log(data.img,"data.img")
            // console.log( banner_data," banner_data")
            this.setData({
                banner_data,
                info_data,
                serve_data,
                question_data:data.problem,
                comment_data,
                explain_data,
                like:data.like,
                a

            })

        },
      })
    },
    toIndex(e){
        let id=e.currentTarget.dataset.id
        console.log(id)
        if(id){
            wx.navigateTo({
              url: '../index/index?id='+id,
            })
        }
    },
    img_ok(){
        //获取页面标题的高度位置，写入数组，一定要在页面元素加载完成后执行
        var then = this;

        let arr = ['t1', 't2', 't3', 't4'];
        let t_list = new Array();
        for (let k = 0; k < 4; k++) {
            let p1 = arr[k];
            let p2 = '#' + p1;
            let t = wx.createSelectorQuery();
            t.select(p2).boundingClientRect()
            t.exec(function (res) {
                t_list[k] = res[0].top;
            });

        };
        then.setData({
            t_list,
        });
        
    },
    chooseService(e) {//选择服务
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let service_name=this.data.serve_data[index].title
        let service_price=this.data.serve_data[index].price
        let service_vip_price=this.data.serve_data[index].vip_price
        // console.log(service_vip_price)
        this.setData({
            service_index: index,
            service_id: id,
            service_name,
            service_price,
            service_vip_price
        });
    },
    makePhone(){
        wx.makePhoneCall({
            phoneNumber: '028-83026224'
        })
    },
    reserve() {//预约按钮
        if (!this.data.user_id) {
            this.setData({
                showLogin: true
            });
        }else{
            // if(this.data.type_id==26){
            //     this.setData({
            //         isAddNum:true
            //     })
            //     let service_name=this.data.serve_data[this.data.service_index].title
            //     let service_price=this.data.serve_data[this.data.service_index].price
            //     console.log(service_name,'service_name')
            //     this.setData({
            //         service_name,
            //         service_price
            //     })
            // }else{
            //     let id = Number(this.data.serve_data[this.data.service_index].id);
               
            //     wx.navigateTo({
            //         url: '../order/order?service_id=' + id,
            //     });
            // }
            this.setData({
                        isAddNum:true
                    })
               let service_name=this.data.serve_data[this.data.service_index].title
                let service_price=this.data.serve_data[this.data.service_index].price
                console.log(service_name,'service_name')
                this.setData({
                    service_name,
                    service_price
                })
        };
    },
    getInputValue(e) {
        let loginData = this.data.loginData
        let value = e.detail.value
        let name = e.currentTarget.dataset.name
        loginData[name] = value
        // console.log(e)
        this.setData({
            loginData
        });
    },
    getCode() { //获取手机验证码
        
        let tel = this.data.loginData.tel
        let second=this.data.second
        if (!tel) {
            app.alert("请输入电话号码")
        } else if (!(/^1[3456789]\d{9}$/.test(tel))) {
            app.alert("请输入正确电话号码")
        } else {
            this.setData({
                showSecond:true
            })
            let interval = setInterval( ()=> {
                this.setData({
                    second: second--
                });
                if (second <= 0) {
                    clearInterval(interval)
                    this.setData({
                        // time: '重新获取',
                        second: 60,
                        // disabled: false,
                        showSecond:false
                        
                    })
                }
            }, 1000);
            wx.request({
                url: 'https://ljjz.guaishe.com/index.php/index/Login/returnCode',
                data: {
                    tel: tel
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.state == true) {
                        this.setData({
                            tel_code: res.data.info,
                            tel_1: res.data.tel
                        })
                    } else {
                        app.alert(res.data.info)
                    }

                },
            })
        }
    },
    closeLogin() {
        this.setData({
            showLogin: false
        })
    },
    login() { //登录
        let code = this.data.loginData.code
        let tel = this.data.loginData.tel
        let tel_1 = this.data.tel_1
        let server_id=wx.getStorageSync('server_id')
        if (Number(code) !== Number(this.data.tel_code)) {
            app.alert("验证码填写错误，请重新填写")
        } else if (tel !== tel_1) {
            app.alert("手机号码与验证码不匹配，请重新填写")
        } else {
            wx.request({
                url: 'https://ljjz.guaishe.com/index.php/index/Login/returnId1',
                data: {
                    tel: this.data.loginData.tel,
                    server_id:server_id?server_id:7
                },
                success: (res) => {
                    console.log(res)
                    if (res.data.code == 200) {
                        wx.setStorageSync("token", res.data.id)
                        console.log(res.data.state,"res.data.state")
                        wx.setStorageSync("vip_state", res.data.vip)
                        if(res.data.vip==1){
                            this.setData({
                               flag:false
                            })
                         }
                        this.setData({
                           vip_state: res.data.vip,
                           showLogin: false,
                           user_id: res.data.id
                        })
                        
                        app.alert("登录成功")
                        this.getInitData(this.data.type_id)
                    } else {
                        app.alert("发生错误，请稍后重试")
                    }

                },
            })
        }
    },
    
    toMyOrder(e) {
        if (!this.data.user_id) {
            this.setData({
                showLogin: true
            })
        }else {
            wx.navigateTo({
                url: '../myOrder/myOrder?user_id=' + this.data.user_id,
            })
        }
    },
    
    tabClick(e){//页面导航
        this.setData({
            tab_index: e.currentTarget.dataset.id
        });
        // console.log(this.data.tab_index)
        // console.log(e.currentTarget.dataset.id)
        let tab_list = this.data.t_list;
        console.log(tab_list)
        let k = Number(1);
        let d = (Number(e.currentTarget.dataset.id) + k) * 150;
        wx.pageScrollTo({
                    scrollTop: tab_list[e.currentTarget.dataset.id]-170,
                    duration: d
                }); 
        // if(e.currentTarget.dataset.id==0){

        // }else if(e.currentTarget.dataset.id==1){
        //     let distance=
        //     wx.pageScrollTo({
        //         scrollTop: tab_list[e.currentTarget.dataset.id]-170,
        //         duration: d
        //     });  
        // }
          
    },
    onPageScroll: function (e) {//监测滚动事件
        // console.log(e.scrollTop)
        //滚动响应tab
        let tab_list = this.data.t_list;
        if (e.scrollTop < tab_list[0]){
            this.setData({
                tab_index: 0
            });            
        } 
        if (e.scrollTop > tab_list[0] && e.scrollTop < tab_list[1]) {
            this.setData({
                tab_index: 1
            });  
        } 
        if (e.scrollTop > tab_list[1] && e.scrollTop < tab_list[2]) {
            this.setData({
                tab_index: 2
            });  
        } 
        if (e.scrollTop > tab_list[2] ) {
            this.setData({
                tab_index: 3
            });  
        };

        //tab锁定
        if (e.scrollTop > 460) {
            this.setData({
                tab_title_show:true,
            });            
        }else{
            this.setData({
                tab_title_show:false,
            });            
        };
        
        //气泡显示判断
        if (e.scrollTop>1500){
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
                delay: 200
            });
            animation.opacity(1).translate(0, 0).step()
            this.setData({
                bubble_anima: animation.export()
            });
        }else{
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
                delay: 200
            });
            animation.opacity(0).translate(200, 0).step()
            this.setData({
                bubble_anima: animation.export()
            });
        }
    },
    tap_info(e){
        let t = Boolean(this.data.mass_state);
        this.setData({
            mass_state:!t
        });
    },
    onShareAppMessage: function (res) {//分享页面
        console.log(this.data.info_data.info_1)
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        console.log(res)
        console.log(this.data.type_id)
        return {
            title: this.data.info_data.info_1,
            path: '/pages/index/index?id='+this.data.type_id
        }
    },
    // getSCode(){//获取小程序二维码
    //     wx.request({
    //       url: 'https://ljjz.guaishe.com/index.php/index/login/getAccessToken',
    //       complete: (res) => {},
    //       data: {
    //           path:"pages/index/index?server_id=1"
    //         } ,
          
    //       success: (result) => {
    //           console.log(result)
    //       },
    //     })
    // },
    handleServiceNum(e){
        let type=e.currentTarget.dataset.type
        let service_num=this.data.service_num
        if(type=="reduce" &&service_num>1){
            service_num =service_num -1
            this.setData({service_num})
        }else if(type=="add"){
            service_num ++
            this.setData({service_num})
        }else if(type=="reduce" &&service_num==1){
           app.alert('不能再减啦')
        }
    },
    move(){
        return
    },
    numConfirm(){//数量输入框确定
        let service_num=this.data.service_num
        let id = Number(this.data.serve_data[this.data.service_index].id);
        wx.navigateTo({
            url: '../order/order?service_id=' + id+'&service_num='+service_num+'&airCondition='+1,
        });
    },
    closeAddNum(){
        this.setData({
            isAddNum:false
        })
    },
    a(){
        console.log("阻止冒泡")
    },
    // goVip() { //开通vip
    //     if (this.data.user_id) {
    //        wx.navigateTo({
    //           url: '../vip/vip',
    //        })
  
    //     } else {
    //        this.setData({
    //           showLogin: true
    //        });
    //     }
    //  }
})