
import React from "react";
import { setActiveEOA } from "../actions/activeEOA"
import FactoryContract from "./FactoryContract"
import DHackathonList from './DHackathonList.js'


export default class Container extends React.Component {
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
    return (
      <div>
        <div className="section">
          <FactoryContract drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
        </div>
        <div className="section">
          <DHackathonList drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}  />
        </div>
      </div>
    )
  }
}

