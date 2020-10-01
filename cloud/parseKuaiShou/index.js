// 云函数入口文件
const cloud = require('wx-server-sdk');
const rp = require('request-promise');
const request = require('request');

cloud.init('mike-52kvs');

function getHtml(url) {
  var options = {
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      // Cookie是必要的，写死可能会被封
      'Cookie': 'did=web_b93a280744384c2aaa6d0967d8730c5e; didv=1598775985000; sid=2c06addd759b077b402d0263',
      // did=web_b93a280744384c2aaa6d0967d8730c5e; didv=1598775985000; sid=2c06addd759b077b402d0263;
    }
  };
  return rp(options);
}

async function parse(url) {
    let res = await getHtml(url);
    let hasPageData = new RegExp(/window\.pageData=(.*?)<\/script>/);
    if (hasPageData.test(res)) {
      jsonData = JSON.parse(RegExp.$1);
      return {
        'playAddress': jsonData["video"]['srcNoMark'],
        'code': 0,
        'tested': true,
      }
    } else {
      return {
        'code': -1
      }
    }
}

// !async function(){
//   var result = await parse("https://v.kuaishou.com/8esN2u");
//   console.log(result)
// }()
// getHtml("https://v.kuaishou.com/8esN2u").then((res => {
//   let hasPageData = new RegExp(/window\.pageData=(.*?)<\/script>/);
//   if (hasPageData.test(res)) {
//     jsonData = JSON.parse(RegExp.$1);
//     // console.log(jsonData);
//     console.log(jsonData["video"]['srcNoMark']) 
//   }else{
//     // 需要验证码
//     console.log('not match')
//   }
// }))


// 云函数入口函数
exports.main = async (event, context) => {
  let result = await parse(event.url);
  return result;
}

