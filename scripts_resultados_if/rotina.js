const fs = require('fs');
const {
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
    cotas
} = require('./filters');
const resultado_if = require('../resultados/resultado_if.json');
const inscritos_if = require('../files_inscritos/inscricoes_organizadas_com_sexo');
const campi = require('../resultados/campi_informacoes');

const cursos_pouco_inscritos = [];
const vagas_area_conhecimento_por_cotas = {};
const vagas_area_conhecimento_por_cotas_detalhada = {};
const vagas_por_curso = {};
const vagas_por_curso_detalhada = {};
const campi_quantidade_vagas_detalhada = {};
const maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia = {};
const maiores_menores_notas_corte_area_conhecimento_cotas = {};
const inscritos_com_sexo_por_area_conhecimento = {};
const inscritos_por_area_conhecimento = {};

areasConhecimento.forEach((value, index) => {
    const resultado = getByAreaConhecimento(resultado_if, value);

    console.log(`${resultado.length} inscritos, com resultado, pela área de conhecimento ${value}`);
    inscritos_por_area_conhecimento[value] = resultado.length;

    const homens = getByAreaConhecimento(getBySexo(resultado_if, 'M'), value).length;
    const mulheres = getByAreaConhecimento(getBySexo(resultado_if, 'F'), value).length;
    console.log(`${homens} homens inscritos, com resultado, pela área de conhecimento ${value}`);
    console.log(`${mulheres} mulheres inscritas, com resultado, pela área de conhecimento ${value}`);
    inscritos_com_sexo_por_area_conhecimento[value] = {};
    inscritos_com_sexo_por_area_conhecimento[value].homens = homens;
    inscritos_com_sexo_por_area_conhecimento[value].mulheres = mulheres;

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

    if (maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia[value] === undefined) {
        maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia[value] = {};
        maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia[value].maior = maior_nota_corte;
        maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia[value].menor = menor_nota_corte;
    }

    maior_nota_corte = 0;
    menor_nota_corte = null;
    let cota_maior = "";
    let cota_menor = "";

    let vagas_cotas_area_conhecimento = 0;
    let vagas_ampla_concorrencia = 0;

    cursos.forEach(curso => {
        let vagas_cotas = 0;
        cotas.forEach(cota => {
            const nota_corte = getNotaCorte(resultado, curso.curso, cota, curso.campus);
            if (nota_corte > maior_nota_corte) {
                maior_nota_corte = nota_corte;
                cota_maior = cota;
            }

            if (menor_nota_corte === null || menor_nota_corte === undefined) {
                menor_nota_corte = nota_corte;
                cota_menor = cota;
            } else if (menor_nota_corte > nota_corte) {
                menor_nota_corte = nota_corte;
                cota_menor = cota;
            }

            const vagas_curso_cota = getVagas(curso.campus, curso.curso, cota);
            vagas_cotas += vagas_curso_cota;

            if (vagas_por_curso_detalhada[getCampusById(curso.campus).campus] === undefined) {
                vagas_por_curso_detalhada[getCampusById(curso.campus).campus] = {};
            }
            if (vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso] === undefined) {
                vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso] = {};
            }
            vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso][cota] = vagas_curso_cota;

            if (vagas_area_conhecimento_por_cotas_detalhada[value] === undefined) {
                vagas_area_conhecimento_por_cotas_detalhada[value] = {};
            }
            if (vagas_area_conhecimento_por_cotas_detalhada[value][cota] === undefined) {
                vagas_area_conhecimento_por_cotas_detalhada[value][cota] = 0;
            }
            vagas_area_conhecimento_por_cotas_detalhada[value][cota] += vagas_curso_cota;

        });
        console.log("Vagas reservadas para cotas no curso " + curso.curso + " do " + getCampusById(curso.campus).campus + ": " + vagas_cotas);
        vagas_cotas_area_conhecimento += vagas_cotas;

        const vagas_ampla_concorrencia_curso = getVagas(curso.campus, curso.curso, "AC");
        console.log("Vagas para Ampla Concorrência no curso " + curso.curso + " do " + getCampusById(curso.campus).campus + ": " + vagas_ampla_concorrencia_curso);

        if (vagas_area_conhecimento_por_cotas_detalhada[value] === undefined) {
            vagas_area_conhecimento_por_cotas_detalhada[value] = {};
        }
        if (vagas_area_conhecimento_por_cotas_detalhada[value].ac === undefined) {
            vagas_area_conhecimento_por_cotas_detalhada[value].ac = 0;
        }

        if (vagas_por_curso[getCampusById(curso.campus).campus] === undefined) {
            vagas_por_curso[getCampusById(curso.campus).campus] = {};
        }
        if (vagas_por_curso[getCampusById(curso.campus).campus][curso.curso] === undefined) {
            vagas_por_curso[getCampusById(curso.campus).campus][curso.curso] = {};
        }
        vagas_por_curso[getCampusById(curso.campus).campus][curso.curso].ac = vagas_ampla_concorrencia_curso;
        vagas_por_curso[getCampusById(curso.campus).campus][curso.curso].cotas = vagas_cotas;
        vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso]["AC"] = vagas_ampla_concorrencia_curso;


        vagas_area_conhecimento_por_cotas_detalhada[value].ac += vagas_ampla_concorrencia_curso;
        vagas_ampla_concorrencia += vagas_ampla_concorrencia_curso;

        if (campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus] === undefined) {
            campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus] = {};
        }
        if (campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].ac === undefined) {
            campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].ac = 0;
        }
        if (campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].cotas === undefined) {
            campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].cotas = 0;
        }
        campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].ac += vagas_ampla_concorrencia_curso;
        campi_quantidade_vagas_detalhada[getCampusById(curso.campus).campus].cotas += vagas_cotas;
    });

    console.log("Vagas reservadas para cotas na Área de Conhecimento " + value + ": " + vagas_cotas_area_conhecimento);
    console.log("Vagas para Ampla Concorrência na Área de Conhecimento " + value + ": " + vagas_ampla_concorrencia);
    console.log("Total de vagas para a Área de Conhecimento " + value + ": " + (vagas_ampla_concorrencia + vagas_cotas_area_conhecimento));

    if (vagas_area_conhecimento_por_cotas[value] === undefined) {
        vagas_area_conhecimento_por_cotas[value] = {};
    }
    vagas_area_conhecimento_por_cotas[value].ac = vagas_ampla_concorrencia;
    vagas_area_conhecimento_por_cotas[value].cotas = vagas_cotas_area_conhecimento;


    if (maior_nota_corte > 0) {
        console.log(`${maior_nota_corte}; É a maior nota de corte da area de conhecimento ${value} pela cota ${cota_maior}.`);
        if (maiores_menores_notas_corte_area_conhecimento_cotas[value] === undefined) {
            maiores_menores_notas_corte_area_conhecimento_cotas[value] = {};
        }
        maiores_menores_notas_corte_area_conhecimento_cotas[value].maior = {
            [cota_maior]: maior_nota_corte
        }
    }

    if (menor_nota_corte > 0) {
        console.log(`${menor_nota_corte}; É a menor nota de corte da area de conhecimento ${value} pela cota ${cota_menor}.`);
        if (maiores_menores_notas_corte_area_conhecimento_cotas[value] === undefined) {
            maiores_menores_notas_corte_area_conhecimento_cotas[value] = {};
        }
        maiores_menores_notas_corte_area_conhecimento_cotas[value].menor = {
            [cota_menor]: menor_nota_corte
        }
    }

    const maior_nota = getMaiorNota(resultado);
    const menor_nota = getMenorNota(resultado);

    console.log(`${maior_nota.nota}; É a maior nota da area de conhecimento ${value}, tirada pelo aluno ${maior_nota.nome} para o curso de ${maior_nota.curso} no ${getCampusById(maior_nota.campus).campus}`);
    console.log(`${menor_nota.nota}; É a menor nota da area de conhecimento ${value}, tirada pelo aluno ${menor_nota.nome} para o curso de ${menor_nota.curso} no ${getCampusById(menor_nota.campus).campus}\n`);


});

