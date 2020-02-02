import React from 'react';
import DocsPage from "./DocsPage"
import { Route, Switch } from 'react-router-dom'
import NavBar from "./NavBar";
import ErrorWeb3 from "./ErrorWeb3"


export default function ErrorContainer () {
  return (
    <div>
      <NavBar />
      <div className="section">
        <Switch>
          <Route path='/docs' component={DocsPage} />
          <Route path='/' exact component={ErrorWeb3} />
          <Route component={DocsPage} />
        </Switch>
      </div>
    </div>
  )
}