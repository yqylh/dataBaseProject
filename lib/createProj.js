exports.createProj = async(req, res, mysql) =>{
    console.log('createProj\n', req.body)
    let obj = {}
    try {
        var article_id, qn_id, proj_id;
        
        article_id = await new Promise(resolve => {
            mysql.ArticleInsert(req.body.content, ans=>{
                resolve(ans.insertId);
            })
        })
        if (req.body.questionnaire == undefined) {
            qn_id = null;
        } else {
            qn_id = await new Promise(resolve =>{
                mysql.QuestionnaireInsert(req.body.title, req.body.questionnaire, ans=>{
                    resolve(ans.insertId);
                })
            })
        }
        console.log(article_id, qn_id)

        await new Promise((resolve) => {
            mysql.ProjectInsert(req.body.title, req.body.type,new Date(req.body.endTime) , article_id, qn_id, ans=>{
                mysql.ManagerInsert(ans.insertId,req.body.stuId)
                proj_id = ans.insertId;
                resolve();
            })
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
        obj.token = await require('./create-token').createToken({
            proj_id: proj_id,
            stuId: req.body.stuId,
        });
        obj.projId = proj_id;
        // console.log(obj)
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