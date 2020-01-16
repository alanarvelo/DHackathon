import React from 'react';
import TextButton from './TextButton'
import { Flex, Box, Heading, justifyContent } from 'rimble-ui'
import { BN } from 'bn.js'
import Web3 from "web3";
import { Link } from 'rimble-ui';
import { Button } from 'rimble-ui';
import { Input } from 'rimble-ui';


class Popup extends React.Component {
  state = {
    name: "",
    prize: ""
  }

  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState((prevState) => (
      Object.assign(prevState, {[name]: value})
    ))
  }

  render() {  
    const { name, prize } = this.state
    return (  
      <Flex style={styles.popup}>  
        <div style={styles.popup_inner}>  
          <h2 style={styles.items} >{this.props.text}</h2>
          <Box>
            <span>Name: </span>
            <Input
              name="name"
              type="text"
              required={true}
              placeholder="e.g. Security Contest"
              value={name}
              onChange={this.handleChange}
            />
          </Box>
          <Box>
            <span>Prize in ETH: </span>
            <Input 
              name="prize"
              type="number" 
              required={true} 
              placeholder="3 ETH" 
              value={prize}
              onChange={this.handleChange}
            />
          </Box>
          <Button onClick={() => this.props.submitFn(name, prize)} icon="Send" iconpos="right">Submit Tx </Button>  
        </div> 
      </Flex>
    );  
  }  
}

const styles = {
  "popup": {
    "position":"fixed",
    "width":"100%",
    "height":"100%",
    "top":"0",
    "left":"0",
    "right":"0",
    "bottom":"0",
    "margin": "auto",
    "backgroundColor":"rgba(0,0,0, 0.3)"
  },
  "popup_inner": {
    "position":"absolute",
    "left":"25%",
    "right":"25%",
    "top":"25%",
    "bottom":"25%",
    "margin":"auto",
    height: "auto",
    width: '60%',
    borderRadius: 10,
    "background":"white",
    "padding": "20px",
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  items: {}
}

export default Popup;