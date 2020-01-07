exports.infoMe = async(req, res, mysql) =>{
    console.log('infoMe\n',req.query)
    let obj = {}
    try {
        if (req.query.stuId == undefined) {
            filed();
            return;
        }
        obj = {}
        mysql.UserQuery(req.query.stuId, (ans) =>{
            if (ans[0] == undefined) {
                filed();
                return;
            }
            obj.tel = ans[0].tel;
            obj.introduction = ans[0].introduction;
            obj.stuId = ans[0].user_id;
            obj.name = ans[0].name;
            obj.mail = ans[0].image;
            obj.isManager = ans[0].isManager;
            if (obj.isManager == 0) {
                ok();
                return;
            }
            mysql.ManagerQueryUser(req.query.stuId, (ans)=>{
                if (ans[0] == undefined) {
                    filed();
                    return;
                }
                for(let i of ans) {obj.manager.push(i.proj_id);}
                ok();
            })
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