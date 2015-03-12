/* node server.js
  webbserver som till�ter uppladdning av filer till azure storage
  dessa environment variabler m�ste s�ttas innan servern startas:
set AZURE_STORAGE_ACCOUNT=portalvhdsgfh152bhy290k
set AZURE_STORAGE_ACCESS_KEY=blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==
  */
var express = require("express");
var multiparty = require("multiparty");
var azure = require("azure-storage");
var app = express();
var containerName = "ownblob";
var AZURE_STORAGE_ACCOUNT = "portalvhdsgfh152bhy290k";
var AZURE_STORAGE_ACCESS_KEY = "blSI3p0IIYZJkojYyc27+5Jm82TmjaYbjEthG+f8fTT615DVeBJ2MMc3gNPyW5dSRaPpeWa2cJ/NE7ypqWTvkw==";
var hostName = "https://" + AZURE_STORAGE_ACCOUNT + ".blob.core.windows.net";

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
                    //res.send('inget gick fel n�r blob skapades! nu lista inneh�ll');
                    blobService.listBlobsSegmented(containerName, null, function (error, result, response) {
                        if (!error) {
                            res.send('inget gick fel n�r blob listades!');
                            console.log(JSON.stringify(result));
                            //console.log(result);
                        }
                        else {
                            res.send(error);
                        }
                    });
                }
            });
        } else {//annat formul�rselement �n fil, vad g�r handlePart?
            form.handlePart(part);
        }
    });
    form.parse(req);//aha, efter detta s� kan eventen fyras av.
    //res.send('OK');
});

app.listen(process.env.PORT || 1337);
