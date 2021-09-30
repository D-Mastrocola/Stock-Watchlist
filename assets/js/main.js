const API_KEY = 'buc39mf48v6oa2u4eqvg';
var chartData = "https://finnhub.io/api/v1/stock/candle?symbol=" + userSearch + "&resolution=D&from=1572651390&to=1575243390&token=buc39mf48v6oa2u4eqvg"
// needed for google charts
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

