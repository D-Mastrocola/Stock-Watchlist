//Using the snadbox api gives us 60calls per minute
const API_KEY = "sandbox_bvhn01v48v6olk04psp0";
let watchListEl = $("#watch-list");
let watchCardContainerEl = $("<div>").addClass("container");

let watchListTickers = ["FSLR", "AAPL", "F"];

let yesterdaysDate = moment().subtract(1, "days");
let date = moment().format("YYYY-MM-DD");

let makeCard = (ticker) => {
  let cardEl = $("<div>").addClass("bg-light");
  let response = fetch(
    "https://finnhub.io/api/v1/quote?symbol=" + ticker + "&token=" + API_KEY
  ).then((response) => {
    response.json().then((data) => {
      console.log(data);
      let price = data.c;

      let title = $('<h2>').html(price + " " + ticker);
      cardEl.append(title);
      watchCardContainerEl.append(cardEl);
    });
  });
};

let createWatchList = () => {
  watchListEl.empty();
  let title = $("<h2>").text("Watchlist");
  watchListTickers.forEach((ticker) => makeCard(ticker));
  watchListEl.append(title, watchCardContainerEl);
};
createWatchList();
