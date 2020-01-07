exports.createProj = async(req, res) =>{
    console.log('createProj\n', req.body)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        
        let article_id, qn_id, proj_id;
        
        await mysql.ArticleInsert(req.body.content, ans=>{
            article_id = ans.insertId;
        })
        await mysql.QuestionnaireInsert(req.body.title, req.body.questionnaire, ans=>{
            qn_id = ans.insertId;
        });
        await mysql.ProjectInsert(req.body.title, req.body.type,new Date(req.body.endtime) , article_id, qn_id, ans=>{
            proj_id = ans.insertId;
            mysql.ManagerInsert(ans.insertId,req.body.stuId)
        })

        let task = [];
        for (let i of req.body.questions) {
            task.push(
                mysql.QuestionInsert(i, result=>{
                    mysql.proj_queInsert(proj_id, result.insertId);
                })
            )
        }
        await Promise.all(task);
        task = [];
        for (let i of req.body.upload) {
            task.push(
                mysql.UploadInsert(req.body.stuId, i.typeLimit, new Date(i.timeLimit), i.sizeLimit, i.name, async ans=>{
                    await mysql.proj_uploadInsert(proj_id, ans.insertId)
                })
            )
        }
        await Promise.all(task);

        obj.token = require('./create-token').createToken({
            proj_id: proj_id,
            stuId: stuId,
        });
        obj.projId = ans.insertId;
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