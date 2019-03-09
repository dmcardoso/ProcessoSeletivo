const csvFilePath = './files_sisu/sisu_com_sexo.csv';
const csvAreaConhecimentoFilePath = './files_inscritos/curso_area_conhecimento.csv';
const fs = require('fs');
const csv = require('csvtojson');
const removeAccents = require('remover-acentos');
const campi = require('./files_inscritos/campi');

const start = async () => {
    const sisu = await csv({delimiter: ';'})
        .fromFile(csvFilePath);
    const area_conhecimento_csv = await csv({delimiter: ';'})
        .fromFile(csvAreaConhecimentoFilePath);

    const new_sisu = sisu.map(({inscricao, nome, campus, sexo, concorrencia, curso, nota, nota_corte_concorrida, classificacao}) => {

        const new_curso = curso.split('(')[0].trim();

        const getAreaConhecimento = (curso_area) => area_conhecimento_csv.filter(area => removeAccents(curso_area.toUpperCase()) === removeAccents(area.curso.toUpperCase()));
        const area_conhecimento_array = getAreaConhecimento(new_curso);

        // console.log(area_conhecimento_array, new_curso);
        let area_conhecimento = "";
        if (area_conhecimento.length < 0) {
            console.log("deu errado");
        } else {
            area_conhecimento = area_conhecimento_array[0].area;
        }

        return {
            inscricao,
            nome,
            campus: Number(campus),
            sexo,
            concorrencia,
            nota,
            curso: new_curso,
            nota_corte_concorrida,
            classificacao,
            area_conhecimento
        };
    });

    const campi_sisu = [];
    new_sisu.forEach(({campus, concorrencia, curso, classificacao}) => {
        const equal = (id) => campi_sisu.some(campus => campus.id === id);
        const getCampusName = (id) => campi.filter(campus => campus.id === Number(id))[0].campus;
        const getPosition = (id) => campi_sisu.filter(campus => Number(campus.id) === Number(id))[0];
        if(!equal(campus)){
            campi_sisu.push({
                id: campus,
                campus: getCampusName(campus),
                cursos: [{
                    curso,
                    vagas :[{
                        [concorrencia] : 1
                    }]
                }]
            })
        }else{
            const campus_index = campi_sisu.indexOf(getPosition(campus));
            const equalCursos = (list, curso) => list.some(curso_row => curso_row.curso === curso);
            const getPositionCurso = (list, curso) => list.filter(curso_row => curso_row.curso === curso)[0];

            if(equalCursos(campi_sisu[campus_index].cursos, curso)){
                const curso_index = campi_sisu[campus_index].cursos.indexOf(getPositionCurso(campi_sisu[campus_index].cursos, curso));
                const obj_vaga = campi_sisu[campus_index].cursos[curso_index].vagas.filter(row_vaga => Object.keys(row_vaga)[0] === concorrencia)[0];
                const getPositionVaga = campi_sisu[campus_index].cursos[curso_index].vagas.indexOf(obj_vaga);

                let vaga = "";

                if(obj_vaga !== null && obj_vaga !== undefined && Object.keys(obj_vaga)[0].length > 0){
                    vaga = Object.keys(obj_vaga)[0];
                }

                if(getPositionVaga === -1){
                    campi_sisu[campus_index].cursos[curso_index].vagas.push({[concorrencia]: 1});
                }else{
                    campi_sisu[campus_index].cursos[curso_index].vagas[getPositionVaga][vaga] += 1;
                }
            }else{
                campi_sisu[campus_index].cursos.push({
                    curso,
                    vagas :[{
                        [concorrencia] : 1
                    }]
                });
            }
        }
    });

    const sisu_total_vagas_csv = await csv({delimiter: ';'})
        .fromFile('./files_sisu/campi_vagas_sisu.csv');
    campi_sisu.forEach((value, index) => {
        value.cursos.forEach((curso_atual, index_curso) => {
            const total_vagas_qtde_array = curso_atual.vagas.map(vaga => vaga[Object.keys(vaga)[0]]);

            campi_sisu[index].cursos[index_curso].vagas_calculadas = total_vagas_qtde_array.reduce((reducer, curr) => reducer + curr);

            sisu_total_vagas_csv.forEach(({campus, curso, vagas}) => {
                const campus_id = value.id;
                const this_curso = curso_atual.curso;
                if(curso === "Bacharelado em Engenharia da Computação") curso = "Bacharelado em Engenharia de Computação";
                if(Number(campus_id) === Number(campus) && removeAccents(this_curso.toUpperCase()) === removeAccents(curso.toUpperCase())){
                    campi_sisu[index].cursos[index_curso].total_vagas = vagas;
                }
            });
        });
    });

    return {new_sisu, campi_sisu};
};

start()
    .then(({new_sisu, campi_sisu}) => {
        fs.writeFileSync('files_sisu/sisu_final.json', JSON.stringify(new_sisu));
        fs.writeFileSync('files_sisu/campi_info_sisu.json', JSON.stringify(campi_sisu));
    });