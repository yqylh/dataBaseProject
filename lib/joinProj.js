exports.joinProj = async(req, res, mysql) =>{
    console.log('joinProj\n',req.query)
    let obj = {}
    try {
        let token = await require('./parse-taken.js').parseTaken(req.query.projToken);
        if (token == -1 || token == -2) throw new Error('Token Error')
        console.log(token)
        mysql.u_pQueryall(req.query.stuId, token.proj_id, ans=>{
            if (ans[0] == undefined) {
                mysql.u_pInsert(req.query.stuId, token.proj_id, null);
            }
            res.json({code:0, obj:obj})
            res.end();
        })
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}