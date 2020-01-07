exports.register = async(req, res, mysql) =>{
    console.log('register\n', req.body)
    let obj = {}
    // const MYSQL = require('./mysql.js');
    // mysql = new MYSQL();
    try {
        if (req.body.stuId == undefined) {
            filed();
            return;
        }
        mysql.UserQuery(req.body.stuId, (ans) =>{
            if (ans[0] != undefined) {
                filed();
                return;
            } else {
                mysql.UserInsert(req.body.stuId, req.body.stuName, null, req.body.stuTel, null, req.body.password, 0);
                ok();
                return;
            }
        })
    } catch(err) {
        console.log(err);
        filed();
    }
    filed = ()=>{
        res.json({code:-1});
        res.end();
    }
    ok = ()=>{
        res.json({code:0, obj:obj})
        res.end();
    }
}