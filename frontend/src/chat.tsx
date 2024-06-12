import { Component } from 'react';
import { Button, CardFooter, Container, Row, Stack } from 'react-bootstrap';
import { MessageBox } from "react-chat-elements";
import Cookies from 'js-cookie';
import Card from 'react-bootstrap/Card'
import { CardBody, CardHeader } from 'react-bootstrap';
import { Input } from 'react-chat-elements' 
import { useLoaderData, withRouter } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RoomModel from '../../backend/src/models/room.ts'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';

class ChatRoom extends Component{
    input: string;
    msgs: [];
    id: string;
 constructor(props) {
    super(props);
    this.msgs = [];
    this.state = {
        msgs: ["Test1", "Test2" ,"Test3"],
        room_name: "test Room",
        id: this.props.router.params.roomID
    }
    this.get_info();
    //this.input = "";
  }
  async get_info(){
    //console.log(Cookies.get('Authorization'))
    const { isPending, error, data } = useQuery({
      queryKey: ['repoData'],
      queryFn: () =>
        fetch('http://localhost:3000/room/info/' + this.props.router.params.roomID, {
  method: 'GET',
  mode: 'cors',
  headers: {"Authorization": Cookies.get('Authorization') },
  credentials: 'include',

}).then((res) =>
          res.json(),
        ),
    })

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message
    console.log(data);
  
    
  }
  addMessage = (newMessage) => {
    this.setState((prevState) => ({
      msgs: [...prevState.msgs, newMessage]
    }));
  };
  add_msg(){
    this.addMessage(this.input)
    //alert(this.state.msgs)
}

  render() {

    const {msgs} = this.state;
    return (
        <>
        <br></br>
        <Card>
            <CardHeader>{this.state.id}</CardHeader>
        <CardBody>
        <Row>
            {msgs.map((room, index) => (
            <MessageBox position={"left"} type={"text"} title={room} text ={room}>  </MessageBox> 
            ))}
            <MessageBox position={"right"} type={"text"} title={"Message Box Title"} text="Here is a text type message box">  </MessageBox> 
    </Row>
        </CardBody>
        <CardFooter>

        <Row>
        <Input onChange={(e) => this.input = e.target.value} placeholder="Type here..."multiline={true}  rightButtons=<Button onClick={() => this.add_msg()}>Send</Button> /> </Row>
        </CardFooter>
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
