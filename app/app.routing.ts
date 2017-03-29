import { WeatherComponent } from "./pages/weather/weather.component";
import { ForecastComponent } from "./pages/forecast/forecast.component";
import { ListComponent } from "./pages/list/list.component";
import { LoginComponent} from './pages/login/login.component';
import { LineComponent} from './pages/line/line.component';
import { ListViewSwipeActionsComponent} from "./pages/listview-swipe-execute-sticky/listview-swipe-actions.component"
export const routes = [
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "line" , component: LineComponent},
  { path: "weather", component: WeatherComponent },
  { path: "forecast", component: ForecastComponent },
  { path: "forecast/:name", component: ForecastComponent },
  { path: "list", component: ListComponent},
  { path: "weather/:name", component: WeatherComponent}
];

export const navigatableComponents = [
    WeatherComponent,
    ForecastComponent,
    ListComponent,
    LoginComponent,
    LineComponent,
    ListViewSwipeActionsComponent
];