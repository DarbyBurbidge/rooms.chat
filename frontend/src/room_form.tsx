import React, { Component } from 'react';
import { Container, Row, Button, Card, CardBody, Form } from 'react-bootstrap';
import { fetch_contacts,  make_user_dict } from './api_function';

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacts: [],
            userDict :{}
        };
    }

    async componentDidMount() {
        try {
            const contacts = await fetch_contacts();
            const userDict = await make_user_dict(contacts);
            this.setState({ contacts });
            this.setState({ userDict });
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        console.log(formData);
        // Handle form submission logic here
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
                                    <Form.Group key={contact} id={contact}>
                                        <Form.Check
                                            type='checkbox'
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

