import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';


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

          if (!initialized) {
            return "Loading...";
          }
          
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

