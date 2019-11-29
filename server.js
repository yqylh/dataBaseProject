var MYSQL=require('./mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var multiparty = require('multiparty')
var fs = require("fs");
var encoding = require('encoding');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.listen(2018);

mysql = new MYSQL();
mysql.connect();

process.on('SIGINT', () => {
    console.log('node exit');
    mysql.disconnect();
    process.exit(0);
});

app.post('/register', (req,res) => {
    console.log(req.body);
    if (req.body.stuId == undefined) {
        res.json({code:-1});
        res.end();
        return;
    }
    mysql.UserQuery(req.body.stuId,(ans) =>{
        if (ans[0] != undefined) {
            res.json({code:-1});
            res.end();
            return;
        } else {
            mysql.UserInsert(req.body.stuId, req.body.stuName, null, req.body.stuTel, null, req.body.password, 0);
            res.json({code:0});
            res.end();
            return;
        }
    })
})
app.post('/login', (req,res) => {
    console.log(req.body);
    if (req.body.password == undefined || (req.body.stuId == undefined && req.body.stuTel == undefined)) {
        res.json({code:-1, obj:{}});
        res.end();
        return;
    }
    if (req.body.stuId != undefined) {
        mysql.UserQuery(req.body.stuId, (ans) =>{
            if (ans[0] == undefined) {
                res.json({code:-1, obj:{}});
                res.end();
                return;
            }
            if (ans[0].pwd != req.body.password) {
                res.json({code:-1, obj:{}});
                res.end();
                return;
            }
            res.json({code:0, obj:{isManager:ans[0].isManager}});
            res.end();
            return;
        })
        return;
    }
    if (req.body.stuTel != undefined) {
        mysql.UserQuerytel(req.body.stuTel, (ans) =>{
            // console.log(ans[0]);
            if (ans[0] == undefined) {
                res.json({code:-1, obj:{}});
                res.end();
                return;
            }
            if (ans[0].pwd != req.body.password) {
                res.json({code:-1, obj:{}});
                res.end();
                return;
            }
            res.json({code:0, obj:{isManager:ans[0].isManager}});
            res.end();
            return;
        })
        return;
    }
    // res.cookie('user',2333,{expires: new Date(Date.now() + 100000), httpOnly: true});
})
app.get('/infoMe', (req,res) => {
    console.log(req.query);
    if (req.query.stuId == undefined) {
        res.json({code:-1});
        res.end();
        return;
    }
    obj = {student: {}}
    mysql.UserQuery(req.query.stuId, (ans) =>{
        if (ans[0] == undefined) {
            res.json({code:-1, obj});
            res.end();
            return;
        }
        obj.student.isManager = ans[0].isManager;
        obj.student.stuTel = ans[0].tel;
        obj.student.introduction = ans[0].introduction;
        mysql.ManagerQueryUser(req.query.stuId, (ans)=>{
            obj.student.manager = [];
            console.log(ans);
            if (ans[0] == undefined) {
                res.json({code:0, obj});
                res.end();
                return;
            }
            for (i = 0; i < ans.length; i++) {
                if (i != ans.length - 1) {
                    mysql.ProjectQuery(ans[i].proj_id, (ans)=>{
                        obj.student.manager.push(ans[0].title);
                    })
                }
                else {
                    mysql.ProjectQuery(ans[i].proj_id, (ans)=>{
                        obj.student.manager.push(ans[0].title);
                        res.json({code:0, obj})
                        res.end();
                    })
                }
            }
        })
    })
})
app.get('/actList', (req,res) => {
    console.log(req.query);
    if (req.query.stuId == undefined) {
        res.json({code:-1});
        res.end();
        return;
    }
    obj = {actiList:[]}
    mysql.u_pQueryuser_id(req.query.stuId, (ans)=>{
        if (ans[0] == undefined) {
            res.json({code:0, obj});
            res.end();
            return;
        }
        endlength = ans.length - 1;

        for (var i = 0; i <= endlength; i++) {
            function task1(value1){
                return new Promise((resolve,reject)=>{
                    mysql.ProjectQuery(ans[value1].proj_id, (ans)=>{
                        temp = {};
                        temp.ID = ans[0].proj_id;
                        temp.Title = ans[0].title;
                        temp.Endtime = ans[0].timestamp.toISOString();
                        temp.Type = ans[0].attributes;
                        resolve({p1:temp,p2: value1});
                    })
                });
            }
            function task2(value2){
                return new Promise((resolve,reject)=>{
                    mysql.ManagerQueryProj(temp.ID, (ans)=>{
                        resolve({p1:value2.p1, p2:value2.p2, p3:ans[0].user_id});
                    })
                });
            }
            function task3(value3) {
                return new Promise((resolve, reject)=>{
                    user_id = value3.p3;
                    mysql.UserQuery(user_id, (ans)=>{
                        value3.p1.Creator = ans[0].name;
                        obj.actiList.push(value3.p1);
                        // console.log(obj.actiList);
                        if (value3.p2 == endlength) {
                            // console.log(obj.actiList[0].Endtime);
                            res.json({code:0, obj});
                            res.end();
                        }
                    })
                })
            }
            task1(i).then(task2).then(task3);
        }
    })
})
app.get('/actDetail', (req,res) => {
    console.log(req.query);
    obj = {
        Title: null,
        Type: null,
        EndTime: null,
        Creator: null,
        article: null,
        question: [],
        file: [],
        upload: [],
        Questionnaire: null,
    }
    function getProj(proj_id) {
        // console.log('rungetProj');
        return new Promise((resolve, reject)=>{
            mysql.ProjectQuery(proj_id, (ans)=>{
                if (ans[0] == undefined) {
                    res.json({code:-1, obj});
                    res.end();
                    return;
                }
                // console.log(ans[0]);
                obj.Title = ans[0].title;
                obj.Type = ans[0].attributes;
                obj.EndTime = ans[0].timestamp.toISOString();
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
                    if (ans[0] != undefined) obj.article = ans[0].content;
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
        return new Promise((resolve, reject) =>{
            num = 0;
            for (i = 0; i < obj.file.length; i++){
                mysql.FileQuery(obj.file[i].id, ans=>{
                    // console.log(ans);
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
                    obj.Creator = ans[0].name;
                    resolve(proj);
                })
            })
        })
    }
    function getQusetionaire(proj) {
        return new Promise((resolve, reject) =>{
            mysql.QuestionnaireQuery(proj.qn_id, ans=>{
                obj.Questionnaire = {name:ans[0].title, url:ans[0].url};
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
                for (i = 0; i < ans.length; i++) {
                    mysql.QuestionQuery(ans[i].que_id, ans=>{
                        obj.question.push(ans[0].content);
                        num++;
                        if (num == endtime) {
                            resolve(proj);
                        }
                    })
                }
            })
        })
    }
    function getUpdate(proj) {
        console.log('getUpdate');
        return new Promise((resolve, reject) =>{
            mysql.proj_uploadQuery(proj.proj_id, ans=>{
                if (ans[0] == undefined) {
                    res.json({code:0, obj});
                    res.end();
                    return;
                }
                num = 0;
                endtime = ans.length;
                for (i = 0; i < ans.length; i++) {
                    mysql.UploadQuery(ans[i].upload_id, ans=>{
                        console.log(ans);
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
    getProj(req.query.actId).then(getArticle).then(getfile).then(getfilename)
    .then(getCreator).then(getQusetionaire).then(getQusetion).then(getUpdate);
})
app.post('/takePartIn', (req,res) => {
    console.log(req.body);
    mysql.u_pInsert(req.body.stuId, req.body.proj_id, null);
    res.end(JSON.stringify({code:0}));
})
app.post('/createActivity', (req,res) => {
    console.log(req.body);
    console.log(new Date(req.body.timestamp));
    mysql.ProjectInsert(req.body.title, req.body.attributes,new Date(req.body.timestamp) , null, null, ans=>{
        // console.log(ans);
        mysql.ManagerInsert(ans.insertId,req.body.stuId)
        res.end(JSON.stringify({code:0, obj:{proj_id:ans.insertId}}));
    })
})

app.post('/upload', async (req, res)=>{
    function parseFile(req) {
        return new Promise((resolve, reject) => {
            const form = new multiparty.Form();
            form.parse(req, function(err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                const path = __dirname + "/upload/" + fields.uploadId + '/' + fields.stuId + '/' + files.file[0].originalFilename;
                resolve({fields:fields, file:files.file[0], path:path});
            });
        })
    }
    function checkUpload(temp) {
        return new Promise(resolve =>{
            const uploadid = temp.fields.uploadId[0];
            mysql.UploadQuery(uploadid, (ans)=>{
                if (ans[0].sizeLimit >= temp.file.size && ans[0].timeLimit >= new Date()) resolve(ans[0].upload_id)
                    else resolve(-1);

            })
        })
    }
    function addFile(temp, upload_id) {
        return new Promise(resolve =>{
            const stuId = temp.fields.stuId[0];
            mysql.FileInsert(temp.path, stuId, upload_id, ans=>{
                if (ans == -1) resolve(-1);
                else resolve(ans)
                // console.log(ans);
            });
        })
    }
    function addu_p_file(temp, file_id) {
        return new Promise(resolve =>{
            mysql.u_pQueryall(temp.fields.stuId[0], temp.fields.proj_id[0], ans=>{
                // console.log(ans[0].u_p_id);
                if (ans[0] == undefined) {
                    resolve(-1);
                } else mysql.u_p_fileInsert(ans[0].u_p_id, file_id, ans=>{
                    if (ans == 0) resolve(0);
                    else resolve(-1);
                })
            })
        })
    }
    function writeFile(temp) {
        return new Promise(resolve =>{
            const des_file = __dirname + "/upload/" + temp.fields.uploadId[0] + '/' + temp.fields.stuId[0];
            // console.log(des_file);
            fs.mkdir(des_file, {
                recursive: true  //是否递归,默认false
            }, (err) => {
                if(err){
                    console.log(err);
                    return;
                }
                fs.readdir(des_file, (err, files) => {
                    if (files[0] != undefined) {
                        console.log(files[0]);
                        resolve(-2);
                        return;
                    }
                    fs.readFile( temp.file.path, function (err, data) {
                        if (err) console.log(err);
                        fs.writeFile(temp.path, data, function (err) {
                            if( err ){
                                console.log( err );
                                resolve(-1)
                            }else{
                                resolve(0)
                            }
                        });
                    });
                })
            });
        })
    }
    try {
        const temp = await parseFile(req);
        const a = await checkUpload(temp);
        if (a == -1 ) {
            res.json({code:a});
            res.end();
            return;
        }
        const b = await addFile(temp, a);
        if (b == -1 ) {
            res.json({code:b});
            res.end();
            return;
        }
        const c = await addu_p_file(temp, b);
        if (c == -1 ) {
            res.json({code:c});
            res.end();
            return;
        }
        const write = await writeFile(temp);
        if (write != 0) {
            res.json({code:write});
            res.end();
            return;
        }
        res.json({code:0});
        res.end();
    } catch(err) {
        console.log(err);
    }
})
app.post('/addArticle', async (req, res) =>{
    CreateArticle = () =>{
        return new Promise(resolve=>{
            mysql.ArticleInsert(req.body.text, ans=>{
                resolve(ans.insertId);
            })
        })
    }
    UpdateProj = id =>{
        return new Promise (resolve =>{
            const sql = 'UPDATE Project SET article_id= ? WHERE proj_id = ?'
            const parse = [id, req.body.proj_id];
            mysql.anyUpdate(sql, parse, (ans)=>{
                resolve(ans);
            })
        })
    }
    try {
        let id = await CreateArticle();
        let a = await UpdateProj(id);
        res.json({code:a});
        res.end();
    } catch(err) {
        console.log(err);
    }
})
app.post('/addArticleFile', async (req, res) =>{
    function parseFile() {
        return new Promise((resolve, reject) => {
            const form = new multiparty.Form();
            form.parse(req, function(err, fields, files) {
                if (err) {
                    reject(err);
                    return;
                }
                const path = __dirname + "/article/" + fields.articleId + '/' + files.file[0].originalFilename;
                resolve({fields:fields, file:files.file[0], path:path});
            });
        })
    }
    function writeFile(temp) {
        return new Promise(resolve =>{
            const des_file = __dirname + "/article/" + temp.fields.articleId + '/';
            console.log(des_file);
            fs.mkdir(des_file, {
                recursive: true  //是否递归,默认false
            }, (err) => {
                if(err){
                    console.log(err);
                    return;
                }
                fs.readFile( temp.file.path, function (err, data) {
                    if (err) console.log(err);
                    fs.writeFile(temp.path, data, function (err) {
                        if( err ){
                            console.log( err );
                            resolve(-1)
                        }else{
                            resolve(0)
                        }
                    });
                });
            });
        })
    }
    function addFile(temp) {
        return new Promise(resolve =>{
            mysql.FileInsert(temp.path, null, 0, ans=>{
                if (ans == -1) resolve(-1);
                else resolve(ans)
            });
        })
    }
    try{
        let a = await parseFile();
        console.log(a);
        let b = await writeFile(a);
        const file_id = await addFile(a);
        if (file_id == -1) {
            res.json({code:-1});
            res.end();
            return;
        }
        mysql.article_fileInsert(a.fields.articleId,file_id, ()=>{
            res.json({code:b});
            res.end();
        });
    }catch(err) {
        console.log(err);
    }
})

app.get('/downFile', async (req, res)=>{
    mysql.FileQuery(req.query.fileId, (ans) =>{
        console.log(ans[0].address);
        fs.readFile(ans[0].address, function(err, data){
            if (err) {
                res.writeHead(404);
                res.end("Read file failed!");
                return;
            }
            let name = ans[0].address;
            for (i = name.length - 1; i >= 0; i--){
                if (name[i] == '/') {
                    name = name.substr(i + 1, name.length - i - 1);
                }
            }

            // 下载
            var userAgent = (req.headers['user-agent']||'').toLowerCase();
            if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
                // name = encoding.convert(name, 'UTF8');
                // console.log(name);
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(name));
                fs.createReadStream(ans[0].address).pipe(res);
            } else if(userAgent.indexOf('firefox') >= 0) {
                res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(name)+'"');
            } else {
                res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(name).toString('binary'));
            }
            res.end(data)
        })
    })
})
app.post('/addwjx', (req, res)=>{
    mysql.QuestionnaireInsert(req.body.title, req.body.url, result=>{
        const sql = 'UPDATE Project SET qn_id= ? WHERE proj_id = ?'
        const parse = [result.insertId, req.body.proj_id];
        mysql.anyUpdate(sql, parse, (ans)=>{
            res.json({code:ans});
            res.end();
        })
    })
})
app.post('/addQue', async (req, res) =>{
    console.log(req.body);
    let task = [];
    pushtask = () =>{
        for (let i of req.body.content) {
            console.log(i);
            task.push(
                mysql.QuestionInsert(i, result=>{
                    mysql.proj_queInsert(req.body.proj_id, result.insertId);
                })
            )
        }
    }
    try{
        await pushtask();
        await Promise.all(task);
        res.json({code:0});
        res.end();
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
})
app.post('/ansQue', async (req, res)=>{
    console.log(req.body);
    getu_pid = () =>{
        return new Promise(resolve=>{
            mysql.u_pQueryall(req.body.stuId, req.body.proj_id, ans=>{
                resolve(ans[0].u_p_id);
            })
        })
    }
    let task = [];
    pushtask = (u_p_id) =>{
        for (let i of req.body.ans) {
            // console.log(i);
            task.push(
                mysql.u_p_ansInsert(u_p_id, i.ansContent, i.que_id)
            )
        }
    }
    try{
        let u_p_id = await getu_pid();
        await pushtask(u_p_id);
        await Promise.all(task);
        res.json({code:0});
        res.end();
    }catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
})
app.post('/addScore', async (req, res)=>{
    console.log(req.body);
    getu_pid = () =>{
        return new Promise(resolve=>{
            mysql.u_pQueryall(req.body.stuId, req.body.proj_id, ans=>{
                resolve(ans[0].u_p_id);
            })
        })
    }
    createAward = ()=>{
        return new Promise(resolve=>{
            mysql.AwardScoreInsert(req.body.awardName, req.body.score, ans=>{
                resolve(ans.insertId);
            })
        })
    }
    try{
        let u_p_id = await getu_pid();
        let newAwardId = await createAward();
        const sql = 'UPDATE u_p SET award_id= ? WHERE u_p_id = ?'
        const parse = [newAwardId, u_p_id];
        mysql.anyUpdate(sql, parse, (ans)=>{
            res.json({code:ans});
            res.end();
        })
    }catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    } 
})
app.post('/addUpload', async (req, res)=>{
    console.log(req.body);
    try{
        await mysql.UploadInsert(req.body.stuId, null, new Date(req.body.timeLimit), req.body.sizeLimit, req.body.name, ans=>{
            mysql.proj_uploadInsert(req.body.proj_id, ans.insertId)
        });
        res.json({code:0});
        res.end();
    }catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }    
})
app.post('/deleteFile', async (req, res)=>{
    findpath = ()=>{
        return new Promise(resolve=>{
            mysql.FileQuery(req.body.fileId, ans=>{
                if (ans[0] == undefined) {
                    resolve(-1);
                } else {
                    mysql.FileDelete(ans[0].file_id);
                    resolve(ans[0].address);
                }
            })
        })
    }
    try{
        let path = await findpath();
        console.log(path);
        if (path != -1) {
            fs.unlinkSync(path);
            res.json({code:0});
        }
        else {
            res.json({code:-1});
        }
    }catch(err){
        console.log(err);
        res.json({code:-1});
    }
    res.end();
})