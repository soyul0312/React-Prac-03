import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/configStore";
import { QueryClient, QueryClientProvider } from "react-query"; //react-query 기본 셋팅 1

const queryClient = new QueryClient(); //react-query 기본 셋팅 2

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    {/* <React.StrictMode> */}
    {/* react-query 기본 셋팅 3 */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    {/* </React.StrictMode> */}
  </QueryClientProvider>
);
