import React, { Component } from 'react';
import axios from 'axios';

import * as config from '../config';

export default class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'user101',
      password: 'password',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleLogin(event) {
    event.preventDefault();  // IMPORTANT.
    axios.post(config.SERVER_URL + '/user/login', {
      username: this.state.username,
      password: this.state.password,
    }).then(this.props.handleLogin);
  }

  handleLogout(event) {
    event.preventDefault();
    axios.post(config.SERVER_URL + '/user/logout')
      .then(this.props.handleLogout);
  }

  renderForm() {
    return (
      <form className="form-inline">
        <div className="form-group">
          <label>Username</label>
          <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={this.handleLogin} >Login</button>
      </form>
      );
  }

  // User logged in.
  renderStatus() {
    return (
      <div>
        <span>Welcome {this.props.user.username}!</span>
        <button type="submit"
          className="btn btn-primary"
          onClick={this.handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  render() {
    var view;
    if (this.props.user) {
      view = this.renderStatus();
    } else {
      view = this.renderForm();
    }
    return (
      <div className="panel panel-default">
        <div className="panel-heading">User</div>
        <div className="panel-body">{ view }</div>
      </div>
      );
  }
}