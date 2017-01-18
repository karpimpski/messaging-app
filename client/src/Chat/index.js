import React, { Component } from 'react';
import io from 'socket.io-client';
import ReactHtmlParser from 'react-html-parser';
import Client from '../Client.js';

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
      var obj = {from: from, message: msg};
      this.setState({messages: this.state.messages.concat(obj)});
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
      if(message.substr(0,4) == '/cmd'){
        this.command(message.slice(5));
      }
      else if(message !== ''){
        this.state.socket.emit('chatMessage', this.state.name, message);
      }
      e.target.message.value = '';
    }
    return false;
  }

  command(cmd){
    if(cmd == 'list'){
      Client.get('/api/users', function(res){
        res.forEach(function(user){
          console.log(user.name);
        })
      });
    }
  }

  render() {
    return (
      <div id="chat">
        <ul id="messages">
          {this.state.messages.map((message, index) => {
            message.from === this.state.name ? message.from = 'me' : message.from = message.from;
            var color = (message.from == 'me') ? 'green' : '#009afd';
            var style = {color: color}
            return <li key={index}><b style={style}>{message.from}:</b> {ReactHtmlParser(message.message)}</li>
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