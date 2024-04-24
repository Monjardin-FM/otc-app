import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { Provider } from "react-redux";
import {
  AppContext,
  appContextDefaultValue,
} from "./utils/context/app.context";
import { store } from "./utils/store";
import { AppRouter } from "./presentation/Components/AppRouter";
import { routes } from "./routes";

function App() {
  return (
    <Provider store={store}>
      <AppContext.Provider value={appContextDefaultValue}>
        <AppRouter routes={routes} />
      </AppContext.Provider>
    </Provider>
  );
}

export default App;
