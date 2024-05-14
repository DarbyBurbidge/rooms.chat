import { Component } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { MessageBox } from "react-chat-elements";
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RoomModel from '../../backend/src/models/room.ts'


class ChatRoom extends Component{

    constructor(props) {
    super(props);
    this.state = {
        msgs: ["Test1", "Test2" ,"Test3"],
        room_name: "test Room"

    }
  }
  render() {
    const { Rooms } = this.state;
    return (
        <>
        <Container>
            <MessageBox position={"left"} type={"text"} title={"Message Box Title"} text="Here is a text type message box">  </MessageBox> 
            <MessageBox position={"right"} type={"text"} title={"Message Box Title"} text="Here is a text type message box">  </MessageBox> 
        </Container>
</>
  );
}

}

export default ChatRoom;
/*
class tesRoom extends Component{
constructor(props) {
    super(props);
    this.state = {
    };
}
    render() {
    return(
        <Container>
            <MessageBox position={"left"} type={"text"} title={"Message Box Title"} text="Here is a text type message box">  </MessageBox> 
        </Container>
    );
    }
}
*/
