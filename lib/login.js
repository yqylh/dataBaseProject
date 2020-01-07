exports.login = async(req, res, mysql) =>{
    console.log('login\n',req.body)
    let obj = {}
    filed = ()=>{
        res.json({code:-1});
        res.end();
    }
    ok = ()=>{
        res.json({code:0, obj:obj})
        res.end();
    }
    try {
        if (req.body.password == undefined || (req.body.stuId == undefined && req.body.stuTel == undefined)) throw new Error('error 8')
        if (req.body.stuId != undefined) {
            mysql.UserQuery(req.body.stuId, (ans) =>{
                if (ans[0] == undefined) {filed(); return;}
                if (ans[0].pwd != req.body.password) {filed(); return;}
                obj.isManager = ans[0].isManager;
                obj.name = ans[0].name;
                ok();
                return;
            })
            return;
        }
        if (req.body.stuTel != undefined) {
            mysql.UserQuerytel(req.body.stuTel, (ans) =>{
                if (ans[0] == undefined) {filed(); return;}
                if (ans[0].pwd != req.body.password) {filed(); return;}
                obj.isManager = ans[0].isManager;
                obj.name = ans[0].name;
                ok();
                return;
            })
            return;
        }
    
    } catch(err) {
        console.log(err);
        filed();
    }
}