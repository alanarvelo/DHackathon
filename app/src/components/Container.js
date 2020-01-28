
import React from "react";
import FactoryContract from "./FactoryContract"
import DHackathonList from './DH/DHackathonList'
import { Heading } from 'rimble-ui';


export default class Container extends React.Component {
  render() {
    return (
      <div>
        <Heading mb={2}>Welcome to Decentralized Hackathons!</Heading>

        <div className="section">
          <FactoryContract drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
        </div>

        <div className="sectionL">
          <DHackathonList />
        </div>
      </div>
    )
  }
}

