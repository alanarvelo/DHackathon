import React from 'react'
import { Heading, Box, Flex } from 'rimble-ui'
import TextButton from '../..//misc/TextButton'
import Popup from '../../misc/Popup'

export default class JudgePanel extends React.Component {
  state= {
    activePopup: ""
  }

  togglePopup = (popupName) => {  
    this.setState({ activePopup: popupName })
  }

  render() {
    return (
      <Flex style={styles.container}>
        <Heading as={"h3"}>Judge Panel</Heading>
        <Box p={1} width={1} style={styles.boxH} >
          <TextButton text={"Vote for winner"} onClick={() => this.togglePopup("submitVote")} size="small" disabled={this.props.state === 2 ? false : true} style={{'margin':10, fontSize: 10}} />
        </Box>
        <Box p={1} width={1} style={styles.boxVText} >
          <ul align="left">
            <li>Can only vote once</li>
            <li>Must vote during <i>In Voting</i> stage </li>
          </ul>
        </Box>
        {this.state.activePopup === "submitVote" 
        ? <Popup
            text="Submit address of proposed winner"
            submitFn={(inputs) => { this.props.submitVote(inputs); this.togglePopup("") }}
            inputsConfig={[ {displayName: "Account: ", name: "winner", type: "text", placeholder: "e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"} ]}
            removePopup={() => this.togglePopup("")}
          />
        : null  
        }
      </Flex>
    )
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
  boxVText: {
    fontSize: 11,
    display: "flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"flex-start",
    width: "100%",
    // marginTop: "18",
  }
}