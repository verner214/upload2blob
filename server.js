/* node server.js
  webbserver som tillåter uppladdning av filer till azure storage
  dessa environment variabler måste sättas innan servern startas:
set AZURE_STORAGE_ACCOUNT=portalvhdsgfh152bhy290k
set AZURE_STORAGE_ACCESS_KEY=blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==
  */
var express = require("express");
var multiparty = require("multiparty");
var azure = require("azure-storage");

var app = express();

app.get('/upload', function (req, res) {
    res.send(
    '<form action="/upload" method="post" enctype="multipart/form-data">' +
    '<input type="file" name="snapshot" />' +
    '<input type="submit" value="Upload" />' +
    '</form>'
    );
});

app.post('/upload', function (req, res) {
    var blobService = azure.createBlobService('portalvhdsgfh152bhy290k', 'blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==');
    var form = new multiparty.Form();
    form.on('part', function(part) {
        if (part.filename) {

            var size = part.byteCount - part.byteOffset;
            var name = part.filename;

            blobService.createBlockBlobFromStream('ownblob', name, part, size, function(error) {
                if (error) {
                    res.send(error);
                } else {
                    //res.send('inget gick fel när blob skapades! nu lista innehåll');
                    blobService.listBlobsSegmented('ownblob', null, function (error, result, response) {
                        if (!error) {
                            res.send('inget gick fel när blob listades!');
                            console.log(JSON.stringify(result));
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
