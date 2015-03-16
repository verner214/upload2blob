/* node server.js
  webbserver som tillåter uppladdning av filer till azure storage
  dessa environment variabler måste sättas innan servern startas:
set AZURE_STORAGE_ACCOUNT=portalvhdsgfh152bhy290k
set AZURE_STORAGE_ACCESS_KEY=blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==
  
obs! bra länk som är rätt och inte fel!, http://azure.microsoft.com/sv-se/develop/nodejs/
obs! om hur man laddar upp och skapar fil innan, http://stackoverflow.com/questions/18317904/stream-uploaded-file-to-azure-blob-storage-with-node
  */
var express = require("express");
var multiparty = require("multiparty");
var azure = require("azure-storage");
var app = express();
var containerName = "ownblob";
var AZURE_STORAGE_ACCOUNT = "portalvhdsgfh152bhy290k";
var AZURE_STORAGE_ACCESS_KEY = "blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==";
var hostName = "https://" + AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net";

app.get('/', function (req, res) {
    res.send(
    '<a href="/upload">ladda upp med stream</a></br>' +
    '<a href="/uploadtufu">ladda upp med tufu</a></br>' +
    '<a href="/show">visa alla blobar</a></br>'
    );
});

app.get('/upload', function (req, res) {
    res.send(
    '<form action="/upload" method="post" enctype="multipart/form-data">' +
    '<input type="file" name="snapshot" />' +
    '<input type="submit" value="Upload" />' +
    '</form>'
    );
});

app.post('/upload', function (req, res) {
    var blobService = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);
    var form = new multiparty.Form();
    form.on('part', function(part) {
        if (part.filename) {

            var size = part.byteCount - part.byteOffset;
            var name = part.filename;

            blobService.createBlockBlobFromStream(containerName, name, part, size, function (error) {
                if (error) {
                    res.send(error);
                } else {
                    //res.send('inget gick fel när blob skapades! nu lista innehåll');
                    blobService.listBlobsSegmented(containerName, null, function (error, result, response) {
                        if (!error) {
                            var url = blobService.getUrl(containerName, name, null, hostName);
                            res.send(url);
                            //res.send(JSON.stringify(result));
                            //res.send('inget gick fel när blob listades2!');
                            //console.log(JSON.stringify(result));
                            //console.log(result);
                        }
                        else {
                            res.send(error);
                        }
                    });
                }
            });
        } else {//annat formulärselement än fil, vad gör handlePart?
            form.handlePart(part);
        }
    });
    form.parse(req);//aha, efter detta så kan eventen fyras av.
    //res.send('OK');
});

app.get('/uploadtufu', function (req, res) {
    res.send(
    '<form action="/uploadtufu" method="post" enctype="multipart/form-data">' +
    '<input type="file" name="snapshot" />' +
    '<input type="submit" value="Upload" />' +
    '</form>'
    );
});

app.post('/uploadtufu', function (req, res) {
/* från länken högst upp, dvs frågan i overflow där svaret är /upload ovan.
app.post('/upload', function (req, res) {
    var path = req.files.snapshot.path;
    var bs= azure.createBlobService();
    bs.createBlockBlobFromFile('c', 'test.png', path, function (error) { });
    res.send("OK");
});
*/
/* spara uppladdat till fil, klippt från egen file
    var blobService = azure.createBlobService(AZURE_STORAGE_ACCOUNT, AZURE_STORAGE_ACCESS_KEY);
    var form = new multiparty.Form();
    form.on('part', function(part) {
        if (part.filename) {

            var size = part.byteCount - part.byteOffset;
            var name = part.filename;

            blobService.createBlockBlobFromStream(containerName, name, part, size, function (error) {
                if (error) {
                    res.send(error);
                } else {
                    //res.send('inget gick fel när blob skapades! nu lista innehåll');
                    blobService.listBlobsSegmented(containerName, null, function (error, result, response) {
                        if (!error) {
                            var url = blobService.getUrl(containerName, name, null, hostName);
                            res.send(url);
                            //res.send(JSON.stringify(result));
                            //res.send('inget gick fel när blob listades2!');
                            //console.log(JSON.stringify(result));
                            //console.log(result);
                        }
                        else {
                            res.send(error);
                        }
                    });
                }
            });
        } else {//annat formulärselement än fil, vad gör handlePart?
            form.handlePart(part);
        }
    });
    form.parse(req);//aha, efter detta så kan eventen fyras av.
    //res.send('OK');
});

app.listen(process.env.PORT || 1337);


/*

var tufu = require("tufu");
var orginalJPG = tufu("c:\\tmp\\dorr1.jpg");

orginalJPG.resize(100, 100);
orginalJPG.save("c:\\tmp\\dorr1_liten.jpg");
*/