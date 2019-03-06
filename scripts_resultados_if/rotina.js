const {getByCampus, getByCurso, getBySexo, getMaiorNota, getNotaCorte, getVagas, getTotalInscritos} = require('./filters');
const resultado_if = require('../resultados/resultado_if.json');
const inscritos_if = require('../files_inscritos/inscricoes_organizadas_com_sexo');
const campi = require('../resultados/campi_informacoes');

const cursos_pouco_inscritos = [];

campi.forEach((value, index) => {
    const campus_id = value.id;
    // console.log(campus_id);
    console.log(`${value.campus}:`);
    console.log(`${getByCampus(inscritos_if, campus_id).length} inscritos, porém com ${getByCampus(resultado_if, campus_id).length} resultados`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "M").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "M").length} do sexo masculino e`)
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "F").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "F").length} do sexo feminino`)

    let maior_nota = 0;
    let curso_maior_nota = 0;
    const notas_cortes_campus = [];
    value.cursos.forEach((curso) => {
        const total_inscritos = getTotalInscritos("", campus_id, curso.curso);
        if(Number(total_inscritos) < Number(curso.total_vagas)) {
            console.log(curso.curso + ": ");
            console.log(getByCurso(getByCampus(resultado_if, campus_id), curso.curso).length + " inscritos");
            cursos_pouco_inscritos.push(`${curso.curso} no ${value.campus}`);
            console.log("Possuiu menos inscritos que a quantidade total de vagas pelo processo seletivo");
        }
        const nota_corte = getNotaCorte(getByCurso(getByCampus(resultado_if, campus_id), curso.curso), curso.curso, 'AC', campus_id);

        notas_cortes_campus.push({nota_corte, curso: curso.curso});
        if(nota_corte > maior_nota){
            maior_nota = nota_corte;
            // console.log("OPA");
            curso_maior_nota = curso.curso;
        }
    });

    const getMenor = notas_cortes_campus.reduce((reducer, current) => (reducer.nota_corte < current.nota_corte) ? reducer : current,0);


    console.log("A menor nota de corte do câmpus " + value.campus + "  foi: " + getMenor.nota_corte + " no curso " + getMenor.curso);
    console.log("A maior nota de corte do câmpus " + value.campus + "  foi: " + maior_nota + " no curso " + curso_maior_nota + '\n');

});

console.log(cursos_pouco_inscritos.join(', ') );