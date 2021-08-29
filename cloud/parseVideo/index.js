// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const request = require('request');
// const fs = require('fs');

cloud.init('mike-52kvs');


function requestNotRedirect(url) {
    /* 请求url并不允许重定向 */
    return new Promise((resolve, reject) => {
        var options = {
            uri: url,
            headers: {
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
            followRedirect: false,
            resolveWithFullResponse: true,
        };
        request.get(options, function (error, response, body) {
            // console.error('error:', error); // Print the error if one occurred
            // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // console.log('body:', body); // Print the HTML for the Google homepage.
            resolve(response)
        })
    })

}


async function getParam(url) {
    const res = await requestNotRedirect(url)
    // console.log(res.body)
    var pattern = new RegExp("video\/(.*?)\/.*?mid=(.*?)&");
    if (pattern.test(res.body)) {
        item_id = RegExp.$1;
        mid = RegExp.$2;
        // console.log(item_id, mid);
        return {
            'item_id': item_id,
            'mid': mid
        }
    } else {
        return null
    }

}

async function getItemInfo(item_id, mid) {
    var url = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_id}`
    // console.log(url)
    try {
        var options = {
            uri: url,
            headers: {
                'authority': 'www.iesdouyin.com',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
                'content-type': 'application/x-www-form-urlencoded',
                'accept': '*/*',
                'referer': `https://www.iesdouyin.com/share/video/${item_id}/?region=CN&mid=${mid}&u_code=15b9142gf&titleType=title&utm_source=copy_link&utm_campaign=client_share&utm_medium=android&app=aweme`,
                'accept-language': 'zh-CN,zh;q=0.9,en-GB;q=0.8,en;q=0.7'
            }
        };
        var res = await rp(options)
        return JSON.parse(res);
    } catch (err) {
        console.log(err)
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

async function parse(res_json) {
    var playwm = res_json.item_list ? res_json['item_list'][0]['video']['play_addr']['url_list'][0] : null
    if (playwm) {
        var tested = false;
        var try_count = 0;
        var paly_address = playwm.replace('playwm', 'play')
        var cover = res_json['item_list'][0]['video']['origin_cover']['url_list'][0];
        // 尝试5次 使得realAddress尽可能在downloadFile合法域名中
        for (var i = 1; i < 5; i++) {
            try_count += 1;
            var realAddress = await getRealAddress(paly_address);
            console.log(realAddress);
            
            // downloadFileUrlsStr 填写小程序后台配置downloadfile合法域名（使用逗号隔开）；
            var downloadFileUrlsStr = "https://txmov2.a.yximgs.com;https://v1-cold.douyinvod.com;https://v1-y.douyinvod.com;https://v1.douyinvod.com;https://v11-x.douyinvod.com;https://v11.douyinvod.com;https://v26-cold.douyinvod.com;https://v26.douyinvod.com;https://v29-cold.douyinvod.com;https://v29.douyinvod.com;https://v3-a.douyinvod.com;https://v3-b.douyinvod.com;https://v3-c.douyinvod.com;https://v3-cold.douyinvod.com;https://v3-d.douyinvod.com;https://v3-e.douyinvod.com;https://v3-x.douyinvod.com;https://v3-y.douyinvod.com;https://v3-z.douyinvod.com;https://v5-cold.douyinvod.com;https://v5-coldb.douyinvod.com;https://v5-coldc.douyinvod.com;https://v5-coldy.douyinvod.com;https://v5-e.douyinvod.com;https://v5-f.douyinvod.com;https://v5-g.douyinvod.com;https://v5-h.douyinvod.com;https://v5-i.douyinvod.com;https://v5-j.douyinvod.com;https://v6-cold.douyinvod.com;https://v6-x.douyinvod.com;https://v6-y.douyinvod.com;https://v6-z.douyinvod.com;https://v6.douyinvod.com;https://v83-c.douyinvod.com;https://v83-d.douyinvod.com;https://v83-x.douyinvod.com;https://v83-y.douyinvod.com;https://v83-z.douyinvod.com;https://v83.douyinvod.com;https://v9-cold.douyinvod.com;https://v9-x.douyinvod.com;https://v9-z.douyinvod.com;https://v9.douyinvod.com;https://v95.douyinvod.com;"
            var downloadFileUrlsList = downloadFileUrlsStr.split(';')
            downloadFileUrlsList.slice(-1) == '' ? downloadFileUrlsList = downloadFileUrlsList.slice(0,-1) : downloadFileUrlsList = downloadFileUrlsList;
            var downloadFileUrls = downloadFileUrlsList.map((e)=>{
                return e.replace('https','http');
            });
            for (var j = 0; j < downloadFileUrls.length; j++) {
                if (realAddress.search(downloadFileUrls[j]) !== -1) {
                    tested = true;
                    break
                }
            }
            if (tested == true) break;
        }
        return {
            'code': 1,
            'tryCount': try_count,
            'tested': tested,
            'playAddress': realAddress,
            'cover': cover
        }
    }
}


async function getRealAddress(url) {
    const res = await requestNotRedirect(url);
    // console.log(res.body)
    var pattern = new RegExp('href=\"(.*?)\"');
    if (pattern.test(res.body)) {
        return RegExp.$1;
    }

}


async function main(url) {
    var params = await getParam(url);
    // console.log(params)
    if (params) {
        var res_json = await getItemInfo(params.item_id, params.mid)
        var result = await parse(res_json);
        return result
    } else {
        return {
            'code': 0
        }
    }
}

// test
// !async function () {
//     var res = await main('https://v.douyin.com/JJTDEKL');
//     console.log(res)
// }()


// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()
    return main(event.url)
}