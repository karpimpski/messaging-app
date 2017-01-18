import React, { Component } from 'react';
import Chat from '../Chat';
import ReactDOM from 'react-dom';

class Login extends Component {
  submit(e){
    e.preventDefault();
    var name = document.getElementById('name').value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        var res = JSON.parse(xhttp.responseText);
        if(res == null){
          ReactDOM.render(<Chat name={name}/>, document.getElementById('root'));
        }
        else{
          alert('Sorry! That name is already taken.');
        }
      }
    };
    xhttp.open("GET", "/api/user/" + name, true);
    xhttp.send();
    
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