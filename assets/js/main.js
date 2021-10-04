const API_KEY = 'fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z';
// needed for google charts
//google.charts.load('current', {'packages':['corechart']});
//google.charts.setOnLoadCallback(makeChart);

//let watchListTickers = ["FSLR", "AAPL", "F"];
let watchListTickers = [];

// let makeCard = () => {
//   let response = fetch('https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
//     console.log(response)
//   });
// }

var getChartData = function() {
    fetch("https://api.polygon.io/v1/open-close/AAPL/2021-09-28?adjusted=true&apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z")
        .then(response => response.json())
        .then(data => console.log(data));
    
}

//makeCard('AAPL')
getChartData();
