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
      isArr3: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    let user_id = wx.getStorageSync("token")
    this.setData({
      user_id
    })
    wx.request({
        url: appUrl + '/index.php/index/user/myOrder',
      data: {
        user_id
      },
      success: (res) => {
          let arr = res.data
          let arr1=[]
          let arr2 = []
          let arr3 = []
        console.log(res)
        for(let i=0;i<arr.length;i++){

            if(arr[i].status==1){
                arr2.push(arr[i])
            } else if (arr[i].status == 2){
                arr3.push(arr[i])
            }else{
                arr1.push(arr[i])
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
    toConfirmOrder(e){
        let id=e.currentTarget.dataset.id
       
            wx.navigateTo({
                url: './confirmOrder/confirmOrder?id=' + id,
            }) 
       
    },
    toLogin() {
        wx.navigateTo({
            url: '../../index/login/login'
        })
    }
 
})