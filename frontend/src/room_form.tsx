import React, { Component } from 'react';
import { Container, Row, Button, Card, CardBody, Form, InputGroup } from 'react-bootstrap';
import { fetch_contacts, make_user_dict, create_room } from './api_function';
import { withRouter, useNavigate} from "react-router-dom";

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            userDict: {},
            navigate : useNavigate,
            roomName: "None"
            
        };
    }

    async componentDidMount() {
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const selectedContacts = [];
        for (let [key, value] of formData.entries()) {
            if (value === 'on') {
                selectedContacts.push(key);
            }
        }
        console.log('Selected Contacts:', selectedContacts);

        try {
            const room = await create_room(this.state.roomName);
            window.location.href = "/room/" + room.roomCode
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    render() {

        return (
            <Container>
                <Card>
                    <CardBody>
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Button variant="primary" type="submit">
                                    Make new Chat Room
                                </Button>
                            </Row>
                            <br></br>
                            <Row>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon3">
            Room Name:
        </InputGroup.Text>
        <Form.Control id="roomName" aria-describedby="basic-addon3" onChange={(event) => { this.setState({roomName:event.target.value})}}/>
      </InputGroup>

                            </Row>

                        </Form>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default RoomForm;
