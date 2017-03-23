import { WeatherComponent } from "./pages/weather/weather.component";
import { ForecastComponent } from "./pages/forecast/forecast.component";
export const routes = [
  { path: "", component: WeatherComponent },
  { path: "weather", component: WeatherComponent },
  { path: "forecast", component: ForecastComponent },
];

export const navigatableComponents = [
    WeatherComponent,
    ForecastComponent
];