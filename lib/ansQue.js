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
        let u_p_id = await getu_pid();
        for (let i of req.body.ans) {
            const sql = 'delete from u_p_ans where u_p_id = ' + u_p_id + ' and que_id = ' + i.queId;
            task.push(
                mysql.anyQuery(sql, (ans)=>{}),
                mysql.u_p_ansInsert(u_p_id, i.ansContent, i.queId)
            )
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