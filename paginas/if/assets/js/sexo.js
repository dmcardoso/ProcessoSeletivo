let dados = [
    {
        url: '../../resultados/sexo_inscritos_if.json',
        elemento: 'inscritos_com_sexo',
        titulo: 'TOTAL DE INSCRITOS POR SEXO',
        multidaset: false
    },
    {
        url: '../../resultados/sexo_maiores_menores_notas_com_cotas_if.json',
        elemento: 'maior_menor_nota_cotas',
        titulo: 'MAIOR E MENOR NOTA DE CORTE POR COTAS',
        multidaset: true
    },
    {
        url: '../../resultados/sexo_maiores_menores_notas_if.json',
        elemento: 'maior_menor_nota_ac',
        titulo: 'MAIOR E MENOR NOTA DE CORTE AC',
        multidaset: true
    }
];

const loadDados = (dados) => {
    dados.forEach(v => {
        fetch(v.url)
            .then(function (res) {
                res.json().then(function (result) {
                    grafico(result, v.elemento, v.titulo, v.multidaset)
                })
            })
            .catch(function (err) {
                console.log('Erro ao carregar os dados: ', err)
            });
    })
};

loadDados(dados);

const grafico = function (dados, elemento, titulo, multidataset) {

    let elem = document.getElementById(elemento).getContext('2d'),
        config = {},
        colors = [
            '#001f3f', '#85144b', '#3D9970', '#FF4136', '#0074D9', '#FF851B',
            '#2ECC40', '#F012BE', '#39CCCC', '#7FDBFF', '#01FF70', '#B10DC9', '#FFDC00'
        ],
        labels = [],
        posicao_dados = [],
        novo = [],
        max_value = 0,
        min_value = 1000000;

    if (multidataset) {

        $.each(dados, function (i, v) {
            labels.push(i.toUpperCase());
            if (v > max_value) max_value = v;
            if (v < min_value) min_value = v;

            posicao_dados.push(v);
        });

        config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: []
            },
            options: {
                animation: {
                    duration: 300,
                    easing: "easeOutQuart",
                    onComplete: function () {
                        let chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                        ctx.font = Chart.helpers.fontString(14, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = '#4d4d4d';

                        this.data.datasets.forEach(function (dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                let data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y + 0);
                            });
                        });
                    }
                },
                title: {
                    display: true,
                    text: titulo.toUpperCase(),
                    fontSize: 30,
                    fontColor: '#4d4d4d'
                },
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                },
                hover: {
                    animationDuration: 0
                },
                tooltips: {
                    mode: 'point',
                    backgroundColor: '#9d9d9d',
                    borderColor: 'fff'
                },
                responsive: true
            }
        };

        $.each(Object.keys(posicao_dados[0]), function (i, v) {
            novo.push({indice: v, dados: []})
        });

        $.each(posicao_dados, function (i, v) {
            let cont = 0;

            $.each(v, function (a, b) {
                if (elemento === 'maior_menor_nota_cotas') {

                    if (novo[cont].indice === a) novo[cont].dados.push(b.nota);

                } else
                if (novo[cont].indice === a) novo[cont].dados.push(b);

                cont++;

            });
        });

        $.each(novo, function (i, v) {

            config.data.datasets.push({
                label: v.indice.toUpperCase(),
                data: [],
                backgroundColor: colors[i],
                hoverBackgroundColor: colors[i],
                borderColor: colors[i],
                fill: false,
                lineTension: 0,
                pointHitRadius: 10,
                pointStyle: 'rectRounded',
                borderWidth: 3
            });

            $.each(v.dados, function (a, b) {
                config.data.datasets[i].data.push(b.replace(',', '.'));
            });
        });

    } else {

        $.each(dados, function (i, v) {

            labels.push(i.toUpperCase());
            posicao_dados.push({indice: i, valor: v});
            if (v > max_value) max_value = v;
            if (v < min_value) min_value = v;

        });

        config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: titulo,
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    pointStyle: 'rectRounded'
                }]
            },
            options: {
                animation: {
                    duration: 300,
                    easing: "easeOutQuart",
                    onComplete: function () {
                        let chartInstance = this.chart,
                            ctx = chartInstance.ctx;

                        ctx.font = Chart.helpers.fontString(14, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = '#4d4d4d';

                        this.data.datasets.forEach(function (dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function (bar, index) {
                                let data = dataset.data[index];
                                ctx.fillText(data, bar._model.x, bar._model.y + 0);
                            });
                        });
                    }
                },
                title: {
                    text: titulo.toUpperCase(),
                    fontSize: 30,
                    fontColor: '#4d4d4d',
                    display: true
                },
                legend: {
                    labels: {
                        usePointStyle: true
                    },
                    display: false
                },
                hover: {
                    animationDuration: 0
                },
                tooltips: {
                    // enabled: false,
                    mode: 'point',
                    backgroundColor: '#9d9d9d',
                    borderColor: 'fff'
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            drawBorder: false,
                            color: []
                        },
                        ticks: {
                            min: 0,
                            max: max_value,
                            stepSize: Math.ceil(max_value / 7)
                        }
                    }]
                },
                responsive: true
            }
        };

        $.each(posicao_dados, function (i, v) {

            config.data.datasets[0].backgroundColor.push(colors[i]);
            config.data.datasets[0].borderColor.push(colors[i]);
            config.data.datasets[0].data.push(v.valor);

        });
    }

    return new Chart(elem, config);

}