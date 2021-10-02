const API_KEY = 'fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z';
let watchListEl = $('#watch-list');
let watchCardContainerEl = $('<div>').addClass('container')

let watchListTickers = ['FSLR'];


let getBasicData = (ticker) => {
  //format yesterdays date because api does not have current day data available
  let yesterdaysDate = moment().subtract(1, 'days');
  let formattedDate = yesterdaysDate.format('YYYY-MM-DD');
  console.log(formattedDate);

  let cardDetailsEl = $('<div>');

  let response = fetch('https://api.polygon.io/v1/open-close/' + ticker + '/' + formattedDate + '?adjusted=true&apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
    response.json().then((data) => {
      console.log(data);
      cardDetailsEl.html('<div>Open: ' + data.open + '</div><div>High: ' + data.high + '</div><div>Low: ' + data.low + "</div><div>Close: " + data.close + '</div>');
    })
  })
  return cardDetailsEl;
}
let makeCard = (ticker) => {
  let cardEl = $('<div>').addClass("row bg-light text-dark p-4").html('<div><h3 class="h3">' + ticker + '</h3><div>');
  let cardDetailsEl = (await = () => getBasicData(ticker));
  cardEl.append(cardDetailsEl);

  watchCardContainerEl.append(cardEl);
}
let createWatchList = () => {
  watchListEl.empty();
  let title = $('<h2>').text('Watchlist');
  watchListTickers.forEach((ticker) => makeCard(ticker));

  watchListEl.append(title, watchCardContainerEl);
}
createWatchList();