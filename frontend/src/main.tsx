import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import Login from './login.tsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import 'react-chat-elements/dist/main.css';
import NavScroll from './nav.tsx';
import HomeMenu from './home.tsx';
import RoomForm from './room_form.tsx';
import Tester from './try_new_chat.jsx';
import JoinModal from './join_room.tsx';
import AddContactModal from './add_contact.tsx';
import AccountPage from './my_account.tsx';
import { RouterProvider, createBrowserRouter, Route } from 'react-router-dom';
import AuthWrapper from './authwrapper'; // Import the AuthWrapper
import AdminPanel from "./room_admin_panel.jsx"
import  Cookies  from 'js-cookie';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

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

export const socket = io('ws://localhost:3000', {
  reconnectionDelayMax: 10000,
  transports: ['websocket'],
});
socket.on('connect', () => {
  console.log('connected to backend');
  Cookies.set('socketid', socket.id);
});

socket.on('join', (arg) => {
  console.log('join received!'); // world
  console.log(arg); // world
});
socket.on('new message', (arg) => {
  console.log('Message received!');
  //queryClient.invalidateQueries(['repoData', roomID]);  // Refetch the room data
});
socket.on('connect_error', (error) => {
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
    path: '/',
    element: (
      <AuthWrapper redirectTo="/login">
        <NavScroll />
        <HomeMenu />
      </AuthWrapper>
    ),
  },
  {
    path: '/home',
    element: (
      <AuthWrapper redirectTo="/login">
        <NavScroll />
        <HomeMenu />
      </AuthWrapper>
    ),
  },
  {
    path: '/login',
    element: <NavScroll></NavScroll>
  },
  {
    path: '/room/:roomID',
    element: (
      <AuthWrapper redirectTo="/login">
        <NavScroll />
        <Tester />
      </AuthWrapper>
    ),
  },
  {
    path: '/newroom',
    element: <RoomForm></RoomForm>
  },
  {
    path: '/tester/:roomID',
    element: (
      <AuthWrapper redirectTo="/login">
        <NavScroll />
        <Tester />
      </AuthWrapper>
    ),
  },
  {
    path: '/invite/:inviteLink',
    element: <JoinModal />,
  },
  {
    path: '/addcontact/:userId',
    element: (
      <AuthWrapper redirectTo="/login">
        <AddContactModal />
      </AuthWrapper>
    ),
  },
  {
    path: '/myaccount',
    element: (
      <AuthWrapper redirectTo="/login">
        <AccountPage />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/:roomID',
    element: (
      <AuthWrapper redirectTo="/login">
        <AdminPanel></AdminPanel>
      </AuthWrapper>
    ),
  },
  {
    path: '*',
    element: (
      <AuthWrapper redirectTo="/login">
        <NavScroll />
        <HomeMenu />
      </AuthWrapper>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

