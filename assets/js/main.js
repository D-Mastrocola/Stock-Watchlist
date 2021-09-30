const API_KEY = 'fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z';



let makeCard = () => {
  let response = fetch('https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=fKzrzAwj3Su_nDWNEMyaa6lLvXCrFX8z').then((response) => {
    console.log(response)
  });
}
makeCard('AAPL')