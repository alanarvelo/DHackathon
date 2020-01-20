import React from 'react'
import TextButton from '../misc/TextButton'
import { Flex, Box } from 'rimble-ui'
import Web3 from "web3"

// TO-DO: create POP-UP for when transaction succeeds and fails

export default class DHackathon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameKey: null,
      DHIDKey: null,
      adminKey: null,
      prizeKey: null,
      createdOnKey: null,
      stateKey: null,
      balanceKey: null,
    }
    this.DHstates = ["In Preparation", "Open", "In Voting", "Closed"]
  }

  componentDidMount() {
    const DHContract = this.props.DHContract
    // get and save the keys to retrieve operational and counter from the store (drizzleState)
    let nameKey = DHContract.methods["name"].cacheCall();
    let DHIDKey = DHContract.methods["DHID"].cacheCall();
    let adminKey = DHContract.methods["admin"].cacheCall();
    let prizeKey = DHContract.methods["prize"].cacheCall();
    let createdOnKey = DHContract.methods["createdOn"].cacheCall();
    let stateKey = DHContract.methods["state"].cacheCall();
    let balanceKey = DHContract.methods["balance"].cacheCall();

    this.setState({ nameKey, DHIDKey, adminKey, prizeKey, createdOnKey, stateKey, balanceKey });
  }

  render() {
    const DHState = this.props.DHState
    const name = DHState.name[this.state.nameKey]
    const DHID = DHState.DHID[this.state.DHIDKey]
    const admin = DHState.admin[this.state.adminKey]
    const prize = DHState.prize[this.state.prizeKey]
    const createdOn = DHState.createdOn[this.state.createdOnKey]
    const state = DHState.state[this.state.stateKey]
    let balance = DHState.balance[this.state.balanceKey]
    balance = balance ? Web3.utils.fromWei(balance.value)  + " eth" : "-"
    // console.log("DHState: ", DHState, this.props.DHContract)


    return (
      <Flex style={styles.container} >
          {/* <Heading as={"h4"} width={1/8}>DHackathon Contract</Heading> */}
          <Box style={styles.box}  p={1} width={1/10} >
            <span style={{fontSize: 12}} >Name:  </span>
            <strong >
              { name && name.value }
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={1/10} >
            <span style={{fontSize: 12}} >ID:  </span>
            <strong>
              { DHID && DHID.value }
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={2/10} >
            <span style={{fontSize: 12}} >Admin:  </span>
            <strong >
              { admin && admin.value.slice(0,4) +'...'+ admin.value.slice(-4) }
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={2/10} >
            <span style={{fontSize: 12}} >Stage:  </span>
            <strong >
              { state && this.DHstates[state.value] }
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={1/10} >
            <span style={{fontSize: 12}} >Balance:  </span>
            <strong>
              { balance }
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={1/10} >
            <span style={{fontSize: 12}} >Prize:  </span>
            <strong>
              { prize && Web3.utils.fromWei(prize.value) + " eth"}
            </strong>
          </Box>
          <Box style={styles.box}  p={1} width={2/10} >
            <span style={{fontSize: 12}} >Created On:  </span>
            <strong>
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
  box: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: 'center'
  }

}