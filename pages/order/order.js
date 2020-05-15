const app = getApp()
const appUrl = app.globalData.url
Page({
   data: {
      timePickerShow: false,
      timeArr: [{
         time: '8:00',
         id: '8:00',
         isUrgent: false
      }, {
         time: '9:00',
         id: '9:00',
         isUrgent: false
      }, {
         time: '10:00',
         id: '10:00',
         isUrgent: false
      }, {
         time: '11:00',
         id: '11:00',
         isUrgent: false
      }, {
         time: '12:00',
         id: '12:00',
         isUrgent: false
      }, {
         time: '13:00',
         id: '13:00',
         isUrgent: false
      }, {
         time: '14:00',
         id: '14:00',
         isUrgent: false
      }, {
         time: '15:00',
         id: '15:00',
         isUrgent: false
      }, {
         time: '16:00',
         id: '16:00',
         isUrgent: false
      }, {
         time: '17:00',
         id: '17:00',
         isUrgent: true
      }, {
         time: '18:00',
         id: '18:00',
         isUrgent: true
      }, {
         time: '19:00',
         id: '19:00',
         isUrgent: true
      }, ],
      num: 0,
      index_1: 0,

      //页面动画相关设定
   },
   onLoad: function(options) {
      console.log(options)
      //console.log(services_id)
      let vip_state = wx.getStorageSync('vip_state')
      let services_id = options.service_id;
      let service_num = options.service_num ? Number(options.service_num) : 1;
      let airCondition=options.airCondition? Number(options.airCondition) : 0;//是否为空调类别
      console.log(service_num)
      console.log(airCondition,'airCondition')
      let address_id = options.address_id;
      let user_id = wx.getStorageSync("token");
      let dateArr = this.getDate();
      // console.log(dateArr);
      this.setData({
         dateArr,
         services_id,
         address_id,
         service_num,
         vip_state,
         airCondition
      })
      if (address_id) {
         wx.request({
            url: 'https://ljjz.guaishe.com/index.php/index/Services/orderInfo',
            data: {
               address_id,
               services_id,
               user_id,

            },
            success: (res) => {
               console.log(res)
               var price = 0
               // if (res.data.status == 0 && res.data.services.price > 15) {
               //    if (vip_state == 1) {
               //       price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100
               //    } else {
               //       price = (res.data.services.price * 100 * service_num - 15 * 100) / 100
               //    }

               // } else {
               //    if (vip_state == 1) {
               //       price = res.data.services.vip_price * service_num
               //    } else {
               //       price = res.data.services.price * service_num
               //    }

               // };
               if (res.data.status == 0 && res.data.services.price > 15) {//首单
                  
                   if (this.data.vip_state == 1) {//vip
                     if(airCondition==1 && res.data.is_air ==0 && service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                        console.log(price,'114')
                     }else{
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100
                     }
                  }else {//非vip
                     if(airCondition==1 && res.data.is_air ==0 && service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                        console.log(price,'114')
                     }else{
                        price = (res.data.services.price * 100 * service_num - 15 * 100) / 100
                     }
                    
                  }

               } else {//非首单
                  if (this.data.vip_state == 1) {//vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                        console.log(price,'163')
                     }else{
                        price = (res.data.services.vip_price * 100 * service_num) / 100
                     }
                  }else {//非vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                        console.log(price,'170')
                     }else{
                        price = (res.data.services.price * 100 * service_num) / 100
                     }
                    
                  }

               };
               this.setData({
                  address: res.data.address,
                  services: res.data.services,
                  status: res.data.status,
                  price: price,
                  is_air:res.data.is_air
               });
            },
         })

      } else {
         wx.request({
            url: 'https://ljjz.guaishe.com/index.php/index/Services/orderInfo',
            data: {
               services_id,
               user_id,
            },
            success: (res) => {
               console.log(res)
               var price = 0
              
               if (res.data.status == 0 && res.data.services.price > 15) {//首单                 
                  if (this.data.vip_state == 1) {//vip
                    if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                       price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                       console.log(price,'163')
                    }else{
                       price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100
                    }
                 }else {//非vip
                    if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                       price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                       console.log(price,'170')
                    }else{
                       price = (res.data.services.price * 100 * service_num - 15 * 100) / 100
                    }
                   
                 }

              } else {//非首单
               if (this.data.vip_state == 1) {//vip
                  if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                     price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                     console.log(price,'163')
                  }else{
                     price = (res.data.services.vip_price * 100 * service_num) / 100
                  }
               }else {//非vip
                  if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                     price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                     console.log(price,'170')
                  }else{
                     price = (res.data.services.price * 100 * service_num) / 100
                  }
                 
               }


              };
               this.setData({
                  address: res.data.address,
                  services: res.data.services,
                  status: res.data.status,
                  price,
                  is_air:res.data.is_air
               })
            },
         })
      };

   },

   onShow: function() {
      let user_id = wx.getStorageSync("token")
      let services_id = this.data.services_id
      let address_id = this.data.address_id
      let service_num = this.data.service_num
      // console.log(address_id)
      if (!address_id) {
         wx.showLoading({
            title: '',
         })
         wx.request({
            url: 'https://ljjz.guaishe.com/index.php/index/Services/orderInfo',
            data: {
               services_id,
               user_id
            },
            success: (res) => {
               console.log(res.data.is_air)
               var price = 0
               if (res.data.status == 0 && res.data.services.price > 15) {//首单
                  if (this.data.vip_state == 1) {//vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                        console.log(price,'163')
                     }else{
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100
                     }
                  }else {//非vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num - 15 * 100) / 100 - 50
                        console.log(price,'170')
                     }else{
                        price = (res.data.services.price * 100 * service_num - 15 * 100) / 100
                     }
                    
                  }

               } else {//非首单
                  if (this.data.vip_state == 1) {//vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                        console.log(price,'163')
                     }else{
                        price = (res.data.services.vip_price * 100 * service_num) / 100
                     }
                  }else {//非vip
                     if(this.data.airCondition==1 && res.data.is_air ==0 && this.data.service_num>1){//空调第一次使用且一台以上
                        price = (res.data.services.vip_price * 100 * service_num) / 100 - 50
                        console.log(price,'170')
                     }else{
                        price = (res.data.services.price * 100 * service_num) / 100
                     }
                    
                  }

               };
               this.setData({
                  address: res.data.address,
                  services: res.data.services,
                  status: res.data.status,
                  price,
                  is_air:res.data.is_air
               })
               wx.hideLoading()
            },
         })
      }
   },
   // getInitData(){

   // },
   handleTimePicker(e) {
      let id = e.currentTarget.dataset.id
      console.log(id)
      if (id == 1) {
         this.setData({
            timePickerShow: true
         });
      } else if (id == 0) {
         this.setData({
            timePickerShow: false
         });
      };

   },
   chooseDate(e) { //选择日期
      let id = e.currentTarget.dataset.id;
      // let num =this.data.num;
      let index = e.currentTarget.dataset.index
      let timeArr = this.data.timeArr;
      // console.log(index)
      // console.log(num)
      if (index > 0) {
         for (let i = 0; i < timeArr.length; i++) {
            timeArr[i].select = true
         };
      } else {
         this.getDate();
      };
      this.setData({
         timeArr,
         date: id,
         num: index
      });
   },
   chooseTime(e) { //选择时间
      let time = e.currentTarget.dataset.time;
      let index = e.currentTarget.dataset.index;
      let urgent = e.currentTarget.dataset.urgent
      if (urgent) {
         app.alert("此时间段为保洁员加班时间段，每小时服务将加收十元服务费")
         this.setData({
            urgent
         })
      }

      this.setData({
         time,
         index_1: index
      });
   },
   timeConfirm() { //确定时间
      let date = this.data.dateArr[this.data.num].date;
      let date_1 = this.data.dateArr[this.data.num].id;
      let time = '';

      if (!this.data.time) {
         time = this.data.timeArr[0].time
      } else {
         time = this.data.time
      };
      let price = this.data.price
      console.log(this.data.urgent)
      if (this.data.urgent) {
         price = this.data.price + 10 * this.data.services.j_time
         console.log()
         this.setData({
            price
         })
      }
      let now = new Date()
      let milliseconds = now.getTime() + 60 * 60 * 1000 //现在时间戳
      let thisTime = date_1 + ' ' + time
      let pseconds = new Date(thisTime).getTime() //选择的时间戳
      if (pseconds < milliseconds) {
         app.alert("当前时间无效，请重新选择时间")
      } else {
         this.setData({
            date,
            time,
            serveTime: date + ' ' + time,
            upServeTime: date_1 + ' ' + time,
            timePickerShow: false
         })
      };
   },
   getDate() { //获得未来5天的时间
      let dateArr = []
      let timeArr = this.data.timeArr
      for (let i = 0; i < timeArr.length; i++) {
         let now = new Date()
         let milliseconds = now.getTime() + 60 * 60 * 1000 //现在时间戳
         let year = now.getFullYear()
         let month = now.getMonth() + 1; //获取当前月
         let day = now.getDate(); //获取当前日
         let thisTime = year + '/' + month + '/' + day + ' ' + timeArr[i].time + ':00'
         let pseconds = new Date(thisTime).getTime()
         if (milliseconds < pseconds) {
            timeArr[i].select = true
         } else {
            timeArr[i].select = false
         }
      }
      this.setData({
         timeArr
      })
      for (let i = 0; i < 5; i++) {
         let myDate = new Date()
         let milliseconds = myDate.getTime() + 1000 * 60 * 60 * 24 * i; //当i为0代表当前日期，为1时可以得到明天的日期，以此类推
         let newMyDate = new Date(milliseconds);
         let year = newMyDate.getFullYear()
         let month = newMyDate.getMonth() + 1; //获取当前月
         let day = newMyDate.getDate(); //获取当前日

         dateArr.push({
            date: month + '月' + day + "号",
            id: year + '/' + month + '/' + day
         })

      }
      console.log(dateArr)
      return dateArr
   },
   toAddress() {
      let services_id = this.data.services_id
      console.log(services_id)
      wx.navigateTo({
         url: '../address/address?user_id=' + wx.getStorageSync("token") + '&services_id=' + services_id,
      })
   },
   scroll(e) {
      // console.log(e)
   },
   topay() { //预约并支付
      if (this.data.address == null) {
         app.alert("请填写地址")
      } else if (!this.data.date || !this.data.time) {
        
         app.alert("请选择上门服务时间")
      } else {
         let a = new Date(this.data.upServeTime)
         // console.log(this.data.upServeTime)
         // console.log(a.getTime() / 1000)
         let upServeTime = a.getTime() / 100
         let share_id = wx.getStorageSync("share_id");
         let user_id = wx.getStorageSync("token");
         // let user_id = Number(share_id)
         console.log(user_id)
         // 用户id和分享id相同
         if (share_id == user_id || !share_id) {
            console.log("1")
            wx.request({
               url: appUrl + '/index.php/index/Pay/addOrder1',
               data: {
                  user_id: wx.getStorageSync("token"),
                  address_id: this.data.address.id,
                  shop_id: this.data.services_id,
                  start_time: upServeTime,
                  is_jb: this.data.urgent ? 1 : 0,
                  num: this.data.service_num
               },
               success: (res) => {
                  console.log(res)
                  let order_id = res.data.order_id
                  if (res.data.code == 200) {
                     app.alert('预约成功,等待支付')
                     wx.login({
                        success: (res) => {
                           // console.log(res)
                           // console.log(services_id)
                           if (res.code) {
                              //发起网络请求
                              wx.request({
                                 url: "https://ljjz.guaishe.com/index.php/index/pay/pays",
                                 data: {
                                    id: order_id,
                                    code: res.code,
                                 },
                                 success: (res) => {
                                    console.log(res)
                                    wx.requestPayment({
                                       'timeStamp': res.data.timeStamp,
                                       'nonceStr': res.data.nonceStr,
                                       'package': res.data.package,
                                       'signType': res.data.signType,
                                       'paySign': res.data.paySign,
                                       'success': (res) => {
                                          wx.redirectTo({
                                             url: '/pages/index/index',
                                             complete: function(res) {},
                                          })
                                       },
                                       'fail': function(res) {
                                          console.log(res)
                                          app.alert("支付失败")
                                       },

                                    })
                                 },
                              })
                           } else {
                              console.log('登录失败！' + res.errMsg)
                           }

                        }
                     })
                  }
               }
            })
         } else if (share_id != user_id && share_id) {
            console.log("2")
            wx.request({
               url: appUrl + '/index.php/index/Pay/addOrder1',
               data: {
                  user_id: wx.getStorageSync("token"),
                  address_id: this.data.address.id,
                  shop_id: this.data.services_id,
                  start_time: upServeTime,
                  is_jb: this.data.urgent ? 1 : 0,
                  share_id: share_id,
                  num: this.data.service_num
               },
               success: (res) => {
                  console.log(res)
                  let order_id = res.data.order_id
                  if (res.data.code == 200) {
                     app.alert('预约成功,等待支付')
                     wx.login({
                        success: (res) => {
                           // console.log(res)
                           // console.log(services_id)
                           if (res.code) {
                              //发起网络请求
                              wx.request({
                                 url: "https://ljjz.guaishe.com/index.php/index/pay/pays",
                                 data: {
                                    id: order_id,
                                    code: res.code,
                                 },
                                 success: (res) => {
                                    console.log(res)
                                    wx.requestPayment({
                                       'timeStamp': res.data.timeStamp,
                                       'nonceStr': res.data.nonceStr,
                                       'package': res.data.package,
                                       'signType': res.data.signType,
                                       'paySign': res.data.paySign,
                                       'success': (res) => {
                                          wx.redirectTo({
                                             url: '/pages/index/index',
                                             complete: function(res) {},
                                          })
                                       },
                                       'fail': function(res) {
                                          console.log(res)
                                          app.alert("支付失败")
                                       },

                                    })
                                 },
                              })
                           } else {
                              console.log('登录失败！' + res.errMsg)
                           }

                        }
                     })
                  }
               }
            })
         }


      }
   },
   // topay() { //预约并支付
   //    if (this.data.address == null) {
   //       app.alert("请填写地址")
   //    } else if (!this.data.date || !this.data.time) {
   //       // console.log(this.data.date)
   //       // console.log(this.data.time)
   //       app.alert("请选择上门服务时间")
   //    } else {
   //       let a = new Date(this.data.upServeTime)
   //       // console.log(this.data.upServeTime)
   //       // console.log(a.getTime() / 1000)
   //       let upServeTime = a.getTime() / 1000
   //       wx.request({
   //          url: appUrl + '/index.php/index/Pay/addOrder1',
   //          data: {
   //             user_id: wx.getStorageSync("token"),
   //             address_id: this.data.address.id,
   //             shop_id: this.data.services_id,
   //             start_time: upServeTime,
   //             is_jb: this.data.urgent ? 1 : 0,
   //             num: this.data.service_num
   //          },
   //          success: (res) => {
   //             console.log(res)
   //             let order_id = res.data.order_id
   //             if (res.data.code == 200) {
   //                app.alert('预约成功,等待支付')
   //                wx.login({
   //                   success: (res) => {
   //                      // console.log(res)
   //                      // console.log(services_id)
   //                      if (res.code) {
   //                         //发起网络请求
   //                         wx.request({
   //                            url: "https://ljjz.guaishe.com/index.php/index/pay/pays",
   //                            data: {
   //                               id: order_id,
   //                               code: res.code
   //                            },
   //                            success: (res) => {
   //                               console.log(res)
   //                               wx.requestPayment({
   //                                  'timeStamp': res.data.timeStamp,
   //                                  'nonceStr': res.data.nonceStr,
   //                                  'package': res.data.package,
   //                                  'signType': res.data.signType,
   //                                  'paySign': res.data.paySign,
   //                                  'success': (res) => {
   //                                     wx.redirectTo({
   //                                        url: '/pages/index/index',
   //                                        complete: function(res) {},
   //                                     })
   //                                  },
   //                                  'fail': function(res) {
   //                                     console.log(res)
   //                                     app.alert("支付失败")
   //                                  },

   //                               })
   //                            },
   //                         })
   //                      } else {
   //                         console.log('登录失败！' + res.errMsg)
   //                      }
   //                   }
   //                })
   //             }
   //          }
   //       })
   //    }
   // },
});