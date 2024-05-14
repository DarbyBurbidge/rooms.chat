import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ContactList from './contact_list';
class NavScroll extends Component {
    constructor(props) {
    super(props);
    this.state = {
        logged_in: true
    }
  }
  render() {
    //this.setState({logged_in: this.props.logged_in});
    const isLoggedIn = this.state.logged_in;
    return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">Rooms.Chat</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        {isLoggedIn? (
        <><ContactList></ContactList></>):(
            <><Button variant="outline-success">Log In</Button> 
            <Button variant="outline-success">Create Account</Button> 
            </>
        )}
        <Navbar.Collapse id="navbarScroll">

          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            
          </Nav>
          {isLoggedIn ? ( 
          
          <><Button variant="outline-success">New Chat +</Button><Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Username"
                                className="me-2"
                                aria-label="Search" />
                            <Button variant="outline-success">Search</Button>
                        </Form></>
        ) : (<></>)}

        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
}
}

export default NavScroll;