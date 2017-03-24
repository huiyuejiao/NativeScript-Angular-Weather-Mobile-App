import { WeatherComponent } from "./pages/weather/weather.component";
import { ForecastComponent } from "./pages/forecast/forecast.component";
import { ListComponent } from "./pages/list/list.component";
export const routes = [
  { path: "", component: WeatherComponent },
  { path: "weather", component: WeatherComponent },
  { path: "forecast", component: ForecastComponent },
  { path: "forecast/:name", component: ForecastComponent },
  { path: "list", component: ListComponent},
  { path: "weather/:name", component: WeatherComponent}
];

export const navigatableComponents = [
    WeatherComponent,
    ForecastComponent,
    ListComponent
];