/* node server.js */
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
    var blobService = azure.createBlobService();
    var form = new multiparty.Form();
    form.on('part', function(part) {
        if (part.filename) {

            var size = part.byteCount - part.byteOffset;
            var name = part.filename;

            blobService.createBlockBlobFromStream('c', name, part, size, function(error) {
                if (error) {
                    res.send({ Grrr: error });
                }
            });
        } else {
            form.handlePart(part);
        }
    });
    form.parse(req);
    res.send('OK');
});

app.listen(3000);
