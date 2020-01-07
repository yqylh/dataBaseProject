exports.upload = async(req, res, mysql) =>{
    console.log('upload\n'+req.body)
    var fs = require('fs')
    var multiparty = require('multiparty')
    let obj = {}
    try {
        function parseFile(req) {
            return new Promise((resolve, reject) => {
                const form = new multiparty.Form();
                form.parse(req, function(err, fields, files) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const path = __dirname + "/../upload/" + fields.uploadId + '/' + fields.stuId + '/' + files.file[0].originalFilename;
                    resolve({fields:fields, file:files.file[0], path:path});
                });
            })
        }
        function checkUpload(temp) {
            return new Promise(resolve =>{
                const uploadid = temp.fields.uploadId[0];
                mysql.UploadQuery(uploadid, (ans)=>{
                    if (ans[0] == undefined) {resolve(-1);return;}
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
                mysql.u_pQueryall(temp.fields.stuId[0], temp.fields.projId[0], ans=>{
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
                const des_file = __dirname + "/../upload/" + temp.fields.uploadId[0] + '/' + temp.fields.stuId[0];
                // console.log(des_file);
                fs.mkdir(des_file, {
                    recursive: true  //是否递归,默认false
                }, (err) => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    fs.readdir(des_file, async (err, files) => {
                        if (files[0] != undefined) {
                            await fs.unlinkSync(des_file+'/'+files[0]);
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
        const temp = await parseFile(req);
        const a = await checkUpload(temp);
        if (a == -1 ) throw new Error('checkUpload Error')
        const b = await addFile(temp, a);
        if (b == -1 ) throw new Error('addFile Error')
        const c = await addu_p_file(temp, b);
        if (c == -1 ) throw new Error('addu_p_file Error')
        const write = await writeFile(temp);
        if (write != 0) throw new Error('writeFile Error')
        res.json({code:0, obj:obj})
        res.end();
    } catch(err) {
        console.log(err);
        filed = ()=>{
            res.json({code:-1});
            res.end();
        }
        filed();
    }
}