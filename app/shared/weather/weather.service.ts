import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
var fetchModule = require("fetch");
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

@Injectable()
export class WeatherService{
    constructor(private http: Http) {}
  load(url) {
    //let url ='http://api.openweathermap.org/data/2.5/weather?lat=51.50853&lon=-0.12574&appid=0f8c7d27cbe2b706f480c1e1512c7c0b';
    console.log(url);
    return fetchModule.fetch(url)
    .then(response => {return response._bodyText})
    .then(data => {
      return data;
    });
  }
  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}