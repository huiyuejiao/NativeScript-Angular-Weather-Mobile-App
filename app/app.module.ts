import { NgModule } from "@angular/core"
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppComponent } from "./app.component";
import { routes, navigatableComponents } from "./app.routing";
import { WeatherService } from "./shared/weather/weather.service";
import { TNSFontIconModule,TNSFontIconService } from 'nativescript-ngx-fonticon';
// turn debug on
TNSFontIconService.debug = true;
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(routes),
    		TNSFontIconModule.forRoot({
      'fa': './css/font-awesome.css',
      'ion': './css/ionicons.css'
		})
  ],
  declarations: [
    AppComponent,
    ...navigatableComponents
  ],
  providers:[WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule {}