const API_KEY = 'fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z';
let cardContainerEl = $('#card-container');






let getBasicData = (ticker) => {
  //format yesterdays date because api does not have current day data available
  let yesterdaysDayOfYear = (moment().dayOfYear()) - 1;
  let date = moment(yesterdaysDayOfYear).format('YYYY-MM-DD')
  console.log(date)
  let response = fetch('https://api.polygon.io/v1/open-close/' + ticker+ '/' + date + '?adjusted=true&apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
    response.json().then((data) => {
      console.log(data)
    })
  })
  
}
let makeCard = (ticker) => {
  let response = fetch('https://api.polygon.io/v1/meta/symbols/' + ticker + '/company?apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
    response.json().then((data) => {
      console.log(data)
      let cardEl = $('<div>').addClass("row bg-light text-dark p-4").html('<h3 class="h3">' + ticker + '</h3><p class="h5 text-secondary">' + data.name + '</p>');
      cardContainerEl.append(cardEl);
      getBasicData(ticker);
    })
  });
}
makeCard('AAPL')