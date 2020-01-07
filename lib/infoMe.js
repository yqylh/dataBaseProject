exports.infoMe = async(req, res, mysql) =>{
    console.log('infoMe\n',req.query)
    let obj = {}
    try {
        if (req.query.stuId == undefined) {
            res.json({code:-1});
            res.end();
            return;
        }
        obj = {}
        mysql.UserQuery(req.query.stuId, (ans) =>{
            if (ans[0] == undefined) throw new Error('UserQuery error')
            obj.tel = ans[0].tel;
            obj.introduction = ans[0].introduction;
            obj.stuId = ans[0].user_id;
            obj.name = ans[0].name;
            obj.mail = ans[0].image;
            obj.isManager = ans[0].isManager;
            res.json({code:0, obj:obj})
            res.end();
        })
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}