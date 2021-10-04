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

//Adds ticker card to watch list element
let makeCard = (ticker) => {
  let cardEl = $("<div>").addClass("bg-light d-flex justify-content-start align-items-center");
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
        change: data.dp,
        open: data.o,
        close: data.pc,
        high: data.h,
        low: data.l
      };
      let changeEl = $('<p>').text(dayInfo.change.toFixed(2) + '%');
      if(dayInfo.change >= 0) changeEl.addClass('text-success')
      else changeEl.addClass('text-danger')

      let openEl = $('<p>').text('O: ' + dayInfo.open);
      let closeEl = $('<p>').text('C: ' + dayInfo.close);
      let highEl = $('<p>').text('H: ' + dayInfo.high);
      let lowEl = $('<p>').text('L: ' + dayInfo.low);
      cardEl.append(title, changeEl, openEl, closeEl, highEl, lowEl);
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


let searchForm = $('#search-form').on('submit', (event) => {
  event.preventDefault();
  let input = $("#search-input").val();
  watchListTickers.push(input);
  makeCard(input);
  $("#search-input").val('');
})