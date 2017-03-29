import { NgModule } from "@angular/core"
import * as elementRegistryModule from 'nativescript-angular/element-registry';

// --- The built-in 'nativescript-telerik-ui-pro' modules
import { NativeScriptUISideDrawerModule } from "nativescript-telerik-ui-pro/sidedrawer/angular";
import { NativeScriptUIListViewModule } from "nativescript-telerik-ui-pro/listview/angular";
import { NativeScriptUICalendarModule } from "nativescript-telerik-ui-pro/calendar/angular";
import { NativeScriptUIChartModule } from "nativescript-telerik-ui-pro/chart/angular";
import { NativeScriptUIDataFormModule } from "nativescript-telerik-ui-pro/dataform/angular";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { NativeScriptModule } from "nativescript-angular/platform";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { AppComponent } from "./app.component";
import { routes, navigatableComponents } from "./app.routing";
import { WeatherService } from "./shared/weather/weather.service";
import { UserService } from "./shared/user/user.service";
import { TNSFontIconModule,TNSFontIconService } from 'nativescript-ngx-fonticon';
import { Database } from "./shared/database/database"
// turn debug on
TNSFontIconService.debug = true;
@NgModule({
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptHttpModule,
    NativeScriptRouterModule,
    NativeScriptUIListViewModule,
    NativeScriptUISideDrawerModule,
    NativeScriptUICalendarModule,
    NativeScriptUIChartModule,
    NativeScriptUIDataFormModule,
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
  providers:[WeatherService, UserService,  Database],
  bootstrap: [AppComponent]
})
export class AppModule {}