import { Component, ElementRef, OnInit, ViewChild  } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import moment = require('moment');
import { Page } from "ui/page";
@Component({
  selector: "my-forecast",
  templateUrl: "pages/forecast/forecast.component.html",
  styleUrls: ["pages/forecast/forecast-common.css"]
})
export class ForecastComponent implements OnInit{
    @ViewChild("listView") listView: ElementRef;
    location;
    forecast = [];
    city_name;
    is_loading:boolean = true;
    temperature_icon;wind_icon; cloud_icoon; pressure_icon;
    private categoricalSource;
    constructor(private route:ActivatedRoute,private weatherService:WeatherService,
    private page:Page){
        this.route.params.subscribe((params)=>{
            this.city_name = params["name"];
        })

    }
    ngOnInit(){
        var time_of_day = utilities.getTimeOfDay();
            let cityname = this.city_name.split(" ");
            cityname =  cityname.join("");
            let url = `${constant.WEATHER_URL}${constant.WEATHER_FORECAST_PATH}?cnt=6&q=${cityname}&appid=${constant.WEATHER_APIKEY}`;
            this.weatherService.load(url).then((data)=>{  
                    data  = JSON.parse(data);
                    this.getList(data);
                    if(this.page.ios){
                        this.listView.nativeElement.ios.separatorStyle = 0;
                    }
            });
        this.setIcons();
     }
    private getList(data){
        let list = data.list.splice(1);//except today
        list.forEach((item) => {
                  this.forecast.push({
                      day: moment.unix(item.dt).format('MMM DD (ddd)'),
                      icon: String.fromCharCode(constant.WEATHER_ICONS['day'][item.weather[0].main.toLowerCase()]),
                      temperature: {
                    //   day: `${utilities.describeTemperature(item.temp.day)}`,
                      day: `${utilities.convertKelvinToCelsius(item.temp.max).toFixed(2)} °C`,
                      night: `${utilities.convertKelvinToCelsius(item.temp.min).toFixed(2)} °C`,
                      },
                      wind: `${item.speed}m/s`,
                      clouds: `${item.clouds}%`,
                      pressure: `${item.pressure} hpa`,
                      description: item.weather[0].description,
                      weather:item.weather[0].main.toLowerCase() ==='clear'?true:false
                  })
              });
        this.is_loading = false;
    }
    private setIcons() {
          var icons = utilities.getIcons(['temperature', 'wind', 'cloud', 'pressure']);
          icons.forEach((item) => {
              this[`${item.name}_icon`] = item.icon;
          });
    }
    private add() {

    }
}