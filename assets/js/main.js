//Using the snadbox api gives us 60calls per minute
const API_KEY = "sandbox_bvhn01v48v6olk04psp0";
let watchListEl = $("#watch-list");
let watchCardContainerEl = $("<div>").addClass("container");

//let watchListTickers = ["FSLR", "AAPL", "F"];
let watchListTickers = [];

let yesterdaysDate = moment().subtract(1, "days");
let date = moment().format("YYYY-MM-DD");

let changeColors = {
  up: "text-success",
  down: "text-danger",
};
let removeCard = () => {

}
//Adds ticker card to watch list element
let makeCard = (ticker) => {
  let cardEl = $("<div>").addClass("border border-2 border-secodary border-start-0 border-top-0 border-end-0 p-2 d-flex justify-content-start align-items-center");
  let response = fetch(
    "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + API_KEY
  ).then((response) => {
    response.json().then((data) => {
      console.log(data);
      let price = data.c.toFixed(2);
      let priceChange = data.d;

      let color = changeColors.down;
      if (priceChange >= 0) color = changeColors.up;

      let title = $("<h2>").addClass('col-4 text-end').html(
        "<span class='col-10 m-2 " + color + "'>" + price + "</span>" + ticker
      );
      let dayInfo = { 
        change: data.dp.toFixed(2),
        open: data.o.toFixed(2),
        close: data.pc.toFixed(2),
        high: data.h.toFixed(2),
        low: data.l.toFixed(2)
      };

      cardEl.attr('ticker', ticker);
      let changeEl = $('<p>').text(dayInfo.change + '%');
      if(dayInfo.change >= 0) changeEl.addClass('text-success col-1')
      else changeEl.addClass('text-danger col-1')

      let openEl = $('<div>').text('O: ' + dayInfo.open).addClass('col-1');
      let closeEl = $('<div>').text('C: ' + dayInfo.close).addClass('col-1');
      let highEl = $('<div>').text('H: ' + dayInfo.high).addClass('col-1');
      let lowEl = $('<div>').text('L: ' + dayInfo.low).addClass('col-1');

      let removeBtnEl = $('<button>').addClass('btn btn-danger').text('Remove').attr('ticker', ticker);

      //create and event listener to remove the button
      removeBtnEl.on('click', () => {
        for(let i = 0; i < watchCardContainerEl.children().length; i++) {
          let selectedEl = $(watchCardContainerEl.children()[i])
          if(removeBtnEl.attr('ticker') === selectedEl.attr('ticker')) {
            selectedEl.remove();
            break;
          }
        }
        watchListTickers.forEach((ticker,  i) => {
          if(removeBtnEl.attr('ticker') === ticker) {
            watchListTickers.splice(i, 1);
          }
        });
        saveWatchList();
      })
      cardEl.append(title, changeEl, openEl, closeEl, highEl, lowEl, removeBtnEl);
      watchCardContainerEl.append(cardEl);

      //Saves the list to local storage
      saveWatchList();
    });
  });
};


//loops throuht tickers in the watch list and makes a card
let createWatchList = () => {
  watchListEl.empty();
  let title = $("<h2>").text("Watchlist");
  watchListTickers.forEach((ticker) => makeCard(ticker));
  watchListEl.append(title, watchCardContainerEl);
};

let saveWatchList = () => {
  localStorage.setItem("watch-list", JSON.stringify(watchListTickers));
};
let loadWatchList = () => {
  let loadedWatchList = localStorage.getItem("watch-list");
  if (loadedWatchList) {
    watchListTickers = JSON.parse(loadedWatchList);
    createWatchList();
  } else {
    let supportedStocks = fetch(
      "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=" + API_KEY
    ).then((response) => {
      response.json().then((data) => {
        let generatedList = [];
        while (generatedList.length < 4) {

          let index = Math.floor(Math.random() * data.length);
          let ticker = data[index].symbol;
          //remove from data to prevent repeated tickers
          data.splice(index, 1);

          generatedList.push(ticker);
        }
        watchListTickers = generatedList;
        console.log(watchListTickers);
        createWatchList();
      });
    });
  }
};
loadWatchList();



// new code for the chart data
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

// searchButtonEl.onclick = function(event) {
//   event.preventDefault();
//   var stock = searchInputEl.value.trim().toUpperCase();
//   getChartData(stock);
// }

let searchForm = $('#search-form').on('submit', (event) => {
  event.preventDefault();
  let input = $("#search-input").val().toUpperCase();
  watchListTickers.push(input);
  makeCard(input);
  $("#search-input").val('');
  var stock = searchInputEl.value.trim().toUpperCase();
  getChartData(stock);
})