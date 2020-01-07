exports.manageFile = async(req, res) =>{
    console.log('manageFile\n',req.query)
    var fs = require('fs')
    const compressing = require('compressing');
    const pipe = require('multipipe');
    const zipStream = new compressing.zip.Stream();

    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        let name;
        await new Promise(resolve =>{
            mysql.proj_uploadQuery(req.query.projId, async (ans)=>{
                var todos = [];
                await ans.forEach( (i) =>{
                    fs.exists(__dirname + '/../upload/' + i.upload_id, ret => {
                        if (ret) {
                            console.log(i.upload_id);
                            todos.push(zipStream.addEntry(__dirname + '/../upload/' + i.upload_id));
                        }
                    })
                })
                await Promise.all(todos);
                name = new Date().getTime() + '.zip';
                const destStream = fs.createWriteStream(name);
                pipe(zipStream, destStream, (err) => {
                    if (err) console.log(err);
                    resolve();
                })
            })
        })
        const path = __dirname + "/../" + name;
        console.log(path);
        fs.readFile(path, function(err, data){
            if (err) {
                res.writeHead(404);
                res.end("Read file failed!");
                return;
            }
            // 下载
            var userAgent = (req.headers['user-agent']||'').toLowerCase();
            if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(name));
                fs.createReadStream(path).pipe(res);
            } else if(userAgent.indexOf('firefox') >= 0) {
                res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(name)+'"');
            } else {
                res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(name).toString('binary'));
            }
            res.end(data);
        })
        setTimeout(()=>{fs.unlinkSync(path)}, 60000)
    } catch(err) {
        console.log(err);
        res.json({code:-1});
        res.end();
    }
}