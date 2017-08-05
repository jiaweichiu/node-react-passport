// For editing one user's details. Can edit password as well.
import React, { Component } from 'react';
import axios from 'axios';
import * as config from '../config';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default class UserEditView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password2: '',
    };
    axios.post(config.SERVER_URL + '/user/get', {
      id: this.props.user_id,
    }).then((rsp) => {
      if (!rsp.data.success) {
        return this.props.toast.error('Failed to get user details.');
      }
      this.setState({
        username: rsp.data.user.username,
        password: '',  // Empty means no change.
        password2: '',
      });
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();  // IMPORTANT.
    var req = {
      id: this.props.user_id,
      username: this.state.username,
    };
    if (this.state.password) {
      if (this.state.password.length < 6) {
        return this.props.toast.error('Password is too short.');
      }
      if (this.state.password !== this.state.password2) {
        return this.props.toast.error('Passwords do not match.');
      }
      req.password = this.state.password;
    }
    axios.post(config.SERVER_URL + '/user/update', req).then((rsp) => {
      if (!rsp.data.success) {
        console.log(rsp.data);
        return this.props.toast.error('Failed to update user.');
      }
      this.props.toast.success('Updated user details!');
    });
  }

  handleRemove(event, userID) {
    event.preventDefault();
    confirmAlert({
      title: 'Confirm',
      message: 'Are you VERY sure you want to delete yourself?',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      onConfirm: () => {
        axios.post(config.SERVER_URL + '/user/remove', {
          id: this.props.user_id,
        }).then((rsp) => {
          if (!rsp.data.success) {
            console.log(rsp.data);
            return this.props.toast.error('Failed to remove user.');
          }
          this.props.toast.success('Successfully deleted user.');
        });
      },
    });
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">User Edit</div>
        <div className="panel-body">

          <form className="form">
          
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange} />
            </div>
            
            <div className="form-group">
              <label>Password (leave empty if you do not want to change)</label>
              <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input className="form-control" type="password" name="password2" value={this.state.password2} onChange={this.handleChange} />
            </div>

            <div className="btn-group">
              <button className="btn btn-primary" onClick={ this.handleSubmit } >Update</button>
            </div>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={ this.handleRemove } >Remove</button>
            </div>
          </form>
        </div>
      </div>
      );
  }
}