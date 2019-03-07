const {getByCampus, getByCurso, getBySexo, getMaiorNota, getNotaCorte, getVagas, getTotalInscritos, getCampusById, getMenorNota, areasConhecimento, getByAreaConhecimento, getCursoByAreaConhecimento, cotas} = require('./filters');
const resultado_if = require('../resultados/resultado_if.json');
const inscritos_if = require('../files_inscritos/inscricoes_organizadas_com_sexo');
const campi = require('../resultados/campi_informacoes');

const cursos_pouco_inscritos = [];

areasConhecimento.forEach((value, index) => {
    const resultado = getByAreaConhecimento(resultado_if, value);

    console.log(`${resultado.length} inscritos, com resultado, pela área de conhecimento ${value}`);

    const homens = getByAreaConhecimento(getBySexo(resultado_if, 'M'), value).length;
    const mulheres = getByAreaConhecimento(getBySexo(resultado_if, 'F'), value).length;
    console.log(`${homens} homens inscritos, com resultado, pela área de conhecimento ${value}`);
    console.log(`${mulheres} mulheres inscritas, com resultado, pela área de conhecimento ${value}`);
    const cursos = getCursoByAreaConhecimento(value, resultado_if);

    let maior_nota_corte = 0;
    let menor_nota_corte = null;
    cursos.forEach(curso => {
        const nota_corte = getNotaCorte(resultado_if, curso.curso, "AC", curso.campus);
        if (nota_corte > maior_nota_corte) maior_nota_corte = nota_corte;

        if (menor_nota_corte === null) menor_nota_corte = nota_corte;
        else if (menor_nota_corte > nota_corte) menor_nota_corte = nota_corte;
    });

    console.log(`${maior_nota_corte}; É a maior nota de corte da area de conhecimento ${value} pela ampla concorrência.`);
    console.log(`${menor_nota_corte}; É a menor nota de corte da area de conhecimento ${value} pela ampla concorrência.`);


    cursos.forEach(curso => {
        maior_nota_corte = 0;
        menor_nota_corte = null;
        let cota_maior = "";
        let cota_menor = "";
        cotas.forEach(cota => {
            const nota_corte = getNotaCorte(resultado, curso.curso, cota, curso.campus);
            console.log(nota_corte + " <<<<<<<<<<<<<<<<<<<<<<<<<");
            console.log(maior_nota_corte+ " ><<<<<<<<<<<<<<<<<<<<<<<<<");
            if (nota_corte > maior_nota_corte) {
                maior_nota_corte = nota_corte;
                cota_maior = cota;
            }

            if (menor_nota_corte === null) {
                menor_nota_corte = nota_corte;
                cota_menor = cota;
            } else if (menor_nota_corte > nota_corte) {
                menor_nota_corte = nota_corte;
                cota_menor = cota;
            }

        });

        if (maior_nota_corte !== undefined && maior_nota_corte > 0) {
            console.log(`${maior_nota_corte}; É a maior nota de corte da area de conhecimento ${value} pela cota ${cota_maior}.`);
        }

        if (menor_nota_corte !== undefined && menor_nota_corte > 0) {
            console.log(`${menor_nota_corte}; É a menor nota de corte da area de conhecimento ${value} pela cota ${cota_menor}.`);
        }
    });

    const maior_nota = getMaiorNota(resultado);
    const menor_nota = getMenorNota(resultado);

    console.log(`${maior_nota.nota}; É a maior nota da area de conhecimento ${value}, tirada pelo aluno ${maior_nota.nome} para o curso de ${maior_nota.curso} no ${getCampusById(maior_nota.campus).campus}`);
    console.log(`${menor_nota.nota}; É a menor nota da area de conhecimento ${value}, tirada pelo aluno ${menor_nota.nome} para o curso de ${menor_nota.curso} no ${getCampusById(menor_nota.campus).campus}`);


});

// Gerais
console.log('-------------------------------------------------------');
console.log(`Inscrições no processo seletivo: ${inscritos_if.length}`);
console.log(`Inscrições com resultado: ${resultado_if.length}`);
console.log('-------------------------------------------------------');
console.log("Inscritos: Mulheres: " + getBySexo(inscritos_if, "F").length);
console.log("Inscritos: Homens: " + getBySexo(inscritos_if, "M").length);
console.log('-------------------------------------------------------');
console.log("Com resultado: Mulheres: " + getBySexo(resultado_if, "F").length);
console.log("Com resultado: Homens: " + getBySexo(resultado_if, "M").length);
console.log('-------------------------------------------------------');
console.log("A maior nota tirada no processo seletivo foi: " + getMaiorNota(resultado_if).nota + " pelo aluno " + getMaiorNota(resultado_if).nome + " concorrendo ao curso de " + getMaiorNota(resultado_if).curso + " no campus " + getCampusById(getMaiorNota(resultado_if).campus).campus);
console.log("A maior nota tirada por um aluno do sexo masculino no processo seletivo foi: " + getMaiorNota(getBySexo(resultado_if, "M")).nota + " pelo aluno " + getMaiorNota(getBySexo(resultado_if, "M")).nome + " concorrendo ao curso de " + getMaiorNota(getBySexo(resultado_if, "M")).curso + " no campus " + getCampusById(getMaiorNota(getBySexo(resultado_if, "F")).campus).campus);
console.log("A maior nota tirada por um aluno do sexo feminino no processo seletivo foi: " + getMaiorNota(getBySexo(resultado_if, "F")).nota + " pela aluna " + getMaiorNota(getBySexo(resultado_if, "F")).nome + " concorrendo ao curso de " + getMaiorNota(getBySexo(resultado_if, "F")).curso + " no campus " + getCampusById(getMaiorNota(getBySexo(resultado_if, "F")).campus).campus);
console.log('-------------------------------------------------------');
console.log("A menor nota tirada no processo seletivo foi: " + getMenorNota(resultado_if).nota + " pelo aluno " + getMenorNota(resultado_if).nome + " concorrendo ao curso de " + getMenorNota(resultado_if).curso + " no campus " + getCampusById(getMenorNota(resultado_if).campus).campus);
console.log("A menor nota tirada por um aluno do sexo masculino no processo seletivo foi: " + getMenorNota(getBySexo(resultado_if, "M")).nota + " pelo aluno " + getMenorNota(getBySexo(resultado_if, "M")).nome + " concorrendo ao curso de " + getMenorNota(getBySexo(resultado_if, "M")).curso + " no campus " + getCampusById(getMenorNota(getBySexo(resultado_if, "F")).campus).campus);
console.log("A menor nota tirada por um aluno do sexo feminino no processo seletivo foi: " + getMenorNota(getBySexo(resultado_if, "F")).nota + " pela aluna " + getMenorNota(getBySexo(resultado_if, "F")).nome + " concorrendo ao curso de " + getMenorNota(getBySexo(resultado_if, "F")).curso + " no campus " + getCampusById(getMenorNota(getBySexo(resultado_if, "F")).campus).campus);
console.log('-------------------------------------------------------');

let total_vagas = 0;
campi.forEach((value, index) => {
    const campus_id = value.id;
    // console.log(campus_id);
    console.log(`${value.campus}:`);
    console.log(`${getByCampus(inscritos_if, campus_id).length} inscritos, porém com ${getByCampus(resultado_if, campus_id).length} resultados`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "M").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "M").length} do sexo masculino e`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "F").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "F").length} do sexo feminino`);

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