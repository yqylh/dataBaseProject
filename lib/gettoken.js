exports.gettoken = async(req, res, mysql) =>{
    console.log('gettoken\n', req.body)
    let obj = {}
    try {
        mysql.ManagerQuery(req.body.projId, async ans=>{
            obj.token = await require('./create-token').createToken({
                proj_id: req.body.projId,
                stuId: ans[0].user_id,
            });
            res.json({code:0, obj:obj})
            res.end();
        })
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}