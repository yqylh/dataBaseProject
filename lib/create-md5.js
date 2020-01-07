exports.createMd5 = (UserInfo) =>{
    var crypto = require('crypto');
    var hash = crypto.createHash('md5');    
    hash.update(JSON.stringify(UserInfo));
    return hash.digest('hex')
}