import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameKey: null,
      DHIDKey: null,
      adminKey: null,
      prizeKey: null,
      createdOnKey: null
    }
  }

  componentDidMount() {
    const DHContract = this.props.DHContract
    // get and save the keys to retrieve operational and counter from the store (drizzleState)
    let nameKey = DHContract.methods["name"].cacheCall();
    let DHIDKey = DHContract.methods["DHID"].cacheCall();
    let adminKey = DHContract.methods["admin"].cacheCall();
    let prizeKey = DHContract.methods["prize"].cacheCall();
    let createdOnKey = DHContract.methods["createdOn"].cacheCall();

    this.setState({ nameKey, DHIDKey, adminKey, prizeKey, createdOnKey });
  }

  render() {
    const DHState = this.props.DHState
    const name = DHState.name[this.state.nameKey]
    const DHID = DHState.DHID[this.state.DHIDKey]
    const admin = DHState.admin[this.state.adminKey]
    const prize = DHState.prize[this.state.prizeKey]
    let createdOn = DHState.createdOn[this.state.createdOnKey]
    // console.log("DHState: ", DHState)


    return (
      <Flex style={styles.container} >
          {/* <Heading as={"h4"} width={1/8}>DHackathon Contract</Heading> */}
          <Box p={1} width={1/8} >
            <span style={{fontSize: 12}} >Name:  </span>
            <strong >
              <br></br>
              { name && name.value }
            </strong>
          </Box>
          <Box p={1} width={1/8} >
            <span style={{fontSize: 12}} >ID:  </span>
            <strong>
              <br></br>
              { DHID && DHID.value }
            </strong>
          </Box>
          <Box p={1} width={1/8} >
            <span style={{fontSize: 12}} >Admin:  </span>
            <strong >
              <br></br>
              { admin && admin.value.slice(0,4) +'...'+ admin.value.slice(-4) }
            </strong>
          </Box>
          <Box p={1} width={1/8} >
            <span style={{fontSize: 12}} >Prize:  </span>
            <strong>
              <br></br>
              { prize && Web3.utils.fromWei(prize.value) + " ETH"}
            </strong>
          </Box>
          <Box p={1} width={1/8} >
            <span style={{fontSize: 12}} >Created On:  </span>
            <strong>
              <br></br>
              { createdOn && new Date(parseInt(createdOn.value)*1000).toLocaleDateString("en-US") }
            </strong>
          </Box>
      </Flex>
    )
  }
}

const styles = {
  container: {
    backgroundColor: '#add8e6',
    padding: 20,
    margin:5,
    height: 120,
    borderWidth: 20,
    borderColor: '#982e4b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'black'
  },
  row: {
    flex: .8,
    alignItems: 'center'
  }

}