var request = require("request");
var options = { method: 'POST',
    url: 'https://api.shuidichou.com/api/cf/v4/user/get-user-case-info',
    form: {
        infoUuid: '1504839e-1cdd-4aa3-ab56-277023b34466',
        userSourceId: 'a7qfDfQr19vQSiN8wa1DMw',
        AuthorizationV2: '' 
    },
};
todo = () =>{
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log((new Date()),JSON.parse(body).data.caseBaseInfo.amount/100);
    });
}
setInterval(todo, 10000)