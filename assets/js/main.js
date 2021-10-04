const API_KEY = 'fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z';
var searchInputEl = document.getElementById("search-input");
var searchButtonEl = document.getElementById("search-button");
// needed for google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

//let watchListTickers = ["FSLR", "AAPL", "F"];
let watchListTickers = [];

// let makeCard = () => {
//   let response = fetch('https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
//     console.log(response)
//   });
// }

var getChartData = function(stockTicker) {
    fetch("https://api.polygon.io/v1/open-close/" + stockTicker + "/2021-09-28?adjusted=true&apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z")
        .then(response => response.json())
        .then(data => drawChart(data));
    
}

// function to make the chart
var drawChart = function(data) {
    var data = google.visualization.arrayToDataTable([
        [data.symbol, data.open, data.low, data.high, data.close],
        ['Tue', 31, 38, 55, 66],
        ['Wed', 50, 55, 77, 80],
        ['Thu', 77, 77, 66, 50],
        ['Fri', 68, 66, 22, 15]
    ], true);

    var options = {
        legend:'none'
      };
    
    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

searchButtonEl.onclick = function(event) {
    event.preventDefault();
    var stock = searchInputEl.value.trim().toUpperCase();
    getChartData(stock);
    // console.log(stock);
}


//makeCard('AAPL')
// getChartData();
