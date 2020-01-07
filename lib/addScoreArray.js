exports.addScoreArray = async(req, res, mysql) =>{
    console.log('addScoreArray\n',req.body)
    let obj = {}
    try {
        getu_pid = (i) =>{
            return new Promise(resolve=>{
                mysql.u_pQueryall(req.body.ScoreArray[i].stuId, req.body.projId, ans=>{
                    resolve(ans[0].u_p_id);
                })
            })
        }
        createAward = (i)=>{
            return new Promise(resolve=>{
                mysql.AwardScoreInsert(req.body.ScoreArray[i].awardName, req.body.ScoreArray[i].score, ans=>{
                    resolve(ans.insertId);
                })
            })
        }
        todos = async (i)=>{
            let u_p_id = await getu_pid(i);
            let newAwardId = await createAward(i);
            console.log(u_p_id, newAwardId);
            const sql = 'UPDATE u_p SET award_id= ? WHERE u_p_id = ?'
            const parse = [newAwardId, u_p_id];
            mysql.anyUpdate(sql, parse, (ans)=>{})
        }
        let task = [];
        for (let i = 0; i < req.body.ScoreArray.length; i++) {
            task.push(todos(i));
        }
        await Promise.all(task);
        res.json({code:0, obj:obj})
        res.end();
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}