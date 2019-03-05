const fs = require('fs');

const stringBeforeCourse = "RESULTADO FINAL - Processo Seletivo para Cursos Superiores 2019/1";

const arquivo = fs.readFileSync('./resultado_if.txt', "utf8");
const array = arquivo.split(stringBeforeCourse);
array.splice(0, 1);

const inscritos_processo = require('./files_inscritos/inscricoes_organizadas_com_sexo');
let contador = 0;

const campi_json = require('./files_inscritos/campi');
const campi = campi_json.map(campus => campus.campus);
const alunos_final = [];

// console.log(array);
array.forEach((valor, indice) => {
    const curso = valor.split('-')[0].trim().toUpperCase();
    let campus = "CAMPUS " + valor.split('-')[1].split('\r')[0].trim().toUpperCase();
    switch (campus) {
        case "CAMPUS CATALÃO":
            campus = 'CAMPUS AVANÇADO CATALÃO';
            break;

        case "CAMPUS HIDROLÂNDIA":
            campus = 'CAMPUS AVANÇADO HIDROLÂNDIA';
            break;

        case "CAMPUS IPAMERI":
            campus = 'CAMPUS AVANÇADO IPAMERI';
            break;
    }
    const vagas = valor.split('OFERTA DE VAGAS:')[1].split('\r\n')[0].trim().split(' / ').map(vaga => {
        const separate = vaga.split('=');
        const cota = separate[0];
        return {[cota]: Number(separate[1])};
    });

    const campus_position = campi.indexOf(campus);

    if (campi_json[campus_position].cursos === undefined) {
        campi_json[campus_position].cursos = [];
        campi_json[campus_position].cursos.push({
            curso, vagas
        });
    } else {
        const cursos = campi_json[campus_position].cursos.map(curso => curso.curso);
        if (!cursos.includes(curso)) {
            campi_json[campus_position].cursos.push({
                curso, vagas
            });
        }
    }

    const alunos_separate = "RESERVA DE VAGA COMPROVADA\r\n";
    const array_alunos = valor.split(alunos_separate)[1].split('Abreviações')[0].split('\r\n');
    const alunos = array_alunos.map(row => {
        const inscricao = row.trim().slice(0, 5);

        if (inscricao !== "") {
            let sexo = "";
            row = row.toUpperCase();

            const nome = row.split(inscricao)[1].trim().split("    ")[0].toUpperCase();
            const nota = row.split(nome)[1].trim().split("    ")[0];
            const classificacao = row.split(nota)[1].trim().split("    ")[0];
            const n_classificacao = classificacao.split('º')[0];
            const classificacao_cota = row.split(classificacao)[1].trim();

            let n_classificacao_cota = "";
            let cota_concorrida = "";
            if (classificacao_cota !== "") {
                n_classificacao_cota = classificacao_cota.split('º')[0];
                cota_concorrida = classificacao_cota.split(' ')[3];
            }
            cota_concorrida = (cota_concorrida === "") ? "AC" : cota_concorrida;
            const igual = inscritos_processo.filter((valor, index) => {
                return valor.inscricao === inscricao;
            });

            if (igual.length > 0) {
                sexo = igual[0].sexo;
                contador++;
            } else {
                sexo = "";
            }

            return {
                inscricao,
                nome,
                campus: campus_position,
                curso,
                sexo,
                concorrencia: cota_concorrida,
                nota,
                classificacao_ac: n_classificacao,
                classificacao_cota: n_classificacao_cota
            };
        }
    });

    if (alunos !== null && alunos !== undefined && alunos.length > 0) {
        alunos.forEach((aluno) => {
            if (aluno !== null && aluno !== undefined)
                alunos_final.push(aluno);
        });
    }
});

console.log("Total de alunos aprovados: " + alunos_final.length);
console.log("Alunos com sexo preenchido: " + contador);
fs.writeFileSync('resultados/resultado_if.json', JSON.stringify(alunos_final));

if (fs.existsSync('resultados/resultado_if.json')) {
    const Json2csvParser = require('json2csv').Parser;
    const fields_inscritos = ['inscricao', 'nome', 'campus', 'curso', 'sexo', 'concorrencia', 'nota', 'classificacao_ac', 'classificacao_cota'];
    const opts_inscritos = {fields: fields_inscritos, delimiter: ";"};
    const fs = require('fs');

    const json_csv = require('./resultados/resultado_if.json');

    try {
        const parser_inscritos = new Json2csvParser(opts_inscritos);
        const csv_resultado = parser_inscritos.parse(json_csv);
        fs.writeFileSync('resultados/resultado_if.csv', csv_resultado);
    } catch (err) {
        console.error(err);
    }
}

fs.writeFileSync('resultados/campi_informacoes.json', JSON.stringify(campi_json));
