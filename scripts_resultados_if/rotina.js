const {getByCampus, getByCurso, getBySexo, getMaiorNota, getNotaCorte, getVagas} = require('./filters');
const resultado_if = require('../resultados/resultado_if.json');

console.log(getByCampus(resultado_if, 7));