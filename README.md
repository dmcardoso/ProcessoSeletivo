# Processo Seletivo IF Goiano 2019

---
### Lingagens e bibliotecas utilizadas:
* Linguagem principal: Node.js;
* Bibliotecas (backend):
```
    "csvtojson": "^2.0.8",
    "json2csv": "^4.3.5",
    "remover-acentos": "0.0.6"
```
* Bibliotecas (frontend):
````
    jQuery v3.3.1
    Chart.js v2.8.0-rc.1
````
* Para a geração dos gráficos foi utilizado a biblioteca [Chart.js](http://chartjs.org/).

---
## Roteiro do trabalho:

#### 1. Manipulação das amostras (Processo seletivo):
- Converter o pdf com a relação de inscritos para um arquivo com formato de facil edição;  (**40 minutos, aproximadamente**)
    - O tempo de execução do passo anterior se deu pela análise de qual site encontrado gerava a melhor forma de se trabalhar com o documento gerado, o escolhido foi [Convert.io](https://convertio.co/pt/pdf-csv/);
- Limpar o lixo do arquivo de texto `files_inscritos/inscricoes_com_lixo.txt` e gerou o arquivo `files_inscritos/inscricoes_limpo.txt`; ( **Aproximadamente  1 hora**)
- Colocar os delimitadores `;` em todas as linhas e limpar as linhas em branco do arquivo `files_inscritos/inscricoes_limpo.txt`; ( **Aproximadamente  30 minutos**)
    - Devido algumas linhas da tabela dos resultados estarem em duas linhas, esse passo foi feito manualmente para evitar um código extenso e cheio de validações que poderiam no final não funcionar perfeitamente.
- Passar para um formato .csv `files_inscritos/inscricoes.csv`; (__Aproximadamente  2 minutos__)

- Implementação do script `inscricoes_from_csv_to_json.js` utilizando a biblioteca `csvtojson` para passar o arquivo `files_inscritos/inscricoes.csv` para o formato json `files_inscritos/inscricoes.json`; (**Aproximadamente  5 minutos**)
- Implementação do script `json_inscricoes.js` para manipulação do arquivo gerado anteriormente e gerar os arquivos `files_inscritos/inscricoes_organizadas.json` e `files_inscritos/campi.json`; (**Aproximadamente  15 minutos**)
- Implementação do script `incricoes_to_csv.js` para gerar os arquivos `files_inscritos/inscricoes_organizadas.csv` e `campi.csv` dos json criados no passo anterior utilizando a biblioteca `json2csv`; (**Aproximadamente  10 minutos**)
- Implementação do script `resultado_if.js` para manipular todo o arquivo de resultado automaticamente e gerar os arquivos `resultados/resultado_if.json`, `resultados/resultado_if.csv` e `resultados/campi_informacoes.json`; (**Aproximadamente  1 hora e 30 minutos**)
- Inserção manual do sexo dos inscritos no arquivo `files_inscritos/inscricoes_organizadas.csv` referente aos inscritos no processo seletivo, que a partir desse foi possivel sincronizar com o de resultados e assim preenchê-los também, a partir do script do passo anterior. (**Aproximadamente  7 horas**)

**A partir desse ponto, a amostra referente ao processo seletivo está pronta para ser trabalhada.**

#### 2. Manipulação das amostras (SISU):

- Pesquisa dos arquivos referentes ao SISU, infelizmente só conseguimos arquivos referentes à primeira chamada, e não uma relação completa de todos os inscritos nos cursos. Felizmente achamos uma tabela completa com essa relação para o IFGoiano para a primeira chamada em [SISU](https://sisu.mec.gov.br/selecionados?co_oferta=104863) `files_sisu/sisu_completo.csv`; (**Aproximadamente  5 horas**)
- Implementação do script `aprovados_sisu.js` para manipulação da amostra e manter o padrão estabelecido anteriormente para a relação de inscritos do processo seletivo, sincronizando o sexo dos inscritos, não necessariamente significa que são os mesmos inscritos, apenas que o nome é exatamente o mesmo, logo, o sexo também. Foi encontrado a ocorrência de 89 pessoas nesse caso. Para esse passo foram gerados os arquivos: `files_sisu/inscricoes_organizadas_com_sexo.json`, `resultados/resultado_sisu.csv` e utlizada a biblioteca `csvtojson`; (**Aproximadamente  45 minutos**)
- Padronização das cotas pelo processo seletivo, devido o formato presente na planilha, gerando o arquivo `files_sisu/padronizado.csv`; (**Aproximadamente  1 hora**)
- Inserção manual do sexo dos inscritos restantes no arquivo `files_sisu/padronizado.csv`, gerando o arquivo `files_sisu/sisu_com_sexo.csv`. (**Aproximadamente  3 horas**)

**A partir desse ponto, a amostra referente ao sisu está pronta para ser trabalhada.**


#### 3. Resultados (Processo Seletivo)
- Exportação dos dados para SQL para tentar gerar os resultados a partir de um banco de dados. Tentativa falhou, visto que de qualquer forma teria que criar rotinas em programação para a geração dos SQLs, e ficou claro que o nível de complexidade aumentaria. (**Aproximadamente  6 horas**)
- Implementação do script `scripts_resultados_if/filters.js`, que se refere às validações em listas do processo seletivo, os métodos implementados foram: (**Aproximadamente  2 horas**)
```js
    /**
    *  Retorna os inscritos filtrados pelo campus informado.
    */
    getByCampus(list, campus_id)
    
    /**
     *  Retorna os inscritos filtrados pelo curso informado.
     */
    getByCurso(list, curso)
    
    /**
     *  Retorna os inscritos filtrados pelo sexo informado.
     */
    getBySexo(list, sexo)
    
    /**
     *  Retorna o inscrito filtrados pela maior nota.
     */
    getMaiorNota(list)
    
    /**
     *  Retorna a nota de corte do curso informado, filtrando pela cota e campus informados.
     */
    getNotaCorte(list, curso, vaga_search = "AC", campus_id)
    
    /**
     *  Retorna a nota de corte do curso informado, filtrando pela cota e campus informados.
     */
    getVagas(campus_id, curso_search, vaga_search = "")
    
    /**
     *  Retorna a quantidade de inscritos filtrando pelo curso e campus informados.
     */
    getTotalInscritos(vaga_search, campus_id, curso)
    
    /**
     *  Retorna o campus pelo id informado.
     */
    getCampusById(campus_id)
    
    /**
     *  Retorna o inscrito que obteve a menor nota.
     */
    getMenorNota(list)
    
    /**
     *  Retorna uma lista de inscritos filtrando pela área de conhecimento.
     */
    getByAreaConhecimento(list, area_search)
    
    /**
     *  Retorna uma lista de cursos filtrando pela área de conhecimento.
     */
    getCursoByAreaConhecimento(area_search, list)
    
    /**
     *  Retorna uma lista de inscritos filtrando por cotas, ignorando a ampla concorrência.
     */
    getByCotas(list)
    
    /**
     *  Retorna uma lista de inscritos filtrando pela cota informada.
     */
    getByCota(list, vaga_search)
```
- Além dos atributos e métodos auxiliares:
```js
    /**
     *  Substitui a vírgula por ponto na string informada.
     */
    replaceDot(string)
    
    /**
    * Lista de áreas de conhecimento.
    */
    const areasConhecimento = [
        'CIÊNCIAS SOCIAIS APLICADAS',
        'CIÊNCIAS AGRÁRIAS',
        'CIÊNCIAS EXATAS E DA TERRA',
        'CIÊNCIAS BIOLÓGICAS',
        'ENGENHARIAS',
        'CIÊNCIAS HUMANAS'
    ];
    
    /**
    * Lista das cotas do processo seletivo.
    */
    const cotas = [
        'RIPPI-PCD',
        'RIPPI',
        'RI-PCD',
        'RI',
        'RSPPI-PCD',
        'RSPPI',
        'RS-PCD',
        'RS'
    ];
```

- Implementação do arquivo `scripts_resultados_if/rotina.js`, que é responsável por gerar o relatório do resultado e os arquivos `.json`, que virão a ser os arquivos responsáveis pela geração dos gráficos. Esse ponto gerou os sequintes arquivos: (**Aproximadamente  14 horas**)
    * resultados/area_conhecimento_inscritos_if.json
    *  resultados/area_conhecimento_inscritos_com_sexo_if.json
    *  resultados/area_conhecimento_vagas_por_cotas_detalhada_if.json
    *  resultados/area_conhecimento_vagas_por_cotas_if.json
    *  resultados/area_conhecimento_maiores_menores_notas_corte_ampla_concorrencia_if.json
    *  resultados/area_conhecimento_maiores_menores_notas_corte_cotas_if.json
    *  resultados/curso_vagas_por_cotas_detalhada_if.json
    *  resultados/curso_vagas_por_cotas_if.json
    *  resultados/curso_vagas_if.json
    *  resultados/curso_inscritos_if.json
    *  resultados/curso_inscritos_com_sexo_if.json
    *  resultados/curso_notas_corte_ampla_concorrencia_if.json
    *  resultados/curso_notas_corte_cotas_if.json
    *  resultados/curso_maiores_menores_notas_if.json
    *  resultados/sexo_inscritos_if.json
    *  resultados/sexo_inscritos_com_resultado_if.json
    *  resultados/sexo_maiores_menores_notas_if.json
    *  resultados/sexo_maiores_menores_notas_com_cotas_if.json
    *  resultados/campi_quantidade_vagas_if.json
    *  resultados/campi_quantidade_vagas_detalhada_if.json
    *  resultados/campi_quantidade_inscritos_if.json
    *  resultados/campi_inscritos_por_campus_com_sexo_if.json
    *  resultados/campi_maiores_menores_notas_corte_ampla_concorrencia_if.json
    *  resultados/campi_maiores_menores_notas_corte_cota_if.json
    *  resultados_gerais/resultado_1_area_conhecimento_if.txt
    *  resultados_gerais/resultado_1_curso_if.txt
    *  resultados_gerais/resultado_1_campus_if.txt
    *  resultados/questao_6_if.txt
    
#### 4. Resultados (SISU)
- Implementação do script `sisu_area_conhecimento.js` que padroniza o `.json` de campi, para aproveitamento estrutural do script de resultados do processo seletivo e inclusão da área de conhecimento dos cursos nos dados do sisu, ressaltando que foram incluídos nos arquivos do processo seletivo ao mesmo tempo; (**Aproximadamente  4 horas**)
- Devido a padronização dos arquivos gerados, o arquivo de filtros do if, citado anteriormente foi praticamente genérico, necessitando apenas da alteração do método no arquivo `script_resultados_sisu/filters.js`: (**Aproximadamente  30 minutos**)
```js
    /**
    * Nesse caso, filtrará pelo curso, cota e campus informados, encontrando a primeira ocorrência
    * e retornando a nota corte, visto que as notas de corte para esse caso estão em todas
    * as linhas da tabela.
    */
    getNotaCorte(list, curso, cota, campus)
``` 
- Nos atributos auxliares houveram as seguintes mudanças: (Algumas cotas presentes no processo seletivo não são usadas no SISU)
```js
    const cotas = [
        'RIPPI-PCD',
        'RIPPI',
        'RI',
        'RSPPI-PCD',
        'RSPPI',
        'RS'
    ];
```

- Alteração na implementação em alguns pontos do arquivo da rotina dos resultados `scripts_resultados_sisu/rotina.js` referente ao sisu, e geração dos seguintes arquivos: (**Aproximadamente  3 horas**)
    * resultados_sisu/area_conhecimento_inscritos_sisu.json
    *  resultados_sisu/area_conhecimento_inscritos_com_sexo_sisu.json
    *  resultados_sisu/area_conhecimento_vagas_por_cotas_detalhada_sisu.json
    *  resultados_sisu/area_conhecimento_vagas_por_cotas_sisu.json
    *  resultados_sisu/area_conhecimento_maiores_menores_notas_corte_ampla_concorrencia_sisu.json
    *  resultados_sisu/area_conhecimento_maiores_menores_notas_corte_cotas_sisu.json
    *  resultados_sisu/curso_vagas_por_cotas_detalhada_sisu.json
    *  resultados_sisu/curso_vagas_por_cotas_sisu.json
    *  resultados_sisu/curso_vagas_sisu.json
    *  resultados_sisu/curso_inscritos_sisu.json
    *  resultados_sisu/curso_inscritos_com_sexo_sisu.json
    *  resultados_sisu/curso_notas_corte_ampla_concorrencia_sisu.json
    *  resultados_sisu/curso_notas_corte_cotas_sisu.json
    *  resultados_sisu/curso_maiores_menores_notas_sisu.json
    *  resultados_sisu/sexo_inscritos_com_resultado_sisu.json
    *  resultados_sisu/sexo_maiores_menores_notas_sisu.json
    *  resultados_sisu/sexo_maiores_menores_notas_com_cotas_sisu.json
    *  resultados_sisu/campi_quantidade_vagas_sisu.json
    *  resultados_sisu/campi_quantidade_vagas_detalhada_sisu.json
    *  resultados_sisu/campi_quantidade_inscritos_sisu.json
    *  resultados_sisu/campi_inscritos_por_campus_com_sexo_sisu.json
    *  resultados_sisu/campi_maiores_menores_notas_corte_ampla_concorrencia_sisu.json
    *  resultados_sisu/campi_maiores_menores_notas_corte_cota_sisu.json
    *  resultados_gerais/resultado_1_area_conhecimento_sisu.txt
    *  resultados_gerais/resultado_1_curso_sisu.txt
    *  resultados_gerais/resultado_1_campus_sisu.txt
    *  resultados_sisu/questao_6_sisu.txt

#### 5. Resultados Gerais
- Implementação do script `script_resultados_geral.js` que tem a finalidade de gerar os resultados cruzando as duas bases de resultados e gerando os seguintes arquivos: (**Aproximadamente  3 horas**)
    * resultados_gerais/geral_por_sexo.json
    * resultados_gerais/geral_por_processo.json
    * resultados_gerais/geral_por_vagas.json
    * resultados_gerais/geral_vagas_por_campus_detalhada.json
    * resultados_gerais/geral_vagas_por_campus.json
    * resultados_gerais/geral_aglutinacao_area_conhecimento.json
    * resultados_gerais/resultado_1_sexo.txt
    
#### 6. Gráficos
- Os gráficos do trabalho foram gerados a partir dos arquivos `.json` de resultados. As manipulações foram feitas individualmente, para que caso haja alteração nos resultados, ou dados, a estrutura do json fosse mantida e não prejudicasse a estrutura dos gráficos, o que ocorreu, alguns dados causaram inconsistência e ajustes no código dos resultados foram feitos. (**Aproximadamente 4 horas**)

---
* Para exibição dos gráficos basta clonar o repositório e executá-lo em algum servidor http, visto que os arquivos de resultados são carregados por AJAX.
```git
    $ git clone https://github.com/dmcardoso/ProcessoSeletivo 
```

* Para a execução dos código das rotinas e manipulações é necessário clonar o projeto e executar o seguinte comando:
```npm
    $ npm install
```

* Cada arquivo deverá ser invocado da seguinte maneira (em seu respectivo diretório):
```npm
    $ node [nome_arquivo].js
```
