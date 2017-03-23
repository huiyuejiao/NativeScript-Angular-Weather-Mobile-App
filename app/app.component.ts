import { Component } from "@angular/core";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
@Component({
  selector: "my-app",
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {
    constructor(private fonticon: TNSFontIconService) {
    // ^ IMPORTANT to cause Angular's DI system to instantiate the service!
  }
}