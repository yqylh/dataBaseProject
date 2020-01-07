exports.updateMe = async(req, res, mysql) =>{
    console.log('updateMe\n',req.body)
    try {
        if (req.body.stuId == undefined) {
            filed();
            return;
        }
        mysql.UserQuery(req.body.stuId, ans=>{
            // console.log(ans);
            mysql.UserUpdate(req.body.name, req.body.introduction, req.body.tel, req.body.mail, ans[0].pwd, req.body.stuId, ans[0].isManager);
            ok();
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
        res.json({code:0})
        res.end();
    }
}