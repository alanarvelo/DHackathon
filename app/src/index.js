import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';


import { DrizzleContext } from "@drizzle/react-plugin";
import drizzleOptions from "./drizzleOptions";
import appMiddlewares from "./middleware/index.js";
import appReducers from "./reducers/index.js";
import { Drizzle, generateStore } from "@drizzle/store";

import { BrowserRouter } from 'react-router-dom'
import WithWeb3 from './ethereumZFY/web3/hoc/WithWeb3';

import { getCurrentConfig } from './configZFY';
const config = getCurrentConfig();
console.log("index: ", config)

ReactDOM.render(
  <BrowserRouter>
    <WithWeb3
      config={config}
      network={config.network}
      contracts={config.contracts}
      handleStatus={false}
      currentContract="DHackathonFactory"
    >
      {( {web3Cleared} ) => {
        console.log("props children delivery: ", web3Cleared)
        // if (web3Cleared) {
        // Drizzle Instance Set-up
        const drizzleStore = generateStore({drizzleOptions, appReducers, appMiddlewares, disableReduxDevTools: false});
        const drizzle = new Drizzle(drizzleOptions, drizzleStore);
          return (
            <DrizzleContext.Provider drizzle={drizzle}>
              <DrizzleContext.Consumer>
                {drizzleContext => {
                  const { drizzle, drizzleState, initialized } = drizzleContext;

                  if (!initialized) {
                    return "Loading...";
                  }
                  console.log("made it here")
                  return (
                    <App drizzle={drizzle} drizzleState={drizzleState} />
                  )
                }}
              </DrizzleContext.Consumer>
            </DrizzleContext.Provider>
          )
        // }
      }}
    </WithWeb3>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

