exports.modifyProj = async(req, res, mysql) =>{
    console.log('modifyProj\n', req.body)
    let obj = {}
    try {
        let article_id, qn_id, proj_id = req.body.projId;
        await new Promise(resolve=>{
            mysql.ProjectQuery(req.body.projId, async ans=>{
                if (ans[0] == undefined) throw new Error('queryError');
                article_id = ans[0].article_id;
                qn_id = ans[0].qn_id;
                if (article_id == undefined || article_id == null) {
                    await new Promise (resolve=>{
                        mysql.ArticleInsert(req.body.content, ans=>{
                            article_id = ans.insertId;
                            resolve();
                        })
                    })
                }
                else mysql.ArticleUpdate(req.body.content, ans[0].article_id);

                // if (qn_id == undefined || qn_id == null) {
                //     await new Promise (resolve=>{
                //         mysql.QuestionnaireInsert(req.body.title, req.body.questionnaire, ans=>{
                //             qn_id = ans.insertId;
                //             resolve();
                //         })
                //     })
                // }
                // else mysql.QuestionnaireInsert(req.body.content, ans[0].article_id);

                mysql.ProjectUpdate(req.body.title, req.body.type, new Date(req.body.endTime), article_id, qn_id, ans[0].proj_id);
                resolve();
            })
        })

        let Sql = "DELETE FROM proj_que WHERE proj_id = " + req.body.projId;
        mysql.anyQuery(Sql, ans=>{})
        Sql = "DELETE FROM proj_upload WHERE proj_id = " + req.body.projId;
        mysql.anyQuery(Sql, ans=>{})

        let task = [];
        if (req.body.questions != undefined) {
            for (let i of req.body.questions) {
                task.push( 
                    mysql.QuestionInsert(i, result=>{
                        mysql.proj_queInsert(proj_id, result.insertId);
                    })
                )
            }
            await Promise.all(task);
        }
        task = [];
        if (req.body.upload != undefined) {
            for (let i of req.body.upload) {
                task.push(
                    mysql.UploadInsert(req.body.stuId, i.typeLimit, new Date(i.timeLimit), i.sizeLimit, i.name, async ans=>{
                        await mysql.proj_uploadInsert(proj_id, ans.insertId)
                    })
                )
            }
            await Promise.all(task);
        }
        obj.token = require('./create-token').createToken({
            proj_id: proj_id,
            stuId: req.body.stuId,
        });
        obj.projId = proj_id;
        res.json({code:0, obj:obj})
        res.end();

    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}