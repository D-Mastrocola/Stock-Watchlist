const API_KEY = 'sandbox_bvhn01v48v6olk04psp0';
var searchInputEl = document.getElementById("search-input");
var searchButtonEl = document.getElementById("search-button");
var chartName = document.getElementById("candlestick-ticker");

// needed for google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var getChartData = function(stockTicker) {
    fetch("https://finnhub.io/api/v1/stock/candle?symbol=" + stockTicker + "&resolution=D&from=1631022248&to=1631627048&token=sandbox_bvhn01v48v6olk04psp0")
        .then(response => response.json())
        .then(data => drawChart(data));
    
}

// function to make the chart
var drawChart = function(data) {
    var data = google.visualization.arrayToDataTable([
        ['Mon', data.l[0], data.o[0], data.c[0], data.h[0]],
        ['Tue', data.l[1], data.o[1], data.c[1], data.h[1]],
        ['Wed', data.l[2], data.o[2], data.c[2], data.h[2]],
        ['Thu', data.l[3], data.o[3], data.c[3], data.h[3]],
        ['Fri', data.l[4], data.o[4], data.c[4], data.h[4]]
    ], true);

    var options = {
        legend:'none'
      };
    
    var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

    chart.draw(data, options);

    chartName.textContent = searchInputEl.value.trim().toUpperCase();
}

searchButtonEl.onclick = function(event) {
    event.preventDefault();
    var stock = searchInputEl.value.trim().toUpperCase();
    getChartData(stock);
}

