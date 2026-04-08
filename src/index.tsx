import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import {BrowserRouter} from "react-router";
import "bootstrap-icons/font/bootstrap-icons.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createStore} from "redux";
import {Provider, useDispatch} from "react-redux";
import {store} from "./redux/redux";
import {install} from "./redux/accountSlice";
import AuthContext from "./authContext";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// UseQuery
const queryClient = new QueryClient();

root.render(
<Provider store={store}>
   <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <AuthContext>
    <App />
    </AuthContext>
  </BrowserRouter>
   </QueryClientProvider>
</Provider>
);


