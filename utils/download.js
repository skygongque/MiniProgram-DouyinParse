// promise风格

//检查权限
function checkAuth() {
	//查询权限
	return new Promise((resolve, reject) => {
		wx.showLoading({
			title: '检查授权情况',
			mask: true
		})
		wx.getSetting({
			success(res) {
				wx.hideLoading();
				if (!res.authSetting['scope.writePhotosAlbum']) {
					//请求授权
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success() {
							//获得授权，开始下载
							resolve("授权成功")
						},
						fail() {
							wx.showModal({
								title: '',
								content: '保存到系统相册需要授权',
								confirmText: '授权',
								success(res) {
									if (res.confirm) {
										wx.openSetting({
											success(res) {
												if (res.authSetting['scope.writePhotosAlbum'] === true) {
													resolve("授权成功")
												}
											}
										})
									}
								},
								fail() {
									wx.showToast({
										title: '打开设置页失败',
										icon: 'none',
									})
								}
							})
						}
					})
				} else {
					//已有授权
					resolve("授权成功")
				}
			},
			fail() {
				wx.hideLoading();
				wx.showToast({
					title: '获取授权失败',
					icon: 'none',
				})
				reject("获取授权失败")
			}
		})
	})
}


const downLoadVideo = function (url) {
	checkAuth()
		.then(() => {
			wx.showLoading({
				title: '正在下载',
				mask: true
			});
			wx.downloadFile({
				url: url,
				success: res => {
					if (res.statusCode === 200) {
						console.log(res.tempFilePath)
						//类型为视频
						wx.saveVideoToPhotosAlbum({
							filePath: res.tempFilePath,
							success: res => {
								console.log(res);
								wx.hideLoading();
								wx.showToast({
									title: '下载成功',
								})

							},
							fail: err => {
								console.log(err);
								wx.hideLoading();
								wx.showToast({
									title: err
								})
							}
						})
					}
				},
				fail: res => {
					console.log(res);
					wx.hideLoading();
					wx.showToast({
						title: '下载失败'
					})
				}
			})
		})
		.catch(() => {
			// 授权失败
			wx.showToast({
				title: '授权失败'
			})
		})
}


module.exports = {
	downLoadVideo
}