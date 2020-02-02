import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import ErrorPage from './components/misc/ErrorPage'
import ErrorContainer from './components/misc/ErrorContainer'
import 'bootstrap/dist/css/bootstrap.min.css';


import { DrizzleContext } from "@drizzle/react-plugin";
import drizzleOptions from "./drizzleOptions";
import appMiddlewares from "./middleware/index.js";
import appReducers from "./reducers/index.js";
import { Drizzle, generateStore } from "@drizzle/store";

import { BrowserRouter } from 'react-router-dom'

// Drizzle Instance Set-up
const drizzleStore = generateStore({drizzleOptions, appReducers, appMiddlewares, disableReduxDevTools: false});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render(
  <BrowserRouter>
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          console.log("init and drizzle: ", initialized, drizzle)
          console.log("drizzleState", drizzleState)
          if (!initialized) {
            console.log("not init: ", drizzleState)
            // console.log("NO INIT: ", drizzle, drizzle["web3"].currentProvider)
            return <ErrorContainer />;
          }
          
          // console.log(drizzle, drizzle.web3.currentProvider)
          
          return (
            <App drizzle={drizzle} drizzleState={drizzleState} />
          )
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

