// WEATHER VARIABLES:
// ---------------------------------------------
// location:
var city = "";
var cityName = $('#cityName')
var cityNameDisplay = null;
var state = "";
var countryCode = ",US";
var locationURL = "https://api.openweathermap.org/geo/1.0/direct?q=";
var APIkeyLocation = "306e5a39201f9a04bf59daf2b8544d8a";
// weather:
var weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=";
var APIkeyWeather = "c443fd962d906a14e3af8d9d37623de2";
// icons:
var picCurrent = $(`<img class="object-none">`);
var picDay1 = $(`<img class="object-scale-down">`);
var picDay2 = $(`<img class="object-scale-down">`);
var picDay3 = $(`<img class="object-scale-down">`);
var picDay4 = $(`<img class="object-scale-down">`);
var picDay5 = $(`<img class="object-scale-down">`);
// lists:
var currentList = $(
  `<ul id="currentList" class="flex flex-col justify-center items-center py-1">`
);
var weatherList1 = $(`<ul>`);
var weatherList2 = $(`<ul>`);
var weatherList3 = $(`<ul>`);
var weatherList4 = $(`<ul>`);
var weatherList5 = $(`<ul>`);
// selectors:
var instructions = $("#instructions");
var currentDay = $("#dayCurrent");
var searchForm = $("#search");
var searchHistory = $("#savedCities");
var newSearch = $("#newSearchBtn");
var weatherContainer = $("#weatherContainer");

