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
    return (
      <div>
        <NavBar drizzleState={drizzleState}/> 
        <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
          {/* <Button
            mb={3}
            onClick={e =>
              window.toastProvider.addMessage("Processing payment...", {
                secondaryMessage: "Check progress on Etherscan",
                actionHref:
                  "https://etherscan.io/tx/0xcbc921418c360b03b96585ae16f906cbd48c8d6c2cc7b82c6db430390a9fcfed",
                actionText: "Check",
                variant: "processing"
              })
            }
          >
            Preview
          </Button> */}
        {/* <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover
          /> */}
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
