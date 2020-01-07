exports.addScoreArray = async(req, res) =>{
    console.log('addScoreArray\n',req.body)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        getu_pid = (i) =>{
            return new Promise(resolve=>{
                mysql.u_pQueryall(req.body.partnerId[i], req.body.projId, ans=>{
                    resolve(ans[0].u_p_id);
                })
            })
        }
        createAward = (i)=>{
            return new Promise(resolve=>{
                mysql.AwardScoreInsert(req.body.awardName[i], req.body.score[i], ans=>{
                    resolve(ans.insertId);
                })
            })
        }
        todos = async (i)=>{
            let u_p_id = await getu_pid(i);
            let newAwardId = await createAward(i);
            const sql = 'UPDATE u_p SET award_id= ? WHERE u_p_id = ?'
            const parse = [newAwardId, u_p_id];
            mysql.anyUpdate(sql, parse, (ans)=>{})
        }
        let task = [];
        for (let i = 0; i < req.body.score.length; i++) {
            task.push(todos(i));
        }
        await Promise.all(task);
        ok();
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