exports.getProjFile = async(req, res) =>{
    console.log('getProjFile\n',req.query)
    var fs = require('fs')
    let obj = {}
    try {
        const MYSQL = require('./mysql.js');
        mysql = new MYSQL();
        mysql.FileQuery(req.query.fileId, (ans) =>{
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
    } catch(err) {
        console.log(err);
        filed();
    }
    filed = ()=>{
        res.json({code:-1});
        res.end();
    }
}