exports.joinProj = async(req, res) =>{
    console.log('joinProj\n',req.query)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        let token = await require('./parse-taken.js').parseTaken(req.query.token);
        if (token == -1 || token == -2) throw new Error('Token Error')
        mysql.u_pInsert(req.query.stuId, token.proj_id, null);
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