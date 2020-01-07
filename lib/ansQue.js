exports.ansQue = async(req, res) =>{
    console.log('ansQue\n', req.body)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        getu_pid = () =>{
            return new Promise(resolve=>{
                mysql.u_pQueryall(req.body.stuId, req.body.projId, ans=>{
                    resolve(ans[0].u_p_id);
                })
            })
        }
        let task = [];
        pushtask = (u_p_id) =>{
            for (let i of req.body.ans) {
                task.push(
                    mysql.u_p_ansInsert(u_p_id, i.ansContent, i.queId)
                )
            }
        }
        let u_p_id = await getu_pid();
        await pushtask(u_p_id);
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