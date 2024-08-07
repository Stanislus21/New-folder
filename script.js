let cityInput = document.getElementById('city_input'),
    search_button = document.getElementById('search_button'),
    api_key = 'edd211ae34fea1e9600adb0c458f6a31',
    currentWeatherScene = document.querySelectorAll('.weather_left .scene')[0],
    thisWeeksForecastScene = document.querySelector('.day_forecast'),
    aqiScene= document.querySelectorAll('.highlights .scene')[0],
    sunriseScene = document.querySelector('.highlights .scene')[1],
    aqiList = ['GOOD','FAIR','MODERATE','POOR', 'DANGEROUS'];

function getWeatherDetails(name, lat, lon, country, state){
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let AIR_POLLUTION_API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;
    days =[
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ],
    months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data =>{
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqiScene.innerHTML = `
            <div class="scene_head">
                            <p>Air Quality Index</p>
                            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi -1]}</p>
                        </div>
                        <div class="air-indices">
                            <i class="fa-regular fa-wind fa-3x"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2> ${pm2_5} </h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2> ${pm10} </h2>
                            </div>
                            <div class="item">
                                <p>SO2</p>
                                <h2> ${so2}</h2>
                            </div>
                            <div class="item">
                                <p>CO</p>
                                <h2> ${co} </h2>
                            </div>
                            <div class="item">
                                <p>NO</p>
                                <h2> ${no} </h2>
                            </div>
                            <div class="item">
                                <p>NO2</p>
                                <h2> ${no2} </h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2> ${nh3} </h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2> ${o3} </h2>
                            </div>
                        </div>
                    `
    }).catch(() =>{
        alert('Failed To Calculate The Air Quality Index.');
    });

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherScene.innerHTML= `
            <div class="current_weather">
                <div class="details">
                    <p>Currently</p>
                    <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                    <p>${data.weather[0].description}</p>
                </div>
                <div class="weather_icon">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                </div>
            </div>
            <hr>
             <div class="scene_footer">
                <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                <p><i class="fa-light fa-location-dot"></i>${name}, ${country}</p>
            </div>
        `;
        let{sunrise, sunset} = data.sys,
                  {timezone} = data,
                 sunRiseTime = moment.utc(sunrise, 'X').add(timezone,'seconds').format('hh:mm A'),
                  sunSetTime = moment.utc(sunset, 'X').add(timezone,'seconds').format('hh:mm A');
                  sunriseScene.innerHTML= `
                    <div class="scene_head">
                            <p>Sunrise & Sunset</p>
                        </div>
                        <div class="sunrise-sunset">
                            <div class="item">
                                <div class="icon">
                                    <i class="fa-light fa-sunrise fa-4x"></i>
                                </div>
                                <div>
                                    <p>Sunrise</p>
                                    <h2>${sunRiseTime}</h2>
                                </div>
                                <div class="item">
                                    <div class="icon">
                                        <i class="fa-light fa-sunset fa-4x"></i>
                                    </div>
                                    <div>
                                        <p>Sunset</p>
                                        <h2>${sunSetTime}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;    
    }).catch(() => {
        alert('Failed To Detect Current.');
    });

    fetch(FORECAST_API_URL).then(res => res.json()).then(data => {
       let uniqueForecastDays = [];
       let thisWeeksForecast = data.list.filter(forecast => {
            let forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
       });
       thisWeeksForecastScene.innerHTML = '';
       for(i = 1; i < thisWeeksForecast.length; i++){
        let date = new Date(thisWeeksForecast[i].dt_txt);
        thisWeeksForecastScene.innerHTML += `
        <div class="forecast_item">
                            <div class="icon_wrapper">
                                <img src="https://openweathermap.org/img/wn/${thisWeeksForecast[i].weather[0].icon}.png" alt="">
                                <span>${(thisWeeksForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>
        `;
       }

    }).catch(() => {
        alert('Failed To Detect Weather Forecast.')
    })
}
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value='';
    if(!cityName) return;
    let GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name,lat,lon,country,state);
    }).catch(() => {
        alert(`Failed to locate ${cityName}`);
    })
}
search_button.addEventListener('click', getCityCoordinates);