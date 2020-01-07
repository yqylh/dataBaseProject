const fs=require('fs');
const compressing = require('compressing');
const zipStream = new compressing.zip.Stream();
zipStream.addEntry('./server.js')
zipStream.addEntry('./uplo')

const destStream = fs.createWriteStream('test.zip');

const pipe = require('multipipe');
pipe(zipStream, destStream, (err) => {
    console.log(err);
})
