const API_KEY = "sandbox_bvhn01v48v6olk04psp0";
// needed for google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


let queryString = document.location.search;
let selectedTicker = queryString.split("=")[1];

//Changes title of page
$(document).prop('title', selectedTicker + ' - Stock Watchlist');

let tickerDetailsEl = $('#ticker-details').addClass('row').html("<h2 class'col-12'>" + selectedTicker + '</h2>');

let getChartData = function(stockTicker) {
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
}

let getTickerDetails = async (ticker) => {
  let tradeInfoEl = $('<div>').addClass("col-3 row");
  let companyInfoEl = $('<div>').addClass('col-3 row');
  let graph = $('<div>').addClass('col-6').attr('id', 'chart_div');
  let quoteData = await fetch("https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + API_KEY).then((response) => {
    response.json().then((data) => {
      console.log(data)

      let previousClose = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>Previous Close: </span><span class='col-6 text-end fw-bold'>" + data.pc.toFixed(2) + "</span>");
      let openPrice = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>Open: </span><span class='col-6 text-end fw-bold'>" + data.o.toFixed(2) + "</span>");
      let dayRange = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>Day Range: </span><span class='col-6 text-end fw-bold'>" + data.l.toFixed(2) + " - " + data.h.toFixed(2) + "</span>");


      tradeInfoEl.append(previousClose, openPrice, dayRange);

    })
  })
  let basicFinancialData = await fetch("https://finnhub.io/api/v1/stock/metric?symbol=" + ticker + "&metric=all&token=" + API_KEY).then((response) => {
    response.json().then((data) => {
      console.log(data)
      let yearRange = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>52 Week Range: </span><span class='col-6 text-end fw-bold'>" + data.metric['52WeekLow'].toFixed(2) + " - " + data.metric['52WeekHigh'].toFixed(2) + "</span>");
      tradeInfoEl.append(yearRange)

      //Market Cap
      let marketCapText = data.metric.marketCapitalization.toFixed(0);
      //Market cap is 10 ^ -6
      if(data.metric.marketCapitalization / 1_000_000 > 1) {
        marketCapText = (data.metric.marketCapitalization/1_000_000).toFixed(2) + "M";
        
      }
      //Market cap is 10 ^ -9 
      else if(data.metric.marketCapitalization / 1_000_000_000 > 1) {
        marketCapText = (data.metric.marketCapitalization/1_000_000_000).toFixed(2) + "B";
      }
      //Market cap is 10 ^ -12 
      else if(data.metric.marketCapitalization / 1_000_000_000_000 > 1) {
        marketCapText = (data.metric.marketCapitalization/1_000_000_000_000).toFixed(2) + "T";
      }
      let marketCap = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>Market Cap: </span><span class='col-6 text-end fw-bold'>" + marketCapText + "</span>");

      //Earnings Per Share
      let epsEl = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>EPS (TTM): </span><span class='col-6 text-end fw-bold'>" + data.metric.epsBasicExclExtraItemsTTM.toFixed(2) + "</span>");

      //PE ratio
      let peRatio = data.metric.peBasicExclExtraTTM;
      if([null, undefined].includes(peRatio)) peRatio = 0;
      let peRatioEl = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>PE Ratio(TTM): </span><span class='col-6 text-end fw-bold'>" + peRatio.toFixed(2) + "</span>");

      let dividendPerShare = data.metric.dividendsPerShareTTM;
      if([null, undefined].includes(dividendPerShare)) dividendPerShare = 0;
      let dividendEl = $('<div>').addClass('col-12 row p-2').html("<span class='col-6 text-start'>Dividend: </span><span class='col-6 text-end fw-bold'>" + dividendPerShare.toFixed(2) + "</span>");

      companyInfoEl.append(marketCap, epsEl, peRatioEl, dividendEl)
    })
  });
  tickerDetailsEl.append(tradeInfoEl, companyInfoEl, graph);
  getChartData(ticker);
}

getTickerDetails(selectedTicker);