const sexo_inscritos = {
    mulheres: getBySexo(inscritos_if, "F").length,
    homens: getBySexo(inscritos_if, "M").length
};
const sexo_inscritos_com_resultado = {
    mulheres: getBySexo(resultado_if, "F").length,
    homens: getBySexo(resultado_if, "M").length
};

const vagas_campi = [];
// Gerais
console.log('-------------------------------------------------------');
console.log(`Inscrições no processo seletivo: ${inscritos_if.length}`);
console.log(`Inscrições com resultado: ${resultado_if.length}`);
inscritos_por_area_conhecimento.total = resultado_if.length;
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

const inscritos_por_campus = {};
const inscritos_por_campus_com_sexo = {};
let total_vagas = 0;
campi.forEach((value, index) => {
    const campus_id = value.id;
    // console.log(campus_id);
    console.log(`${value.campus}:`);
    console.log(`${getByCampus(inscritos_if, campus_id).length} inscritos, porém com ${getByCampus(resultado_if, campus_id).length} resultados`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "M").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "M").length} do sexo masculino e`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "F").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "F").length} do sexo feminino`);

    inscritos_por_campus[value.campus] = getByCampus(resultado_if, campus_id).length;
    inscritos_por_campus_com_sexo[value.campus] = {};
    inscritos_por_campus_com_sexo[value.campus].homens = getBySexo(getByCampus(resultado_if, campus_id), "M").length;
    inscritos_por_campus_com_sexo[value.campus].mulheres = getBySexo(getByCampus(resultado_if, campus_id), "F").length;

    let maior_nota = 0;
    let curso_maior_nota = 0;
    const notas_cortes_campus = [];
    let vagas_campus = 0;
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
            cursos_pouco_inscritos.push(`${curso.curso} no ${value.campus}` + " (" + getByCurso(getByCampus(resultado_if, campus_id), curso.curso).length + " inscritos de " + curso.total_vagas + " vagas)");
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
        vagas_campus += Number(curso.total_vagas);
    });

    console.log("A quantidade de vagas ofertada pelo campus foi de: " + vagas_campus);
    vagas_campi.push({[value.campus]: vagas_campus});

    const getMenor = notas_cortes_campus.reduce((reducer, current) => (reducer.nota_corte < current.nota_corte) ? reducer : current, 0);


    console.log("A menor nota de corte do câmpus " + value.campus + "  foi: " + getMenor.nota_corte + " no curso " + getMenor.curso);
    console.log("A maior nota de corte do câmpus " + value.campus + "  foi: " + maior_nota + " no curso " + curso_maior_nota + '\n');

});

