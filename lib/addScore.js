exports.addScore = async(req, res, mysql) =>{
    console.log('addScore\n',req.body)
    let obj = {}
    try {
        getu_pid = () =>{
            return new Promise(resolve=>{
                mysql.u_pQueryall(req.body.partnerId, req.body.projId, ans=>{
                    resolve(ans[0].u_p_id);
                })
            })
        }
        createAward = ()=>{
            return new Promise(resolve=>{
                mysql.AwardScoreInsert(req.body.awardName, req.body.score, ans=>{
                    resolve(ans.insertId);
                })
            })
        }
        let u_p_id = await getu_pid();
        let newAwardId = await createAward();
        const sql = 'UPDATE u_p SET award_id= ? WHERE u_p_id = ?'
        const parse = [newAwardId, u_p_id];
        mysql.anyUpdate(sql, parse, (ans)=>{})
        
        res.json({code:0, obj:obj})
        res.end();
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}