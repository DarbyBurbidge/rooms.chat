import { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ContactList from './contact_list';
import { instanceOf } from 'prop-types';
import Cookies from 'js-cookie';
import { CookiesProvider, useCookies, withCookies } from 'react-cookie'
import { redirect, useNavigate } from 'react-router-dom';
const navigate = (url: string) => {
  window.location.href = url;
}

const auth = async () => {
  //useCookies(["user"]) 
  const response = await fetch('http://localhost:3000/account/login',
    { method: 'POST' });
  const data = await response.json();
  //console.log(data)
  //alert(data.url) 
  navigate(data.url);
}

class NavScroll extends Component {
    constructor(props) {
    super(props);
    this.state = {
        authed: Cookies.get('Authorization') || 'None',
        user_name:   ""
    };
  }

  async localauth() 
  {
    await auth();
    console.log(Cookies.get('Authorization') )
    //const { cookies } = this.props;

    //Cookies.set('logged_in', true );
    //this.setState({ logged_in: Cookies.get('logged_in')});
  }
  render() {
    //this.setState({logged_in: this.props.logged_in});
    //const [isLoggedIn, setCookie] = useCookies(['user']);
    return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">Rooms.Chat</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        {this.state.authed != "None"? (
        <></>):(
            <><Button variant="outline-success" onClick={this.localauth }>Log In</Button> 
            <Button variant="outline-success" onClick={() => {auth()} }>Create Account</Button> 
            </>
        )}
        <Navbar.Collapse id="navbarScroll">

          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            
          </Nav>
          {this.state.authed != "None" ? ( 
          
          <> <a href='newroom'><Button variant="outline-success">New Chat +</Button> </a><Form className="d-flex">
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

export default withCookies(NavScroll);