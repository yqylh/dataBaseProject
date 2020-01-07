exports.infoMe = async(req, res) =>{
    console.log('infoMe\n',req.query)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        if (req.query.stuId == undefined) {
            filed();
            return;
        }
        obj = {student: {}}
        mysql.UserQuery(req.query.stuId, (ans) =>{
            if (ans[0] == undefined) {
                filed();
                return;
            }
            obj.student.isManager = ans[0].isManager;
            obj.student.stuTel = ans[0].tel;
            obj.student.introduction = ans[0].introduction;
            obj.student.manager = [];
            if (obj.student.isManager == 0) {
                ok();
                return;
            }
            mysql.ManagerQueryUser(req.query.stuId, (ans)=>{
                if (ans[0] == undefined) {
                    filed();
                    return;
                }
                for(let i of ans) {obj.student.manager.push(i.proj_id);}
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