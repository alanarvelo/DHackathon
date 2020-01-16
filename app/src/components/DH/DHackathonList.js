import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
// import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';
import { Link } from 'react-router-dom'

import DHCard from './DHCard'
import { DrizzleContext } from "@drizzle/react-plugin";

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathonList extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //   }
  // }

  componentDidMount() {
  }

  render() {
    return (
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;
            console.log("drizzle: ", drizzle)
            // console.log("drizzleState: ", drizzleState)

            if (!initialized) {
              return "Loading...";
            }
            let DHList = Object.keys(drizzle.contracts)
                          .filter(contractName => contractName !== "DHackathonFactory" && contractName !== "SimpleStorage")
            console.log("DHLIST: ", DHList, drizzle, drizzleState)
            
            return (
              <Flex style={{flex: 1, flexDirection: 'column'}}>
                <Heading as={"h1"} width={1}> Active DHackathons </Heading>
                <br></br>
                { DHList.map(DHName => (
                  <Link to={`/DH/${DHName}`} key={DHName} style={{ textDecoration: 'none' }}>
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