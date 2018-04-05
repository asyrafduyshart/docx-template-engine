const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { Transform } = require("stream");

const transform = (url, template) => new Promise((resolve, reject) => {
    formatData(url, template)
        .then((buffer) => {
            resolve(buffer);
        }).catch((error) => {
            reject(error);
        });
})


const formatData = (data, template) => new Promise(function (resolve, reject) {
    const content = fs.readFileSync(data, 'binary');
    const zip = new JSZip(content);

    const doc = new Docxtemplater();
    doc.loadZip(zip);

    //set the templateconstiables
    doc.setData(template);

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        const e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        }
        reject(e);
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // const buffer = doc.getZip().generate({
    //     type:"blob",
    //     mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // }) //Output the document using Data-URI
    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    resolve(buffer)
})

module.exports = transform;