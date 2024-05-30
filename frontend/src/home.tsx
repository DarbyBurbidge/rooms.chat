import { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Cookies from 'js-cookie';
import { make_user_dict } from './api_function';
import { send } from 'process';
import  Image  from 'react-bootstrap/Image';
import { Button } from 'react-bootstrap';
        

async function current_user_data() {
  const data = await fetch(`http://localhost:3000/account/info`, {
    method: 'GET',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  }).then(res => res.json());
  return data.account;
}

async function fetch_room_info(roomID) {
  const data = await fetch(`http://localhost:3000/room/info/${roomID}`, {
    method: 'GET',
    mode: 'cors',
    headers: { "Authorization": Cookies.get('Authorization') },
    credentials: 'include',
  }).then(res => res.json());
  return data.room;
}

class RoomToReact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      room_name: this.props.room_name,
      msg_count: this.props.msg_count,
      last_msg: this.props.last_msg,
      room_uid: this.props.uid,
      user_dict: this.props.user_dict
    };
  }

  createLink() {
    return "/tester/" + this.state.room_uid;
  }

  render() {
    const { room_name, msg_count, last_msg, user_dict } = this.state;
    const sender = user_dict[last_msg.sender] || {"given_name" : "", "family_name": ""};

    return (
      <a href={this.createLink()}>
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-start"
        >
        <Button>Delete Room</Button>
          <div className="ms-2 me-auto">
            <div className="fw-bold">{room_name}</div>
            {last_msg.content === "none" ? null : (
              <div className="d-inline-flex">
                <Image src= {sender.imageUrl} thumbnail /> 
                <p className="fw-light">{sender.given_name} {sender.family_name}</p>: {last_msg.content}
              </div>
            )}
          </div>
          <Badge bg="primary" pill>
            {msg_count}
          </Badge>
        </ListGroup.Item>
      </a>
    );
  }
}

class HomeMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Rooms: [],
      isLoading: true,
      error: null,
      user_dict: {}
    };
  }

  async componentDidMount() {
    try {
      const currentUser = await current_user_data();
      const roomPromises = currentUser.rooms.map(roomID => fetch_room_info(roomID));
      const rooms = await Promise.all(roomPromises);

      const senders = new Set();
      rooms.forEach(room => {
        room.messages.forEach(message => senders.add(message.sender));
      });

      const user_dict = await make_user_dict([...senders]);

      this.setState({ Rooms: rooms, user_dict, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    const { Rooms, isLoading, error, user_dict } = this.state;

    if (isLoading) return 'Loading...';
    if (error) return `An error has occurred: ${error.message}`;

    return (
      <ListGroup as="ol">
        {Rooms.map((room, index) => {
          const lastMessage = room.messages.length > 0 ? room.messages[room.messages.length - 1] : { "content": "none", "sender": "" };
          const unreadCount = room.messages.filter(message => !message.read).length;
          return (
            <RoomToReact
              key={index}
              room_name={room.name}  // Assuming room has a name property
              last_msg={lastMessage}
              msg_count={unreadCount}
              uid={room.id}
              user_dict={user_dict}
            />
          );
        })}
      </ListGroup>
    );
  }
}

export default HomeMenu;
