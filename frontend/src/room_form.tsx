import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Card, CardBody, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap';
import { Component } from 'react';

class RoomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    

    handleSubmit = (event) => {
        event.preventDefault();
        event.persist();
        let doc = event.target;
        //Array(doc.getElementsByClassName("form-check")).forEach(element => {
            //console.log(element.get('value'));
        //});
        
        const formData = new FormData(event.target);
        console.log(formData);
        //console.log(socket.id)
        // Handle form submission logic here
    };

    render() {
        return (
    <Container >
    
<Card>
    
    <CardBody>
    <Form onSubmit={this.handleSubmit}>
        <Row>
      <Button variant="primary" type="submit" >
        Make new Chat Room
      </Button>
    </Row>
    <Row>
      <h2>Contacts:</h2>


      {['contact1', 'contact2', 'contact3'].map((type) => (
        <Form.Group id={type}>

          <Form.Check // prettier-ignore
            type='checkbox'
            id={`default-${type}`}
            label={`${type}`}
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
