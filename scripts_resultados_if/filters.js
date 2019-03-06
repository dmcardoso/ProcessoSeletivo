const removeAccents = require('remover-acentos');
const resultado_if = require('../resultados/resultado_if.json');
const campi_info = require('../resultados/campi_informacoes');

const getByCampus = (list, campus_id) => list.filter(row => Number(row.campus) === Number(campus_id));

const getBySexo = (list, sexo) => list.filter(row => row.sexo === sexo);

const getByCurso = (list, curso) => list.filter(row => removeAccents(row.curso) === removeAccents(curso));

const getMaiorNota = (list) => list.reduce((reducer, curr) => parseFloat(replaceDot(reducer.nota)) < parseFloat(replaceDot(curr.nota)) ? curr : reducer);

const replaceDot = string => string.replace(',', '.');

const getNotaCorte = (list, curso, vaga_search = "AC", campus_id) => {
    const corte = getTotalInscritos(vaga_search, campus_id, curso);

    let filtro_colocacao = "";
    switch (vaga_search) {
        case "AC":
            filtro_colocacao = "classificacao_ac";
            break;
        default:
            filtro_colocacao = "classificacao_cota";
            break;
    }
    let ultimo_aprovado = list.filter(inscrito => Number(inscrito[filtro_colocacao]) === corte);

    if (ultimo_aprovado.length > 0) {
        ultimo_aprovado = ultimo_aprovado[0];
        return replaceDot(ultimo_aprovado.nota);
    } else {
        // console.log("Menos inscritos que a quantidade total de vagas");
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
        },0);
    }
};

module.exports = {getByCampus, getByCurso, getBySexo, getMaiorNota, getNotaCorte, getVagas, getTotalInscritos};

// console.log(getByCampus(resultado_if,7));
// console.log(getBySexo(getByCampus(resultado_if, 10), "F"));
// console.log(getByCurso(getByCampus(getBySexo(resultado_if, "M"),7), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO").length);
// console.log(parseFloat(replaceDot(getMaiorNota(resultado_if).nota)));
// console.log(getVagas(7, "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"));
// getNotaCorte(resultado_if);
// console.log(getNotaCorte(getByCurso(getByCampus(resultado_if, 7), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"), "BACHARELADO EM SISTEMAS DE INFORMAÇÃO"));