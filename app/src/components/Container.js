
import React from "react";
import { setActiveEOA } from "../actions/activeEOA"
import FactoryContract from "./FactoryContract"
import DHackathonList from './DHackathonList.js'
import DHackathon from "../contracts/DHackathon.json";


export default class Container extends React.Component {
  // set and track the active account in MetaMask
  componentDidMount() {
    this.props.drizzle.store.dispatch(setActiveEOA(this.props.drizzleState.accounts[0]))
    this.listenToActiveAccountUpdates();
    // this.createNewContracts()
  }

  // listens for updates on the MetaMask active account. Beware: this is a MetaMask beta feature
  listenToActiveAccountUpdates() {
    this.props.drizzle.web3.currentProvider.publicConfigStore.on('update', ({ selectedAddress }) => {
      this.props.drizzle.store.dispatch(setActiveEOA(selectedAddress))
    });
  }

  //  createNewContracts = async () => {
  //   let drizzleState = this.props.drizzleState
  //   let newDHs = Object.keys(drizzleState.newDHackathons)
  //   let contracts = Object.keys(drizzleState.contracts)
  //   let toAdd = newDHs.filter(newDH => !contracts.includes(newDH))
  //   console.log("toAdd: ", toAdd)
  //   if (toAdd.length > 0) {
  //     let { contractName, contractAddress } = drizzleState.newDHackathons[toAdd[0]]
  //     console.log(contractName, contractAddress)
  //     let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathon['abi'], contractAddress)
  //     let contractConfig = { contractName, web3Contract}
  //     let events = ['LogFundingReceived', 'LogProjectSubmitted', 'LogVoteSubmitted', 'LogPrizeWithdrawn',
  //                   'LogDHInPreparation', 'LogDHOpen', 'LogDHInVoting', 'LogDHClosed']
  //     // this.props.drizzle.store.dispatch({type: 'ADD_CONTRACT', drizzle: this.props.drizzle, contractConfig, events})
      
  //     // await this.props.drizzle.store.dispatch(removeFromAddQueue(contractName))
  //     this.props.drizzle.addContract(contractConfig, events)
  //   }
  // }

  render() {
    // this.createNewContracts()
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

