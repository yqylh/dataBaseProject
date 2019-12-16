// var mysql      = require('mysql');
function Mysql(){
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
  		password : 'qazxsw321',
  		database : 'info'
	});
	this.connect = function(){
		connection.connect();
    };
    this.disconnect = function(){
		connection.end();
	};
    //insert
	this.UserInsert = function(thyuser_id,thyname,thyintro,thytel,thyimage,thypwd, thyisManager){
		var addSql = 'INSERT INTO User(`user_id`,`name`,`introduction`,`tel`,`image`,`pwd`,`isManager`) VALUES(?,?,?,?,?,?,?)';
		var addSqlParams=[thyuser_id,thyname,thyintro,thytel,thyimage,thypwd, thyisManager];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

	this.ManagerInsert = function(thyproj_id,thyuser_id){
		var addSql = 'INSERT INTO Manager(`mg_id`,`proj_id`,`user_id`) VALUES(0,?,?)';
		var addSqlParams=[thyproj_id,thyuser_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

	this.ProjectInsert = function(thytitle,thyattributes,thytimestamp,thyarticle_id,thyqn_id, result){
		var addSql = 'INSERT INTO Project(`proj_id`,`title`,`attributes`,`timestamp`,`article_id`,`qn_id`) VALUES(0,?,?,?,?,?)';
		var addSqlParams=[thytitle,thyattributes,thytimestamp,thyarticle_id,thyqn_id];
		connection.query(addSql,addSqlParams,function (err, ans) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
               result(ans);
		});
	};

    this.ArticleInsert = function(thycontent, ans){
		var addSql = 'INSERT INTO Article(`article_id`,`content`) VALUES(0,?)';
		var addSqlParams=[thycontent];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
            ans(result);
		});
	};

	this.FileInsert = function(thyaddress,thyuser_id,thyupload_id, result){
		var addSql = 'INSERT INTO File(`file_id`,`address`,`user_id`,`upload_id`) VALUES(0,?,?,?)';
		var addSqlParams=[thyaddress,thyuser_id,thyupload_id];
		connection.query(addSql,addSqlParams,function (err, ans) {
        	if(err){
                console.log('[INSERT ERROR] - ',err.message);
                result(-1);
				return;
            }
            result(ans.insertId);
		});
	};


	this.AwardScoreInsert = function(thyname,thyscore, ans){
		var addSql = 'INSERT INTO AwardScore(`as_id`,`name`,`score`) VALUES(0,?,?)';
		var addSqlParams=[thyname,thyscore];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
            ans(result);
		});
	};

	this.UploadInsert = function(thyuser_id,thytypeLimit,thytimeLimit,thysizeLimit,thyname, ans){
		var addSql = 'INSERT INTO Upload(`upload_id`,`user_id`,`typeLimit`,`timeLimit`,`sizeLimit`,`name`) VALUES(0,?,?,?,?,?)';
		var addSqlParams=[thyuser_id,thytypeLimit,thytimeLimit,thysizeLimit,thyname];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
            ans(result);
		});
	};

	this.QuestionnaireInsert = function(thytitle,thyurl, ans){
		var addSql = 'INSERT INTO Questionnaire(`qn_id`,`title`,`url`) VALUES(0,?,?)';
		var addSqlParams=[thytitle,thyurl];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
            ans(result)
		});
	};

	this.QuestionInsert = function(thycontent, ans){
		var addSql = 'INSERT INTO Question(`que_id`,`content`) VALUES(0,?)';
		var addSqlParams=[thycontent];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
            ans(result)
		});
	};


	this.u_pInsert = function(thyuser_id,thyproj_id,thyaward_id){
		var addSql = 'INSERT INTO u_p(`u_p_id`,`user_id`,`proj_id`,`award_id`) VALUES(0,?,?,?)';
		var addSqlParams=[thyuser_id,thyproj_id,thyaward_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

	this.proj_uploadInsert = function(thyproj_id,thyupload_id){
		var addSql = 'INSERT INTO proj_upload(`proj_id`,`upload_id`) VALUES(?,?)';
		var addSqlParams=[thyproj_id,thyupload_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

	this.article_fileInsert = function(thyarticle_id,thyfile_id, ans){
		var addSql = 'INSERT INTO article_file(`article_id`,`file_id`) VALUES(?,?)';
		var addSqlParams=[thyarticle_id,thyfile_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
               }
               ans();
		});
	};

	this.proj_queInsert = function(thyproj_id,thyque_id){
		var addSql = 'INSERT INTO proj_que(`proj_id`,`que_id`) VALUES(?,?)';
		var addSqlParams=[thyproj_id,thyque_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

	this.u_p_fileInsert = function(thyu_p_id,thyfile_id, ret){
		var addSql = 'INSERT INTO u_p_file(`u_p_id`,`file_id`) VALUES(?,?)';
		var addSqlParams=[thyu_p_id,thyfile_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
                console.log('[INSERT ERROR] - ',err.message);
                ret(-1);
				return;
            }
            ret(0);   
		});
	};

	this.u_p_ansInsert = function(thyu_p_id,thyans,thyque_id){
		var addSql = 'INSERT INTO u_p_ans(`u_p_id`,`ans`,`que_id`) VALUES(?,?,?)';
		var addSqlParams=[thyu_p_id,thyans,thyque_id];
		connection.query(addSql,addSqlParams,function (err, result) {
        	if(err){
				console.log('[INSERT ERROR] - ',err.message);
				return;
       		}
		});
	};

    // query
    this.UserQuery = (user_id, ret) =>{
        var str = 'select * from User where user_id =' + user_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('userQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.UserQuerytel = (tel, ret) =>{
        var str = 'select * from User where tel =' + tel;
        // console.log(str);
        connection.query(str, (err, result) => {
            if (err) {
                console.log('UserQuerytel error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.ManagerQuery = (proj_id, ret) =>{
        var str = 'select * from Manager where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('managerQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.ManagerQueryUser = (user_id, ret) =>{
        var str = 'select * from Manager where user_id =' + user_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('managerQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.ManagerQueryProj = (proj_id, ret) =>{
        var str = 'select * from Manager where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('managerQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.ProjectQuery = (proj_id, ret) =>{
        var str = 'select * from Project where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('projectQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.ArticleQuery = (article_id, ret) =>{
        var str = 'select * from Article where article_id =' + article_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('articleQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.FileQuery = (file_id, ret) =>{
        var str = 'select * from File where file_id =' + file_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('fileQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.AwardScoreQuery = (as_id, ret) =>{
        var str = 'select * from AwardScore where as_id =' + as_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('awardscoreQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.UploadQuery = (upload_id, ret) =>{
        var str = 'select * from Upload where upload_id =' + upload_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('uploadQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.QuestionnaireQuery = (qn_id, ret) =>{
        var str = 'select * from Questionnaire where qn_id =' + qn_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('questionnaireQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.QuestionQuery = (que_id, ret) =>{
        var str = 'select * from Question where que_id =' + que_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('questionQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_pQuery = (u_p_id, ret) =>{
        var str = 'select * from u_p where u_p_id =' + u_p_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_pQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_pQueryall = (user_id, proj_id, ret) =>{
        var str = 'select * from u_p where user_id =' + user_id + ' and proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_pQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_pQueryuser_id = (user_id, ret) =>{
        var str = 'select * from u_p where user_id =' + user_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_pQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_pQueryproj_id = (proj_id, ret) =>{
        var str = 'select * from u_p where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_pQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.proj_uploadQuery = (proj_id, ret) =>{
        var str = 'select * from proj_upload where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('proj_uploadQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.article_fileQuery = (article_id, ret) =>{
        var str = 'select * from article_file where article_id =' + article_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('article_fileQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.proj_queQuery = (proj_id, ret) =>{
        var str = 'select * from proj_que where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('proj_queQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_p_fileQuery = (u_p_id, ret) =>{
        var str = 'select * from u_p_file where u_p_id =' + u_p_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_p_fileQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    this.u_p_ansQuery = (u_p_id, ret) =>{
        var str = 'select * from u_p_ans where u_p_id =' + u_p_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_p_ansQuery error', err.message);
                return;
            }
            ret(result);
        })
    }
    // delete
    this.UserDelete = (user_id, ret) =>{
        var str = 'delete from User where user_id =' + user_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('userDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.ManagerDelete = (mg_id, ret) =>{
        var str = 'delete from Manager where mg_id =' + mg_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('managerDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.ProjectDelete = (proj_id, ret) =>{
        var str = 'delete from Project where proj_id =' + proj_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('projectDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.ArticleDelete = (article_id, ret) =>{
        var str = 'delete from Article where article_id =' + article_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('articleDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.FileDelete = (file_id, ret) =>{
        var str = 'delete from File where file_id =' + file_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('fileDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.AwardScoreDelete = (as_id, ret) =>{
        var str = 'delete from AwardScore where as_id =' + as_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('awardscoreDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.UploadDelete = (upload_id, ret) =>{
        var str = 'delete from Upload where upload_id =' + upload_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('uploadDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.QuestionnaireDelete = (qn_id, ret) =>{
        var str = 'delete from Questionnaire where qn_id =' + qn_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('questionnaireDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.QuestionDelete = (que_id, ret) =>{
        var str = 'delete from Question where que_id =' + que_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('questionDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.u_pDelete = (u_p_id, ret) =>{
        var str = 'delete from u_p where u_p_id =' + u_p_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_pDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.proj_uploadDelete = (proj_id, upload_id, ret) =>{
        var str = 'delete from proj_upload where proj_id =' + proj_id + ' and upload_id = ' + upload_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('proj_uploadDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.article_fileDelete = (article_id, file_id, ret) =>{
        var str = 'delete from article_file where article_id =' + article_id + ' and file_id = ' + file_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('article_fileDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.proj_queDelete = (proj_id, que_id, ret) =>{
        var str = 'delete from proj_que where proj_id =' + proj_id + ' and que_id = ' + que_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('proj_queDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.u_p_fileDelete = (u_p_id, file_id, ret) =>{
        var str = 'delete from u_p_file where u_p_id =' + u_p_id + ' and file_id = ' + file_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_p_fileDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    this.u_p_ansDelete = (u_p_id, que_id, ret) =>{
        var str = 'delete from u_p_ans where u_p_id =' + u_p_id+ ' and que_id = ' + que_id;
        connection.query(str, (err, result) => {
            if (err) {
                console.log('u_p_ansDelete error', err.message);
                return;
            }
            // ret(result);
        })
    }
    //update
	this.UserUpdate = function(thyname,thyintro,thytel,thyimage,thypwd,thyId, thyisManager){
        var modSql = 'UPDATE User SET name= ? , introduction= ? , tel= ? , image= ? , pwd= ?, isManager=? WHERE user_id= ?';
        var modSqlParams=[thyname,thyintro,thytel,thyimage,thypwd,thyId, thyisManager];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.ManagerUpdate = function(thyproj_id,thyuser_id,thyId){
        var modSql = 'UPDATE Manager SET proj_id= ? , user_id= ?  WHERE mg_id= ?';
        var modSqlParams=[thyproj_id,thyuser_id,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.ProjectUpdate = function(thytitle,thyattributes,thytimestamp,thyarticle_id,thyqn_id,thyId){
        var modSql = 'UPDATE Project SET title= ? , attributes= ? , timestamp= ? , article_id=? , qn_id= ?  WHERE proj_id= ?';
        var modSqlParams=[thytitle,thyattributes,thytimestamp,thyarticle_id,thyqn_id,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.ArticleUpdate = function(thycontent,thyId){
        var modSql = 'UPDATE Article SET content= ?  WHERE article_id= ?';
        var modSqlParams=[thycontent,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.FileUpdate = function(thyaddress,thyuser_id,thyupload_id,thyId){
        var modSql = 'UPDATE File SET address= ? , user_id= ? , upload_id= ?  WHERE file_id= ?';
        var modSqlParams=[thyaddress,thyuser_id,thyupload_id,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.AwardScoreUpdate = function(thyname,thyscore,thyId){
        var modSql = 'UPDATE AwardScore SET name= ? , score= ?  WHERE as_id= ?';
        var modSqlParams=[thyname,thyscore,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};

	this.UploadUpdate = function(thyuser_id,thytypeLimit,thytimeLimit,thysizeLimit,thyname,thyId, result){
        var modSql = 'UPDATE Upload SET user_id= ? , typeLimit= ? , timeLimit= ? , sizeLimit = ?, name=? WHERE upload_id= ?';
        var modSqlParams=[thyuser_id,thytypeLimit,thytimeLimit,thysizeLimit,thyname,thyId];
        connection.query(modSql,modSqlParams,function (err, ans) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
            result(ans);    
        });
	};
	this.QuestionnaireUpdate = function(thytitle, thyurl,thyId){
        var modSql = 'UPDATE Questionnaire SET title= ? , url= ? WHERE qn_id= ?';
        var modSqlParams=[thytitle, thyurl,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
	};
	this.QuestionUpdate = function(thycontent,thyId){
        var modSql = 'UPDATE Question SET content= ? WHERE que_id= ?';
        var modSqlParams=[thycontent,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
    };
	this.u_pUpdate = function(thyuser_id, thyproj_id,thyaward_id,thyId){
        var modSql = 'UPDATE u_p SET user_id= ? , proj_id= ?, award_id= ? WHERE u_p_id= ?';
        var modSqlParams=[thyuser_id, thyproj_id,thyaward_id,thyId];
        connection.query(modSql,modSqlParams,function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
    };
    this.u_p_ansUpdate = function(thyans,thyu_p_id, thyque_id) {
        var modSql = 'UPDATE u_p_ans SET ans= ? WHERE u_p_id= ? and que_id= ?';
        var modSqlParams=[thyans,thyu_p_id, thyque_id];
        connection.query(modSql,modSqlParams,function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ',err.message);
                return;
            }
        });
    }
    this.anyUpdate = function(sql, parse, solve) {
        connection.query(sql, parse, function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ',err.message);
                solve(-1);
                return;
            }
            solve(0);
        });
    }
    this.anyQuery = function(sql, solve) {
        connection.query(sql, function (err, result) {
            if (err) {
                console.log('[QUERY ERROR] - ',err.message);
                solve(-1);
                return;
            }
            solve(result);
        });
    }
};
module.exports=Mysql;
