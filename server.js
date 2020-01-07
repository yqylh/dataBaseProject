const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MYSQL = require('./lib/mysql.js');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.listen(2018);

var telcodeMap = new Map();
mysql = new MYSQL();
mysql.connect();

process.on('SIGINT', () => {
    console.log('node exit');
    mysql.disconnect();
    process.exit(0);
});
app.post('/register', async (req, res)=>{
    const register = require('./lib/register.js').register;
    register(req, res);
})
app.post('/login', async (req, res)=>{
    const login = require('./lib/login.js').login;
    login(req, res);
})
app.get('/infoMe', async (req, res)=>{
    const infoMe = require('./lib/infoMe.js').infoMe;
    infoMe(req, res);
})
app.get('/ProjList', async (req, res)=>{
    const ProjList = require('./lib/ProjList.js').ProjList;
    ProjList(req, res);
})
app.get('/projDetail', async (req, res)=>{
    const projDetail = require('./lib/projDetail.js').projDetail;
    projDetail(req, res);
})
app.get('/joinProj', async (req, res)=>{
    const joinProj = require('./lib/joinProj.js').joinProj;
    joinProj(req, res);
})
app.post('/updateProj', async (req, res)=>{
    if (req.body.projId == undefined) {
        const createProj = require('./lib/createProj.js').createProj;
        createProj(req, res);
    } else {
        const modifyProj = require('./lib/modifyProj.js').modifyProj;
        modifyProj(req, res);
    }
})

app.post('/addProjFile', async (req, res)=>{
    const addProjFile = require('./lib/addProFile.js').addProjFile;
    addProjFile(req, res);
})
app.get('/getProjFile', async (req, res)=>{
    const getProjFile = require('./lib/getProjFile.js').getProjFile;
    getProjFile(req, res);
})
app.post('/upload', async (req, res)=>{
    const upload = require('./lib/upload.js').upload;
    upload(req, res);
})
app.get('/manageFile', async (req, res)=>{
    const manageFile = require('./lib/manageFile.js').manageFile;
    manageFile(req, res);
})
app.post('/addScore', async (req, res)=>{
    const addScore = require('./lib/addScore.js').addScore;
    addScore(req, res);
})
app.post('/ansQue', async (req, res)=>{
    const ansQue = require('./lib/ansQue.js').ansQue;
    ansQue(req, res);
})
app.get('/getParterDetail', async (req, res)=>{
    const getParterDetail = require('./lib/getParterDetail.js').getParterDetail;
    getParterDetail(req, res);
})
app.post('/addScoreArray', async (req, res)=>{
    const addScoreArray = require('./lib/addScoreArray.js').addScoreArray;
    addScoreArray(req, res);
})
