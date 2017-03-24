import { Component, ElementRef, OnInit, ViewChild  } from "@angular/core";
import { Router } from "@angular/router";
import { TextField } from "ui/text-field";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import { cityWeather } from "../../shared/weather/weather";
import moment = require('moment');
import applicationSettings = require("application-settings");
@Component({
  selector: "my-list",
  templateUrl: "pages/list/list.component.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"]
})
export class ListComponent implements OnInit{
    location;
    public searchPhrase: string;
    cityWeatherList:Array<cityWeather>;
    city;
    city_weather;
    nighttime:boolean = false;
    is_loading:boolean = true;
    @ViewChild("sb") sb: ElementRef;
    constructor(private router:Router,private weatherService: WeatherService){

    }
    ngOnInit(){
        this.city_weather = JSON.parse(applicationSettings.getString("city_weather"));
        this.cityWeatherList = [];
        this.city_weather.forEach((item) => {
            let place = `${item.name}, ${item.sys.country}`;
            let temperature_data = item.main.temp;
            let temperature = `${utilities.describeTemperature(Math.floor(temperature_data))} (${utilities.convertKelvinToCelsius(temperature_data).toFixed(2)} °C)`;
            let id = this.cityWeatherList.length;
            var loc =`${item.coord.lat},${item.coord.lon}`;
            var targetDate = new Date() // Current date/time of user computer
            var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;// Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
            var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + constant.GOOGLE_MAP_API_KEY
            this.weatherService.load(apicall).then((data) =>{
              data  = JSON.parse(data);
              if(data.status ==="OK"){
                var offsets = data.dstOffset * 1000 + data.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
                var time = moment(localdate).format('hh:mm a');
                this.nighttime = utilities.getTimeOfDay(moment(localdate))==="night"?true:false;
                this.cityWeatherList.push(new cityWeather(id,place,temperature,time,this.nighttime));
              }

            },() =>{
                  alert('Request failed');
            });
            this.is_loading  = false;
            
        });
 
    }
    public onClear() {
        this.searchPhrase = "";
    }
    onSubmit(value) {
        if (value.trim() === "") {
          alert("Enter a city name");
          return;
        }
        value = value.split(" ");
        let city = value.join("");
        let textField = <TextField>this.sb.nativeElement;
        textField.dismissSoftInput();
        let url = `${constant.WEATHER_URL}${constant.CURRENT_WEATHER_PATH}?q=${city.trim()}&appid=${constant.WEATHER_APIKEY}`;
        this.weatherService.load(url).then((data)=>{ 
                let city_weather = JSON.parse(applicationSettings.getString("city_weather"));
                data  = JSON.parse(data);
                city_weather.push(data);
                applicationSettings.setString("city_weather",JSON.stringify(city_weather));
                let place = `${data.name}, ${data.sys.country}`;
                let temperature_data = data.main.temp;
                let temperature = `${utilities.describeTemperature(Math.floor(temperature_data))} (${utilities.convertKelvinToCelsius(temperature_data).toFixed(2)} °C)`;
                let id = this.cityWeatherList.length;
                var loc =`${data.coord.lat},${data.coord.lon}`;
                var targetDate = new Date() // Current date/time of user computer
                var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;
                var apicall = 'https://maps.googleapis.com/maps/api/timezone/json?location=' + loc + '&timestamp=' + timestamp + '&key=' + constant.GOOGLE_MAP_API_KEY
                this.weatherService.load(apicall).then((data) =>{
                      data  = JSON.parse(data);
                      if(data.status ==="OK"){
                        var offsets = data.dstOffset * 1000 + data.rawOffset * 1000 // get DST and time zone offsets in milliseconds
                        var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
                        var time = moment(localdate).format('hh:mm a');
                        this.nighttime = utilities.getTimeOfDay(moment(localdate))==="night"?true:false;
                        this.cityWeatherList.push(new cityWeather(id,place,temperature,time,this.nighttime));
                      }

                },() =>{
                      alert('Request failed');
                });
                this.searchPhrase = "";
        },()=>{
                alert({
                message: "An error occurred while adding an city.",
                okButtonText: "OK"
              });
              this.searchPhrase = "";
        });
  }
  delete(item:cityWeather) {
        for(let i= 0;i<this.cityWeatherList.length;i++){
            if(this.cityWeatherList[i].id == item.id){
                  let index = i;
                  this.cityWeatherList.splice(index, 1);
                  return;
            }      
        }
  }
detail(city_name){
  this.router.navigate(["/weather",city_name]);
}

}