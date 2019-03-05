const Json2csvParser = require('json2csv').Parser;
const fields_inscritos = ['inscricao', 'nome', 'campus', 'curso', 'sexo'];
const fields_campi = ['id', 'campus'];
const opts_inscritos = {fields: fields_inscritos, delimiter: ";"};
const opts_campi = {fields: fields_campi, delimiter: ";"};
const fs = require('fs');

const json_csv = require('./files_inscritos/inscricoes_organizadas');
const json_campi = require('./files_inscritos/campi');

try {
    const parser_inscritos = new Json2csvParser(opts_inscritos);
    const parser_campi = new Json2csvParser(opts_campi);
    const csv_inscritos = parser_inscritos.parse(json_csv);
    const csv_campi = parser_campi.parse(json_campi);
    fs.writeFileSync('files_inscritos/inscricoes_organizadas.csv', csv_inscritos);
    fs.writeFileSync('files_inscritos/campi.csv', csv_campi);
} catch (err) {
    console.error(err);
}