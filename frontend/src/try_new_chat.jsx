import {
    QueryClient,
    QueryClientProvider,
    useQuery,
  } from 'react-query';
  import { SystemMessage } from "react-chat-elements"
  import Spinner from 'react-bootstrap/Spinner';
  import { useParams } from 'react-router-dom';
  import { useState, useEffect } from 'react';
  import { Button, CardFooter, Row, Modal } from 'react-bootstrap';
  import { MessageBox, Avatar, Input } from "react-chat-elements";
  import Cookies from 'js-cookie';
  import Card from 'react-bootstrap/Card';
  import { CardBody, CardHeader } from 'react-bootstrap';
  import * as Icon from 'react-bootstrap-icons';
  import io from "socket.io-client";
  import {socket} from "./main" 
  const queryClient = new QueryClient();
  
  async function delete_message(roomID) {
      console.log(roomID)
      await fetch(`http://localhost:3000/message/delete/${roomID}`, {
          method: 'DELETE',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': Cookies.get('Authorization'),
          },
          credentials: 'include',
      });
      window.location.reload();  // Refresh the whole page after sending a message
  }
  
  async function send_message(roomID, text) {
      await fetch(`http://localhost:3000/message/create/${roomID}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': Cookies.get('Authorization'),
          },
          credentials: 'include',
          body: JSON.stringify({ content: text }),
      });
      //window.location.reload();  // Refresh the whole page after sending a message
  }
  
  async function fetch_user_data(userId) {
      const data = await fetch(`http://localhost:3000/user/id?id=${userId}`, {
          method: 'GET',
          mode: 'cors',
          headers: { "Authorization": Cookies.get('Authorization') },
          credentials: 'include',
      }).then(res => res.json());
      return data;
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
  
  async function make_user_dict(messages) {
      const user_dict = {};
      const uniqueSenders = [...new Set(messages.map(message => message.sender))];
  
      await Promise.all(uniqueSenders.map(async (senderId) => {
          const data = await fetch_user_data(senderId);
          user_dict[senderId] = data;
      }));
  
      return user_dict;
  }
  
  export default function Tester() {
      return (
          <QueryClientProvider client={queryClient}>
              <Example />
          </QueryClientProvider>
      );
  }
  function Example() {
    
      const { roomID } = useParams();
      const [message, setMessage] = useState('');
      const [userDict, setUserDict] = useState({});
      const [isUserDictLoading, setIsUserDictLoading] = useState(true);
      const [currentUser, setCurrentUser] = useState(null);
      const [showModal, setShowModal] = useState(false);
      const [inviteLink, setInviteLink] = useState('');
  
      const { isLoading, error, data } = useQuery(['repoData', roomID], () =>
          fetch(`http://localhost:3000/room/info/${roomID}`, {
              method: 'GET',
              mode: 'cors',
              headers: { "Authorization": Cookies.get('Authorization') },
              credentials: 'include',
          }).then(res => res.json())
      );
  
      useEffect(() => {
          if (data && data.room && data.room.messages) {
              make_user_dict(data.room.messages).then((dict) => {
                  setUserDict(dict);
                  setIsUserDictLoading(false);
              });
          }
      }, [data]);
  
      useEffect(() => {
          current_user_data().then(setCurrentUser);
      }, []);
  
      if (isLoading || isUserDictLoading || !currentUser) return 'Loading...';
  
      if (error) return 'An error has occurred: ' + error.message;
  
      console.log(data);
      let room;
      try {
          room = data.room;
          console.log(currentUser._id);
      } catch (error) {
          room = { id: "None" };
      }
  
      const handleSendMessage = async () => {
          if (message.trim() !== '') {
              await send_message(roomID, message);
              setMessage('');
          }
      };
  
      const handleCreateInviteLink = () => {
          // Logic to create the invite link goes here
          // For now, we just set a dummy invite link
          setInviteLink(`http://localhost:5173/invite/${data.room.inviteUrl}`);
          setShowModal(true);
      };
  
      return (
          <div>
              {room.id === "None" ? (
                  <>
                      <Spinner animation="border" variant="primary" />
                      <Spinner animation="border" variant="secondary" />
                      <Spinner animation="border" variant="success" />
                      <Spinner animation="border" variant="danger" />
                      <Spinner animation="border" variant="warning" />
                      <Spinner animation="border" variant="info" />
                      <Spinner animation="border" variant="light" />
                      <Spinner animation="border" variant="dark" />
                  </>
              ) : (
                  <Card>
                      <CardHeader>
                          <div className="d-inline-flex justify-content-between">
                              <a href="/home"><Button variant="outline-primary"><Icon.ArrowLeft /></Button></a>
                              <h1>{room.creator.given_name} {room.creator.family_name}'s Room</h1>
                              <Button variant="outline-secondary" onClick={handleCreateInviteLink}>Create Invite Link</Button>
                          </div>
                      </CardHeader>
                      <CardBody>
                          <Row>
                              {room.messages.length ? (
                                  room.messages.map((text, index) => (
                                      <MessageBox
                                          key={index}
                                          position={text.sender === currentUser._id ? "right" : "left"}
                                          removeButton={text.sender === currentUser._id}
                                          titleColor={text.sender === currentUser._id ? "green" : "white"}
                                          avatar={userDict[text.sender]?.imageUrl}
                                          onRemoveMessageClick={() => delete_message(text._id)}
                                          type="text"
                                          title={userDict[text.sender] ? `${userDict[text.sender].given_name} ${userDict[text.sender].family_name}` : 'Unknown User'}
                                          text={text.content}
                                      />
                                  ))
                              ) : (
                                  <SystemMessage text={"No Messages"} />
                              )}
                          </Row>
                      </CardBody>
                      <CardFooter>
                          <Row>
                              <Input
                                  placeholder="Type here..."
                                  multiline={true}
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  rightButtons={
                                      <Button onClick={handleSendMessage}>Send</Button>
                                  }
                              />
                          </Row>
                      </CardFooter>
                  </Card>
              )}
  
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                      <Modal.Title>Invite Link</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <p>Share this link to invite others to the room:</p>
                      <p><a href={inviteLink}>{inviteLink}</a></p>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={() => setShowModal(false)}>
                          Close
                      </Button>
                  </Modal.Footer>
              </Modal>
          </div>
      );
  }
  