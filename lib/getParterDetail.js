exports.getParterDetail = async(req, res) =>{
    console.log('getParterDetail\n',req.query)
    let obj = {
        stuId:[],
        name:[],
        awardName:[],
        score:[]
    }
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        var sql = 'select user_id stuId, Username, name awardName, score FROM ( select user_id, name Username, award_id  from u_p natural join User where proj_id = ' + req.query.proj_id + ' ) X , AwardScore where X.award_id = AwardScore.as_id';
        await mysql.anyQuery(sql, ans=>{
            for (var i of ans) {
                obj.stuId.push(ans[i].stuId);
                obj.name.push(ans[i].Username);
                obj.awardName.push(ans[i].awardName);
                obj.score.push(ans[i].score);
            }
        })
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
