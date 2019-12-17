const fs = require("fs");
// var des_file = __dirname + "/upload/3/2014";
// fs.mkdir(des_file, {
//   recursive: true  //是否递归,默认false
// }, (err) => {
//   if(err){
//     console.log(err);
//     return;
//   }
// });
// // 

// var time1 = new Date();
// var time2 = new Date('2020-1-1 12:14:15');
// console.log(time1 < new Date());
// console.log(toString(times))
console.log(__dirname);
var path = __dirname + '/qwq';
console.log(path)
fs.unlinkSync(path);