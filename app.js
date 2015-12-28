var fs = require('fs');
var path = require('path');

var baseUrl = process.cwd();
fs.readdir('./br4_files', function (err, files) {
    if (err) {
        throw err;
    }
    files.forEach(function (file) {
        var ext = path.extname(file);
        if(ext.toUpperCase()=='.BR4'){
            var fileName = path.basename(file, '.BR4')+'.mp3';
            var readStream = fs.createReadStream('./br4_files/'+file);
            var writeStream = fs.createWriteStream('./mp3_files/'+fileName);
            readStream.on('data', function(chunk) {
                var decodeChunk = new Buffer(chunk.length);
                for(var i=0;i<chunk.length;i++){
                    decodeChunk[i]= ~ chunk[i];
                }
                if (writeStream.write(decodeChunk) === false) {
                    readStream.pause();
                }
            });
            readStream.on('end', function() {
                writeStream.end();
            });
            writeStream.on('drain', function() {
                readStream.resume();
            });
            writeStream.on('finish', function() {
                console.log('decode ' + file+' done!');
            });
        }
    });
});