let questao_seis = "";
console.log("Os cursos que houveram o número de convocados para 1ª chamada menor que o número de vagas foram: \r\n");
questao_seis += "Os cursos que houveram o número de convocados para 1ª chamada menor que o número de vagas foram: \r\n";
console.log(cursos_pouco_inscritos.join('\r\n'));
questao_seis += cursos_pouco_inscritos.join('\r\n');

console.log("\nO total de vagas ofertadas pelo processo seletivo foram: " + total_vagas);

/**
 * Escreve os arquivos dos resultados
 */
// Area conhecimento
fs.writeFileSync('resultados/area_conhecimento_inscritos_if.json', JSON.stringify(inscritos_por_area_conhecimento)); //1 e 5
fs.writeFileSync('resultados/area_conhecimento_inscritos_com_sexo_if.json', JSON.stringify(inscritos_com_sexo_por_area_conhecimento)); //1 e 5
fs.writeFileSync('resultados/area_conhecimento_vagas_por_cotas_detalhada_if.json', JSON.stringify(vagas_area_conhecimento_por_cotas_detalhada)); //2
fs.writeFileSync('resultados/area_conhecimento_vagas_por_cotas_if.json', JSON.stringify(vagas_area_conhecimento_por_cotas)); //2
fs.writeFileSync('resultados/area_conhecimento_maiores_menores_notas_corte_ampla_concorrencia_if.json', JSON.stringify(maiores_menores_notas_corte_area_conhecimento_ampla_concorrencia)); //3 e 4
fs.writeFileSync('resultados/area_conhecimento_maiores_menores_notas_corte_cotas_if.json', JSON.stringify(maiores_menores_notas_corte_area_conhecimento_cotas));//3 e 4

fs.writeFileSync('resultados/curso_vagas_por_cotas_detalhada_if.json', JSON.stringify(vagas_por_curso_detalhada));
fs.writeFileSync('resultados/curso_vagas_por_cotas_if.json', JSON.stringify(vagas_por_curso));

fs.writeFileSync('resultados/sexo_inscritos_if.json', JSON.stringify(sexo_inscritos));
fs.writeFileSync('resultados/sexo_inscritos_com_resultado_if.json', JSON.stringify(sexo_inscritos_com_resultado));

fs.writeFileSync('resultados/campi_quantidade_vagas_if.json', JSON.stringify(vagas_campi));
fs.writeFileSync('resultados/campi_quantidade_vagas_detalhada_if.json', JSON.stringify(campi_quantidade_vagas_detalhada));
fs.writeFileSync('resultados/campi_quantidade_inscritos_if.json', JSON.stringify(inscritos_por_campus));
fs.writeFileSync('resultados/campi_inscritos_por_campus_com_sexo_if.json', JSON.stringify(inscritos_por_campus_com_sexo));

// Questão 6
fs.writeFileSync('resultados/questao_6_if.txt', questao_seis);