/* NODE VERSIONS */
var chartColors = ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A',
'#FFEB3B', '#FF9800', '#795548', '#E91E63', '#673AB7', '#2196F3', '#00BCD4', '#4CAF50',
'#CDDC39', '#FFC107', '#FF5722'
];

init.push(getData);

function getData() {
  $.get("/api/telemetry/raw", function (data) {
    var counts = data.metrics.reduce((p, c) => {
      var name = c.major_version + '.' + c.minor_version + '.' + c.patch_version;
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;
      return p;
    }, {});
    
    prepareGraphData(counts);
  });
}

function prepareGraphData(data){
  var chartdata = {
    labels: [],
    datasets: [
      {
        label: 'Versions',
        data: [],
        backgroundColor: []
      }
    ]
  };

  var colorcount = 0;
  for (const [key, value] of Object.entries(data)) {
    console.log(key, value);

    chartdata.labels.push(key);
    chartdata.datasets[0].data.push(value);
    chartdata.datasets[0].backgroundColor.push(chartColors[colorcount]);
    colorcount++;
  }

  setupGraph(chartdata);
}

function setupGraph(data) {
  var ctx = document.getElementById('chartcanvas').getContext('2d');
  var myLineChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      cutoutPercentage: 0,
      legend: {
        display: true
      }
    }
  });
}