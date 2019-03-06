const {getByCampus, getByCurso, getBySexo, getMaiorNota, getNotaCorte, getVagas, getTotalInscritos} = require('./filters');
const resultado_if = require('../resultados/resultado_if.json');
const inscritos_if = require('../files_inscritos/inscricoes_organizadas_com_sexo');
const campi = require('../resultados/campi_informacoes');

const cursos_pouco_inscritos = [];

console.log(`Inscrições no processo seletivo: ${inscritos_if.length}`);
console.log(`Inscrições com resultado: ${resultado_if.length}`);
console.log('-------------------------------------------------------');
console.log("Inscritos: Mulheres: " + getBySexo(inscritos_if, "F").length);
console.log("Inscritos: Homens: " + getBySexo(inscritos_if, "M").length);
console.log('-------------------------------------------------------');
console.log("Com resultado: Mulheres: " + getBySexo(resultado_if, "F").length);
console.log("Com resultado: Homens: " + getBySexo(resultado_if, "M").length);
console.log('-------------------------------------------------------');

let total_vagas = 0;
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
        console.log(curso.curso + ": ");

        const list = getByCurso(getByCampus(resultado_if, campus_id), curso.curso);
        console.log("Total de inscritos no curso: " + list.length);
        const list_feminino = getBySexo(list, "F");
        const list_masculino = getBySexo(list, "M");

        console.log("Inscritos do sexo feminino: " + list_feminino.length);
        console.log("Inscritos do sexo masculino: " + list_masculino.length);

        if (Number(total_inscritos) < Number(curso.total_vagas)) {
            cursos_pouco_inscritos.push(`${curso.curso} no ${value.campus}`);
            console.log("Possuiu menos inscritos que a quantidade total de vagas pelo processo seletivo (" + getByCurso(getByCampus(resultado_if, campus_id), curso.curso).length + " de " + curso.total_vagas + ")");
        }
        const nota_corte = getNotaCorte(getByCurso(getByCampus(resultado_if, campus_id), curso.curso), curso.curso, 'AC', campus_id);

        console.log("Nota de corte do curso: " + nota_corte);
        notas_cortes_campus.push({nota_corte, curso: curso.curso});
        if (nota_corte > maior_nota) {
            maior_nota = nota_corte;
            curso_maior_nota = curso.curso;
        }

        total_vagas += Number(curso.total_vagas);
    });

    const getMenor = notas_cortes_campus.reduce((reducer, current) => (reducer.nota_corte < current.nota_corte) ? reducer : current, 0);


    console.log("A menor nota de corte do câmpus " + value.campus + "  foi: " + getMenor.nota_corte + " no curso " + getMenor.curso);
    console.log("A maior nota de corte do câmpus " + value.campus + "  foi: " + maior_nota + " no curso " + curso_maior_nota + '\n');

});

console.log("Os cursos que houveram o número de convocados para 1ª chamada menor que o número de vagas foram: ");
console.log(cursos_pouco_inscritos.join('\r\n'));
console.log("\nO total de vagas ofertadas pelo processo seletivo foram: " + total_vagas);