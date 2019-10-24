import React from "react";
import createStore from "./store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import "react-toastify/dist/ReactToastify.css";
import {
  cacheExchange,
  createClient,
  debugExchange,
  fetchExchange,
  Provider as UrqlProvider,
  subscriptionExchange
} from "urql";
import { SubscriptionClient } from "subscriptions-transport-ws";
import Header from "./components/Header";
import SelectDropDown from "./components/SelectDropDown";
import CurrentDataContainer from "./components/CurrentDataContainer";
import ChartContainer from "./components/ChartContainer";

const subscriptionClient = new SubscriptionClient(
  "wss://react.eogresources.com/graphql",
  {}
);

const client = createClient({
  url: "https://react.eogresources.com/graphql",
  exchanges: [
    debugExchange,
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

const store = createStore();

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: "rgb(39,49,66)"
    },
    secondary: {
      main: "rgb(197,208,222)"
    },
    background: {
      main: "rgb(226,231,238)"
    }
  }
});

const App = props => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <UrqlProvider value={client}>
          <Header />
          <SelectDropDown />
          <CurrentDataContainer />
          <ChartContainer/>
          <ToastContainer />
      </UrqlProvider>
    </Provider>
  </MuiThemeProvider>
);

export default App;
