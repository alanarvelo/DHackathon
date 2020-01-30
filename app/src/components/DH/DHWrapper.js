import React from 'react'
import { Redirect } from 'react-router-dom'
import DHackathon from "./DHackathon"
import DHackathonJSON from "../../contracts/DHackathon.json"


export default class DHWrapper extends React.Component {
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
    console.log("comp address comparison: ", children, this.contractAddress )
    if (!children.map((a) => a.toLowerCase()).includes(this.contractAddress)) return "NotFound"
    let contractName = `DH${this.contractAddress.slice(-4)}`
    if (!Object.keys(this.props.drizzleState.contracts).includes(contractName)) {
      let web3Contract = new this.props.drizzle.web3.eth.Contract(DHackathonJSON['abi'], this.contractAddress)
      await this.props.drizzle.addContract({contractName, web3Contract}, this.DHContractEvents)
      return contractName
    }
  }

  render() {
    if (!this.state.DHName === "NotFound") return <Redirect to='/404' />
    else if (!this.state.DHName === "") return "LOADING DHACKATHON"
    else  { if (this.props.drizzleState.contracts && this.props.drizzleState.contracts[this.state.DHName]) {
              return <DHackathon drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} DHName={this.state.DHName} />
            }
          else return null
          }
  }

}

const styles = {
  container: {
    backgroundColor: '#b5daff',
    padding: 10,
    margin: 3,
    // // "position":"center",
    // "width":"90%",
    // "height":"90%",
    borderWidth: 20,
    borderColor: '#982e4b',
    borderRadius: 5,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    color: 'black',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'space-between',
    justifyContent: 'space-around',
  },
  boxH: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center",
    // marginBottom: "20px"
  },
  boxV: {
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: "100%",
  },
  boxVL: {
    fontSize: 12,
    display: "flex",
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    width: "100%",
    marginTop: "18",
  },
}