
import React from "react";
import { DrizzleContext } from "drizzle-react";
import FactoryState from './FactoryState';
import { BaseStyles, Box, Heading } from 'rimble-ui';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
      // console.log("drizzle: ", drizzle)
      // console.log("drizzleState: ", drizzleState)

      if (!initialized) {
        return "Loading...";
      }
      
      return (
        <BaseStyles style={{textAlign: 'center'}}>
          <Box m={4}>
            <Heading mb={2}>Welcome to Decentralized Hackathons!</Heading>
            <div className="App">
              <ToastContainer />
            </div>
            <div className="section">
              <FactoryState drizzle={drizzle} drizzleState={drizzleState} />
            </div>
          </Box>
        </BaseStyles>
      )
    }}
  </DrizzleContext.Consumer>
)

// const mapStateToProps = state => {
//   return {
//     accounts: state.accounts,
//     SimpleStorage: state.contracts.SimpleStorage,
//     DHackathonFactory: state.contracts.DHackathonFactory,
//     drizzleStatus: state.drizzleStatus,
//   };
// };
// export default drizzleConnect(MyComponent, mapStateToProps);

