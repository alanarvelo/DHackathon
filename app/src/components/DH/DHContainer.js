import React from 'react'
import { Redirect } from 'react-router-dom'
import DHackathon from "./DHackathon"
import DHackathonJSON from "../../abis/DHackathon.json"
import { DrizzleContext } from "@drizzle/react-plugin";



export default class DHContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      DHName: ""
    }
    this.contractAddress = this.props.match.params.contractAddress.toLowerCase()
  }

  async componentDidMount() {
    // if contract adress in url not in state, see if it exists, else redirect
    if (!this.props.drizzle.contractList.map((c) => c.address.toLowerCase()).includes(this.contractAddress)) {
      const DHName = await this.identifyDH()
      this.setState({ DHName })
    } else this.setState({ DHName: `DH${this.contractAddress.slice(-4)}` })
  }

  async identifyDH() {
    const children = await this.props.drizzle.contracts.DHackathonFactory.methods.getChildren().call();
    if (!children.map((a) => a.toLowerCase()).includes(this.contractAddress)) return "NotFound"
    let contractName = `DH${this.contractAddress.slice(-4)}`
    if (!Object.keys(this.props.drizzleState.contracts).includes(contractName)) {
      let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathonJSON['abi'], this.contractAddress)
      await this.props.drizzle.addContract({contractName, web3Contract}, this.DHContractEvents)
      return contractName
    }
  }

  render() {
    return (
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
  
          if (!initialized) {
            return "Loading...";
          }
            if (this.state.DHName === "NotFound") return <Redirect to='/404' />
            else if (this.state.DHName === "") return "LOADING DHACKATHON"
            else  { if (this.props.drizzleState.contracts && this.props.drizzleState.contracts[this.state.DHName]) {
                      return <DHackathon drizzle={drizzle} drizzleState={drizzleState} DHName={this.state.DHName} />
                    }
                  else return null
                  }
        }}
      </DrizzleContext.Consumer>  
    ) 
  }

}