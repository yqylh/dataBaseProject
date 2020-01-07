exports.parseTaken = async (token) =>{
    var createMd5 = require('./create-md5').createMd5;
    var jwt = require('jsonwebtoken');
    parse = ()=>{
        return new Promise((resolve)=>{
            jwt.verify(token,'&TSr1X#vTrO#D*Y--b$jkJlXXoG!43wS', (err, token) => {
                if (err) {
                    console.log(err);
                    resolve(-1)
                }
                if (token.iss != createMd5({
                    proj_id: token.proj_id,
                    stuId: token.stuId,
                    time:token.time
                })) {
                    resolve(-2)
                } else {
                    resolve(token)
                }
            })
        })
    }
    let ans;
    await parse().then((obj)=>{ans = obj});
    // ans = ans.then((obj)=>{return })
    return ans;
}
