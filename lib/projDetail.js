exports.projDetail = async(req, res, mysql) =>{
    console.log('projDetail\n', req.query)
    let obj = {
        title: null,
        type: null,
        endtime: null,
        creator: null,
        content: null,
        question: [],
        file: [],
        upload: [],
        questionnaire: null
    }
    try {
        function getProj(proj_id) {
            // console.log('getProj');
            return new Promise((resolve, reject)=>{
                mysql.ProjectQuery(proj_id, (ans)=>{
                    if (ans[0] == undefined) {
                        res.json({code:-1, obj});
                        res.end(); 
                        return;
                    }
                    // console.log(ans[0]);
                    obj.title = ans[0].title;
                    obj.type = ans[0].attributes;
                    obj.endtime = ans[0].timestamp.toISOString();
                    resolve(ans[0]);
                })
            })
        }
        function getArticle(proj) {
            // console.log('getArticle');
            return new Promise((resolve, reject)=>{
                // console.log(proj);
                if (proj.article_id != null) {
                    mysql.ArticleQuery(proj.article_id, (ans)=>{
                        if (ans[0] != undefined) obj.content = ans[0].content;
                        resolve(proj);
                    })
                } else {
                    resolve(proj);
                }
            })
        }
        function getfile(proj) {
            // console.log('getfile');
            return new Promise((resolve, reject)=>{
                if (proj.article_id != null) {
                    mysql.article_fileQuery(proj.article_id, (ans)=>{
                        ans.forEach(element => {
                            obj.file.push({id:element.file_id});
                        });
                        resolve(proj);
                    })
                } else {
                    resolve(proj);
                }
            })
        }
        function getfilename(proj) {
            // console.log('111')
            return new Promise((resolve, reject) =>{
                num = 0;
                // console.log(obj);
                if (num == obj.file.length) resolve(proj);
                for (i = 0; i < obj.file.length; i++){
                    mysql.FileQuery(obj.file[i].id, ans=>{
                        var name;
                        for (k = ans[0].address.length - 1; k >= 0; k--) if (ans[0].address[k] == '/') {
                            name = ans[0].address.substr(k + 1, ans[0].address.length - k);
                            break;
                        }
                        obj.file[num].name = name;
                        num++;
                        if (num == obj.file.length) resolve(proj);
                    })
                }
            })
        }
        function getCreator(proj) {
            return new Promise((resolve, reject) =>{
                mysql.ManagerQueryProj(proj.proj_id, ans=>{
                    mysql.UserQuery(ans[0].user_id, ans=>{
                        obj.creator = ans[0].name;
                        resolve(proj);
                    })
                })
            })
        }
        function getQusetionaire(proj) {
            return new Promise((resolve, reject) =>{
                mysql.QuestionnaireQuery(proj.qn_id, ans=>{
                    obj.questionnaire = {name:ans[0].title, url:ans[0].url};
                    resolve(proj);
                })
            })
        }
        function getQusetion(proj) {
            // console.log(obj);
            return new Promise((resolve, reject) =>{
                mysql.proj_queQuery(proj.proj_id, ans=>{
                    // console.log(ans);
                    if (ans[0] == undefined) {
                        resolve(proj);
                        return;
                    }
                    num = 0;
                    endtime = ans.length;
                    if (num == endtime) resolve(proj);
                    for (i = 0; i < ans.length; i++) {
                        mysql.QuestionQuery(ans[i].que_id, ans=>{
                            obj.question.push({id:ans[0].que_id, content:ans[0].content});
                            num++;
                            if (num == endtime) resolve(proj);
                        })
                    }
                })
            })
        }
        function getUpdate(proj) {
            // console.log('getUpdate');
            return new Promise((resolve, reject) =>{
                mysql.proj_uploadQuery(proj.proj_id, ans=>{
                    if (ans[0] == undefined) {
                        res.json({code:0, obj});
                        res.end(); 
                        return;
                    }
                    num = 0;
                    endtime = ans.length;
                    if (num == endtime) {
                        res.json({code:0, obj});
                        res.end(); 
                    }
                    for (i = 0; i < ans.length; i++) {
                        mysql.UploadQuery(ans[i].upload_id, ans=>{
                            // console.log(ans);
                            obj.upload.push({
                                name: ans[0].name,
                                typeLimit:ans[0].typeLimit,
                                timeLimit:ans[0].timeLimit.toISOString(),
                                sizeLimit:ans[0].sizeLimit,
                                id:ans[0].upload_id
                            });
                            num++;
                            if (num == endtime) {
                                res.json({code:0, obj});
                                res.end(); 
                            }
                        })
                    }
                })
            })
        }
        await getProj(req.query.projId).then(getArticle).then(getfile).then(getfilename)
        .then(getCreator).then(getQusetionaire).then(getQusetion).then(getUpdate);
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