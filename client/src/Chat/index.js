import React, { Component } from 'react';
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';
var socket;

class Chat extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.name, 
      socket: io({query: 'name=' + name}),
      messages: []
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
    })
  }

  submit(e){
    e.preventDefault();
    var from = this.state.name;
    var message = e.target.message.value;
    if(message !== ''){
      this.state.socket.emit('chatMessage', from, message);
    }
    e.target.message.value = '';
    return false;

  }

  render() {
    return (
      <div className="App">
        <ul id="messages">
          {this.state.messages.map(function(message, index){
            return <li key={index}>{message}</li>
          })}
        </ul>
      <span id="notifyUser"></span>
      <form id="form" onSubmit={this.submit.bind(this)}> 
        <input type="hidden" id="user" value={this.state.name} />
        <input id="m" type='text' autoComplete="off" placeholder="Type your message.." name="message" />
        <input type="submit" id="button" value="Send"/> 
      </form>
      </div>
    );
  }
}

export default Chat;