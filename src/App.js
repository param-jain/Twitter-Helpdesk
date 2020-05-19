import React from 'react';
import logo from './logo.svg';
import './App.css';
import TwitterLogin from "react-twitter-login";
import HelpDesk from './components/HelpDesk';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Button, Spinner, Image } from 'react-bootstrap'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      loading: false
    }
  }

  componentDidMount() {
    console.log('Appjs CDM');
    console.log(localStorage.getItem('userData'));
  }

  authHandler = (err, data) => {
    this.setState({userData: data, loading: false});
    localStorage.setItem('userData', data)
    window.location.reload(true);
  };

  onLogoutClicked = () => {
    console.log(localStorage.getItem('userData'))
    localStorage.setItem('userData', 'undefined');
    window.location.reload(true);
  }

  renderLoader = () => {
    if (this.state.loading) {
      return (
        <Spinner animation="border"/>
      )
    } else {
      return (
        <Image style={{height: '2rem', width: '4rem', marginTop: -6}} src="https://image.flaticon.com/icons/svg/220/220233.svg" roundedCircle />
      )
    }
  }

  render() {
    if (!localStorage.getItem('userData') || localStorage.getItem('userData') == 'undefined') {
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
              >
                <Button onClick={() => this.setState({loading: true})} size='lg' variant='light' style={{marginTop: 5, width:'15rem', height: '3rem', borderRadius: '1.5rem', alignItems: 'center', justifyContent: 'center'}}>
                  {this.renderLoader()}
                </Button>
              </TwitterLogin>
          </header>
        </div>
      );
    } else {
      return (
        <div>
          <Navbar bg="light" variant="light">
            <Navbar.Brand href="/">Twitter HelpDesk - Conversations: Matching "amazonIN"</Navbar.Brand>
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
