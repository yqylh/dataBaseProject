exports.joinProj = async(req, res) =>{
    console.log('joinProj\n',req.query)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        let token = await require('./parse-taken.js').parseTaken(req.query.projToken);
        if (token == -1 || token == -2) throw new Error('Token Error')
        console.log(token)
        mysql.u_pInsert(req.query.stuId, token.proj_id, null);
        ok = ()=>{
            res.json({code:0, obj:obj})
            res.end();
        }
        ok();
    } catch(err) {
        console.log(err);
        filed = ()=>{
            res.json({code:-1});
            res.end();
        }
        filed();
    }
}