import { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Cookies from 'js-cookie';

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
      room_uid: this.props.uid
    };
  }

  createLink() {
    return "/tester/" + this.state.room_uid;
  }

  render() {
    return (
        <a href={this.createLink()}>
      <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
          <div className="ms-2 me-auto">
            <div className="fw-bold">{this.state.room_name}</div>
          {this.state.last_msg.content === "none"? (<></>):(
            <div className= "d-inline-flex"><p className="fw-light">{this.state.last_msg.sender}</p>:  {this.state.last_msg.content}</div>
)}
          </div>
          <Badge bg="primary" pill>
            {this.state.msg_count}
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
      error: null
    };
  }

  async componentDidMount() {
    try {
      const currentUser = await current_user_data();
      const roomPromises = currentUser.rooms.map(roomID => fetch_room_info(roomID));
      const rooms = await Promise.all(roomPromises);
      this.setState({ Rooms: rooms, isLoading: false });
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  render() {
    const { Rooms, isLoading, error } = this.state;

    if (isLoading) return 'Loading...';
    if (error) return `An error has occurred: ${error.message}`;

    return (
      <ListGroup as="ol">
        {Rooms.map((room, index) => {
          const lastMessage = room.messages.length > 0 ?  room.messages[room.messages.length - 1] : {"content" :"none", "sender": ""};
          const unreadCount = room.messages.filter(message => !message.read).length;
          return (
            <RoomToReact
              key={index}
              room_name={"Room Name"}
              last_msg={lastMessage}
              msg_count={unreadCount}
              uid={room.id}
            />
          );
        })}
      </ListGroup>
    );
  }
}

export default HomeMenu;
