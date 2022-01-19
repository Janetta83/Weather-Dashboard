// check local storage and initialize
var cities = JSON.parse(localStorage.getItem("cities"));
if (cities) {
    cities = {}
} else {
    historyFunction(cities);
}
console.log(cities)
// Fetch text information on button click
function searchCoordsFunction() {
    var yekipa = "f9e3ef72f0eaeee2c3f8a3b8951dd135";

    let cityName = document.querySelector("#search input").ariaValue;

    let currentApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + yekipa;
    fetch(currentApiUrl)
      .then(function (response) {
          if (response.ok) {
              response.json()
              .then(function (data) {
                  let lat = (data.coord.lat);
                  let lon = (data.coord.lon);
                  let dt = (data.dt);
                  weatherFunction(cityName, dt, lat, lon, yekipa);
              });
          } else {
              alert("Error: " + response.statusText);
          }
      });
};

function weatherFunction(cityName, dt, lat, lon, yekipa) {
    let city = {
        today: {},
        forecast: {}
    };
    let oneCallApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&dt=" + dt + "&units=imperial&appid=" + yekipa;
    
    fetch(oneCallApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                city.today = {
                    date: String(new Date(dt * 1000)),
                    icon: data.current.weather[0].icon,
                    temp: data.current.temp,
                    wind: data.current.wind_speed,
                    humidity: data.current.humidity,
                    uvi: data.current.uvi
                };
                //forecast data
                for (i = 1; i < 6; i++) {
                    city.forecast[i] = {
                        date: String(new Date(data.daily[i].dt * 1000)),
                        icon: data.daily[i].weather[0].icon,
                        temp: data.daily[i].temp.day,
                        wind: data.daily[i].wind_speed,
                        humidity: data.daily[i].humidity,
                    }
                }

                cities[cityName] = city;

                localStorage.setItem("cities", JSON.stringify(cities));

                historyFunction(cities);

                displayFunction(cityName)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

//creates history function
function historyFunction(cities) {
    document.getElementById("bottom").innerHTML = ""
    for (const city in cities) {
        let buttonE1 = document.createElement("button");
        buttonE1.onclick = function() {
            displayFunction(city)
        }
        buttonE1.innerText = String(city);
        document.getElementById("bottom").append(buttonE1);
      }
    }

    function displayFunction(city) {
        console.log("display for .. " + city)

        //Clear daily
        document.getElementById("today").innerText = "";
        //display daily
        let dateHeaderE1 = document.createElement("h2")
        dateHeaderE1.innerText = (cities[city].today.date).substr(0,10)
        document.getElementById("today").appendChild(dateHeaderE1)
        let iconImgE1 = document.createElement("img")
        iconImgE1.src = "http://openweathermap.org/img/wn/" + (cities[city].today.icon) + "@2x.png";
        dateHeaderE1.append(iconImgE1)

        let tempDivE1 = document.createElement("h4")
        tempDivE1.innerText = "Temp: " + cities[city].today.temp + " °F"
        document.getElementById("today").appendChild(tempDivE1)

        let windDivE1 = document.createElement("h4")
        windDivE1.innerText = "Wind: " + cities[city].today.wind + "MPH"
        document.getElementById("today").appendChild(windDivE1)

        let humidityDivE1 = document.createElement("h4")
        humidityDivE1.innerText = "Humidity: " + cities[city].today.humidity + "%"
        document.getElementById("today").appendChild(humidityDivE1)

        let uviDivE1 = document.createElement("h4")
        uviDivE1.innerText = "UV Index: " + cities[city].today.uvi
        document.getElementById("today").appendChild(uviDivE1)

        let uviCondition = "";
        if (cities[city].today.uvi >= 0 && cities[city].today.uvi < 2) {
            uviCondition = "Green"
        } else if (cities[city].today.uvi > 3 && cities[city].today.uvi < 5) {
            uviCondition = "Yellow"
        } else if (cities[city].today.uvi > 6 && cities[city].today.uvi < 7) {
            uviCondition = "Orange"
        } else {uviCondition = "Red"}

        uviDivE1.style.backgroundColor = uviCondition

        //Clear forecast
        for (var i = 1; i < 6; i++) {
            document.querySelector(".day" + i).innerHTML = ""
        }
        //Display forecast
        for (var i = 1; i < 6; i++) {
            let dateSpanE1 = document.createElement("span")
            dateSpanE1.innerText = (cities[city].forecast[i].date).substr(0,10)
            document.querySelector(".day" + i).appendChild(dateSpanE1)

            let iconImgE1 = document.createElement("img")
            iconImgE1.src = "http://openweathermap.org/img/wn/" + (cities[city].forecast[i].icon) + "@2x.png";
            document.querySelector(".day" + i).appendChild(iconImgE1)

            let tempDivE1 = document.createElement("span")
            tempDivE1.innerText = "Temp: " + cities[city].forecast[i].temp + " °F"
            document.querySelector(".day" + i).appendChild(tempDivE1)

            let windDivE1 = document.createElement("span")
            windDivE1.innerText = "Wind: " + cities[city].forecast[i].wind + "MPH"
            document.querySelector(".day" + i).appendChild(windDivE1)

            let humidityDivE1 = document.createElement("span")
            humidityDivE1.innerText = "Humidity: " + cities[city].forecast[i].humidity + "%"
            document.querySelector(".day" + i).appendChild(humidityDivE1)
        }
            
        }
        
    }
}