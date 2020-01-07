exports.ProjList = async(req, res, mysql) =>{
    console.log('ProjList\n', req.query)
    let obj = {projList:[]}
    try {
        if (req.query.stuId == undefined) {
            res.json({code:-1});
            res.end();
            return;
        }
        mysql.u_pQueryuser_id(req.query.stuId, (ans)=>{
            if (ans[0] == undefined) {
                filed(); return;
            }
            endlength = ans.length - 1;
            for (var i = 0; i <= endlength; i++) {
                function task1(value){
                    return new Promise((resolve,reject)=>{
                        mysql.ProjectQuery(ans[value].proj_id, (ans)=>{
                            temp = {};
                            temp.projId = ans[0].proj_id;
                            temp.title = ans[0].title;
                            temp.endtime = ans[0].timestamp.toISOString();
                            temp.type = ans[0].attributes;
                            resolve({p1:temp,p2: value});
                        })
                    });
                }
                function task2(value){
                    return new Promise((resolve,reject)=>{
                        mysql.ManagerQueryProj(temp.projId, (ans)=>{
                            resolve({p1:value.p1, p2:value.p2, p3:ans[0].user_id});
                        })
                    });
                }
                function task3(value) {
                    user_id = value.p3;
                    mysql.UserQuery(user_id, (ans)=>{
                        value.p1.creator = ans[0].name;
                        obj.projList.push(value.p1);
                        if (value.p2 == endlength) ok()
                    })
                }
                task1(i).then(task2).then(task3);
            }
        })    
    } catch(err) {
        console.log(err);
        filed();
    }
    filed = ()=>{
        res.json({code:-1, obj:obj});
        res.end();
    }
    ok = ()=>{
        res.json({code:0, obj:obj})
        res.end();
    }
}