const path_csv_aprovados = './files_sisu/padronizado.csv';
const path_csv_processo_seletivo = './files_inscritos/inscricoes_organizadas_com_sexo.csv';
const csv = require('csvtojson');
const fs = require('fs');

if (!fs.existsSync('files_inscritos/inscricoes_organizadas_com_sexo.json')) {
    csv({delimiter: ';'})
        .fromFile(path_csv_processo_seletivo)
        .then((jsonObj) => {
            fs.writeFileSync('files_inscritos/inscricoes_organizadas_com_sexo.json', JSON.stringify(jsonObj));
        });
}

const start = async () => {
    const json_sisu = await csv({delimiter: ';'})
        .fromFile(path_csv_aprovados);

    const campi_json = require('./files_inscritos/campi.json');
    const campi = campi_json.map(campus => campus.campus);

    const inscritos_processo = require('./files_inscritos/inscricoes_organizadas_com_sexo.json');
    let contador = 0;

    const new_json_sisu = json_sisu.map(row => {
        const new_obj = {};
        new_obj.inscricao = row['CO_INSCRICAO_ENEM'];
        new_obj.nome = row['NO_INSCRITO'].toUpperCase();
        let campus = row['NO_CAMPUS'].split('- ')[1].toUpperCase().trim();

        if(campus === 'CAMPUS AVANÇADO CRISTALINA') campus = 'CAMPUS CRISTALINA';
        new_obj.campus = campi.indexOf(campus);

        const formacao = (row['DS_FORMACAO'] === "Tecnológico") ? "TECNOLOGIA EM " : `${row['DS_FORMACAO'].toUpperCase()} EM `;
        new_obj.curso = formacao + row['NO_CURSO'].toUpperCase() + " (" + row['DS_TURNO'].toUpperCase() + ")";

        const igual = inscritos_processo.filter((valor, index) => {
            return valor.nome === new_obj.nome;
        });

        if (igual.length > 0) {
            new_obj.sexo = igual[0].sexo;
            contador++;
        } else {
            new_obj.sexo = "";
        }

        new_obj.concorrencia = row['NO_MODALIDADE_CONCORRENCIA'].toUpperCase();
        new_obj.nota = row['NU_NOTA_CANDIDATO'];
        new_obj.nota_corte_concorrida = row['NU_NOTACORTE_CONCORRIDA'];
        new_obj.classificacao = row['NU_CLASSIFICACAO'];

        return new_obj;
    });

    console.log("Sexos preenchidos: " + contador);
    console.log("Pessoas: " + new_json_sisu.length);
    console.log("Falta preencher sexo de " + (new_json_sisu.length - contador) + " pessoas");

    fs.writeFileSync('files_sisu/inscricoes_organizadas_com_sexo.json', JSON.stringify(new_json_sisu));

    if (fs.existsSync('files_sisu/inscricoes_organizadas_com_sexo.json')) {
        const Json2csvParser = require('json2csv').Parser;
        const fields_inscritos = ['inscricao', 'nome', 'campus', 'curso', 'sexo', 'concorrencia', 'nota', 'nota_corte_concorrida', 'classificacao'];
        const opts_inscritos = {fields: fields_inscritos, delimiter: ";"};
        const fs = require('fs');

        const json_csv = require('./files_sisu/inscricoes_organizadas_com_sexo');

        try {
            const parser_inscritos = new Json2csvParser(opts_inscritos);
            const csv_inscritos = parser_inscritos.parse(json_csv);
            fs.writeFileSync('resultados/resultado_sisu.csv', csv_inscritos);
        } catch (err) {
            console.error(err);
        }
    }
};

start();