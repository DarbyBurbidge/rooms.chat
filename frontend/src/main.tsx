import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './login.tsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from "socket.io-client"

import "react-chat-elements/dist/main.css"
import NavScroll from './nav.tsx'
import HomeMenu from './home.tsx'
import SlideOutList from './contact_list.tsx'
import RegistrationForm from './register.tsx'
import Example from './contact_list.tsx'
import ChatRoom from './chat.tsx'


const socket = io("ws://localhost:3000", {
  reconnectionDelayMax: 10000,
  transports: ['websocket']
});

socket.on("connect", () => {
  console.log("connected to backend");
});

socket.on("connect_error", (error) => {
  if (socket.active) {
    // temporary failure, the socket will automatically try to reconnect
  } else {
    // the connection was denied by the server
    // in that case, `socket.connect()` must be manually called in order to reconnect
    console.log(error.message);
  }
});

    //<RegistrationForm></RegistrationForm>
    //
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <NavScroll />
  <ChatRoom></ChatRoom>
  </React.StrictMode>,
)
