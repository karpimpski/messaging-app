import React, { Component } from 'react';
import Chat from '../Chat';
import ReactDOM from 'react-dom';
import Client from '../Client.js';

class Login extends Component {
  submit(e){
    e.preventDefault();
    var name = document.getElementById('name').value;
    Client.get('/api/user/' + name, function(data){
      if(data == null){
        ReactDOM.render(<Chat name={name}/>, document.getElementById('root'));
      }
      else{
        alert('Sorry! That name is already taken.');
      }
    });
  }

  render(){
    return (
      <div id='login'>
        <p>Choose a name</p>
        <form id='username' onSubmit={this.submit.bind(this)}>
          <input type='text' id='name' autoComplete='off'/>
          <input type='submit' value='Enter'/>
        </form>
      </div>
    )
  }
}

export default Login;