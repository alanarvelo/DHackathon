import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Nav } from 'react-bootstrap'
import { MetaMaskButton } from 'rimble-ui';
import Web3 from "web3";

import { initializeWeb3 } from "../../../node_modules/@drizzle/store/src/web3/web3Saga"

// TO-DO: appropriately wire-up the Login with MM button so it works smoothly with drizzle

export default class NavBarBar extends Component {
  getWeb3 = async () => {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          // Use Mist/MetaMask's provider.
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://127.0.0.1:8545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });
  };

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
            : (<MetaMaskButton.Outline size="small" style={{marginBottom: "5px"}} onClick={() => {initializeWeb3(); console.log("Refresh the page and log In With MetaMask.")}} >
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

