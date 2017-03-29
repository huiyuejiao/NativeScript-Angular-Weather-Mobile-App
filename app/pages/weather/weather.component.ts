import { Router, ActivatedRoute } from "@angular/router";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import store = require("../../shared/store");
import moment = require('moment');
import { Page } from "ui/page";
import { Component, ElementRef, ViewChild, Injectable, OnInit, ChangeDetectorRef } from "@angular/core";
import { View } from "ui/core/view";
import { RadSideDrawer } from "nativescript-telerik-ui-pro/sidedrawer";
import { ActionItem } from "ui/action-bar";
import sideDrawerModule = require('nativescript-telerik-ui-pro/sidedrawer');
import { Observable } from "data/observable";
import { RadSideDrawerComponent, SideDrawerType } from "nativescript-telerik-ui-pro/sidedrawer/angular";
import applicationSettings = require("application-settings");
import * as tnsOAuthModule from 'nativescript-oauth';
@Component({
  selector: "my-app",
  templateUrl: "pages/weather/weather.html",
  styleUrls: ["pages/weather/weather-common.css"]
})
export class WeatherComponent implements OnInit{
    city_name;
    city_name_tirmmed;
    is_loading:boolean = true;icon_name;code;
    location;
    icon;temperature;weather;place;wind;clouds;
    pressure;humidity;rain;sunrise;sunset;
    humidity_icon;sunrise_icon;sunset_icon;
    pressure_icon;wind_icon;cloud_icon;rain_icon;
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    private drawer: SideDrawerType;
    constructor(private route: ActivatedRoute,private router: Router,
    private weatherService:WeatherService,private page:Page,
    private _changeDetectionRef: ChangeDetectorRef) {

            this.route.params.subscribe((params) => {
            this.city_name = params["name"];
        });
    }
    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }
        public openDrawer() {
        this.drawer.showDrawer();
    }

    ngOnInit(){

        if(this.city_name){
            this.city_name_tirmmed = this.city_name.split(" ");
            this.city_name_tirmmed =  this.city_name_tirmmed.join("");
            let url = `${constant.WEATHER_URL}${constant.CURRENT_WEATHER_PATH}?q=${this.city_name_tirmmed}&appid=${constant.WEATHER_APIKEY}`;
            console.log(url);
            this.weatherService.load(url).then((data)=>{  
                    data  = JSON.parse(data);
                    this.setNames(data);
            });
        }else{
            this.location = {  
                    "latitude":49.282729,
                    "longitude":-123.120738
            };
            let url = `${constant.WEATHER_URL}${constant.CURRENT_WEATHER_PATH}?lat=${this.location.latitude}&lon=${this.location.longitude}&appid=${constant.WEATHER_APIKEY}`;
            console.log(url);
            this.weatherService.load(url).then((data)=>{  
                    data  = JSON.parse(data);
                    if(store.weather_init_flag){
                        store.weather_init_flag = false;
                        let city_weather = [];
                        city_weather.push(data);
                        applicationSettings.setString("city_weather",JSON.stringify(city_weather));
                    }
                    this.setNames(data);
            });
        }
        //this.page.actionBarHidden = true;
       // this.page.backgroundImage = "res://bg_sunny_night";
        var time_of_day = utilities.getTimeOfDay();
        this.page.cssClass = time_of_day;
        this.setIcons();

    }
    setNames(data){
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
                this.city_name_tirmmed  = this.place.split(" ");
                this.city_name_tirmmed = this.city_name_tirmmed.join("");
                this.wind = `${utilities.describeWindSpeed(data.wind.speed)} ${data.wind.speed}m/s ${utilities.degreeToDirection(data.wind.deg)} (${data.wind.deg}°)`;
                this.clouds = `${data.clouds.all}%`;
                this.pressure = `${data.main.pressure} hpa`;
                this.humidity = `${utilities.describeHumidity(data.main.humidity)} (${data.main.humidity}%)`;
                this.rain = `${rain_data}%`;
                this.sunrise = moment.unix(data.sys.sunrise).format('hh:mm a');
                this.sunset = moment.unix(data.sys.sunset).format('hh:mm a');
                this.is_loading = false;
    }
    setIcons() {
        var icons = utilities.getIcons([
            'temperature', 'wind', 'cloud','pressure', 'humidity', 'rain','sunrise', 'sunset'
            ]);
        icons.forEach((item) => {
        this[`${item.name}_icon`] = item.icon;
        });
    }
    goToForecastPage(){
        console.log(this.city_name_tirmmed);
        this.router.navigate(["/forecast",this.city_name_tirmmed]);
    }

goToLinePage(){
    this.router.navigate(["/line"]);
}
    public onTapLogout() {
        tnsOAuthModule.logout()
            .then(() => {console.log('logged out');this.router.navigate(['login'])})
            .catch((er) => {
                console.error('error logging out');
                console.dir(er);
            });
    }
   all(){
       this.router.navigate(['/list'])
   }
}