function displayWeather() {
  $("#cityNameDisplay").remove();
  $("#day1data").empty();
  $("#day2data").empty();
  $("#day3data").empty();
  $("#day4data").empty();
  $("#day5data").empty();
  $("#currentList").empty();
  $(instructions).addClass("hidden");
  $(searchForm).addClass("hidden");
  $(newSearch).removeClass("hidden");
  $(weatherContainer).removeClass("hidden");
  $(searchHistory).removeClass("hidden");
  $(cityName).removeClass("hidden");
  // Gets location from user input and converts to latitude & longitude. 
  city = $("#userSearch").val();
  state = $("#userState").val();
  localStorage.setItem(`${city}`, `${city}`);
  let savedBtn = $(
    `<button id="${city}" class="savedBtn rounded-lg p-2 my-5 mx-2 text-black text-xl font-info bg-cyan-200 border-solid border-2 border-gray-900">${city}</button>`
  );
  $(savedBtn).appendTo("#savedCities");

  cityNameDisplay = $(
    `<p id="cityNameDisplay" class="text-6xl font-sansita text-center text-[#271801] mt-20px">${city}</p>`
  );
  $(cityNameDisplay).appendTo(cityName);
  fetch(
    locationURL +
      city +
      "," +
      state +
      countryCode +
      "&limit=1&appid=" +
      APIkeyLocation
  )
    .then(function (location) {
      console.log("determining location...");
      return location.json();
    })
    .then(function (locationData) {
      var lat = locationData[0].lat;
      lat = lat.toFixed(2);
      console.log(lat);
      var lon = locationData[0].lon;
      lon = lon.toFixed(2);
      console.log(lon);

      getWeather(lat, lon);

      // Uses latitude & longitude values to get a forecast for the location.
      function getWeather() {
        var weatherIcon = `https://openweathermap.org/img/wn/`;
        fetch(
          weatherURL +
            lat +
            "&lon=" +
            lon +
            "&exclude=minutely,hourly&units=imperial&lang=en&appid=" +
            APIkeyWeather
        )
          .then(function (response) {
            console.log("getting weather...");
            return response.json();
          })
          .then(function (weatherResponse) {
            var currentIcon = weatherResponse.current.weather[0].icon;
            var currentTemp = weatherResponse.current.temp.toFixed();
            var currentDescription =
              weatherResponse.current.weather[0].description;
            var currentHumidity = weatherResponse.current.humidity;
            var currentWind = weatherResponse.current.wind_speed.toFixed();
            var currentUVI = weatherResponse.current.uvi.toFixed();

            currentConditions = currentDescription.split(' ');
            for (let i = 0; i < currentConditions.length; i++) {
              currentConditions[i] = currentConditions[i][0].toUpperCase() + currentConditions[i].substr(1);
            }

            currentConditions = currentConditions.join(' ');


            picCurrent = $(picCurrent)
              .addClass("h-14 w-auto")
              .attr("src", `${weatherIcon}${currentIcon}.png`);
            $(picCurrent).appendTo("#dayCurrent");
            $(currentList).appendTo("#dayCurrent");
            currentTemp = `<li class="text-xl font-info">Temp: ${currentTemp}º</li>`;
            $(currentTemp).appendTo("#currentList");
            currentConditions = `<li class="text-xl font-info">${currentConditions}</li>`;
            $(currentConditions).appendTo("#currentList");
            currentHumidity = `<li class="text-xl font-info">Humidity: ${currentHumidity}%</li>`;
            $(currentHumidity).appendTo("#currentList");
            currentWind = `<li class="text-xl font-info">Wind: ${currentWind} MPH</li>`;
            $(currentWind).appendTo("#currentList");

            // Applies background color to indicate favorable, moderate, or severe UVI ratings.
            $(currentDay).removeClass("bg-lime-500 bg-yellow-500 bg-red-500");
            if (currentUVI <= 2) {
              $(currentDay).addClass("bg-lime-500");
            }
            if (currentUVI > 2 && currentUVI < 6) {
              $(currentDay).addClass("bg-yellow-500");
            }
            if (currentUVI >= 6) {
              $(currentDay).addClass("bg-red-500");
            }

            currentUVI = `<li class="text-xl font-info">UV Index: ${currentUVI}</li>`;
            $(currentUVI).appendTo("#currentList");

            // Retrieves and appends weather data from the first 5 days of the forecast.
            for (var i = 0; i < 5; i++) {
              var weatherIMG = weatherResponse.daily[i].weather[0].icon;
              var tempHigh = weatherResponse.daily[i].temp.max.toFixed();
              var tempLow = weatherResponse.daily[i].temp.min.toFixed();
              var description = weatherResponse.daily[i].weather[0].description;
              var humidity = weatherResponse.daily[i].humidity;
              var windSpeed = weatherResponse.daily[i].wind_speed.toFixed();
              var windDegree = weatherResponse.daily[i].wind_deg;

              // Capitalizes Weather Description
              conditions = description.split(' ');
              for (let i = 0; i < conditions.length; i++) {
                conditions[i] = conditions[i][0].toUpperCase() + conditions[i].substr(1);
              }

              conditions = conditions.join(' ');
              
              if (i === 0) {
                console.log("1");
                // retrieves weather icon & appends to weather block
                picDay1 = $(picDay1)
                  .addClass("h-11")
                  .attr("src", `${weatherIcon}${weatherIMG}.png`);
                $(picDay1).appendTo("#day1");

                // creates & appends items to list
                weatherList1 = $(weatherList1)
                  .addClass("contents")
                  .attr("id", "day1data");
                $(weatherList1).appendTo("#day1");

                tempHigh = `<li class="text-xs text-[#F7BF4F] font-info">High: ${tempHigh}º</li>`;
                $(tempHigh).appendTo("#day1data");

                tempLow = `<li class="text-xs text-[#F7BF4F] font-info">Low: ${tempLow}º</li>`;
                $(tempLow).appendTo("#day1data");

                conditions = `<li class="text-xs text-[#F7BF4F] font-info">${conditions}</li>`;
                $(conditions).appendTo("#day1data");

                humidity = `<li class="text-xs text-[#F7BF4F] font-info">Humidity: ${humidity}%</li>`;
                $(humidity).appendTo("#day1data");

                windSpeed = `<li class="text-xs text-[#F7BF4F] font-info">Wind: ${windSpeed} MPH</li>`;
                $(windSpeed).appendTo("#day1data");

                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${windDegree}º</li>`;

                if ($(windDegree).txt <= 11 || $(windDegree).txt >= 349) {
                  var direction = `N`;
                } else if ($(windDegree).txt >= 12 && $(windDegree).txt <= 33) {
                  direction = `NNE`;
                } else if ($(windDegree).txt >= 34 && $(windDegree).txt <= 56) {
                  direction = `NE`;
                } else if ($(windDegree).txt >= 57 && $(windDegree).txt <= 78) {
                  direction = `ENE`;
                } else if (
                  $(windDegree).txt >= 79 &&
                  $(windDegree).txt <= 101
                ) {
                  direction = `E`;
                } else if (
                  $(windDegree).txt >= 102 &&
                  $(windDegree).txt <= 123
                ) {
                  direction = `ESE`;
                } else if (
                  $(windDegree).txt >= 124 &&
                  $(windDegree).txt <= 146
                ) {
                  direction = `SE`;
                } else if (
                  $(windDegree).txt >= 147 &&
                  $(windDegree).txt <= 168
                ) {
                  direction = `SSE`;
                } else if (
                  $(windDegree).txt >= 169 &&
                  $(windDegree).txt <= 191
                ) {
                  direction = `S`;
                } else if (
                  $(windDegree).txt >= 192 &&
                  $(windDegree).txt <= 213
                ) {
                  direction = `SSW`;
                } else if (
                  $(windDegree).txt >= 214 &&
                  $(windDegree).txt <= 236
                ) {
                  direction = `SW`;
                } else if (
                  $(windDegree).txt >= 237 &&
                  $(windDegree).txt <= 258
                ) {
                  direction = `WSW`;
                } else if (
                  $(windDegree).txt >= 259 &&
                  $(windDegree).txt <= 281
                ) {
                  direction = `W`;
                } else if (
                  $(windDegree).txt >= 282 &&
                  $(windDegree).txt <= 303
                ) {
                  direction = `WNW`;
                } else if (
                  $(windDegree).txt >= 304 &&
                  $(windDegree).txt <= 326
                ) {
                  direction = `NW`;
                } else {
                  direction = `NNW`;
                }
                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${direction}</li>`;
                $(windDegree).appendTo("#day1data");
              } else if (i === 1) {
                console.log("2");
                picDay1 = $(picDay2)
                  .addClass("h-11")
                  .attr("src", `${weatherIcon}${weatherIMG}.png`);
                $(picDay1).appendTo("#day2");

                // creates & appends items to list
                weatherList2 = $(weatherList2)
                  .addClass("contents")
                  .attr("id", "day2data");
                $(weatherList2).appendTo("#day2");

                tempHigh = `<li class="text-xs text-[#F7BF4F] font-info">High: ${tempHigh}º</li>`;
                $(tempHigh).appendTo("#day2data");

                tempLow = `<li class="text-xs text-[#F7BF4F] font-info">Low: ${tempLow}º</li>`;
                $(tempLow).appendTo("#day2data");

                conditions = `<li class="text-xs text-[#F7BF4F] font-info">${conditions}</li>`;
                $(conditions).appendTo("#day2data");

                humidity = `<li class="text-xs text-[#F7BF4F] font-info">Humidity: ${humidity}%</li>`;
                $(humidity).appendTo("#day2data");

                windSpeed = `<li class="text-xs text-[#F7BF4F] font-info">Wind: ${windSpeed} MPH</li>`;
                $(windSpeed).appendTo("#day2data");

                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${windDegree}º</li>`;
                if ($(windDegree).txt <= 11 || $(windDegree).txt >= 349) {
                  var direction = `N`;
                } else if ($(windDegree).txt >= 12 && $(windDegree).txt <= 33) {
                  direction = `NNE`;
                } else if ($(windDegree).txt >= 34 && $(windDegree).txt <= 56) {
                  direction = `NE`;
                } else if ($(windDegree).txt >= 57 && $(windDegree).txt <= 78) {
                  direction = `ENE`;
                } else if (
                  $(windDegree).txt >= 79 &&
                  $(windDegree).txt <= 101
                ) {
                  direction = `E`;
                } else if (
                  $(windDegree).txt >= 102 &&
                  $(windDegree).txt <= 123
                ) {
                  direction = `ESE`;
                } else if (
                  $(windDegree).txt >= 124 &&
                  $(windDegree).txt <= 146
                ) {
                  direction = `SE`;
                } else if (
                  $(windDegree).txt >= 147 &&
                  $(windDegree).txt <= 168
                ) {
                  direction = `SSE`;
                } else if (
                  $(windDegree).txt >= 169 &&
                  $(windDegree).txt <= 191
                ) {
                  direction = `S`;
                } else if (
                  $(windDegree).txt >= 192 &&
                  $(windDegree).txt <= 213
                ) {
                  direction = `SSW`;
                } else if (
                  $(windDegree).txt >= 214 &&
                  $(windDegree).txt <= 236
                ) {
                  direction = `SW`;
                } else if (
                  $(windDegree).txt >= 237 &&
                  $(windDegree).txt <= 258
                ) {
                  direction = `WSW`;
                } else if (
                  $(windDegree).txt >= 259 &&
                  $(windDegree).txt <= 281
                ) {
                  direction = `W`;
                } else if (
                  $(windDegree).txt >= 282 &&
                  $(windDegree).txt <= 303
                ) {
                  direction = `WNW`;
                } else if (
                  $(windDegree).txt >= 304 &&
                  $(windDegree).txt <= 326
                ) {
                  direction = `NW`;
                } else {
                  direction = `NNW`;
                }
                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${direction}</li>`;
                $(windDegree).appendTo("#day2data");
              } else if (i === 2) {
                console.log("3");
                picDay1 = $(picDay3)
                  .addClass("h-11")
                  .attr("src", `${weatherIcon}${weatherIMG}.png`);
                $(picDay1).appendTo("#day3");

                // creates & appends items to list
                weatherList3 = $(weatherList3).attr("id", "day3data");
                $(weatherList3).appendTo("#day3");

                tempHigh = `<li class="text-xs text-[#F7BF4F] font-info">High: ${tempHigh}º</li>`;
                $(tempHigh).appendTo("#day3data");

                tempLow = `<li class="text-xs text-[#F7BF4F] font-info">Low: ${tempLow}º</li>`;
                $(tempLow).appendTo("#day3data");

                conditions = `<li class="text-xs text-[#F7BF4F] font-info">${conditions}</li>`;
                $(conditions).appendTo("#day3data");

                humidity = `<li class="text-xs text-[#F7BF4F] font-info">Humidity: ${humidity}%</li>`;
                $(humidity).appendTo("#day3data");

                windSpeed = `<li class="text-xs text-[#F7BF4F] font-info">Wind: ${windSpeed} MPH</li>`;
                $(windSpeed).appendTo("#day3data");

                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${windDegree}º</li>`;
                if ($(windDegree).txt <= 11 || $(windDegree).txt >= 349) {
                  var direction = `N`;
                } else if ($(windDegree).txt >= 12 && $(windDegree).txt <= 33) {
                  direction = `NNE`;
                } else if ($(windDegree).txt >= 34 && $(windDegree).txt <= 56) {
                  direction = `NE`;
                } else if ($(windDegree).txt >= 57 && $(windDegree).txt <= 78) {
                  direction = `ENE`;
                } else if (
                  $(windDegree).txt >= 79 &&
                  $(windDegree).txt <= 101
                ) {
                  direction = `E`;
                } else if (
                  $(windDegree).txt >= 102 &&
                  $(windDegree).txt <= 123
                ) {
                  direction = `ESE`;
                } else if (
                  $(windDegree).txt >= 124 &&
                  $(windDegree).txt <= 146
                ) {
                  direction = `SE`;
                } else if (
                  $(windDegree).txt >= 147 &&
                  $(windDegree).txt <= 168
                ) {
                  direction = `SSE`;
                } else if (
                  $(windDegree).txt >= 169 &&
                  $(windDegree).txt <= 191
                ) {
                  direction = `S`;
                } else if (
                  $(windDegree).txt >= 192 &&
                  $(windDegree).txt <= 213
                ) {
                  direction = `SSW`;
                } else if (
                  $(windDegree).txt >= 214 &&
                  $(windDegree).txt <= 236
                ) {
                  direction = `SW`;
                } else if (
                  $(windDegree).txt >= 237 &&
                  $(windDegree).txt <= 258
                ) {
                  direction = `WSW`;
                } else if (
                  $(windDegree).txt >= 259 &&
                  $(windDegree).txt <= 281
                ) {
                  direction = `W`;
                } else if (
                  $(windDegree).txt >= 282 &&
                  $(windDegree).txt <= 303
                ) {
                  direction = `WNW`;
                } else if (
                  $(windDegree).txt >= 304 &&
                  $(windDegree).txt <= 326
                ) {
                  direction = `NW`;
                } else {
                  direction = `NNW`;
                }
                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${direction}</li>`;
                $(windDegree).appendTo("#day3data");
                state = $("#userState").val("--");
              } else if (i === 3) {
                console.log("4");
                picDay1 = $(picDay4)
                  .addClass("h-11")
                  .attr("src", `${weatherIcon}${weatherIMG}.png`);
                $(picDay1).appendTo("#day4");

                // creates & appends items to list
                weatherList4 = $(weatherList4).attr("id", "day4data");
                $(weatherList4).appendTo("#day4");

                tempHigh = `<li class="text-xs text-[#F7BF4F] font-info">High: ${tempHigh}º</li>`;
                $(tempHigh).appendTo("#day4data");

                tempLow = `<li class="text-xs text-[#F7BF4F] font-info">Low: ${tempLow}º</li>`;
                $(tempLow).appendTo("#day4data");

                conditions = `<li class="text-xs text-[#F7BF4F] font-info">${conditions}</li>`;
                $(conditions).appendTo("#day4data");

                humidity = `<li class="text-xs text-[#F7BF4F] font-info">Humidity: ${humidity}%</li>`;
                $(humidity).appendTo("#day4data");

                windSpeed = `<li class="text-xs text-[#F7BF4F] font-info">Wind: ${windSpeed} MPH</li>`;
                $(windSpeed).appendTo("#day4data");

                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${windDegree}º</li>`;
                if ($(windDegree).txt <= 11 || $(windDegree).txt >= 349) {
                  var direction = `N`;
                } else if ($(windDegree).txt >= 12 && $(windDegree).txt <= 33) {
                  direction = `NNE`;
                } else if ($(windDegree).txt >= 34 && $(windDegree).txt <= 56) {
                  direction = `NE`;
                } else if ($(windDegree).txt >= 57 && $(windDegree).txt <= 78) {
                  direction = `ENE`;
                } else if (
                  $(windDegree).txt >= 79 &&
                  $(windDegree).txt <= 101
                ) {
                  direction = `E`;
                } else if (
                  $(windDegree).txt >= 102 &&
                  $(windDegree).txt <= 123
                ) {
                  direction = `ESE`;
                } else if (
                  $(windDegree).txt >= 124 &&
                  $(windDegree).txt <= 146
                ) {
                  direction = `SE`;
                } else if (
                  $(windDegree).txt >= 147 &&
                  $(windDegree).txt <= 168
                ) {
                  direction = `SSE`;
                } else if (
                  $(windDegree).txt >= 169 &&
                  $(windDegree).txt <= 191
                ) {
                  direction = `S`;
                } else if (
                  $(windDegree).txt >= 192 &&
                  $(windDegree).txt <= 213
                ) {
                  direction = `SSW`;
                } else if (
                  $(windDegree).txt >= 214 &&
                  $(windDegree).txt <= 236
                ) {
                  direction = `SW`;
                } else if (
                  $(windDegree).txt >= 237 &&
                  $(windDegree).txt <= 258
                ) {
                  direction = `WSW`;
                } else if (
                  $(windDegree).txt >= 259 &&
                  $(windDegree).txt <= 281
                ) {
                  direction = `W`;
                } else if (
                  $(windDegree).txt >= 282 &&
                  $(windDegree).txt <= 303
                ) {
                  direction = `WNW`;
                } else if (
                  $(windDegree).txt >= 304 &&
                  $(windDegree).txt <= 326
                ) {
                  direction = `NW`;
                } else {
                  direction = `NNW`;
                }
                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${direction}</li>`;
                $(windDegree).appendTo("#day4data");
              } else if (i === 4) {
                console.log("5");
                picDay1 = $(picDay5)
                  .addClass("h-11")
                  .attr("src", `${weatherIcon}${weatherIMG}.png`);
                $(picDay1).appendTo("#day5");

                // creates & appends items to list
                weatherList5 = $(weatherList5).attr("id", "day5data");
                $(weatherList5).appendTo("#day5");

                tempHigh = `<li class="text-xs text-[#F7BF4F] font-info">High: ${tempHigh}º</li>`;
                $(tempHigh).appendTo("#day5data");

                tempLow = `<li class="text-xs text-[#F7BF4F] font-info">Low: ${tempLow}º</li>`;
                $(tempLow).appendTo("#day5data");

                conditions = `<li class="text-xs text-[#F7BF4F] font-info">${conditions}</li>`;
                $(conditions).appendTo("#day5data");

                humidity = `<li class="text-xs text-[#F7BF4F] font-info">Humidity: ${humidity}%</li>`;
                $(humidity).appendTo("#day5data");

                windSpeed = `<li class="text-xs text-[#F7BF4F] font-info">Wind: ${windSpeed} MPH</li>`;
                $(windSpeed).appendTo("#day5data");

                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${windDegree}º</li>`;
                if ($(windDegree).txt <= 11 || $(windDegree).txt >= 349) {
                  var direction = `N`;
                } else if ($(windDegree).txt >= 12 && $(windDegree).txt <= 33) {
                  direction = `NNE`;
                } else if ($(windDegree).txt >= 34 && $(windDegree).txt <= 56) {
                  direction = `NE`;
                } else if ($(windDegree).txt >= 57 && $(windDegree).txt <= 78) {
                  direction = `ENE`;
                } else if (
                  $(windDegree).txt >= 79 &&
                  $(windDegree).txt <= 101
                ) {
                  direction = `E`;
                } else if (
                  $(windDegree).txt >= 102 &&
                  $(windDegree).txt <= 123
                ) {
                  direction = `ESE`;
                } else if (
                  $(windDegree).txt >= 124 &&
                  $(windDegree).txt <= 146
                ) {
                  direction = `SE`;
                } else if (
                  $(windDegree).txt >= 147 &&
                  $(windDegree).txt <= 168
                ) {
                  direction = `SSE`;
                } else if (
                  $(windDegree).txt >= 169 &&
                  $(windDegree).txt <= 191
                ) {
                  direction = `S`;
                } else if (
                  $(windDegree).txt >= 192 &&
                  $(windDegree).txt <= 213
                ) {
                  direction = `SSW`;
                } else if (
                  $(windDegree).txt >= 214 &&
                  $(windDegree).txt <= 236
                ) {
                  direction = `SW`;
                } else if (
                  $(windDegree).txt >= 237 &&
                  $(windDegree).txt <= 258
                ) {
                  direction = `WSW`;
                } else if (
                  $(windDegree).txt >= 259 &&
                  $(windDegree).txt <= 281
                ) {
                  direction = `W`;
                } else if (
                  $(windDegree).txt >= 282 &&
                  $(windDegree).txt <= 303
                ) {
                  direction = `WNW`;
                } else if (
                  $(windDegree).txt >= 304 &&
                  $(windDegree).txt <= 326
                ) {
                  direction = `NW`;
                } else {
                  direction = `NNW`;
                }
                windDegree = `<li class="text-xs text-[#F7BF4F] font-info">${direction}</li>`;
                $(windDegree).appendTo("#day5data");
              }
            }
          });
      }
    });
  // Returns to default values after getting location & weather data.
  city = $("#userSearch").val("");
}


function displayForm() {

  $(instructions).removeClass("hidden");
  $(searchForm).removeClass("hidden");
  $(newSearch).addClass("hidden");
};


$("#weatherBtn").on("click", displayWeather);
$("#newSearchBtn").on("click", displayForm);