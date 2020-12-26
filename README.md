# 体验二维码
![](pics/gh_0398b035b95e_258%20(1).jpg)  

UI 比较丑不要介意，功能还是在的  

# 使用方法

## 注册小程序

https://mp.weixin.qq.com/  
登录小程序后台,在 开发 - 开发设置 中复制小程序 **AppID** 备用    

## 下载微信开发者工具
https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

## 下载源码 并在微信开发者工具导入项目

源码地址  
```
https://github.com/skygongque/MiniProgram-DouyinParse
```
![](pics/01.png)
## 开通云开发
![](pics/02.png)

## 查看云开发的环境id
![](pics/03.png)

## 初始化云开发环境
![](pics/04.png)

## 上传并部署云函数
![](pics/05.png)

## 小程序后台 配置downloadFile合法域名
![](pics/06.png)

以下域名与[云函数文件](./cloud/parseVideo/index.js)的94行的数组对应（但要注意一处是http一处是https），可以自行增加提高效率。
```
https://v26-dy-cold.ixigua.com;https://v27-dy-cold.ixigua.com;https://v29-dy-cold.ixigua.com;https://v3-dy-cold.ixigua.com;https://v5-dy-b.ixigua.com;https://v5-dy-c.ixigua.com;https://v5-dy-e.ixigua.com;https://v5-dy-f.ixigua.com;https://v5-dy-g.ixigua.com;https://v5-dy-h.ixigua.com;https://v5-dy-i.ixigua.com;https://v5-dy-j.ixigua.com;https://v6-dy-cold.ixigua.com;https://v9-dy-cold.ixigua.com;https://v92-dy.ixigua.com;https://v95-dy-a.ixigua.com;https://v95-dy.ixigua.com;https://txmov2.a.yximgs.com;
```
**抖音又换了很多域名而小程序后台最对可以配置200个downloadFile域名有点不够用了** 

## 复制抖音分享链接使用, 可以上传提交审核 发布
![](pics/07.png)
