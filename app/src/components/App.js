import React, { Component } from "react";
import "../App.css";

import { Route, Switch, Redirect } from 'react-router-dom'
import { setActiveEOA } from "../actions/activeEOA"

import 'react-toastify/dist/ReactToastify.css'
// import { ToastContainer } from 'react-toastify'
import { ToastMessage, ToastContainer, Button } from 'rimble-ui'

import Container from "./Container";
import DHackathon from "./DH/DHackathon";
import NavBar from "./misc/NavBar";
import Docs from "./misc/Docs"
import NotFound from "./misc/NotFound"

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
    console.log(drizzle, drizzleState)
    console.log("WEB 3: ", this.props.drizzle.web3)
    return (
      <div>
        <NavBar drizzleState={drizzleState}/> 
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
          <div className="App">
            <Switch>
              <Route path='/DH/:DHID' render={(props) => <DHackathon {...props} drizzle={drizzle} drizzleState={drizzleState} /> }/>
              <Route path='/docs' component={Docs} />
              <Route path='/' exact render={() => <Container drizzle={drizzle} drizzleState={drizzleState} />} />
              <Route component={NotFound} />
            </Switch>
          </div>
      </div>
    )
  }
}

export default App;
