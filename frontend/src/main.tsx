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
//import { CookiesProvider, useCookies } from 'react-cookie'
import { Route, RouterProvider, createBrowserRouter , useLoaderData} from 'react-router-dom'

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <NavScroll/>,
  },
  {
    path:"/login",
    element: <Login></Login>
  },
  {
    path:"/room/:roomID",
    loader: ({ request, params }) => { return (params.roomID);},
    Component: withRouter(ChatRoom)
  }
]);
  console.log(document.cookie);
    //<RegistrationForm></RegistrationForm>
    //<ChatRoom></ChatRoom>
    //<CookiesProvider>

    //</CookiesProvider>
<Route path="chat/:id" component={ChatRoom}/>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
