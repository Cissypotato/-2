//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
    },
    globalData: {
        userInfo: null,
        url: 'https://ljjz.guaishe.com/'
    },
    alert(k) { //错误警告
        wx.showToast({
            title: k,
            icon: 'none',
            duration: 2000,
        })
    },
})