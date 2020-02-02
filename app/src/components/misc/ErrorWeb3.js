import { withStyles } from '@material-ui/styles';
import React from 'react';
import { Button, Flex, Heading, Box, MetaMaskButton, UPortButton, } from "rimble-ui";

import { initializeWeb3 } from "../../../node_modules/@drizzle/store/src/web3/web3Saga"

  // To-do: get Metamask login buttons working properly with drizzle

class ErrorWeb3 extends React.Component {
  constructor(props) {
    super(props)
    this.web3Gen = initializeWeb3()
  }
    render() {
      // console.log("Gen: ", this.web3Gen)
      // console.log("1 next: ", this.web3Gen.next())
      // console.log("2 next: ", this.web3Gen.next())
      // console.log("3 next: ", this.web3Gen.next())
      // console.log("4 next: ", this.web3Gen.next())
      // console.log("5 next: ", this.web3Gen.next())
        const { classes } = this.props;
        return (
          <div className={classes.wrapper}>
            <div className={classes.inner}>
              <Heading>Log-in & connect to a supported network</Heading>
              <Heading>to use the DApp</Heading>
              <header className={classes.header}>
                <p>Log-in with your preferred web3 provider</p>
              </header>
              <Flex width={1} style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}} >
                <Box width={1/3} className={classes.boxV}>
                  <MetaMaskButton.Solid onClick={async () => {initializeWeb3(); alert("Install the MetaMask extension and refresh the page to login, feature in development. Thanks :)."); console.log("Refresh the page and log In With MetaMask.") }}>
                    Connect with MetaMask
                  </MetaMaskButton.Solid>
                </Box>
                <Box width={1/3} className={classes.box}>
                  <Button disabled>
                    Connect with Blockstack
                  </Button>
                  <p style={{fontSize: 10}}>coming soon</p>
                </Box>
                <Box width={1/3} className={classes.box}>
                  <UPortButton.Solid disabled>
                    Connect with Uport
                  </UPortButton.Solid>
                  <p style={{fontSize: 10}}>coming soon</p>
                </Box>
              </Flex>
              <header className={classes.header}>
                  <p>Connect to one of the supported networks</p>
                </header>
              <Flex width={1} style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}} >
                <Box width={1/3} className={classes.box}>
                  <Heading as={"h6"}>Mainnet</Heading>
                </Box>
                <Box width={1/3} className={classes.box}>
                  <Heading as={"h6"}>Ropsten</Heading>
                </Box>
                <Box width={1/3} className={classes.box}>
                  <Heading as={"h6"}>Rinkeby</Heading>
                </Box>

              </Flex>
            </div>
          </div>
        );
    }
}

const styles = theme => ({
    wrapper: {
        padding: '0 0 4rem 0',
    },
    inner: {
        margin: '0 auto',
		    maxWidth: 'calc(100% - 10rem)',
        width: '100rem',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        borderBottom: '1px solid',
        margin: '2em auto 2rem auto',
        maxWidth: '80%',
        textAlign: 'center',
        width: '45.7142857143rem',
        '& h1': {
            fontSize: '3rem',
            fontFamily: "'Fjalla One', sans-serif",
            fontWeight: 400,
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.25rem',
        },
        '& p': {
            fontSize: '1.5rem',
            color: '#4468ca',
        },
    },
    div: {
	      display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        borderRadius: '5px',
        textAlign: 'center',
        margin: 0
    },
    box: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxV: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    }
});

export default withStyles(styles)(ErrorWeb3);
