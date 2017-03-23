import { Component, ElementRef, OnInit, ViewChild  } from "@angular/core";
import { Router } from "@angular/router";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import moment = require('moment');
import { Page } from "ui/page";
@Component({
  selector: "my-app",
  templateUrl: "pages/weather/weather.html",
  styleUrls: ["pages/weather/weather-common.css"]
})
export class WeatherComponent implements OnInit{
    is_loading:boolean = false;icon_name;code;
    location;
    icon;temperature;weather;place;wind;clouds;
    pressure;humidity;rain;sunrise;sunset;
    humidity_icon;sunrise_icon;sunset_icon;
    pressure_icon;wind_icon;cloud_icon;rain_icon;

constructor(private router: Router,private weatherService:WeatherService,
private page:Page) {

}
ngOnInit(){
      this.page.actionBarHidden = true;
     // this.page.backgroundImage = "res://bg_login";
        this.location ={  
            "latitude":51.50853,
            "longitude":-0.12574,
            "altitude":0,
            "horizontalAccuracy":37.5,
            "verticalAccuracy":37.5,
            "speed":0,
            "direction":0,
            "timestamp":"2016-08-08T02:25:45.252Z",
            "android":{  
            
            }
        }
  var time_of_day = utilities.getTimeOfDay();
  this.page.cssClass = time_of_day;
  let url = `${constant.WEATHER_URL}${constant.CURRENT_WEATHER_PATH}?lat=${this.location.latitude}&lon=${this.location.longitude}&appid=${constant.WEATHER_APIKEY}`;
        console.log(url);



  this.weatherService.load(url).then((data)=>{
            data  = JSON.parse(data);
            let weather_data = data.weather[0].main.toLowerCase();
            let weather_description_data = data.weather[0].description;

            let temperature_data = data.main.temp;
            let icon_data = constant.WEATHER_ICONS['day'][weather_data];

            let rain_data = '0';
            if(data.rain){
                rain_data = data.rain['3h'];
            }
            this.icon = String.fromCharCode(icon_data);
            this.temperature = `${utilities.describeTemperature(Math.floor(temperature_data))} (${utilities.convertKelvinToCelsius(temperature_data).toFixed(2)} °C)`
            this.weather = weather_description_data;
            this.place = `${data.name}, ${data.sys.country}`;
            this.wind = `${utilities.describeWindSpeed(data.wind.speed)} ${data.wind.speed}m/s ${utilities.degreeToDirection(data.wind.deg)} (${data.wind.deg}°)`;
            this.clouds = `${data.clouds.all}%`;
            this.pressure = `${data.main.pressure} hpa`;
            this.humidity = `${utilities.describeHumidity(data.main.humidity)} (${data.main.humidity}%)`;
            this.rain = `${rain_data}%`;
            this.sunrise = moment(data.sys.sunrise).format('hh:mm a');
            this.sunset = moment(data.sys.sunset).format('hh:mm a');

  });
  this.setIcons();
  var charCode = 0xf07a;
  this.sunrise_icon = String.fromCharCode(charCode);

}
    setIcons() {
         var icons = utilities.getIcons([
        'temperature', 'wind', 'cloud',
        'pressure', 'humidity', 'rain',
        'sunrise', 'sunset'
         ]);
    icons.forEach((item) => {
       this[`${item.name}_icon`] = item.icon;
    });
    
    console.log(this.humidity_icon )
}
goToForecastPage(){
    console.log("go to page")
    this.router.navigate(["/forecast"]);
}

}