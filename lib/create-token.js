exports.createToken = function(UserInfo) {
    // return new Promise((resolve, reject) => {
        var jwt = require('jsonwebtoken');
        var createMd5 = require('./create-md5').createMd5;
        UserInfo.time = new Date().getTime();
        var token = jwt.sign(UserInfo, '&TSr1X#vTrO#D*Y--b$jkJlXXoG!43wS', {
            expiresIn:60*60*24*90, // 90day
            issuer:createMd5(UserInfo)
        })
        return token;
    // })
}