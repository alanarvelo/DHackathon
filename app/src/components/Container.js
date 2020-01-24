
import React from "react";
import FactoryContract from "./FactoryContract"
import DHackathonList from './DH/DHackathonList'
import { Heading, Flash } from 'rimble-ui';
import { DrizzleContext } from "@drizzle/react-plugin";

export default class Container extends React.Component {
  render() {
    return(
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }                                    
          return (
            <div>
              <Heading mb={2}>Welcome to Decentralized Hackathons!</Heading>
              <div className="section">
                <FactoryContract drizzle={drizzle} drizzleState={drizzleState} />
              </div>
              <div className="section">
                <DHackathonList />
              </div>
            </div>
          )
        }}
      </DrizzleContext.Consumer>  
    )
  }
}

