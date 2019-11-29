var SQL = require('./mysql');
var mysql = new SQL();
mysql.connect();

var times = new Date('2100-1-1 12:14:15');
console.log(times);
// obj = {
//     // name:1
// }
// obj.qwq = 1;
// console.log(obj);

// mysql.ArticleInsert('233哈');
// mysql.UserInsert('201800000000', '0', '000', '00000000000', null, '000', 1);
// mysql.QuestionInsert('你bu好');
// mysql.QuestionnaireInsert('学习时间qwq调查', 'baidu.com');
// mysql.ProjectInsert('捡垃圾3','志愿活动', times, 2, 2);
// mysql.ManagerInsert(6, '201805130169');
// mysql.UploadInsert('201805130168',null, times, 9999999999, 'ArticleFileUpload');
// mysql.FileInsert('/23', '201805130168', 2);
// mysql.AwardScoreInsert('一等奖', 30)
// mysql.u_pInsert('201805130169',6,null)
// mysql.proj_uploadInsert(4,3);
// mysql.article_fileInsert(2, 5);
// mysql.proj_queInsert(4, 3);
// mysql.u_p_fileInsert(1,2);
// mysql.u_p_ansInsert(1, '对', 1);


// mysql.ArticleUpdate('王锟nb', 1);
// mysql.UserUpdate('尹 永琪', '太 菜 了', '15964802069', null, 'qwqw', '201805130168');
// mysql.QuestionUpdate('你bu好', 1);
// mysql.QuestionnaireUpdate('学习时间qwq调查', '辣鸡baidu.com', '1');
// mysql.ProjectUpdate('bu捡垃圾','志愿1活动', times, 1, 1,2);
// mysql.ManagerUpdate(2, '201805130168', 4);
// mysql.UploadUpdate('201805130168','doc', times, 2333, 1);
// mysql.FileUpdate('/2323', '201805130168', 1,2);
// mysql.AwardScoreUpdate('一 等奖', 30, '1')
// mysql.u_pUpdate('201805130168',2,1)
// mysql.u_p_ansUpdate('不对', 1, 1);

// mysql.ArticleQuery(1, (ans)=>{console.log(ans)});
// mysql.UserQuery('201805130168', (ans)=>{console.log(ans)});
// mysql.QuestionQuery(1, (ans)=>{console.log(ans)});
// mysql.QuestionnaireQuery(1, (ans)=>{console.log(ans)});
// mysql.ProjectQuery(2, (ans)=>{console.log(ans)});
// mysql.ManagerQuery(4, (ans)=>{console.log(ans)});
// mysql.UploadQuery(1, (ans)=>{console.log(ans)});
// mysql.FileQuery(2, (ans)=>{console.log(ans)});
// mysql.AwardScoreQuery(1, (ans)=>{console.log(ans)})
// mysql.u_pQuery(1, (ans)=>{console.log(ans)})
// mysql.proj_uploadQuery(2, (ans)=>{console.log(ans)});
// mysql.article_fileQuery(1, (ans)=>{console.log(ans)});
// mysql.proj_queQuery(2, (ans)=>{console.log(ans)});
// mysql.u_p_fileQuery(1, (ans)=>{console.log(ans)});
// mysql.u_p_ansQuery(1, (ans)=>{console.log(ans)});


// mysql.ArticleDelete(1);
// mysql.UserDelete('201805130168');
// mysql.QuestionDelete(1);
// mysql.QuestionnaireDelete(1);
// mysql.ProjectDelete(2);
// mysql.ManagerDelete(4);
// mysql.UploadDelete(1);
// mysql.FileDelete(2);
// mysql.AwardScoreDelete(1)
// mysql.u_pDelete(1)

// mysql.proj_uploadDelete(2, 1);
// mysql.article_fileDelete(1,2);
// mysql.proj_queDelete(2,2);
// mysql.u_p_fileDelete(1,2);
// mysql.u_p_ansDelete(1,2);



mysql.disconnect();
