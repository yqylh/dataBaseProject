exports.getParterDetail = async(req, res) =>{
    console.log('getParterDetail\n',req.query)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        var sql = 'select user_id stuId, Username, name awardName, score FROM ( select user_id, name Username, award_id  from u_p natural join User where proj_id = ' 
            + req.query.projId + ' ) X , AwardScore where X.award_id = AwardScore.as_id union select user_id, name Username, null, null from u_p natural join User where proj_id = '
            + req.query.projId +' and award_id is null';
        await new Promise(resolve =>{
            mysql.anyQuery(sql, ans=>{
                obj.list = [];
                for (var i of ans) {
                    if(i.awardName == null) i.awardName = "";
                    if(i.score == null) i.score = "";
                    obj.list.push({
                        stuId:i.stuId,
                        name:i.Username,
                        awardName:i.awardName,
                        score:i.score
                    })
                }
                resolve();
            })
        })
        res.json({code:0, obj:obj})
        res.end();
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}
