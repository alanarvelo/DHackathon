import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { MetaMaskButton } from 'rimble-ui';

import { initializeWeb3 } from "../../../node_modules/@drizzle/store/src/web3/web3Saga"

// TO-DO: appropriately wire-up the Login with MM button so it works smoothly with drizzle

export default class NavBarBar extends Component {
  getNetwork(networkVersion) {
    switch (networkVersion) {
      case 1:
        return 'Mainnet';
      case 2:
        return 'Morden';
      case 3:
        return 'Ropsten';
      case 4:
        return 'Rinkeby';
      case 42:
        return 'Kovan';
      default:
        return 'Local Ganache';
    }
  }
  render() {
    return(
      <Nav justify bg="light" variant="tabs" defaultActiveKey="/" className='centered-container'>
        <Nav.Item>
          <NavLink to='/docs' activeClassName='active'>
            Docs
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to='/' exact >
            Home
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          { (this.props.drizzleState && this.props.drizzleState.drizzleStatus.initialized && this.props.drizzleState.activeEOA.account)
            ? (<Nav.Item style={{display: "flex", flexDirection: "column", marginBottom: "5px"}}> 
                <span style={{fontSize: 9}}>{`Connected to ${this.getNetwork(this.props.drizzleState.web3.networkId)} network with account:`}</span>
                <span style={{fontSize: 12}}>{this.props.drizzleState.activeEOA.account}</span>
              </Nav.Item>)
            : (<MetaMaskButton.Outline size="small" style={{marginBottom: "5px"}} onClick={() => {initializeWeb3(); alert("Install the MetaMask extension and refresh the page to login, feature in development. Thanks :)."); console.log("Refresh the page and log In With MetaMask.")}} >
                  Connect with MetaMask
              </MetaMaskButton.Outline>)
          }
        </Nav.Item>
      </Nav>
    )
  }
}

