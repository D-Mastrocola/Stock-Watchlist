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
let addCard = (ticker) => {
  console.log(ticker);
  let cardEl = $("<div>").addClass("bg-light");
  let response = fetch(
    "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + API_KEY
  ).then((response) => {
    response.json().then((data) => {
      watchListTickers.push(ticker);
      console.log(data);
      let price = data.c;
      let priceChange = data.d;

      let color = changeColors.down;
      if (priceChange >= 0) color = changeColors.up;

      let title = $("<h2>").html(
        "<span class=" + color + ">" + price + "</span>" + ticker
      );
      cardEl.append(title);
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
  watchListTickers.forEach((ticker) => addCard(ticker));
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
        while (generatedList.length < 10) {
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
