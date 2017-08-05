import React, { Component } from 'react';
import axios from 'axios';

import * as config from '../config';

function initialState() {
  return {
    username: '',
    password: '',
    password2: '',
  };
}

export default class SignupView extends Component {
  constructor(props) {
    super(props);
    this.state = initialState();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.password || this.state.password.length < 6) {
      return this.props.toast.error('Password too short.');
    }
    if (this.state.password !== this.state.password2) {
      return this.props.toast.error('Passwords do not match.');
    }
    axios.post(config.SERVER_URL + "/user/create", {
      username: this.state.username,
      password: this.state.password,
    }).then((rsp) => {
      if (!rsp.data.success) {
        return this.props.toast.error('Failed to create user.');
      }
      this.props.toast.success('Created new user!');
    });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Signup</div>
        <div className="panel-body">

          <form className="form">
          
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
            </div>

            <button type="submit" className="btn btn-primary" onClick={ this.handleSubmit } >Sign up</button>
          </form>
        </div>
      </div>
      );
  }
}