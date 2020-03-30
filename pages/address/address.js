// pages/personal/address/address.js
const app = getApp()
let appUrl = app.globalData.url
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    isLogin: false,
    hasAddress:true
  },
   onLoad: function (options) {
       console.log(options)
     let services_id = options.services_id
     console.log(services_id)
     this.setData({
       services_id
     })
  },
  onShow: function (options) {
    
    let user_id=wx.getStorageSync("token")
    // console.log(user_id)
    this.setData({
      user_id,
    })
    wx.request({
      url: appUrl + '/index.php/index/useraddress/address_list',
      data: {
          user_id
      },
      success: (res) => {
        console.log(res)
        console.log(res.data.info)
        if (res.data.info === "暂无地址") {
          this.setData({
            hasAddress: false
          })
        } else {
          this.setData({
            hasAddress: true,
            addressList: res.data.info
          })
        }

      },
    })
  },

  toAddAdress(){//新建地址

    wx.navigateTo({
      url: './addAddress/addAddress',
    })

  },
  handleChange(event){
    let id = event.currentTarget.dataset.id
    // let addressList=this.data.addressList
    // for (let i=0;i<addressList.length;i++){
    //     if(id==addressList[i].id){
    //         addressList[i]['default']==2
    //         this.setData({
    //             addressList
    //         })
    //     }
    // }
    // wx.request({
    //     url: appUrl + '/index.php/index/address/select_address',
    //   data: {
    //     "id": id,
    //     user_id: wx.getStorageSync('token')
    //   },
    //   success: (res) => {
    //     if (res.data.state) {

    //           this.onShow()
    //     }
         
    //   },
    // })
    wx.redirectTo({
        url: '../order/order?address_id='+id+'&service_id='+this.data.services_id,
    })
  },
  deleteAddress(event){//删除地址
   let id=event.currentTarget.dataset.id
    wx.request({
      url: appUrl + '/index.php/index/useraddress/del_address',
      data: {
        "id":id,
        user_id:wx.getStorageSync("token"),
      },
      success: (res)=> {
        if(res.data.state){
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
            success: (res) =>{
              this.onShow()
             },
            
          })
        }
      },
    })

  },
  
  editAddress:function(event){
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: './addAddress/addAddress?id='+id,
    })
  },
  
 

//   onShow: function () {
//     this.getAddress()
//   },

  toLogin() {
    wx.navigateTo({
      url: '../../../index/login/login'
    })
  }
})