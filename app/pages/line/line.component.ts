import { Component, OnInit } from '@angular/core';
import { ObservableArray } from "data/observable-array";

@Component({
    moduleId: module.id,
    selector: 'tk-chart-styling-label',
    templateUrl: 'line.component.html'
})
export class LineComponent implements OnInit {
    private categoricalSource;

    constructor() { }

    getCategoricalSource() {
        return [
            { Country: "Germany", Amount: 15, SecondVal: 14, ThirdVal: 24, Impact: 0, Year: 0 },
            { Country: "France", Amount: 13, SecondVal: 23, ThirdVal: 25, Impact: 0, Year: 0 },
            { Country: "Bulgaria", Amount: 24, SecondVal: 17, ThirdVal: 23, Impact: 0, Year: 0 },
            { Country: "Spain", Amount: 11, SecondVal: 19, ThirdVal: 24, Impact: 0, Year: 0 },
            { Country: "USA", Amount: 18, SecondVal: 8, ThirdVal: 21, Impact: 0, Year: 0 }
        ];
    }
    ngOnInit() {
        this.categoricalSource = this.getCategoricalSource();
    }
}