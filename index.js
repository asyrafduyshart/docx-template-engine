
const serverless = require('serverless-http');
const express = require('express')
const app = express()
const path = require('path');


const transform = require('./transform');

app.get('/', function (req, res, next) {
    // res.setHeader('Content-Disposition', 'attachment; filename=panda.docx');
    // res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    // // res.end("Hello")
    // res.end(path.resolve(__dirname, 'temp', "hello.docx"));

    transform("https://docxtemplater.com/docs/simple.docx", "hello")
        .then((buffer) => {
            console.log('buffer: ', buffer);
            res.setHeader('Content-Disposition', 'attachment; filename=panda.docx');
            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.end(buffer);
        }).catch((err) => {
            res.status(500).send(err);
        });
})

module.exports.handler = serverless(app);