const json = require('./files_inscritos/inscricoes');
const fs = require('fs');

let contador = 0;
const new_json_array = Object.entries(json).filter((row, index, json) => {
    const this_row = row[1];
    if (this_row.inscricao === "") {
        json[(index + 1)][1].nome = `${this_row.nome} ${json[(index + 1)][1].nome}`;
        json[(index + 1)][1].vaga = `${this_row.vaga} ${json[(index + 1)][1].vaga}`;
        contador++;
    } else {
        return {nome: this_row.nome, vaga: this_row.vaga, inscricao: this_row.inscricao};
    }
});

console.log("Novo json: " + new_json_array.length);
console.log("Json antigo: " + Object.entries(json).length);
console.log("Errados removidos: " + contador);
console.log("Conta: " + (Object.entries(json).length - new_json_array.length));

if ((Object.entries(json).length - new_json_array.length) === contador) {
    console.log("Deu tudo certo");
}

// const cursos = [];
const campi = [];

const new_json_object = new_json_array.map(row => {
    let campus = row[1].vaga.split('- ')[1].toUpperCase();
    let curso = row[1].vaga.split('- ')[0].trim().toUpperCase();
    row[1].curso = curso;
    // row[1].campus = campus;

    // if (!cursos.includes(curso)) {
    //     cursos.push(curso);
    //
    //     row[1].curso = cursos.indexOf(curso);
    // }else{
    //     row[1].curso = cursos.indexOf(curso);
    // }

    if (!campi.includes(campus)) {
        campi.push(campus);

        row[1].campus = campi.indexOf(campus);
    }else{
        row[1].campus = campi.indexOf(campus);
    }

    row[1].sexo = "";
    row[1].nome = row[1].nome.trim();
    delete row[1]['field4'];
    delete row[1]['vaga'];
    return row[1];
});

// const new_cursos = cursos.map((curso,id)=> {
//     console.log(curso);
//     return {id, curso};
// });

const new_campi = campi.map((campus,id)=> {
    // console.log(campus);
    return {id, campus};
});

// console.log(new_campi);

// console.log(new_cursos);

fs.writeFileSync('files_inscritos/inscricoes_organizadas.json', JSON.stringify(new_json_object));
fs.writeFileSync('files_inscritos/campi.json', JSON.stringify(new_campi));