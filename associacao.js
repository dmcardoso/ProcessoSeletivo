const file_resultado_path = './resultados/resultado_if.csv';
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
const fields_resultado = ['area', 'sexo', 'nota'];
const opts_resultado = {fields: fields_resultado, delimiter: ";"};
const fs = require('fs');

csv({delimiter: ';'})
    .fromFile(file_resultado_path)
    .then((jsonObj) => {

        const filtered = jsonObj.map(row => {
            return {area_conhecimento: row.area_conhecimento, sexo: row.sexo, nota: row.nota};
        });

        // const maior_nota = jsonObj.reduce((thiss, reducer) => thiss.nota > reducer.nota ? thiss : reducer, 0);
        // console.log(maior_nota);

        // 1907,2
        // 3861,2

        const organize_notas = filtered.map(row => {
            let nota = 0;

            const this_nota = Number(row.nota.replace(',', '.'));

            // 390,2
            if (this_nota <= 2297.4 && this_nota >= 1907.2) {
                nota = '1907-2297';
            } else if (this_nota <= 2687.6 && this_nota >= 2297.4) {
                nota = '2297-2687';
            } else if (this_nota <= 3077.8 && this_nota >= 2687.6) {
                nota = '2687-3077';
            } else if (this_nota <= 3468 && this_nota >= 3077.8) {
                nota = '3077-3468';
            } else if (this_nota <= 3861.8 && this_nota >= 3468) {
                nota = '3468-3861';
            }

            return {...row, area: row.area_conhecimento, nota};
        });

        const parser_resultado = new Json2csvParser(opts_resultado);
        const csv_resultado = parser_resultado.parse(organize_notas);
        fs.writeFileSync('./associacao.csv', csv_resultado);
    });
