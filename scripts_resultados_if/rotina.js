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
    cotas,
    getByCotas,
    getByCota
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
const maiores_menores_notas_corte_campi_cotas = {};
const maiores_menores_notas_corte_campi_cotas_to_json = {};
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
        const nota_corte = getNotaCorte(getByCurso(getByCampus(resultado, curso.campus), curso.curso), curso.curso, "AC", curso.campus);
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
        const curso_list = getByCurso(getByCampus(resultado, curso.campus), curso.curso);
        let vagas_cotas = 0;
        if (vagas_por_curso_detalhada[getCampusById(curso.campus).campus] === undefined) {
            vagas_por_curso_detalhada[getCampusById(curso.campus).campus] = {};
        }
        vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso] = {
            'RIPPI-PCD': 0,
            'RIPPI': 0,
            'RI': 0,
            'RSPPI-PCD': 0,
            'RSPPI': 0,
            'RS': 0
        };

        if (maiores_menores_notas_corte_campi_cotas_to_json[getCampusById(curso.campus).campus] === undefined) {
            maiores_menores_notas_corte_campi_cotas_to_json[getCampusById(curso.campus).campus] = {};
        }
        maiores_menores_notas_corte_campi_cotas_to_json[getCampusById(curso.campus).campus][curso.curso] = {
            'RIPPI-PCD': 0,
            'RIPPI': 0,
            'RI': 0,
            'RSPPI-PCD': 0,
            'RSPPI': 0,
            'RS': 0
        };

        cotas.forEach(cota => {
            const nota_corte = getNotaCorte(getByCota(curso_list, cota), curso.curso, cota, curso.campus);
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

            vagas_por_curso_detalhada[getCampusById(curso.campus).campus][curso.curso][cota] = vagas_curso_cota;

            if (vagas_area_conhecimento_por_cotas_detalhada[value] === undefined) {
                vagas_area_conhecimento_por_cotas_detalhada[value] = {};
            }
            if (vagas_area_conhecimento_por_cotas_detalhada[value][cota] === undefined) {
                vagas_area_conhecimento_por_cotas_detalhada[value][cota] = 0;
            }
            vagas_area_conhecimento_por_cotas_detalhada[value][cota] += vagas_curso_cota;

            if (maiores_menores_notas_corte_campi_cotas[getCampusById(curso.campus).campus] === undefined) {
                maiores_menores_notas_corte_campi_cotas[getCampusById(curso.campus).campus] = [];
            }

            maiores_menores_notas_corte_campi_cotas[getCampusById(curso.campus).campus].push({
                curso: curso.curso,
                cota,
                nota_corte: nota_corte || 0
            });

            maiores_menores_notas_corte_campi_cotas_to_json[getCampusById(curso.campus).campus][curso.curso][cota] = nota_corte || 0;

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

const sexo_maior_menor_nota_com_cota = {
    maior: {
        homens: {
            cota: getMaiorNota(getByCotas(getBySexo(resultado_if, "M"))).concorrencia,
            nota: getMaiorNota(getByCotas(getBySexo(resultado_if, "M"))).nota
        },
        mulheres: {
            cota: getMaiorNota(getByCotas(getBySexo(resultado_if, "F"))).concorrencia,
            nota: getMaiorNota(getByCotas(getBySexo(resultado_if, "F"))).nota
        }
    },
    menor: {
        homens: {
            cota: getMenorNota(getByCotas(getBySexo(resultado_if, "M"))).concorrencia,
            nota: getMenorNota(getByCotas(getBySexo(resultado_if, "M"))).nota
        },
        mulheres: {
            cota: getMenorNota(getByCotas(getBySexo(resultado_if, "F"))).concorrencia,
            nota: getMenorNota(getByCotas(getBySexo(resultado_if, "F"))).nota
        }
    }
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
const maiores_menores_notas_sexo = {
    maior: {
        homens: getMaiorNota(getBySexo(resultado_if, "M")).nota,
        mulheres: getMaiorNota(getBySexo(resultado_if, "F")).nota,
    },
    menor: {
        homens: getMenorNota(getBySexo(resultado_if, "M")).nota,
        mulheres: getMenorNota(getBySexo(resultado_if, "F")).nota
    }
};

const inscritos_por_campus = {};
const inscritos_por_campus_com_sexo = {};
let total_vagas = 0;
const campi_maiores_menores_notas_corte_ampla_concorrencia = {};
const maiores_menores_notas_corte_campi_cotas_filtered = {};
const curso_inscritos = {};
const curso_inscritos_com_sexo = {};
const notas_corte_cursos_ampla_concorrencia = {};
const maiores_menores_notas_curso = {};
const curso_vagas = {};
let resultado_curso = "Total de inscritos por curso: \r\n";
let resultado_campus = "Total de inscritos por campus: \r\n";

campi.forEach((value, index) => {
    const campus_id = value.id;
    // console.log(campus_id);
    console.log(`${value.campus}:`);
    console.log(`${getByCampus(inscritos_if, campus_id).length} inscritos, porém com ${getByCampus(resultado_if, campus_id).length} resultados`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "M").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "M").length} do sexo masculino e`);
    console.log(`Sendo esses: Inscritos - ${getBySexo(getByCampus(inscritos_if, campus_id), "F").length} e Com resultado - ${getBySexo(getByCampus(resultado_if, campus_id), "F").length} do sexo feminino`);
    resultado_campus += `${value.campus} ${getByCampus(resultado_if, campus_id).length} inscritos\r\n`;

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

        if (curso_vagas[value.campus] === undefined) {
            curso_vagas[value.campus] = {};
        }

        curso_vagas[value.campus][curso.curso] = curso.total_vagas;

        const list = getByCurso(getByCampus(resultado_if, campus_id), curso.curso);
        console.log("Total de inscritos no curso: " + list.length);
        resultado_curso += `${value.campus} e curso ${curso.curso}: ${list.length}\r\n`;

        if (maiores_menores_notas_curso[value.campus] === undefined) {
            maiores_menores_notas_curso[value.campus] = {};
        }
        if (maiores_menores_notas_curso[value.campus][curso.curso] === undefined) {
            maiores_menores_notas_curso[value.campus][curso.curso] = {};
        }
        maiores_menores_notas_curso[value.campus][curso.curso].maior = getMaiorNota(list).nota;
        maiores_menores_notas_curso[value.campus][curso.curso].menor = getMenorNota(list).nota;


        const list_feminino = getBySexo(list, "F");
        const list_masculino = getBySexo(list, "M");

        if (curso_inscritos[value.campus] === undefined) {
            curso_inscritos[value.campus] = {};
        }
        curso_inscritos[value.campus][curso.curso] = list.length;

        if (curso_inscritos_com_sexo[value.campus] === undefined) {
            curso_inscritos_com_sexo[value.campus] = {};
        }
        if (curso_inscritos_com_sexo[value.campus][curso.curso] === undefined) {
            curso_inscritos_com_sexo[value.campus][curso.curso] = {};
        }
        curso_inscritos_com_sexo[value.campus][curso.curso].homens = list_masculino.length;
        curso_inscritos_com_sexo[value.campus][curso.curso].mulheres = list_feminino.length;

        console.log("Inscritos do sexo feminino: " + list_feminino.length);
        console.log("Inscritos do sexo masculino: " + list_masculino.length);

        if (Number(total_inscritos) < Number(curso.total_vagas)) {
            cursos_pouco_inscritos.push(`${curso.curso} no ${value.campus}` + " (" + getByCurso(getByCampus(resultado_if, campus_id), curso.curso).length + " inscritos de " + curso.total_vagas + " vagas)");
            console.log("Possuiu menos inscritos que a quantidade total de vagas pelo processo seletivo (" + getByCurso(getByCampus(resultado_if, campus_id), curso.curso).length + " de " + curso.total_vagas + ")");
        }
        const nota_corte = getNotaCorte(getByCurso(getByCampus(resultado_if, campus_id), curso.curso), curso.curso, 'AC', campus_id);

        console.log("Nota de corte do curso: " + nota_corte);
        if (notas_corte_cursos_ampla_concorrencia[value.campus] === undefined) {
            notas_corte_cursos_ampla_concorrencia[value.campus] = {};
        }
        notas_corte_cursos_ampla_concorrencia[value.campus][curso.curso] = nota_corte;
        notas_cortes_campus.push({nota_corte, curso: curso.curso});
        if (nota_corte > maior_nota) {
            maior_nota = nota_corte;
            curso_maior_nota = curso.curso;
        }

        total_vagas += Number(curso.total_vagas);
        vagas_campus += Number(curso.total_vagas);
    });
    const maior_nota_corte_campus_cota = maiores_menores_notas_corte_campi_cotas[value.campus].reduce((reducer, curr) => {
        return (parseFloat(reducer.nota_corte) > parseFloat(curr.nota_corte)) ? reducer : curr
    }, {nota_corte: 0});
    const menor_nota_corte_campus_cota = maiores_menores_notas_corte_campi_cotas[value.campus].reduce((reducer, curr) => {
        if(parseFloat(curr.nota_corte) === 0){
            curr.nota_corte = 8000;
        }
        return (parseFloat(reducer.nota_corte) < parseFloat(curr.nota_corte)) ? reducer : curr
    }, {nota_corte: 8000});

    if(menor_nota_corte_campus_cota.nota_corte === 8000){
        menor_nota_corte_campus_cota.nota_corte = 0;
    }

    if (maiores_menores_notas_corte_campi_cotas_filtered[value.campus] === undefined) {
        maiores_menores_notas_corte_campi_cotas_filtered[value.campus] = {
            maior: {[maior_nota_corte_campus_cota.cota]: maior_nota_corte_campus_cota.nota_corte},
            menor: {[menor_nota_corte_campus_cota.cota]: menor_nota_corte_campus_cota.nota_corte}
        };
    }

    console.log("A quantidade de vagas ofertada pelo campus foi de: " + vagas_campus);
    vagas_campi.push({[value.campus]: vagas_campus});

    const getMenor = notas_cortes_campus.reduce((reducer, current) => (reducer.nota_corte < current.nota_corte) ? reducer : current, 0);

    campi_maiores_menores_notas_corte_ampla_concorrencia[value.campus] = {};
    campi_maiores_menores_notas_corte_ampla_concorrencia[value.campus].maior = maior_nota;
    campi_maiores_menores_notas_corte_ampla_concorrencia[value.campus].menor = getMenor.nota_corte;

    console.log("A menor nota de corte do câmpus " + value.campus + "  foi: " + getMenor.nota_corte + " no curso " + getMenor.curso);
    console.log("A maior nota de corte do câmpus " + value.campus + "  foi: " + maior_nota + " no curso " + curso_maior_nota + '\n');

});

let questao_seis = "";
console.log("Os cursos que houveram o número de convocados para 1ª chamada menor que o número de vagas foram: \r\n");
questao_seis += "Os cursos que houveram o número de convocados para 1ª chamada menor que o número de vagas foram: \r\n";
console.log(cursos_pouco_inscritos.join('\r\n'));
questao_seis += cursos_pouco_inscritos.join('\r\n');

console.log("\nO total de vagas ofertadas pelo processo seletivo foram: " + total_vagas);

let resultado_area_conhecimento = "Inscritos por área de conhecimento: \r\n";
Object.entries(inscritos_por_area_conhecimento).forEach(value => {
    resultado_area_conhecimento += `${value[0]}: ${value[1]}\r\n`
});

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
fs.writeFileSync('resultados/curso_vagas_if.json', JSON.stringify(curso_vagas));
fs.writeFileSync('resultados/curso_inscritos_if.json', JSON.stringify(curso_inscritos)); //1 e 5
fs.writeFileSync('resultados/curso_inscritos_com_sexo_if.json', JSON.stringify(curso_inscritos_com_sexo)); //1 e 5
fs.writeFileSync('resultados/curso_notas_corte_ampla_concorrencia_if.json', JSON.stringify(notas_corte_cursos_ampla_concorrencia)); //1 e 5
fs.writeFileSync('resultados/curso_notas_corte_cotas_if.json', JSON.stringify(maiores_menores_notas_corte_campi_cotas_to_json)); //1 e 5
fs.writeFileSync('resultados/curso_maiores_menores_notas_if.json', JSON.stringify(maiores_menores_notas_curso)); //1 e 5

fs.writeFileSync('resultados/sexo_inscritos_if.json', JSON.stringify(sexo_inscritos));
fs.writeFileSync('resultados/sexo_inscritos_com_resultado_if.json', JSON.stringify(sexo_inscritos_com_resultado));
fs.writeFileSync('resultados/sexo_maiores_menores_notas_if.json', JSON.stringify(maiores_menores_notas_sexo));
fs.writeFileSync('resultados/sexo_maiores_menores_notas_com_cotas_if.json', JSON.stringify(sexo_maior_menor_nota_com_cota));

fs.writeFileSync('resultados/campi_quantidade_vagas_if.json', JSON.stringify(vagas_campi));
fs.writeFileSync('resultados/campi_quantidade_vagas_detalhada_if.json', JSON.stringify(campi_quantidade_vagas_detalhada));
fs.writeFileSync('resultados/campi_quantidade_inscritos_if.json', JSON.stringify(inscritos_por_campus));
fs.writeFileSync('resultados/campi_inscritos_por_campus_com_sexo_if.json', JSON.stringify(inscritos_por_campus_com_sexo));
fs.writeFileSync('resultados/campi_maiores_menores_notas_corte_ampla_concorrencia_if.json', JSON.stringify(campi_maiores_menores_notas_corte_ampla_concorrencia));
fs.writeFileSync('resultados/campi_maiores_menores_notas_corte_cota_if.json', JSON.stringify(maiores_menores_notas_corte_campi_cotas_filtered));


fs.writeFileSync('resultados_gerais/resultado_1_area_conhecimento_if.txt', resultado_area_conhecimento);
fs.writeFileSync('resultados_gerais/resultado_1_curso_if.txt', resultado_curso);
fs.writeFileSync('resultados_gerais/resultado_1_campus_if.txt', resultado_campus);

// Questão 6
fs.writeFileSync('resultados/questao_6_if.txt', questao_seis);