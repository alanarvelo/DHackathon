import React, { Component } from "react";
import Container from "./Container";
import "../App.css";

import drizzleOptions from "../drizzleOptions";
import appMiddlewares from "../middleware/index.js";
import appReducers from "../reducers/index.js";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";

import 'react-toastify/dist/ReactToastify.css'
import { BaseStyles, Box, Heading } from 'rimble-ui';
import { ToastContainer } from 'react-toastify'

// Drizzle Instance Set-up
const drizzleStore = generateStore({drizzleOptions, appReducers, appMiddlewares, disableReduxDevTools: false});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>

        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            console.log("drizzle: ", drizzle)
            console.log("drizzleState: ", drizzleState)

            if (!initialized) {
              return "Loading...";
            }
            
            return (
              <BaseStyles style={{textAlign: 'center'}}>
                <Box m={4}>
                  <Heading mb={2}>Welcome to Decentralized Hackathons!</Heading>
                  <div className="App">
                    <ToastContainer />
                    <Container drizzle={drizzle} drizzleState={drizzleState} />
                  </div>
                </Box>
              </BaseStyles>
            )
          }}
        </DrizzleContext.Consumer>

      </DrizzleContext.Provider>
    );
  }
}

export default App;
