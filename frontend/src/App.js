import React, { Component } from 'react';
import axios from 'axios';

import logo from './logo.svg';
import './App.css';
import * as config from './config';

// Our components.
import SignupView from "./components/SignupView";
import LoginView from "./components/LoginView";

var ReactToastr = require('react-toastr');
var {ToastContainer} = ReactToastr; // This is a React Element. 
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

// NOTE: Needed for making ajax calls to a different port or address.
axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      mainView: null,
    };

    // Check auth. This is to "remember me".
    axios.post(config.SERVER_URL + '/user/checkauth').then((rsp) => {
      if (!rsp.data.success) {
        return;
      }
      this.setState({user: rsp.data.user});
    });

    // Show functions. For navigation and setting state.mainView.
    this.showSignup = this.showSignup.bind(this);

    // Handlers for child components.
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    // Toast.
    this.toastSuccess = this.toastSuccess.bind(this);
    this.toastError = this.toastError.bind(this);
    this.toast = {
      success: this.toastSuccess,
      error: this.toastError,
    };
  }

  // For UserView
  handleLogin(rsp) {
    if (!rsp.data.success) {
      return this.toastError('Login failed');
    }
    this.toastSuccess('Login as ' + rsp.data.user.username + ' ok!');
    this.setState({
      user: rsp.data.user,
      mainView: null,
    });
  }

  handleLogout(rsp) {
    if (!rsp.data.success) {
      return this.toastError('Logout failed');
    }
    this.setState({
      user: null,
      mainView: null,
    });
  }

  toastSuccess(s) {
    this.refs.container.success(s, 'Success',
      {
        timeOut: 5000,
        extendedTimeOut: 5000
      });
  }

  toastError(s) {
    this.refs.container.error(s, 'Error',
      {
        timeOut: 5000,
        extendedTimeOut: 5000
      });
  }

  showSignup() {
    console.log('showSignup');
    this.setState({
      mainView: (<SignupView toast={this.toast} />),
    });
  }

  render() {
    return (
      <div className="container">
        <nav className="navbar navbar-default myNav">
          <a className="navbar-brand">Brand</a>
          <div className="btn-group" role="group">
            <button type="button" name="signup"
              className="btn btn-default navbar-btn"
              onClick={this.showSignup}>
              Signup
            </button>
            <button type="button" name="user_edit"
              className="btn btn-default navbar-btn"
              onClick={this.props.showUserEdit}>
              User edit
            </button>
          </div>
        </nav>
        <ToastContainer ref='container'
          toastMessageFactory={ToastMessageFactory}
          className='toast-top-right'
        />
        <LoginView
          handleLogin={this.handleLogin}
          handleLogout={this.handleLogout}
          user={this.state.user}
          toast={this.toast}
        />
        { this.state.mainView }
      </div>
    );
  }
}

export default App;
