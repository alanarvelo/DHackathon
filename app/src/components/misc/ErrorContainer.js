import React from 'react';
import DocsPage from "./DocsPage"
import { Route, Switch } from 'react-router-dom'
// import ErrorPage from './components/misc/ErrorPage'
import NavBar from "./NavBar";



export default function ErrorContainer () {
  return (
    <div>
      <NavBar />
      <div className="section">
        <Route path='/docs' component={DocsPage} />
      </div>
    </div>
  )
}