import React from 'react'
import { Flex, Heading } from 'rimble-ui'

import { DrizzleContext } from "@drizzle/react-plugin";

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHWrapper extends React.Component {

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }
                                    
          return (
            <Flex style={{flex: 1, flexDirection: 'column'}}>
            </Flex>
          )
        }}
      </DrizzleContext.Consumer>   
    )
  }
}