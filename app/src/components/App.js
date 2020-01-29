import React, { Component } from "react";
import "../App.css";

import { Route, Switch, Redirect } from 'react-router-dom'
import { setActiveEOA } from "../actions/activeEOA"
import DHackathonJSON from "../contracts/DHackathon.json"

import { DrizzleContext } from "@drizzle/react-plugin";

import { ToastMessage } from 'rimble-ui'

import Container from "./Container";
import DHackathon from "./DH/DHackathon";
import NavBar from "./misc/NavBar";
import DocsPage from "./misc/DocsPage"
import NotFound from "./misc/NotFound"


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      childrenAdded: false,
    }
    this.DHContractEvents = ['FundingReceived', 'ProjectSubmitted', 'VoteSubmitted', 'PrizeWithdrawn',
                              'DHInPreparation', 'DHOpen', 'DHInVoting', 'DHClosed',
                              'JudgeAdded', 'JudgeRemoved', 'ParticipantAdded', 'ParticipantRemoved']
  }
  
  async componentDidMount() {
    // set and track the active account in MetaMask
    this.props.drizzle.store.dispatch(setActiveEOA(this.props.drizzleState.accounts[0]))
    this.listenToActiveAccountUpdates();

    // add previously created DHackathon contract by getting their address from the Factory
    if (!this.state.childrenAdded) {
      const children = await this.props.drizzle.contracts.DHackathonFactory.methods.getChildren().call();
      console.log("CHILDREN: ",children)
      children.reverse().map((childAddress, idx, arr) => this.addChildren(childAddress, idx, arr.length))
    }
    this.setState({childrenAdded: true})
  }

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.props.drizzle.store.dispatch(setActiveEOA(selectedAddress))
    });
  }

  async addChildren(childAddress, idx, max) {
    let contractName = `DH${max - idx}`
    let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathonJSON['abi'], childAddress)
    this.props.drizzle.addContract({contractName, web3Contract}, this.DHContractEvents)
  }


  render() {
    return (
    <DrizzleContext.Consumer>
      {drizzleContext => {
        const { drizzle, drizzleState, initialized } = drizzleContext;

        if (!initialized) {
          return "Loading...";
        }

        // const { drizzle, drizzleState } = this.props
        console.log("drizzle: ", drizzle)
        console.log("drizzleState: ", drizzleState) 
        return (
          <div>
            <NavBar drizzleState={drizzleState}/>
            <ToastMessage.Provider ref={node => (window.toastProvider = node)} />
            {/* { drizzleState.drizzlesStatus && drizzleState.drizzlesStatus.initialized */}
              {/* ? */}
              (<div className="App">
                  <Switch>
                    <Route path='/DH/:DHID' render={(props) => <DHackathon {...props} drizzle={drizzle} drizzleState={drizzleState} /> }/>
                    <Route path='/docs' component={DocsPage} />
                    <Route path='/' exact render={() => <Container drizzle={drizzle} drizzleState={drizzleState} />} />
                    <Route component={NotFound} />
                  </Switch>
                </div>)
              {/* :null */}
            {/* } */}
          </div>
        )
      }}
    </DrizzleContext.Consumer>  
    ) 
  }
}

export default App;
