exports.addProjFile = async(req, res) =>{
    console.log('addProjFile\n', req.body)
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        let articleId;

        function parseFile() {
            return new Promise((resolve, reject) => {
                const form = new multiparty.Form();
                form.parse(req, async function(err, fields, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    await mysql.ProjectQuery(fields.projId, ans=>{
                        articleId = ans[0].articleId;
                    })
                    const path = __dirname + "/../article/" + articleId + '/' + files.file[0].originalFilename;
                    resolve({fields:fields, file:files.file[0], path:path});
                });
            })
        }
        function writeFile(temp) {
            return new Promise(resolve =>{
                const des_file = __dirname + "/../article/" + articleId + '/';
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

        let a = await parseFile();
        let b = await writeFile(a);
        const file_id = await addFile(a);
        if (file_id == -1) throw new Error('addFile error')
        mysql.article_fileInsert(articleId, file_id, ()=>{
            ok();
        });
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