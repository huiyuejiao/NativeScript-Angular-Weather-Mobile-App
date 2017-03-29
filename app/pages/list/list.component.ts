// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Component, ElementRef, OnInit, ViewChild, NgZone  } from "@angular/core";
import { Router } from "@angular/router";
import { TextField } from "ui/text-field";
import { WeatherService } from "../../shared/weather/weather.service";
import constant = require("../../shared/constants");
import utilities = require("../../shared/utilities");
import { cityWeather } from "../../shared/weather/weather";
import moment = require('moment');
import applicationSettings = require("application-settings");
import { Page} from 'ui/page';
import * as frameModule from "ui/frame";
import * as utilsModule from "utils/utils";
import { ListViewEventData, RadListView } from "nativescript-telerik-ui-pro/listview";
import { RadListViewComponent } from "nativescript-telerik-ui-pro/listview/angular";
import { ObservableArray } from "data/observable-array";
import { Database } from "../../shared/database/database"
@Component({
  selector: "my-list",
  templateUrl: "pages/list/list.component.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"]
})
export class ListComponent implements OnInit{
    location;
    public searchPhrase: string;
    cityWeatherList:Array<cityWeather>=[];
    city;
    city_weather;
    nighttime:boolean = false;
    is_loading:boolean = true;
    @ViewChild("sb") sb: ElementRef;
    @ViewChild("myListView") listViewComponent: RadListViewComponent;
    constructor(private router:Router,private weatherService: WeatherService,
    private page:Page,private zone: NgZone,
    private database: Database){

    }
    ngOnInit(){
        this.city_weather = JSON.parse(applicationSettings.getString("city_weather"));
        this.cityWeatherList = [];
        this.database.fetch();
        console.dump(this.database.weather);
        let weather_list=this.database.weather;
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
                this.database.insert(place,temperature_data);
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
detail(city_name){
  this.router.navigate(["/weather",city_name]);
}
    // >> angular-listview-swipe-action-release-notify
    public onCellSwiping(args: ListViewEventData) {
        console.log("ths is cell swipping")
        var swipeLimits = args.data.swipeLimits;
        var currentItemView = args.object;
        var currentView;

        if (args.data.x > 200) {
            console.log("Notify perform left action");
        } else if (args.data.x < -200) {
            console.log("Notify perform right action");
        }
    }
    // << angular-listview-swipe-action-release-notify

    // >> angular-listview-swipe-action-release-limits
    public onSwipeCellStarted(args: ListViewEventData) {
        console.log("this is swip cell start")
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['object'];
        var leftItem = swipeView.getViewById('mark-view');
        var rightItem = swipeView.getViewById('delete-view');
        swipeLimits.left = leftItem.getMeasuredWidth();
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = leftItem.getMeasuredWidth() / 2;
    }
    // << angular-listview-swipe-action-release-limits

    // >> angular-listview-swipe-action-release-execute
    public onSwipeCellFinished(args: ListViewEventData) {
        console.log("This is swip cell finished")

    }
    // << angular-listview-swipe-action-release-execute

    // >> angular-listview-swipe-action-handlers
    public onLeftSwipeClick(args) {
        console.log("Left swipe click");
        console.dump(args.object.bindingContext)
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args) {
        console.log("Right swipe click");
        console.dump(args.object.bindingContext)
        this.cityWeatherList.splice(this.cityWeatherList.indexOf(args.object.bindingContext), 1);
    }
}