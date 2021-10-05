const API_KEY = "sandbox_bvhn01v48v6olk04psp0";


let queryString = document.location.search;
let selectedTicker = queryString.split("=")[1];
console.log(selectedTicker);

let tickerDetailsEl = $('#ticker-details').addClass('row').html("<h2 class'col-12'>" + selectedTicker + '</h2>');


let getTickerDetails = async (ticker) => {
  let tradeInfoEl = $('<div>').addClass("col-3 row align-items-center");
  let companyInfoEl = $('<div>').addClass('col-3');
  let graph = $('<img>').addClass('col-6').attr('src', './assets/images/image place holder.jpg');
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
    })
  });


  tickerDetailsEl.append(tradeInfoEl, companyInfoEl, graph)
}
getTickerDetails(selectedTicker);