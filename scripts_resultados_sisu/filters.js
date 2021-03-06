const removeAccents = require('remover-acentos');
const resultado_if = require('../files_sisu/sisu_final.json');
const campi_info = require('../files_sisu/campi_info_sisu');
const campi = require('../files_inscritos/campi');

const areasConhecimento = [
    'CIÊNCIAS SOCIAIS APLICADAS',
    'CIÊNCIAS AGRÁRIAS',
    'CIÊNCIAS EXATAS E DA TERRA',
    'CIÊNCIAS BIOLÓGICAS',
    'ENGENHARIAS',
    'CIÊNCIAS HUMANAS'
];

const cotas = [
    'RIPPI-PCD',
    'RIPPI',
    'RI',
    'RSPPI-PCD',
    'RSPPI',
    'RS'
];

const getByCampus = (list, campus_id) => list.filter(row => Number(row.campus) === Number(campus_id));

const getCampusById = (campus_id) => campi.filter(campus => campus.id === campus_id)[0];

const getBySexo = (list, sexo) => list.filter(row => row.sexo === sexo);

const getByCurso = (list, curso) => list.filter(row => removeAccents(row.curso) === removeAccents(curso));

const getMaiorNota = (list) => list.reduce((reducer, curr) => parseFloat(replaceDot(reducer.nota)) < parseFloat(replaceDot(curr.nota)) ? curr : reducer);

const getMenorNota = (list) => list.reduce((reducer, curr) => parseFloat(replaceDot(reducer.nota)) > parseFloat(replaceDot(curr.nota)) ? curr : reducer);

const replaceDot = string => string.replace(',', '.');

const getNotaCorte = (list, curso, cota, campus) => {
    const nota_corte = list.find(row => row.curso === curso && row.campus === campus && row.concorrencia === cota);
    if(nota_corte !== undefined && nota_corte.nota_corte_concorrida !== undefined){
        return replaceDot(nota_corte.nota_corte_concorrida);
    }
};

const getTotalInscritos = (vaga_search, campus_id, curso) => {
    const count_inscritos = getByCurso(getByCampus(resultado_if, campus_id), curso).length;
    let corte = Number(getVagas(campus_id, curso, vaga_search));
    // console.log(corte + " <<<<");

    if (count_inscritos < corte) {
        // console.log(count_inscritos + " Curso com menor número de inscritos " + corte);
        corte = count_inscritos;
    }

    return corte;
};

const getVagas = (campus_id, curso_search, vaga_search = "") => {
    const campus = campi_info.filter(campus => campus.id === campus_id)[0];
    const curso = campus.cursos.filter(curso => removeAccents(curso.curso) === removeAccents(curso_search))[0];

    if (vaga_search !== "") {
        return curso.vagas.filter(vaga => Object.keys(vaga)[0] === vaga_search)[0][vaga_search];
    } else {
        return curso.vagas.reduce((reducer, current) => {
            return reducer + current[Object.keys(current)[0]];
            // reducer[Object.keys(reducer)[0]] + current[Object.keys(current)[0]]
        }, 0);
    }
};

const getByAreaConhecimento = (list, area_search) => list.filter(row => removeAccents(row['area_conhecimento'].toUpperCase()) === removeAccents(area_search.toUpperCase()));

const getCursoByAreaConhecimento = (area_search, list) => {
    const cursos = [];

    list.forEach(row => {
        const igual = (new_curso) => cursos.some(curso => curso.curso === new_curso.curso && curso.campus === new_curso.campus);
        if (removeAccents(row.area_conhecimento.toUpperCase()) === removeAccents(area_search.toUpperCase()) && !igual(row)) {
            cursos.push({curso: row.curso, campus: row.campus});
        }
    });

    return cursos;
};

const getByCota = (list) => list.filter(row => row.concorrencia !== "AC");
const getByCotaName = (list, cota_search, curso, campus) => list.filter(row => row.concorrencia === cota_search && row.curso === curso && row.campus === campus);

module.exports = {
    getByCampus,
    getByCurso,
    getBySexo,
    getMaiorNota,
    getNotaCorte,
    getVagas,
    getTotalInscritos,
    getCampusById,
    getMenorNota,
    areasConhecimento,
    getByAreaConhecimento,
    getCursoByAreaConhecimento,
    cotas,
    getByCota,
    getByCotaName
};

// console.log(getByCampus(resultado_if,7));
// console.log(getBySexo(getByCampus(resultado_if, 10), "F"));
// console.log(getByCurso(getByCampus(getBySexo(resultado_if, "M"),7), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO").length);
// console.log(parseFloat(replaceDot(getMaiorNota(resultado_if).nota)));
// console.log(getVagas(7, "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"));
// getNotaCorte(resultado_if);
// console.log(getNotaCorte(getByCurso(getByCampus(resultado_if, 7), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"));