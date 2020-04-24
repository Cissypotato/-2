// pages/vip/vip.js
Page({

   /**
    * 页面的初始数据
    */
   data: {
      showLogin: false,
      flag: false
   },

   //  生命周期函数--监听页面加载
   onLoad: function (options) {
      wx.login({ //获得code
         success: res => {
            this.setData({
               code: res.code
            })
         }
      })

   },
   onShow: function () {

   },


   pay() { //点击立即支付
      let user_id = wx.getStorageSync("token")
      let vip_state = wx.getStorageSync('vip_state')
      // console.log(vip_state)
      if (vip_state == 1) {
         wx.showToast({
            title: '您已开通VIP',
            icon: 'none'
         })
      } else {
         wx.request({
            url: 'https://ljjz.guaishe.com/index.php/index/pay/vipPay',
            data: {
               user_id: user_id,
               code: this.data.code
            },
            success: res => {
               console.log(res)

               wx.requestPayment({ //支付费用
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: res.data.package,
                  signType: res.data.signType,
                  paySign: res.data.paySign,
                  user_id: this.data.user_id,
                  success:(res) =>{
                     console.log(res, '支付成功')
                     wx.setStorageSync('vip_state', 1)
                     this.setData({
                        flag: true
                     })

                  },
                  fail(res) { }
               })
            }
         })
      }

      // wx.showModal({ //是否开通
      //    title: '提示',
      //    content: 'vip时长一年，日常家居保洁和擦玻璃优惠！',
      //    success: res => {
      //       if (res.confirm) {
      //          wx.request({
      //             url: 'https://ljjz.guaishe.com/index.php/index/pay/vipPay',
      //             data: {
      //                user_id: this.data.user_id,
      //                code: this.data.code
      //             },
      //             success: res => {
      //                if (res.data.code == 201) { //判断是否开通vip
      //                   wx.showToast({
      //                      title: '您已开通VIP',
      //                      icon: 'none'
      //                   })
      //                   // wx.navigateBack({
      //                   //    delta: 1
      //                   // })
      //                }
      //                wx.requestPayment({ //支付费用
      //                   timeStamp: res.data.timeStamp,
      //                   nonceStr: res.data.nonceStr,
      //                   package: res.data.package,
      //                   signType: res.data.signType,
      //                   paySign: res.data.paySign,
      //                   user_id: this.data.user_id,
      //                   success(res) {
      //                      console.log(res, '支付成功')
      //                      wx.navigateBack({
      //                         delta:1
      //                      })
      //                   },
      //                   fail(res) {}
      //                })
      //             }
      //          })

      //       } else if (res.cancel) {
      //          console.log('用户点击取消')
      //       }
      //    }
      // })
   },
   end() {
      this.setData({
         flag: false
      })
      setTimeout(() => {
         wx.navigateBack({
            delta: 1
         })
      }, 800)
   }
})