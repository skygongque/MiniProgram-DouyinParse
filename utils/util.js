const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//downloadfile.js
// callback风格
/**
 * 下载单个文件
 */
function downloadFile(type, url, successc, failc) {
  checkAuth(() => {
    wx.showLoading({
      title: '正在下载',
      mask: true
    });
    downloadSaveFile(
      type,
      url,
      () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载成功',
          icon: 'none',
        })
        successc && successc();
      },
      (errMsg) => {
        wx.hideLoading();
        wx.showToast({
          title: errMsg,
          icon: 'none',
        })
        failc && failc();
      }
    );
  })
}

/**
 * 下载多个文件
 */
function downloadFiles(type, urls, completec) {
  let success = 0;
  let fail = 0;
  let total = urls.length;
  let errMsgs = [];

  checkAuth(() => {
    wx.showLoading({
      title: '正在下载',
      mask: true
    })
    for (let i = 0; i < urls.length; i++) {
      downloadSaveFile(
        type,
        urls[i],
        () => {
          success++;
          if (success + fail === total) {
            saveCompleted(success, fail, completec, errMsgs);
          }
        },
        (errMsg) => {
          fail++;
          errMsg && errMsgs.push(`视频${i}${errMsg}`);
          if (success + fail === total) {
            saveCompleted(success, fail, completec, errMsgs);
          }
        }
      );
    }
  })
}

//保存完成
function saveCompleted(success, fail, completec, errMsgs) {
  wx.hideLoading();
  let errMsg = '无';
  if (errMsgs.length) {
    errMsg = errMsgs.join('\n');
  }

  wx.showModal({
    title: `成功${success}项，失败${fail}项`,
    content: `失败信息:\n${errMsg}`,
    showCancel: false,
    success(res) {
      if (res.confirm) {
        completec && completec();
      }
    }
  })
}

//下载文件
function downloadSaveFile(type, url, successc, failc) {
  wx.downloadFile({
    url: url,
    success: res => {
      if (res.statusCode === 200) {
        if (type === 'video') {
           console.log(res.tempFilePath)
          //类型为视频
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              successc && successc();
            },
            fail: res => {
              failc && failc('保存失败');
            }
          })
        } else if (type === 'image') {
          //类型为图片
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: res => {
              successc && successc();
            },
            fail: res => {
              failc && failc('保存失败');
            }
          })
        }else if(type==='file'){
          wx.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              const savedFilePath = res.savedFilePath
              console.log(res)
            }
          })
        }
      } else {
        failc && failc('状态码非200');
      }
    },
    fail: res => {
      console.log(res);
      failc && failc('下载失败'+JSON.stringify(res));
    }
  })
}

//检查权限
function checkAuth(gotc) {
  //查询权限
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
            gotc && gotc();
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
                        gotc && gotc();
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
        gotc && gotc();
      }
    },
    fail() {
      wx.hideLoading();
      wx.showToast({
        title: '获取授权失败',
        icon: 'none',
      })
    }
  })
}



module.exports = {
  formatTime: formatTime,
  downloadFile,
  downloadFiles
}
