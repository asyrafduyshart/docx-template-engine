const express = require('express')
const app = express()
const path = require('path');
const fileUpload = require('express-fileupload');


const transform = require('./transform');

const uploadDir = path.join(__dirname, 'temp');

// default options
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

app.post('/upload', function (req, res) {
    if (!req.files) return res.status(400).send('No files were uploaded.');

    const docTemplate = req.body;
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let docFile = req.files.document;
    let uploadPath = path.join(uploadDir, docFile.name);
    docFile.mv(uploadPath)
        .then(() => {
            transform(uploadPath, docTemplate)
            .then((buffer) => {
                console.log('buffer: ', buffer);
                res.setHeader('Content-Disposition', `attachment; filename=${docFile.name}`);
                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.end(buffer);
            }).catch((err) => {
                console.error(err)
                res.status(500).send(err);
            });
        })
        .catch((err) => {
            console.error(err)
            res.status(500).send(err);
        });
});

app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
  });

app.listen(9000, () => console.log('Example app listening on port 9000!'))