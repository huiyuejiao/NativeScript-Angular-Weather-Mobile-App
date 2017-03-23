import { Component, ElementRef, OnInit, ViewChild  } from "@angular/core";
import { Router } from "@angular/router";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import moment = require('moment');
import listViewModule = require("ui/list-view");

import { ListView } from "ui/list-view";
@Component({
  selector: "my-forecast",
  templateUrl: "pages/forecast/forecast.component.html",
  styleUrls: ["pages/forecast/forecast-common.css"]
})
export class ForecastComponent implements OnInit{
    location;
    forecast = [];
    is_loading:boolean = false;
    temperature_icon;wind_icon; cloud_icoon; pressure_icon;
    constructor(private weatherService:WeatherService){

    }
    ngOnInit(){
  var time_of_day = utilities.getTimeOfDay();

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
      let url = `${constant.WEATHER_URL}${constant.WEATHER_FORECAST_PATH}?cnt=6&lat=${this.location.latitude}&lon=${this.location.longitude}&appid=${constant.WEATHER_APIKEY}`;
        console.log(url);
        this.setIcons();
    this.weatherService.load(url).then((data)=>{
            data  = JSON.parse(data);
            var list = data.list.splice(1);//except today
            list.forEach((item) => {
            console.log(moment(item.dt).format('MMM DD (ddd)'));
            this.forecast.push({
                day: moment(item.dt).format('MMM DD (ddd)'),
                icon: String.fromCharCode(constant.WEATHER_ICONS['day'][item.weather[0].main.toLowerCase()]),
                temperature: {
                day: `${utilities.describeTemperature(item.temp.day)}`,
                night: `${utilities.describeTemperature(item.temp.night)}`
                },
                wind: `${item.speed}m/s`,
                clouds: `${item.clouds}%`,
                pressure: `${item.pressure} hpa`,
                description: item.weather[0].description
            })
          });
          console.dump(this.forecast);
        })
    }
      private setIcons() {
    var icons = utilities.getIcons(['temperature', 'wind', 'cloud', 'pressure']);
    icons.forEach((item) => {
     this[`${item.name}_icon`] = item.icon;
    });
  }
}