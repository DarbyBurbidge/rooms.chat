import { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RoomModel from '../../backend/src/models/room.ts'
import test from 'node:test';
class RoomToReact extends Component{
    //Will eventually Handle Room
    constructor(props) {
        super(props);
    this.state = {
        room_name : "test",
        msg_count : 3,
        last_msg : "Test Message"
    }
    this.setState({
        room_name : this.props.room_name,
        last_msg : this.props.last_msg
    });

  }
    render()
    {
    this.setState({
        room_name : this.props.room_name,
        last_msg : this.props.last_msg,
        msg_count : this.props.msg_count
    });
        return (    
    <ListGroup.Item
        as="li"
        className="d-flex justify-content-between align-items-start"
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">{this.state.room_name}</div>
          {this.state.last_msg}
        </div>
        <Badge bg="primary" pill>
          {this.state.msg_count}
        </Badge>
      </ListGroup.Item>
    );
}

}
class HomeMenu extends Component{
    constructor(props) {
    super(props);
    this.state = {
        Rooms: ["Test1", "Test2" ,"Test3"]

    }
  }
  render() {
    const { Rooms } = this.state;
    return (
        <ListGroup as="ol">
            {Rooms.map((room, index) => (
                <RoomToReact key={index} room_name={room} last_msg={ "Last Message " + room} msg_count="4" />
            ))}
        </ListGroup>
    );
}
}
export default HomeMenu ;