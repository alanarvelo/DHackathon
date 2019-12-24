import React, { Component } from "react";
import Container from "./Container";
import "../App.css";

import drizzleOptions from "../drizzleOptions";
import appMiddlewares from "../middleware/index.js";
import { Drizzle, generateStore } from "drizzle";
import { DrizzleContext } from "drizzle-react";

// Drizzle Instance Set-up
const drizzleStore = generateStore({drizzleOptions, appMiddlewares, disableReduxDevTools: false});
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

class App extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <Container />
      </DrizzleContext.Provider>
    );
  }
}

export default App;
