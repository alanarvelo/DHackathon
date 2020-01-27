import React from 'react'
import { Heading, Box, Image } from 'rimble-ui'
import stateDiagram from "../../images/UML/UML_state_diagram_simplified.png"
import sequenceDiagram from "../../images/UML/UML_sequence_diagram.png"

export default function DocsPage () {
  return (
    <div style={styles.container}>
      <Heading as={"h5"}> How it works? </Heading>
      <p align="left">
        The purpose of DeHack is to bring Hackathons to the Web3 era. The processes of registration, prize funding, judge selection, project submission, voting, and prize disbursal 
        are executed and recorded in the blockchain. This gives the hackathon, and any competition for that matter, transparency, immediacy, and anti-tampering capabilities.
        A decentralized hackathon (DHackathon) is meant to resemble a real-life hackathon as closely as possible.
      </p>

      <p align="left">
        To create a DHackathon, you must use the createDHackathon function of <it>DHackathonFactory</it>. When you pass it a <it>name</it> and a <it>prize</it>, it will
        instantiate a new DHackathon contract and grant you the Admin role. This function has a cost of 0.1 ether.
        A DHackathon has 4 types of users: Admin, Participant, Judge, and everyone else (No role).
        A DHakcathon has 4 states (or stages):  In Preparation, Open, In Voting, Closed.
        Below is a simplified workflow of a typical DHackathon.
      </p>

      <img src={stateDiagram} alt={"Simplified State Diagram"} style={styles.imgs} />
      <p align="left">
         For a detailed description of how the platform works and how it is built read the README <a href="https://github.com/alanarvelo/DHackathon/blob/master/README.md">here</a>.
      </p>

      <Heading as={"h5"}> Roles </Heading>
      <p align="left">
        Roles indicate <b>who</b> has access to which functions. They are also exclusive, the same EOA can't hold two roles, e.g. the Admin can't be a judge, nor can a judge be a participant.
      </p>

      <ul align="left">
        <li> <b>Admin:</b> in charge of adding and removing judges and moving the contract through its stages (In Preparation, Open, In Voting, Closed, more on stages below). </li>
        <li> <b>Participant:</b> submit a link to their project and withdraw a piece of the prize if they got any votes from judges. </li>
        <li> <b>Judge:</b> review the submitted projects and vote for their elected winner. </li>
        <li> <b>Anyone:</b> regiser as a participant (gaining participant role access, i.e. can participate in the hackathon by submitting a project). </li>
      </ul>
      <p align="left">
        Any EOA, including ones with assigned roles, can `submitFunds()` that will be accumulated in the `DHackathon` contract as the prize to be withdrawn by the winners.
      </p>

      <Heading as={"h5"}> Stages </Heading>
      <p align="left">
        Stages indicate <b>when</b> roles have access to functions. The Admin moves the DHackathon through stages.
      </p>
      
      <ul align="left">
        <li><b>In Preparation:</b>contract starts on this stage.
          <ul align="left">
            <li> Admin: add and remove judges, and set the stage to _Open_. </li>
            <li> Participant: deregister, abandoning their role. </li>
            <li> Judge: - </li>
            <li> No role: register as a participant. </li>
          </ul>
        </li>
        <li><b>Open:</b>contract balance must be >= than the declared _prize_. At least 1 judge and 2 participants must have registered.
          <ul align="left">
            <li> Admin: remove judges, and set the stage to _inVoting_. </li>
            <li> Participant: can submit a project, and deregister. </li>
            <li> Judge: - </li>
            <li> No role: - </li>
          </ul>
        </li>
        <li><b>In Voting:</b>
          <ul align="left">
            <li> Admin: remove judges, and set the stage to _Closed_. </li>
            <li> Participant: de-register. </li>
            <li> Judge: can submit a vote. </li>
            <li> No role: - </li>
          </ul>
        </li>
        <li><b>Closed:</b>at least 1 vote must have been submitted.
          <ul align="left">
            <li> Admin: - </li>
            <li> Participant: can withdraw prize, if they have received votes. </li>
            <li> Judge: - </li>
            <li> No role: - </li>
          </ul>
        </li>
      </ul>

      <p align="left">
        Below, a sequence diagram to further illustrate the process.
      </p>
      <img src={sequenceDiagram} alt={"Sequence Diagram"} style={styles.imgs} />

      <br></br>
      <br></br>
      <p align="left">
        Here is the project's <a href="https://github.com/alanarvelo/DHackathon">Github Page</a>. If you want to get in contact, <a href="mailto:alanarvelo@gmail.com">email me</a>.
      </p>


    </div>
  )
}

const styles = {
  container: {
    // backgroundColor: '#add8e6',
    padding: 5,
    margin: '1em',
    // // "position":"center",
    // "width":"90%",
    // "height":"90%",
    // borderWidth: 20,
    // borderColor: '#982e4b',
    // borderRadius: 10,
    // alignItems: 'center',
    // justifyContent: 'space-between',
    color: 'black',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
    // justifyContent: 'space-around',
  },
  // boxH: {
  //   display: "flex",
  //   flexDirection: 'row',
  //   alignItems: "center"
  // },
  imgs: {
    display: "block",
    margin: "1em",
    marginLeft: "auto",
    marginRight: "auto",
    width: "70%",
  }
  // boxV: {
  //   display: "flex",
  //   flexDirection: 'column',
  //   alignItems: 'flex-start',
  //   width: "100%",
  // },
  // boxVL: {
  //   fontSize: 12,
  //   display: "flex",
  //   flexDirection:"column",
  //   alignItems:"flex-start",
  //   justifyContent:"center",
  //   width: "100%",
  //   marginTop: "18",
  // }
}