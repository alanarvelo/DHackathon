import React from 'react'
import TextButton from './TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';

import DHackathon from './DHackathon'

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
    let DHList = Object.keys(this.props.drizzleState.contracts)
                    .filter(contractName => contractName !== "DHackathonFactory" && contractName !== "SimpleStorage")
    // console.log("DHLIST: ", DHList, this.props.drizzle, this.props.drizzleState)

    return (
      <Flex style={{flex: 1, flexDirection: 'column'}}>
        <Heading as={"h1"} width={1}> Active DHackathons </Heading>
        <br></br>
        <ul>
        { DHList.map(DHName => (
          <li key={DHName} >
            <DHackathon DHContract={this.props.drizzle.contracts[DHName]} DHState={this.props.drizzleState.contracts[DHName]} />
          </li> )
        )}
        </ul>
      </Flex>
    )
  }
}