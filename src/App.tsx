import { Provider } from "react-redux";
import {
  AppContext,
  appContextDefaultValue,
} from "./utils/context/app.context";
import { ThemeProvider } from "./utils/context/theme.context";
import { store } from "./utils/store";
import { AppRouter } from "./presentation/Components/AppRouter";
import { routes } from "./routes";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContext.Provider value={appContextDefaultValue}>
          <AppRouter routes={routes} />
        </AppContext.Provider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
