import React, { Component } from "react";
import "../App.css";

import { Route } from 'react-router-dom'
import { setActiveEOA } from "../actions/activeEOA"

import 'react-toastify/dist/ReactToastify.css'
import { BaseStyles, Box } from 'rimble-ui';
import { ToastContainer } from 'react-toastify'

import Container from "./Container";
import DHackathon from "./DH/DHackathon";

class App extends Component {
  // set and track the active account in MetaMask
  componentDidMount() {
    this.props.drizzle.store.dispatch(setActiveEOA(this.props.drizzleState.accounts[0]))
    this.listenToActiveAccountUpdates();
  }

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.props.drizzle.store.dispatch(setActiveEOA(selectedAddress))
    });
  }

  render() {
    const { drizzle, drizzleState } = this.props
    return (
      <BaseStyles style={{textAlign: 'center'}}>
        <Box m={4}>
          <div className="App">
            <ToastContainer />
            <Route path='/DH/:DHID' render={(props) => <DHackathon {...props} drizzle={drizzle} drizzleState={drizzleState} /> }/>
            <Route path='/' exact render={() => <Container drizzle={drizzle} drizzleState={drizzleState} />} />
          </div>
        </Box>
      </BaseStyles>
    )
  }
}

export default App;
