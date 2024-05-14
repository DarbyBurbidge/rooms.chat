import { Component } from 'react';
import { Button, Container, Row, Stack } from 'react-bootstrap';
import { MessageBox } from "react-chat-elements";

import Card from 'react-bootstrap/Card'
import { CardBody, CardHeader } from 'react-bootstrap';
import { Input } from 'react-chat-elements' 
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RoomModel from '../../backend/src/models/room.ts'


class ChatRoom extends Component{
    input: string;

 constructor(props) {
    super(props);
    this.state = {
        msgs: ["Test1", "Test2" ,"Test3"],
        room_name: "test Room"

    }
    this.input = "";
  }

  add_msg(){
    text = this.input
    this.state.msgs.append(text)
    this.setState({msgs: this.state.msgs.append(text)})
}

  render() {
    const {msgs} = this.state;
    return (
        <>
        <br></br>
        <Card>
            <CardHeader>{this.state.room_name}</CardHeader>
        <CardBody>
        <Row>
            {msgs.map((room, index) => (
            <MessageBox position={"left"} type={"text"} title={room} text ={room}>  </MessageBox> 
            ))}
            <MessageBox position={"right"} type={"text"} title={"Message Box Title"} text="Here is a text type message box">  </MessageBox> 
    </Row>
        <Row>
        <Input ref={this.input} placeholder="Type here..."multiline={true}  rightButtons=<Button onClick={this.add_msg} >Send</Button> /> </Row>
        </CardBody>
        </Card>
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
