exports.modifyProj = async(req, res) =>{
    console.log('modifyProj\n', req.body)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();

        let article_id, qn_id, proj_id = req.body.projId;
        await mysql.ProjectQuery(req.body.projId, ans=>{
            if (ans[0] == undefined) throw new Error('queryError');
            ProjectUpdate(req.body.title, req.body.type, new Date(req.body.endtime), ans[0].article_id, ans[0].qn_id, ans[0].proj_id);
            article_id = ans[0].article_id;
            qn_id = ans[0].qn_id;
        })
        mysql.ArticleUpdate(req.body.content, article_id);
        mysql.QuestionnaireUpdate(req.body.title, req.body.questionnaire, qn_id);

        let Sql = "DELETE FROM proj_que WHERE proj_id = " + req.body.projId;
        await mysql.anyQuery(Sql, ans=>{})
        let Sql = "DELETE FROM proj_upload WHERE proj_id = " + req.body.projId;
        await mysql.anyQuery(Sql, ans=>{})

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
    }}