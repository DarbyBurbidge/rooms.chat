import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from 'react-query';
import { SystemMessage } from "react-chat-elements"
import Spinner from 'react-bootstrap/Spinner';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Button, CardFooter, Row, Modal } from 'react-bootstrap';
import { MessageBox, Avatar, Input } from "react-chat-elements";
import Cookies from 'js-cookie';
import Card from 'react-bootstrap/Card';
import { CardBody, CardHeader } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import io from "socket.io-client";
import { socket } from "./main" 

const queryClient = new QueryClient();




async function delete_room(roomID) {
  const response = await fetch(`http://localhost:3000/room/delete/${roomID}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  });
}

async function current_user_data(){
  const data = await fetch(`http://localhost:3000/account/info`, {
    method: 'GET',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  }).then(res => res.json());
  return data.account;
}


export default function AdminPanel() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminRender/>
    </QueryClientProvider>
  );
}

function AdminRender() {
  const queryClient = useQueryClient();
  const { roomID } = useParams();
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messageInputRef = useRef(null);
  const { isLoading, error, data, refetch } = useQuery(['repoData', roomID], () =>
    fetch(`http://localhost:3000/room/info/${roomID}`, {
      method: 'GET',
      mode: 'cors',
      headers: { "Authorization": Cookies.get('Authorization') },
      credentials: 'include',
    }).then(res => res.json())
  );


  useEffect(() => {
    current_user_data().then(setCurrentUser);
  }, []);


  if (isLoading ||  !currentUser) return 'Loading...';

  if (error) return 'An error has occurred: ' + error.message;

  let room;
  try {
    room = data.room;
    console.log(currentUser._id);
  } catch (error) {
    room = { id: "None" };
  }



  return (
    <div>
        <Card>
          <CardHeader>
            <div className="d-inline-flex justify-content-between">
              <a href={"/room/" + roomID}><Button variant="outline-primary"><Icon.ArrowLeft /></Button></a>
              <h1>{room.name || "No Room Name"}</h1>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Button variant="danger" size="lg" onClick={() => {delete_room(roomID); window.location.href = "/home" }}> Delete Room !</Button>
            </Row>
            <Row>
            </Row>
          </CardBody>
          <CardFooter>
          </CardFooter>
        </Card>
      </div>
      );
}
