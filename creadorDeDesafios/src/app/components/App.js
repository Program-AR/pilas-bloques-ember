import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Wizard from '../containers/wizard'
import NavBar from "../components/navbar/navbar";
import Footer from "./footer/footer";
import "./App.css";

const App = () => (
<Router>
  <NavBar/>
	<Switch>
    <Route exact path='/' component={Wizard}/>
    <Route exact path='/create' component={Wizard}/>
    <Route exact path='/edit' component={Wizard}/>
	</Switch>
  <Footer/>
</Router>
);

export default App
