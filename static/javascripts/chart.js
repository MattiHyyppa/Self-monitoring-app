const backgroundColors = [
  'rgba(33, 218, 255, 0.4)',
  'rgba(33, 166, 255, 0.4)',  
  'rgba(33, 70, 255, 0.4)',
  'rgba(133, 33, 255, 0.4)',
  'rgba(255, 33, 244, 0.4)',
  'rgba(255, 23, 120, 0.4)'
]

const backgroundColors2 = [
  'rgba(33, 218, 255, 0.7)',
  'rgba(33, 166, 255, 0.7)',
  'rgba(33, 70, 255, 0.7)',
  'rgba(133, 33, 255, 0.7)',
  'rgba(255, 33, 244, 0.7)',
  'rgba(255, 23, 120, 0.7)'
]

const borderColors = [
  'rgba(33, 218, 255, 1)',
  'rgba(33, 166, 255, 1)',
  'rgba(33, 70, 255, 1)',
  'rgba(133, 33, 255, 1)',
  'rgba(255, 33, 244, 1)',
  'rgba(255, 23, 120, 1)'
]

function generateColors(num, colorList) {
  const lenColors = colorList.length;
  const n = parseInt(num / lenColors + 1);
  return Array(n).fill(colorList).flat().slice(0, num);
}


function pieChart(data, chartId) {
  const { pieChartData } = data;
  let { labels, dataY, name } = pieChartData;
  dataY = dataY.map(item => parseFloat(item).toFixed(2));

  if (dataY) {
    const config = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: name,
          data: dataY,
          backgroundColor: generateColors(dataY.length, backgroundColors2),
          borderWidth: 3
        }]
      }
    };

    const ctx = document.getElementById(chartId);
    const chart = new Chart(ctx, config);
  }
}

function barChart(data, chartId) {
  const { barChartData } = data;
  let { labels, dataY, name } = barChartData;
  dataY = dataY.map(item => parseFloat(item).toFixed(2));

  if (dataY) {
    const config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: name,
          data: dataY,
          backgroundColor: Array(dataY.length).fill(backgroundColors[1]),
          borderColor: Array(dataY.length).fill(borderColors[1]),
          borderWidth: 3
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    };
  
    const ctx = document.getElementById(chartId);
    const chart = new Chart(ctx, config);
  }
}

function lineChart(data, chartId) {
  const { lineChartData } = data;
  let { labels, dataY, name, maxTicks } = lineChartData;
  dataY = dataY.map(item => parseFloat(item).toFixed(2));

  if (dataY) {
    const config = {
      type: 'line',
      data: {
        datasets: [{
          label: name,
          data: dataY,
          fill: false,
          borderWidth: 3,
          borderColor: borderColors[1]
        }],
        labels: labels
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    }
    if (maxTicks) {
      config.options.scales.xAxes = [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: maxTicks,
        }
      }]
    }

    const ctx = document.getElementById(chartId);
    const chart = new Chart(ctx, config);
  }
}