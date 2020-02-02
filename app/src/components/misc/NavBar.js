import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { MetaMaskButton } from 'rimble-ui';
import Web3 from "web3";

import { initializeWeb3 } from "../../../node_modules/@drizzle/store/src/web3/web3Saga"

// TO-DO: appropriately wire-up the Login with MM button so it works smoothly with drizzle

export default class NavBarBar extends Component {
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
                <span style={{fontSize: 10}}>{"Logged in with account:"}</span>
                <span style={{fontSize: 12}}>{this.props.drizzleState.activeEOA.account}</span>
              </Nav.Item>)
            : (<MetaMaskButton.Outline size="small" style={{marginBottom: "5px"}} onClick={() => {initializeWeb3(); alert("Please refresh the page and login with MM, feature in development. Thanks :) "); console.log("Refresh the page and log In With MetaMask.")}} >
                  Connect with MetaMask
              </MetaMaskButton.Outline>)
          }
        </Nav.Item>
          {/* {loggedIn
            ? <NavBarDropdown title={`${users[authedUser].name}`} id="nav-dropdown" >
                <NavBarDropdown.Item > {`Logged in as ${users[authedUser].name}`} </NavBarDropdown.Item>
                <NavBarDropdown.Divider />
                <NavBarDropdown.Item onClick={this.handleLogOut}>Log Out</NavBarDropdown.Item>
              </NavBarDropdown>
            : <Nav.Item>
                <NavBarLink to='/login' activeClassName='active'>
                  Login
                </NavBarLink>
              </Nav.Item>
          } */}
      </Nav>
    )
  }
}

