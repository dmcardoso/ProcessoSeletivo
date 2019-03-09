const sexo_inscritos_com_resultado_sisu = require('./resultados_sisu/sexo_inscritos_com_resultado_sisu.json');
const campi_quantidade_vagas_sisu = require('./resultados_sisu/campi_quantidade_vagas_sisu.json');
const sexo_inscritos_com_resultado_if = require('./resultados/sexo_inscritos_com_resultado_if.json');
const campi_quantidade_vagas_if = require('./resultados/campi_quantidade_vagas_if.json');

const fs = require('fs');
const csv = require('csvtojson');

const start = async () => {
    let mulheres_if = 0;
    let mulheres_sisu = 0;
    let mulheres = 0;
    let homens_if = 0;
    let homens_sisu = 0;
    let homens = 0;
    let resultado ="";
    Object.entries(sexo_inscritos_com_resultado_if).forEach((value) => {
        if(value[0] === 'mulheres') {
            mulheres_if = value[1];
            mulheres = value[1];
        }
        if(value[0] === 'homens'){
            homens_if = value[1];
            homens = value[1];
        }
    });
    Object.entries(sexo_inscritos_com_resultado_sisu).forEach((value) => {
        if(value[0] === 'mulheres') {
            mulheres_sisu = value[1];
            mulheres += value[1];
        }
        if(value[0] === 'homens'){
            homens_sisu = value[1];
            homens += value[1];
        }
    });

    console.log("Homens sisu: " + homens_sisu);
    console.log("Mulheres sisu: " + mulheres_sisu);
    console.log("Homens if: " + homens_if);
    console.log("Mulheres if: " + mulheres_if);
    console.log("Homens geral: " + homens);
    console.log("Mulheres geral: " + mulheres);

    const geral_por_sexo = {
        homens,
        mulheres
    };

    const geral_por_processo = {
        sisu: (homens_sisu + mulheres_sisu),
        if: (homens_if + mulheres_if)
    };

    resultado += "1. Quantos estudantes fizeram o processo seletivo e via sisu.\r\n";
    resultado += `SISU: ${(homens_sisu + mulheres_sisu)}\r\nIF: ${(homens_if + mulheres_if)} \r\n`;

    resultado += "Homens sisu: " + homens_sisu + "\r\n";
    resultado += "Mulheres sisu: " + mulheres_sisu + "\r\n";
    resultado += "Homens if: " + homens_if + "\r\n";
    resultado += "Mulheres if: " + mulheres_if + "\r\n";
    resultado += "Homens geral: " + homens + "\r\n";
    resultado += "Mulheres geral: " + mulheres + "\r\n";

    const geral_vagas = {
        sisu: 584,
        if: 1366
    };

    const vagas_por_campus_detalhada = {};
    Object.entries(campi_quantidade_vagas_if).forEach((value) => {
        vagas_por_campus_detalhada[Object.keys(value[1])[0]] = {};
        vagas_por_campus_detalhada[Object.keys(value[1])[0]].if = value[1][Object.keys(value[1])];
    });
    Object.entries(campi_quantidade_vagas_sisu).forEach((value) => {
        vagas_por_campus_detalhada[Object.keys(value[1])[0]].sisu = value[1][Object.keys(value[1])];
    });

    const vagas_por_campus = {};
    Object.entries(vagas_por_campus_detalhada).forEach((value) => {
        vagas_por_campus[value[0]] = (value[1][Object.keys(value[1])[0]] + value[1][Object.keys(value[1])[1]]);
    });

    const area_conhecimento_csv = await csv({delimiter: ';'})
        .fromFile('./files_inscritos/curso_area_conhecimento.csv');

    const cursos_area_conhecimento = {};
    area_conhecimento_csv.forEach((value) => {
        if(cursos_area_conhecimento[value.area] === undefined){
            cursos_area_conhecimento[value.area] = 1;
        }else{
            if(value.curso !== "BACHARELADO EM ENGENHARIA DE COMPUTAÇÃO"){
                cursos_area_conhecimento[value.area] += 1;
            }
        }
    });

    return {geral_por_sexo, geral_por_processo, geral_vagas, vagas_por_campus_detalhada,vagas_por_campus, cursos_area_conhecimento, resultado} ;
};

start().then(({geral_por_sexo, geral_por_processo, geral_vagas, vagas_por_campus_detalhada,vagas_por_campus, cursos_area_conhecimento, resultado}) => {
    fs.writeFileSync('./resultados_gerais/geral_por_sexo.json', JSON.stringify(geral_por_sexo));
    fs.writeFileSync('./resultados_gerais/geral_por_processo.json', JSON.stringify(geral_por_processo));
    fs.writeFileSync('./resultados_gerais/geral_por_vagas.json', JSON.stringify(geral_vagas));
    fs.writeFileSync('./resultados_gerais/geral_vagas_por_campus_detalhada.json', JSON.stringify(vagas_por_campus_detalhada));
    fs.writeFileSync('./resultados_gerais/geral_vagas_por_campus.json', JSON.stringify(vagas_por_campus));
    fs.writeFileSync('./resultados_gerais/geral_aglutinacao_area_conhecimento.json', JSON.stringify(cursos_area_conhecimento));
    fs.writeFileSync('./resultados_gerais/resultado_1_sexo.txt', resultado);
});