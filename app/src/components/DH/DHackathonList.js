import React from 'react'
import { Flex, Heading } from 'rimble-ui'
import { Link } from 'react-router-dom'

import DHCard from './DHCard'
import { DrizzleContext } from "@drizzle/react-plugin";

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathonList extends React.Component {

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
          }
          let DHList = Object.keys(drizzle.contracts)
                        .filter(contractName => contractName !== "DHackathonFactory").reverse()
                                    
          return (
            <Flex style={{flex: 1, flexDirection: 'column'}}>
              <Heading as={"h2"} width={1} style={{align: "left"}}> Active DHackathons </Heading>
              <br></br>
              { DHList.map(DHName => (
                <Link to={`/DH/${drizzle.contracts[DHName].address}`} key={DHName} style={{ textDecoration: 'none' }}>
                  <DHCard DHContract={drizzle.contracts[DHName]} DHState={drizzleState.contracts[DHName]} />
                </Link>
              )
              )}
            </Flex>
          )
        }}
      </DrizzleContext.Consumer>   
    )
  }
}