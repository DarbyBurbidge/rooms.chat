import React, { Component } from 'react';
import { Container, Row, Button, Card, CardBody, Form } from 'react-bootstrap';
import { fetch_contacts, make_user_dict, create_room } from './api_function';
import { withRouter, useNavigate} from "react-router-dom";

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            userDict: {},
            navigate : useNavigate
        };
    }

    async componentDidMount() {
        try {
            const contacts = await fetch_contacts();
            const userDict = await make_user_dict(contacts);
            this.setState({ contacts, userDict });
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
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
            const room = await create_room();
            window.location.href = "/room/" + room.roomCode
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    render() {
        const { contacts, userDict } = this.state;

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
                            <Row>
                                <h2>Contacts:</h2>
                                {contacts.map((contact) => (
                                    <Form.Group key={contact} controlId={contact}>
                                        <Form.Check
                                            type='checkbox'
                                            name={contact}
                                            id={`default-${contact}`}
                                            label={`${userDict[contact].given_name} ${userDict[contact].family_name}`}
                                        />
                                    </Form.Group>
                                ))}
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        );
    }
}

export default RoomForm;
