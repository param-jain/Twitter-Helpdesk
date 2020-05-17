import React from 'react';
import logo from './logo.svg';
import './App.css';
import TwitterLogin from "react-twitter-login";
import HelpDesk from './HelpDesk';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button } from 'react-bootstrap'
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null
    }
  }

  authHandler = (err, data) => {
    console.log(err, data);
    this.setState({userData: data});
    localStorage.setItem('userData', data)
    window.location.reload(true);
  };

  onLogoutClicked = () => {
    localStorage.setItem('userData', '');
    window.location.reload(true);
  }

  render() {
    if (!localStorage.getItem('userData')) {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
              <h1><strong>Login</strong></h1>
              <TwitterLogin
                authCallback={this.authHandler}
                consumerKey='u5h3Mu4EVEOeatsJCdkAWb2ip'
                consumerSecret='tnRS7uqqV94EiyJOisxG9lnMYXOL5DzdysuhSsY7p69I6HVKGE'
                callbackUrl={'http://localhost:3000'}
              />
          </header>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Twitter HelpDesk</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Button variant="outline-primary" onClick={() => this.onLogoutClicked()}>Logout</Button>
            </Navbar.Collapse>
          </Navbar>
          <HelpDesk userData={this.state.userData}/>
        </div>
      )
    }
  }
}

export default App;
