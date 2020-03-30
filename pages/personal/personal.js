Page({
    data: {},
    onLoad: function() {
       
    },
    onShow: function() {
        let user_id = wx.getStorageSync("token")
        this.setData({
            user_id
        });
        wx.request({
            url: getApp().globalData.url + '/index.php/index/user/personal',
            data: {
                id: user_id
            },
            success: (res) => {
                console.log(res.data);
                this.setData({
                    init_data: res.data,
                    user_id: user_id
                });
            },
        });

    },
    onPullDownRefresh() {//下拉刷新
        wx.showLoading({
            title: '数据刷新中',
            mask: true
        });    
        wx.request({
            url: getApp().globalData.url + '/index.php/index/user/personal',
            data: {
                id: this.data.user_id
            },
            success: (res) => {
                let then = this;
                wx.showNavigationBarLoading();
                setTimeout(function () {
                    wx.showToast({
                        title: '数据刷新成功',
                        duration: 1000
                    });
                    then.setData({
                        init_data: res.data
                    });
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                }, 1000);
            },
        });
    },
    toPages(e) {
        let id = e.currentTarget.dataset.id;
        if (id == 1) {
            wx.navigateTo({
                url: './scoring/scoring'
            })
        } else if (id == 2) {
            wx.navigateTo({
                url: './myTask/myTask'
            })
        } else if (id == 5) {
            wx.navigateTo({
                url: './order/order'
            })
        } else if (id == 6) {//实名认证成为志愿者
            wx.navigateTo({
                url: './register/register'
            })
        } else if (id == 7) {
            wx.navigateTo({
                url: '../index/login/login'
            })
        } else if (id == 8) {
            wx.navigateTo({
                url: './upTask/upTask'
            })
        } else if (id == 9) {
            wx.navigateTo({
                url: './taskReview/taskReview'
            })
        } else if (id == 10) {
            wx.navigateTo({
                url: './projectAccept/projectAccept'
            })
        } else if (id == 11) {
            wx.navigateTo({
                url: './projectAccept/projectAccept'
            })
        }
    },
})