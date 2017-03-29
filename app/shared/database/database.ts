import { Injectable } from "@angular/core";
var Sqlite = require("nativescript-sqlite");
@Injectable()
export class Database {

    private database: any;
    public weather: Array<any>;
 
    public constructor() {
        console.log("this is database");
        this.weather = [];
        (new Sqlite("my.db")).then(db => {
            db.execSQL("CREATE TABLE IF NOT EXISTS weather (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT, temp TEXT)").then(id => {
                this.database = db;
            }, error => {
                console.log("CREATE TABLE ERROR", error);
            });
        }, error => {
            console.log("OPEN DB ERROR", error);
        });
    }
 
    public insert(city,temp) {
        this.database.execSQL("INSERT INTO weather (city, temp) VALUES (?, ?)", [city, temp]).then(id => {
            console.log("INSERT RESULT", id);
            this.fetch();
        }, error => {
            console.log("INSERT ERROR", error);
        });
    }
 
    public fetch() {
        this.database.all("SELECT * FROM weather").then(rows => {
            this.weather = [];
            for(var row in rows) {
                this.weather.push({
                    "city": rows[row][1],
                    "temp": rows[row][2]
                });
            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }

}