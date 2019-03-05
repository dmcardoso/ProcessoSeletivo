const csvFilePath = './files_inscritos/inscricoes.csv';
const fs = require('fs');
const csv = require('csvtojson');

csv({delimiter: ';'})
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        fs.writeFileSync('files_inscritos/inscricoes.json', JSON.stringify(jsonObj));
    });