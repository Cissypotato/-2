// pages/personal/order/order.js
const app = getApp()
let appUrl = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isArr1: true,
    isArr2: false,
    isArr3: false,
    isAddMoney: false,
    order_data: {
      num: 1
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function () {
    let user_id = wx.getStorageSync("token")
    console.log(user_id)
    this.setData({
      user_id
    })
    this.getInitData()
  },
  getInitData() {
    let user_id = wx.getStorageSync("token")
    wx.request({
      url: 'https://ljjz.guaishe.com/index.php/index/login/returnOrder',
      data: {
        user_id
      },
      success: (res) => {
        console.log(res)
        let arr1 = res.data//全部
        let arr2 = []//待服务
        let arr3 = []//已完成
        console.log(res)
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i].status == 1) {
            arr2.push(arr1[i])
          } else if (arr1[i].status == 2) {
            arr3.push(arr1[i])
          }
        }
        console.log(arr3)
        this.setData({
          arr1,
          arr2,
          arr3
        })
      },
    })
  },
  changeArr(e) {
    let arr = e.currentTarget.dataset.arr
    console.log(arr)
    if (arr == 1) {
      this.setData({
        isArr1: true,
        isArr2: false,
        isArr3: false,
      })
    } else if (arr == 2) {
      this.setData({
        isArr1: false,
        isArr2: true,
        isArr3: false,
      })
    } else if (arr == 3) {
      this.setData({
        isArr1: false,
        isArr2: false,
        isArr3: true,
      })
    }

  },
  addMoney(e) {//点击超时加费
    let order_id = e.currentTarget.dataset.id

    wx.request({
      url: 'https://ljjz.guaishe.com/index.php/index/pay/overDesc',
      data: { order_id },
      success: (result) => {
        console.log(result)
        let order = result.data.data
        let order_data = this.data.order_data
        order_data.price = order.price
        this.setData({
          order,
          isAddMoney: true,
          order_data,
          order_id
        })
      },
    })
  },
  add() {
    let order_data = this.data.order_data
    order_data.num++
    order_data.price = order_data.num * this.data.order.price
    this.setData({
      order_data
    })
  },
  reduce() {
    let order_data = this.data.order_data
    if (order_data.num <= 1) {
      wx.showToast({
        icon: "none",
        title: '不能再减啦',
      })
    } else {
      order_data.num = order_data.num - 1
      order_data.price = order_data.num * this.data.order.price
      this.setData({
        order_data
      })
    }
  },
  handleCover() {
    let isAddMoney = !this.data.isAddMoney
    this.setData({
      isAddMoney
    })
  },
  blueclick() {
    console.log("阻止冒泡")
  },

  move() {
    console.log('move')
  },
  confirm() {//确认支付
    let user_id = this.data.user_id
    let order_id = this.data.order_id
    wx.request({
      url: 'https://ljjz.guaishe.com/index.php/index/pay/overTime?=4&=8&num=2',
      data: {
        order_id,
        user_id,
        num: this.data.order_data.num
      },
      success: (result) => {
        if(result.data.code==200){
          let order_id=result.data.order_id
          this.pay(order_id)
        }
        console.log(result)
      },
    })



    // wx.requestPayment()

  },
  pay(id) {//支付
    wx.login({
      complete: (res) => {
        if(res.code){
          wx.request({
            url: 'https://ljjz.guaishe.com/index.php/index/pay/payTime',
            data:{
              id:id,
              code:res.code,
            },
            success: (res) => {
              console.log(res)
              if (res.errMsg == "request:ok") {
                let data = res.data
                wx.requestPayment(
                  {
                    'timeStamp': data.timeStamp,
                    'nonceStr': data.nonceStr,
                    'package': data.package,
                    'signType': data.signType,
                    'paySign': data.paySign,
                    'success': (res) => {
                      console.log(res)
                      this.setData({ isAddMoney: false })
                      this.getInitData()
                      wx.showToast({
                        icon: "none",
                        title: '支付成功',
                      }, 800)
                    
                       
                     
      
                      //   wx.navigateBack({
                      //     delta: 2
                      //   })
      
      
                    },
      
                  })
              }
      
            }
          })
        }
      },
    })
   
  }
})