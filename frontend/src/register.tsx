import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';

import Card from 'react-bootstrap/Card'
import { CardBody, CardHeader } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap';
class RegistrationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission logic here
    };

    render() {
        return (
    <Container >
    
    <Row><br></br></Row>
    <Row>
    <Card bg = 'light' className="mx-auto" >
        <CardHeader>Create Account</CardHeader>
      <Button variant="danger" type="ignore">
        Create Account With Google
      </Button>
    <CardBody>

    
    <Form>
      <Form.Group className="" controlId="UserName">
        <Form.Label>User Name</Form.Label>
        <Form.Control type="email" placeholder="User Name" />
        
      </Form.Group>
 <Row className="g-2">
    <Form.Label>Name</Form.Label>
      <Col md>
          <Form.Control type="text" placeholder="First Name" />
      </Col>
      <Col md>
          <Form.Control type="text" placeholder="Last Name" />
      </Col>
    </Row>

      <Form.Group className="" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        
      </Form.Group>

      <Form.Group className="" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="" controlId="formBasicPassword">
        <Form.Label>Repeat Password:</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create Account
      </Button>
    </Form>
    </CardBody>
    </Card>
    </Row>
    </Container>
        );
    }
}

export default RegistrationForm;
