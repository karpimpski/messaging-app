import React, { Component } from 'react';
import io from 'socket.io-client';

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.name, 
      socket: io(name),
      messages: [],
      userTyping: false
    };
  }

  componentDidMount(){
    this.setListeners();
    this.state.socket.emit('newUser', this.state.name);
    this.state.socket.emit('chatMessage', 'System', '<b>' + this.state.name + '</b> has joined the discussion');
  }

  setListeners(){
    this.state.socket.on('chatMessage', (from, msg) => {
      this.setState({messages: this.state.messages.concat(msg)});
    });
    this.state.socket.on('notifyUser', (user) => {
      if(user !== this.state.name) {
        this.setState({userTyping: user});
      }
      setTimeout(() => { 
        this.setState({userTyping: false});
      }, 10000);;
    });
  }

  submit(e){
    e.preventDefault();
    if(this.state.socket.disconnected){
      alert('You have been disconnected due to inactivity. Please refresh the page.');
    }
    else{
      var message = e.target.message.value;
      if(message !== ''){
        this.state.socket.emit('chatMessage', this.state.name, message);
      }
      e.target.message.value = '';
    }
    return false;
  }

  render() {
    return (
      <div id="chat">
        <ul id="messages">
          {this.state.messages.map(function(message, index){
            return <li key={index}>{message}</li>
          })}
        </ul>
      <span id="notifyUser">{this.state.userTyping ? `${this.state.userTyping} is typing a message...` : ''}</span>
      <form id="form" onSubmit={this.submit.bind(this)}> 
        <input id="m" type='text' autoComplete="off" placeholder="Type your message.." name="message" onKeyUp={() => this.state.socket.emit('notifyUser', this.state.name)}/>
        <input type="submit" id="button" value="Send"/> 
      </form>
      </div>
    );
  }
}

export default Chat;