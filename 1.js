// var request = require("request");
// var options = { method: 'POST',
//     url: 'https://api.shuidichou.com/api/cf/v4/user/get-user-case-info',
//     form: {
//         infoUuid: '1504839e-1cdd-4aa3-ab56-277023b34466',
//         userSourceId: 'a7qfDfQr19vQSiN8wa1DMw',
//         AuthorizationV2: '' 
//     },
// };
// todo = () =>{
    // request(options, function (error, response, body) {
    //     if (error) throw new Error(error);
    //     console.log((new Date()),JSON.parse(body).data.caseBaseInfo.amount/100);
    // });
// }
// setInterval(todo, 10000)
var request = require('request');
var iconv = require('iconv-lite'); //引入模块

var options = {
    'method': 'GET',
    'url': 'http://seat.lib.sdu.edu.cn/api.php/users/201822121197',
    'headers': {
        'Host': 'seat.lib.sdu.edu.cn',
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36',
            'Referer': 'http://seat.lib.sdu.edu.cn/Home/Web/space/id/19/day/2019-12-23/floor/0',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-HK;q=0.7', 
        'Cookie': {
            "security_session_verify":"9c985bfea0eaa3565026730c2cc723cc", 
            "Hm_lvt_f38ce10fcdb590711258afeff4dba5a1":"1576844262", 
            "PHPSESSID":"ST-690754-vmOxwthxiXf9uWCAmEsp-cas", 
            "redirect_url":"%2FHome%2FWeb%2Fnew_index", 
            "userid":"201805130168", 
            "user_name":"%E5%B0%B9%E6%B0%B8%E7%90%AA",
            "access_token":"69292082edb936278160a09fac4a36b0",
            "sso_error":0, 
            "Hm_lpvt_f38ce10fcdb590711258afeff4dba5a1":"1576844276", 
            "expire":"2019-12-20+21%3A29%3A11", 
            "uservisit":1
        }
    },
    encoding: 'utf8'
};
request(options, function (error, res, body) { 
  if (error) throw new Error(error);
//   var buf = iconv.decode(body, 'unicode').toString()
  console.log(body);
});
